import React, { useEffect, useState } from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import styles from "@/assets/styles";
import Nav from "@/src/components/nav";

export default function UserProfile() {
    const { user, logout } = useAuth();
    const [userName, setUserName] = useState<string>("N/A");

    useEffect(() => {
        const fetchUserName = async () => {
            if (!user) return;

            // Se for uma empresa, use o nome do user_metadata
            if (user.user_metadata?.name) {
                setUserName(user.user_metadata.name);
                return;
            }

            // Se for um funcionário, busque o nome na tabela funcionarios
            const { data: funcionario, error } = await supabase
                .from('funcionarios')
                .select('name')
                .eq('id_usuario', user.id)
                .single();

            if (error) {
                console.error('Erro ao buscar funcionário:', error);
                setUserName("N/A");
                return;
            }

            if (funcionario) {
                setUserName(funcionario.name);
            } else {
                setUserName("N/A");
            }
        };

        fetchUserName();
    }, [user]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Nav />
                    
                    <Text style={styles.slogan}>Perfil do Usuário</Text>

                    <View style={styles.form}>
                        {user ? (
                            <>
                                <View>
                                    <Text style={styles.label}>Nome</Text>
                                    <Text style={styles.text}>{userName}</Text>
                                </View>

                                <View>
                                    <Text style={styles.label}>Email</Text>
                                    <Text style={styles.text}>{user.email || "N/A"}</Text>
                                </View>

                                <Pressable 
                                    style={styles.button} 
                                    onPress={logout} 
                                >
                                    <Text style={styles.buttonText}>Deslogar</Text>
                                </Pressable>
                            </>
                        ) : (
                            <Text>Usuário não autenticado.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}