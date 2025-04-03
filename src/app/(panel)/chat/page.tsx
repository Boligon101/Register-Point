import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView, ActivityIndicator, Alert, TextInput } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import styles from "@/assets/styles";
import Colors from "@/constants/Colors";
import Nav from "@/src/components/nav";

// Tipos melhorados com interfaces explícitas
interface Mensagem {
    conteudo: string;
    enviado_em: string;
    lida: boolean;
}
  
interface ConversaDB {
    id: string;
    created_at: string;
    ultima_mensagem: string | null;
    tipo: string;
    nome: string | null;
    mensagens: Mensagem[];
}
  
interface Conversa {
    id: string;
    created_at: string;
    ultima_mensagem: string | null;
    tipo: 'individual' | 'grupo';
    nome: string | null;
    mensagens: Mensagem[];
}

export default function Chat() {
    const { user } = useAuth();
    const [conversas, setConversas] = useState<Conversa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchConversas = useCallback(async () => {
        if (!user?.id) {
          setLoading(false);
          return;
        }
      
        try {
          // Primeiro buscar o funcionário associado ao usuário
          const { data: funcionario, error: errorFuncionario } = await supabase
            .from('funcionarios')
            .select('id')
            .eq('id_usuario', user.id)
            .single();
      
          if (errorFuncionario || !funcionario) {
            throw new Error("Funcionário não encontrado");
          }
      
          // Depois buscar as conversas usando o ID do funcionário
          const { data: conversasData, error } = await supabase
            .from('participantes_conversa')
            .select(`
              conversa_id,
              conversas (
                id,
                created_at,
                ultima_mensagem,
                tipo,
                nome,
                mensagens (
                  conteudo,
                  enviado_em,
                  lida
                )
              )
            `)
            .eq('funcionario_id', funcionario.id) 
            .order('ultima_mensagem', { foreignTable: 'conversas', ascending: false });
            console.log("ID DO FUNCIONARIO",funcionario.id)
            console.log("CONVERSA DATA",conversasData)
      
          if (error) throw error;
      
          // Restante do código de formatação permanece o mesmo
          const conversasFormatadas: Conversa[] = (conversasData || [])
            .filter(item => item.conversas)
            .map(item => {
              const rawConversa = item.conversas as unknown as ConversaDB;
              
              return {
                id: String(rawConversa.id),
                created_at: String(rawConversa.created_at),
                ultima_mensagem: rawConversa.ultima_mensagem ? String(rawConversa.ultima_mensagem) : null,
                tipo: rawConversa.tipo === 'individual' ? 'individual' : 'grupo',
                nome: rawConversa.nome ? String(rawConversa.nome) : null,
                mensagens: Array.isArray(rawConversa.mensagens) 
                  ? rawConversa.mensagens.map(m => ({
                    conteudo: String(m.conteudo),
                    enviado_em: String(m.enviado_em),
                    lida: Boolean(m.lida)
                  }))
                  : []
              };
            })
            .filter((conversa): conversa is Conversa => conversa !== null);
      
          setConversas(conversasFormatadas);
        } catch (error) {
          console.error('Erro ao buscar conversas:', error);
          Alert.alert('Erro', 'Não foi possível carregar as conversas');
        } finally {
          setLoading(false);
        }
      }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchConversas();
        }, [fetchConversas])
    );

    const iniciarNovaConversa = () => {
        router.push("/(panel)/chat/new");
    };

    const abrirConversa = (conversaId: string) => {
        router.push({
            pathname: "/(panel)/chat/conversation",
            params: { conversaId }
        });
    };

    const formatarData = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    console.log("CONVERSAS", conversas)

    const filteredConversas = conversas.filter(conversa => {
        // Se há texto de busca, verifica no nome ou no tipo
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          return (
            (conversa.nome && conversa.nome.toLowerCase().includes(searchLower)) ||
            (conversa.tipo === 'individual' && 'chat individual'.includes(searchLower)) ||
            (conversa.tipo === 'grupo' && 'grupo sem nome'.includes(searchLower)) ||
            (conversa.mensagens.some(m => 
              m.conteudo.toLowerCase().includes(searchLower)
            ))
          );
        }
        return true;
      });

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.green} />
                </View>
            </SafeAreaView>
        );
    }

    console.log("FILTRO CONVERSA",filteredConversas)

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Nav showBackButton={false} />

                    <Text style={styles.slogan}>Conversas</Text>

                    <Pressable
                        style={styles.buttonAdd}
                        onPress={iniciarNovaConversa}
                    >
                        <Text style={styles.buttonText}>Nova Conversa</Text>
                    </Pressable>

                    <View style={styles.form}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar conversas..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        {filteredConversas.length > 0 ? (
                            filteredConversas.map((conversa) => (
                                <Pressable
                                    key={conversa.id}
                                    style={[styles.funcionarioItem, { flexDirection: 'row', alignItems: 'center' }]}
                                    onPress={() => abrirConversa(conversa.id)}
                                >
                                    <View style={{ marginRight: 15 }}>
                                        <Ionicons 
                                            name={conversa.tipo === 'individual' ? "person-circle" : "people-circle"} 
                                            size={40} 
                                            color={Colors.green} 
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.funcionarioNameList}>
                                            {conversa.tipo === 'individual' ? 
                                                'Chat Individual' : 
                                                conversa.nome || 'Grupo sem nome'}
                                        </Text>
                                        
                                        {conversa.mensagens.length > 0 && (
                                            <>
                                                <Text 
                                                    style={[styles.funcionarioDetail, { marginBottom: 5 }]}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {conversa.mensagens[0].conteudo}
                                                </Text>
                                                <Text style={[styles.funcionarioDetail, { fontSize: 12 }]}>
                                                    {formatarData(conversa.mensagens[0].enviado_em)}
                                                </Text>
                                            </>
                                        )}
                                    </View>

                                    {conversa.mensagens.some(m => !m.lida) && (
                                        <View style={{
                                            backgroundColor: Colors.green,
                                            width: 12,
                                            height: 12,
                                            borderRadius: 6,
                                            marginLeft: 10
                                        }} />
                                    )}
                                </Pressable>
                            ))
                        ) : (
                            <Text style={[styles.funcionarioDetail, { textAlign: 'center', marginTop: 20 }]}>
                                Nenhuma conversa encontrada
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}