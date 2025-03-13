import { 
    View, 
    Text, 
    TextInput, 
    Pressable, 
    SafeAreaView, 
    ScrollView, 
    Alert,
    ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import colors from "@/constants/Colors";
import styles from "@/assets/styles";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignIn() {
        setLoading(true);

        // Faz o login do usuário
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            Alert.alert("Erro", authError.message);
            setLoading(false);
            return;
        }

        // Obtém o ID do usuário logado
        const userId = authData.user?.id;

        if (!userId) {
            Alert.alert("Erro", "Usuário não encontrado.");
            setLoading(false);
            return;
        }

        // Verifica se o usuário é uma empresa
        const { data: empresaData, error: empresaError } = await supabase
            .from('empresa')
            .select('id')
            .eq('id_usuario', userId)
            .single();

        if (empresaError && empresaError.code !== 'PGRST116') { // PGRST116 = Nenhum resultado encontrado
            Alert.alert("Erro", "Erro ao verificar empresa.");
            setLoading(false);
            return;
        }

        // Verifica se o usuário é um funcionário
        const { data: funcionarioData, error: funcionarioError } = await supabase
            .from('funcionarios')
            .select('id')
            .eq('id_usuario', userId)
            .single();

        if (funcionarioError && funcionarioError.code !== 'PGRST116') { 
            Alert.alert("Erro", "Erro ao verificar funcionário.");
            setLoading(false);
            return;
        }

        // Redireciona com base no tipo de usuário
        if (empresaData) {
            router.replace('/(panel)/profile/page'); // Redireciona para a página da empresa
        } else if (funcionarioData) {
            router.replace('/(panel)/user/page'); // Redireciona para a página do funcionário
        } else {
            Alert.alert("Erro", "Usuário não encontrado em nenhuma tabela.");
        }

        setLoading(false);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>

                    <View style={styles.headerStart}>
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
