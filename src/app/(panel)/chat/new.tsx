import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView, ActivityIndicator, Alert, TextInput, Image } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import styles from "@/assets/styles";
import Colors from "@/constants/Colors";
import Nav from "@/src/components/nav";

type Funcionario = {
  id: string;
  name: string;
  departamento?: string;
  foto_perfil?: string;
};

export default function NewChat() {
    const { user } = useAuth();
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedFuncionarios, setSelectedFuncionarios] = useState<string[]>([]);

    const fetchFuncionarios = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // 1. Busca o funcionário atual pelo id_usuario para pegar a empresa
            const { data: funcionarioAtual, error: errorFuncionario } = await supabase
                .from('funcionarios')
                .select('id, id_empresa')
                .eq('id_usuario', user.id)
                .single();

            if (errorFuncionario || !funcionarioAtual) {
                throw new Error("Funcionário não encontrado");
            }

            // 2. Busca todos os funcionários da mesma empresa
            const { data: colegas, error: errorColegas } = await supabase
                .from('funcionarios')
                .select('id, name, departamento, foto_perfil')
                .eq('id_empresa', funcionarioAtual.id_empresa)
                .neq('id', funcionarioAtual.id);

            if (errorColegas) throw errorColegas;

            // Formata os dados dos funcionários
            const funcionariosFormatados = (colegas || []).map(f => ({
                id: String(f.id),
                name: String(f.name),
                departamento: f.departamento ? String(f.departamento) : undefined,
                foto_perfil: f.foto_perfil ? String(f.foto_perfil) : undefined
            }));

            setFuncionarios(funcionariosFormatados);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível carregar os funcionários');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchFuncionarios();
        }, [fetchFuncionarios])
    );

    const toggleSelection = (id: string) => {
        setSelectedFuncionarios(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        );
    };

    const criarConversa = async () => {
        if (!user?.id) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }

        if (selectedFuncionarios.length === 0) {
            Alert.alert('Atenção', 'Selecione pelo menos um funcionário');
            return;
        }

        try {
            setLoading(true);

            // 1. Busca o funcionário correspondente ao usuário atual
            const { data: funcionarioAtual, error: errorFuncionario } = await supabase
                .from('funcionarios')
                .select('id')
                .eq('id_usuario', user.id)
                .single();

            if (errorFuncionario || !funcionarioAtual) {
                throw new Error("Funcionário não encontrado para este usuário");
            }

            // 2. Cria a conversa
            const { data: conversa, error: conversaError } = await supabase
                .from('conversas')
                .insert({
                    tipo: selectedFuncionarios.length > 1 ? 'grupo' : 'individual',
                    nome: selectedFuncionarios.length > 1 ? 'Novo Grupo' : null,
                    criador_id: funcionarioAtual.id,
                    ultima_mensagem: new Date().toISOString()
                })
                .select()
                .single();

            if (conversaError || !conversa) {
                throw new Error(conversaError?.message || "Erro ao criar conversa");
            }

            // 3. Adiciona participantes
            const participantes = [
                { 
                    conversa_id: conversa.id, 
                    funcionario_id: funcionarioAtual.id,
                    entrou_em: new Date().toISOString()
                },
                ...selectedFuncionarios.map(id => ({
                    conversa_id: conversa.id,
                    funcionario_id: id,
                    entrou_em: new Date().toISOString()
                }))
            ];

            const { error: participantesError } = await supabase
                .from('participantes_conversa')
                .insert(participantes);

            if (participantesError) throw participantesError;

            // 4. Redireciona para a conversa
            router.replace({
                pathname: "/(panel)/chat/conversation",
                params: { conversaId: conversa.id }
            });

        } catch (error) {
            console.error('Erro ao criar conversa:', error);
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar conversa');
        } finally {
            setLoading(false);
        }
    };

    const filteredFuncionarios = funcionarios.filter(funcionario =>
        funcionario.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
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
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Nav showBackButton={true} />

                    <Text style={styles.slogan}>Nova Conversa</Text>

                    <View style={styles.form}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar funcionários..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        {filteredFuncionarios.length > 0 ? (
                            <>
                                {filteredFuncionarios.map((funcionario) => (
                                    <Pressable
                                        key={funcionario.id}
                                        style={[styles.funcionarioItem, {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }]}
                                        onPress={() => toggleSelection(funcionario.id)}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {/* Avatar do funcionário */}
                                            {funcionario.foto_perfil ? (
                                                <Image 
                                                    source={{ uri: funcionario.foto_perfil }}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 20,
                                                        marginRight: 15,
                                                        backgroundColor: Colors.lightGray
                                                    }}
                                                    onError={() => console.log('Erro ao carregar imagem')}
                                                />
                                            ) : (
                                                <View style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                    backgroundColor: Colors.lightGreen,
                                                    marginRight: 15,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text style={{ 
                                                        color: Colors.green,
                                                        fontWeight: 'bold',
                                                        fontSize: 16
                                                    }}>
                                                        {funcionario.name.charAt(0).toUpperCase()}
                                                    </Text>
                                                </View>
                                            )}
                                            
                                            <View>
                                                <Text style={styles.funcionarioNameList}>
                                                    {funcionario.name}
                                                </Text>
                                                <Text style={styles.funcionarioDetail}>
                                                    {funcionario.departamento || 'Sem departamento'}
                                                </Text>
                                            </View>
                                        </View>

                                        {selectedFuncionarios.includes(funcionario.id) && (
                                            <Feather name="check-circle" size={24} color={Colors.green} />
                                        )}
                                    </Pressable>
                                ))}

                                <Pressable
                                    style={[styles.buttonAdd, { marginTop: 20 }]}
                                    onPress={criarConversa}
                                    disabled={loading || selectedFuncionarios.length === 0}
                                >
                                    <Text style={styles.buttonText}>
                                        {selectedFuncionarios.length > 1 
                                            ? `Criar Grupo (${selectedFuncionarios.length})` 
                                            : 'Iniciar Conversa'}
                                    </Text>
                                </Pressable>
                            </>
                        ) : (
                            <Text style={[styles.funcionarioDetail, { textAlign: 'center', marginTop: 20 }]}>
                                Nenhum funcionário encontrado
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}