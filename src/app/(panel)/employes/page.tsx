import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView, ActivityIndicator, Alert, TextInput } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import styles from "@/assets/styles";
import Colors from "@/constants/Colors";
import Nav from "@/src/components/nav";

const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
};

export default function Funcionarios() {
    const { user } = useAuth();
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchFuncionarios = useCallback(async () => {
        if (!user) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }

        try {
            const { data: empresa, error: empresaError } = await supabase
                .from('empresa')
                .select('id')
                .eq('id_usuario', user.id)
                .single();

            if (empresaError || !empresa) {
                throw new Error("Empresa não encontrada.");
            }

            // Busca simples na tabela funcionarios
            const { data: funcionariosData, error: funcionariosError } = await supabase
                .from('funcionarios')
                .select('*')
                .eq('id_empresa', empresa.id);

            if (funcionariosError) {
                throw new Error("Erro ao buscar funcionários.");
            }

            setFuncionarios(funcionariosData || []);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            fetchFuncionarios();
        }, [fetchFuncionarios])
    );

    const handleExcluirFuncionario = async (id: string) => {
        try {
            const { error } = await supabase
                .from('funcionarios')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error("Erro ao excluir funcionário.");
            }

            setFuncionarios(funcionarios.filter((funcionario) => funcionario.id !== id));
            Alert.alert('Sucesso', 'Funcionário excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
            }
        }
    };

    const handleEditarFuncionario = async (funcionario: any) => {
        await router.push({
            pathname: "/(panel)/employes/edit/page",
            params: { funcionario: JSON.stringify(funcionario) },
        });
        fetchFuncionarios();
    };

    const filteredFuncionarios = funcionarios.filter((funcionario) =>
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

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Nav showBackButton={false} />

                    <Text style={styles.slogan}>Funcionários da Empresa</Text>

                    <Pressable
                        style={styles.buttonAdd}
                        onPress={() => router.push("/(panel)/employes/create/page")}
                    >
                        <Text style={styles.buttonText}>Adicionar Funcionário</Text>
                    </Pressable>

                    <View style={styles.form}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar funcionário..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {filteredFuncionarios.length > 0 ? (
                            filteredFuncionarios.map((funcionario) => (
                                <View key={funcionario.id} style={styles.funcionarioItem}>
                                    <Text style={styles.funcionarioNameList}>
                                        { ' ' + funcionario.name}
                                    </Text>
                                    <Text style={styles.funcionarioDetail}> 
                                        <Text style={styles.listSubTitle}>
                                            Email:
                                        </Text> 
                                        { ' ' + funcionario.email}
                                    </Text>
                                    <Text style={styles.funcionarioDetail}> 
                                        <Text style={styles.listSubTitle}>
                                            CPF: 
                                        </Text>
                                        { ' ' + funcionario.cpf}
                                    </Text>
                                    <Text style={styles.funcionarioDetail}>
                                        <Text style={styles.listSubTitle}>Idade:</Text>
                                        {funcionario.data_nascimento 
                                            ? ` ${calcularIdade(funcionario.data_nascimento)} ${calcularIdade(funcionario.data_nascimento) !== 1 ? 'Anos' : 'Ano'}` 
                                            : ' N/A'}
                                    </Text>
                                    <Text style={styles.funcionarioDetail}>
                                        <Text style={styles.listSubTitle}>
                                            Salário:   
                                        </Text>
                                        { ' R$' + funcionario.salario}
                                    </Text>
                                    <Text style={styles.funcionarioDetail}>
                                        <Text style={styles.listSubTitle}>
                                            Carga Horária: 
                                        </Text>
                                        {' ' + funcionario.carga_horaria} horas
                                    </Text>
                                    <Text style={styles.funcionarioDetail}>
                                        <Text style={styles.listSubTitle}>
                                            Número: 
                                        </Text>
                                        {' ' + funcionario.numero}
                                    </Text>
                                    
                                    {/* Campo de departamento direto da coluna */}
                                    <Text style={styles.funcionarioDetail}>
                                        <Text style={styles.listSubTitle}>
                                            Departamento: 
                                        </Text>
                                        { ' ' + funcionario.departamento || 'Não informado'}
                                    </Text>

                                    <View style={styles.actionsContainer}>
                                        <Pressable
                                            style={styles.editButton}
                                            onPress={() => handleEditarFuncionario(funcionario)}
                                        >
                                            <Feather name="edit" size={24} color={Colors.green} />
                                        </Pressable>
                                        <Pressable
                                            style={styles.deleteButton}
                                            onPress={() => handleExcluirFuncionario(funcionario.id)}
                                        >
                                            <MaterialIcons name="delete" size={24} color={"red"} />
                                        </Pressable>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text>Nenhum funcionário encontrado.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}