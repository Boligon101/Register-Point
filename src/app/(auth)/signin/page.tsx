import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Pressable, 
    SafeAreaView, 
    ScrollView, 
    Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import colors from "@/constants/colors";
import styles from "@/assets/styles";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignIn() {
        setLoading(true);

        console.log("Email enviado:", email);
        console.log("Senha enviada:", password);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            Alert.alert("Erro", error.message);
            setLoading(false);
            return;
        }

        console.log("Usuário logado:", data);

        setLoading(false);
        router.replace('/(panel)/profile/page');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.LogoText}>
                            Register<Text style={styles.greenText}>Point</Text>
                        </Text>
                    </View>

                    <Text style={styles.slogan}>Transformando o jeito de registrar seu ponto.</Text>

                    <View style={styles.form}>
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

                        <Pressable style={styles.button} onPress={handleSignIn}>
                            <Text style={styles.buttonText}>
                                {loading ? 'Carregando...' : 'Entrar' }
                            </Text>
                        </Pressable>

                        <Text style={styles.textLink}>
                            Ainda não possui uma conta?{" "}
                            <Link 
                                href='/(auth)/signup/page' 
                                style={styles.link}
                            >
                                Cadastre-se
                            </Link>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
