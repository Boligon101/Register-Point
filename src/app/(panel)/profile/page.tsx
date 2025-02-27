// src/app/(panel)/profile/page.js
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import Nav from "@/src/components/nav";
import styles from "@/assets/styles"; // Importe os estilos globais
import colors from "@/constants/Colors"; // Importe as cores

export default function Profile() {
    const { setAuth, user } = useAuth();
    const router = useRouter();

    async function handleSignout() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            Alert.alert("Error", 'Erro ao tentar sair da conta');
            return;
        }

        setAuth(null); // Define o usuário como null
        router.replace('/(auth)/signin/page'); // Navega para a página de login
    }

    return (
        <View style={styles.container}>
            {/* Nav no topo da tela */}
            <Nav showBackButton={false} />

            {/* Conteúdo da página */}
            <View style={styles.content}>
                <Text style={styles.LogoText}>Página de Perfil</Text>
                <Text style={styles.text}>Email: {user?.email}</Text>
                <Text style={styles.text}>ID: {user?.id}</Text>

                {/* Botão de deslogar */}
                <Pressable style={styles.button} onPress={handleSignout}>
                    <Text style={styles.buttonText}>Deslogar</Text>
                </Pressable>
            </View>
        </View>
    );
}