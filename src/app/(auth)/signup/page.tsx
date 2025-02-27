import React, { useState } from "react";
import { View, Text, TextInput, Pressable, SafeAreaView, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import styles from "@/assets/styles";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignUp() {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                cnpj,
              },
            },
          });
          
          if (authError) {
            console.error("Erro no Supabase Auth:", authError);
            Alert.alert("Erro", authError.message);
            return;
          }
          
          console.log("Usuário cadastrado:", authData);
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

                    <Text style={styles.slogan}>Crie uma conta</Text>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Nome Completo</Text>
                            <TextInput
                                placeholder="Digite seu Nome Completo..."
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>CNPJ</Text>
                            <TextInput
                                placeholder="Digite seu CNPJ..."
                                style={styles.input}
                                value={cnpj}
                                onChangeText={setCnpj}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                placeholder="Digite seu email..."
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                placeholder="Digite sua senha..."
                                style={styles.input}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <Pressable style={styles.button} onPress={handleSignUp}>
                            <Text style={styles.buttonText}>
                                {loading ? 'Carregando...' : 'Cadastrar' }
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}