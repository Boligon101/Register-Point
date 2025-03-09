import React, { useState } from "react";
import { View, Text, TextInput, Pressable, SafeAreaView, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import styles from "@/assets/styles";

export default function AdicionarEmpresa() {
    const [nomeEmpresa, setNomeEmpresa] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [emailEmpresa, setEmailEmpresa] = useState("");
    const [telefoneEmpresa, setTelefoneEmpresa] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleAdicionarEmpresa() {
        setLoading(true);

        try {
            // Passo 1: Criar o usuário de login
            const { data: user, error: authError } = await supabase.auth.signUp({
                email: emailEmpresa,
                password: senha, // Usa a senha fornecida pelo usuário
                options: {
                    data: {
                        name: nomeEmpresa,
                        role: "admin", // Adiciona um campo para identificar o tipo de usuário
                    },
                },
            });

            if (authError) {
                throw authError;
            }

            // Verificar se o usuário foi criado
            if (!user.user) {
                throw new Error("Erro ao criar usuário: usuário não foi criado.");
            }

            // Passo 2: Criar a empresa
            const { data: empresa, error: empresaError } = await supabase
                .rpc('criar_empresa', {
                    nome_empresa: nomeEmpresa,
                    cnpj: cnpj,
                    email_empresa: emailEmpresa,
                    telefone_empresa: telefoneEmpresa,
                    id_usuario: user.user.id,
                });

            if (empresaError) {
                throw empresaError;
            }

            Alert.alert("Sucesso", "Empresa adicionada com sucesso!");
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("Erro", error.message);
            } else {
                Alert.alert("Erro", "Ocorreu um erro desconhecido.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.formHeader}>
                        <Pressable 
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </Pressable>

                        <View style={styles.header}>
                            <Text style={styles.LogoText}>
                                Register<Text style={styles.greenText}>Point</Text>
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.slogan}>Adicionar Empresa</Text>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Nome da Empresa</Text>
                            <TextInput
                                placeholder="Digite o nome da empresa..."
                                style={styles.input}
                                value={nomeEmpresa}
                                onChangeText={setNomeEmpresa}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>CNPJ</Text>
                            <TextInput
                                placeholder="Digite o CNPJ da empresa..."
                                style={styles.input}
                                value={cnpj}
                                onChangeText={setCnpj}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Email da Empresa</Text>
                            <TextInput
                                placeholder="Digite o email da empresa..."
                                style={styles.input}
                                value={emailEmpresa}
                                onChangeText={setEmailEmpresa}
                                keyboardType="email-address"
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Telefone da Empresa</Text>
                            <TextInput
                                placeholder="Digite o telefone da empresa..."
                                style={styles.input}
                                value={telefoneEmpresa}
                                onChangeText={setTelefoneEmpresa}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Senha</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder="Digite sua senha..."
                                    style={styles.passwordInput}
                                    value={senha}
                                    onChangeText={setSenha}
                                    secureTextEntry={!mostrarSenha}
                                />
                                <Pressable 
                                    style={styles.passwordToggle}
                                    onPress={() => setMostrarSenha(!mostrarSenha)}
                                >
                                    <Ionicons 
                                        name={mostrarSenha ? "eye-off" : "eye"} 
                                        size={24} 
                                        color="gray" 
                                    />
                                </Pressable>
                            </View>
                        </View>

                        <Pressable 
                            style={[styles.button, loading && styles.buttonDisabled]} 
                            onPress={handleAdicionarEmpresa}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Carregando...' : 'Adicionar Empresa'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}