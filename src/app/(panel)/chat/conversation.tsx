import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from "@/assets/styles";
import Colors from "@/constants/Colors";
import Nav from "@/src/components/nav";

type Participante = {
  id: string;
  name: string;
  foto_perfil?: string;
};

type Mensagem = {
  id: string;
  conteudo: string;
  enviado_em: string;
  remetente_id: string;
  lida: boolean;
  remetente: Participante;
};

// Função para formatar a data
const formatarData = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Conversation() {
  const { user } = useAuth();
  const { conversaId } = useLocalSearchParams<{ conversaId: string }>();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [nomeConversa, setNomeConversa] = useState("");
  const [funcionarioId, setFuncionarioId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Busca o ID do funcionário associado ao usuário
  const fetchFuncionarioId = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data: funcionario, error } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('id_usuario', user.id)
        .single();

      if (!error && funcionario) {
        setFuncionarioId(funcionario.id);
      }
    } catch (error) {
      console.error('Erro ao buscar ID do funcionário:', error);
    }
  }, [user?.id]);

  const carregarConversa = useCallback(async () => {
    if (!user?.id || !conversaId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Carrega informações da conversa
      const { data: conversa, error: conversaError } = await supabase
        .from('conversas')
        .select('*')
        .eq('id', conversaId)
        .single();

      if (conversaError || !conversa) {
        throw new Error(conversaError?.message || "Conversa não encontrada");
      }

      setNomeConversa(conversa.nome || conversa.tipo === 'individual' ? 'Chat Privado' : 'Grupo');

      // Carrega participantes
      const { data: participantesData, error: participantesError } = await supabase
        .from('participantes_conversa')
        .select(`
          funcionarios (
            id,
            name,
            foto_perfil
          )
        `)
        .eq('conversa_id', conversaId);

      if (participantesError) throw participantesError;

      const participantesList = (participantesData?.map((p: any) => ({
        id: p.funcionarios.id,
        name: p.funcionarios.name,
        foto_perfil: p.funcionarios.foto_perfil
      })) || []) as Participante[];
      
      setParticipantes(participantesList);

      // Carrega mensagens
      const { data: mensagensData, error: mensagensError } = await supabase
        .from('mensagens')
        .select(`
          id,
          conteudo,
          enviado_em,
          remetente_id,
          lida,
          funcionarios:remetente_id (
            id,
            name,
            foto_perfil
          )
        `)
        .eq('conversa_id', conversaId)
        .order('enviado_em', { ascending: true });

      if (mensagensError) throw mensagensError;

      const mensagensFormatadas = (mensagensData || []).map((msg: any) => ({
        id: msg.id,
        conteudo: msg.conteudo,
        enviado_em: msg.enviado_em,
        remetente_id: msg.remetente_id,
        lida: msg.lida,
        remetente: {
          id: msg.funcionarios.id,
          name: msg.funcionarios.name,
          foto_perfil: msg.funcionarios.foto_perfil
        }
      })) as Mensagem[];

      setMensagens(mensagensFormatadas);

      // Marca mensagens como lidas
      if (funcionarioId) {
        await supabase
          .from('mensagens')
          .update({ lida: true })
          .eq('conversa_id', conversaId)
          .neq('remetente_id', funcionarioId)
          .eq('lida', false);
      }

    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar conversa');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [user, conversaId, funcionarioId]);

  useFocusEffect(
    useCallback(() => {
      fetchFuncionarioId();
      carregarConversa();
      
      // Configura realtime para novas mensagens
      const subscription = supabase
        .channel(`conversa_${conversaId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens',
          filter: `conversa_id=eq.${conversaId}`
        }, async (payload) => {
          // Busca informações do remetente para a nova mensagem
          const { data: remetente } = await supabase
            .from('funcionarios')
            .select('id, name, foto_perfil')
            .eq('id', payload.new.remetente_id)
            .single();

          const novaMensagem: Mensagem = {
            id: payload.new.id,
            conteudo: payload.new.conteudo,
            enviado_em: payload.new.enviado_em,
            remetente_id: payload.new.remetente_id,
            lida: payload.new.lida,
            remetente: {
              id: remetente?.id || '',
              name: remetente?.name || 'Desconhecido',
              foto_perfil: remetente?.foto_perfil
            }
          };

          setMensagens(prev => [...prev, novaMensagem]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }, [carregarConversa, conversaId, fetchFuncionarioId])
  );

  useEffect(() => {
    if (mensagens.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !funcionarioId || !conversaId) return;
  
    // Declara a variável no escopo da função como Mensagem
    let mensagemTemp: Mensagem = {
      id: Math.random().toString(),
      conteudo: novaMensagem,
      enviado_em: new Date().toISOString(),
      remetente_id: funcionarioId,
      lida: false,
      remetente: {
        id: funcionarioId,
        name: '', // Será preenchido abaixo
        foto_perfil: undefined
      }
    };
    
    try {
      setLoading(true);
      
      // Preenche os dados do remetente
      const { data: funcionario } = await supabase
        .from('funcionarios')
        .select('name, foto_perfil')
        .eq('id', funcionarioId)
        .single();

      if (funcionario) {
        mensagemTemp.remetente.name = funcionario.name;
        mensagemTemp.remetente.foto_perfil = funcionario.foto_perfil;
      }

      // Adiciona a mensagem otimisticamente
      setMensagens(prev => [...prev, mensagemTemp]);
      setNovaMensagem("");
  
      // Envia a mensagem para o banco de dados
      const { data: mensagemEnviada, error } = await supabase
        .from('mensagens')
        .insert({
          conversa_id: conversaId,
          remetente_id: funcionarioId,
          conteudo: novaMensagem,
          enviado_em: mensagemTemp.enviado_em
        })
        .select()
        .single();
  
      if (error) throw error;
  
      // Atualiza a lista com o ID real
      setMensagens(prev => prev.map(msg => 
        msg.id === mensagemTemp.id ? {
          ...msg,
          id: mensagemEnviada.id,
          lida: mensagemEnviada.lida
        } : msg
      ));
  
      // Atualiza a última mensagem da conversa
      await supabase
        .from('conversas')
        .update({ 
          ultima_mensagem: new Date().toISOString()
        })
        .eq('id', conversaId);
  
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Reverte a mensagem otimista em caso de erro
      setMensagens(prev => prev.filter(msg => msg.id !== mensagemTemp.id));
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível enviar a mensagem');
    } finally {
      setLoading(false);
    }
  };

  if (loading || funcionarioId === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.green} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header personalizado */}
      <View style={styles.whatsappHeader}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        
        <View style={styles.avatarWrapper}>
          {participantes[0]?.foto_perfil ? (
            <Image 
              source={{ uri: participantes[0]?.foto_perfil }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {participantes[0]?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.chatInfo}>
          <Text style={styles.chatTitle}>{nomeConversa}</Text>
          <Text style={styles.chatParticipants}>
            {participantes.length} participante{participantes.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={styles.headerIcons}>
          <Ionicons name="videocam" size={24} color="white" style={styles.headerIcon} />
          <Ionicons name="call" size={20} color="white" style={styles.headerIcon} />
          <Ionicons name="ellipsis-vertical" size={20} color="white" style={styles.headerIcon} />
        </View>
      </View>
  
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatMessagesContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.messagesWrapper}>
            {mensagens.length === 0 ? (
              <View style={styles.noMessagesContainer}>
                <Text style={styles.noMessagesText}>
                  Nenhuma mensagem ainda. Envie a primeira!
                </Text>
              </View>
            ) : (
              mensagens.map((mensagem) => {
                const isMyMessage = mensagem.remetente_id === funcionarioId;
                
                return (
                  <View 
                    key={mensagem.id}
                    style={[
                      styles.messageContainer,
                      isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
                    ]}
                  >
                    {/* Avatar (apenas para mensagens de outros) */}
                    {!isMyMessage && (
                      <View style={styles.avatarWrapper}>
                        {mensagem.remetente.foto_perfil ? (
                          <Image 
                            source={{ uri: mensagem.remetente.foto_perfil }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <View style={styles.avatarFallback}>
                            <Text style={styles.avatarInitial}>
                              {mensagem.remetente.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                    
                    {/* Container do conteúdo */}
                    <View style={styles.messageBubble}>
                      {/* Nome do remetente (apenas para mensagens de outros) */}
                      {!isMyMessage && (
                        <Text style={styles.senderName}>
                          {mensagem.remetente.name}
                        </Text>
                      )}
                      
                      <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
                        {mensagem.conteudo}
                      </Text>
                      
                      {/* Rodapé da mensagem */}
                      <View style={styles.messageFooter}>
                        <Text style={styles.messageTime}>
                          {formatarData(mensagem.enviado_em)}
                        </Text>
                        {isMyMessage && (
                          <MaterialIcons 
                            name={mensagem.lida ? "done-all" : "done"} 
                            size={14} 
                            color={mensagem.lida ? Colors.zinc : 'rgba(255,255,255,0.7)'} 
                            style={{ marginLeft: 4 }}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
  
        <View style={styles.whatsappInputContainer}>
          <View style={styles.inputActionButton}>
            <Ionicons name="happy" size={24} color={Colors.gray} />
          </View>
          <View style={styles.inputActionButton}>
            <Ionicons name="attach" size={24} color={Colors.gray} />
          </View>
          <TextInput
            style={styles.whatsappInput}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={Colors.gray}
            value={novaMensagem}
            onChangeText={setNovaMensagem}
            multiline
          />
          <View style={styles.inputActionButton}>
            <Ionicons name="camera" size={24} color={Colors.gray} />
          </View>
          <Pressable
            onPress={enviarMensagem}
            disabled={!novaMensagem.trim()}
            style={({ pressed }) => [
              styles.sendButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            {novaMensagem.trim() ? (
              <Ionicons name="send" size={20} color="white" />
            ) : (
              <Ionicons name="mic" size={24} color={Colors.gray} />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}