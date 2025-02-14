import colors from "@/constants/colors";
import { Link, useRouter } from "expo-router";
import { 
    View, 
    Text, 
    ActivityIndicator, 
    Pressable, 
    TextInput, 
    Alert,
    SafeAreaView,
    ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react"; // Adiciona useEffect
import styles from "@/assets/styles";
import { supabase } from "@/src/lib/supabase";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [password, setPassword] = useState("");
    const [localizacao, setLocalizacao] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Função para renovar o token antes de expirar
    const renewTokenBeforeExpiry = async () => {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
            console.error("Erro ao renovar o token:", error);
            return null;
        } else {
            console.log("Token renovado com sucesso:", data);
            return data;
        }
    };

    // Renova o token periodicamente
    useEffect(() => {
        const interval = setInterval(renewTokenBeforeExpiry, 5 * 60 * 1000); // Renova a cada 5 minutos
        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, []);

    // Função para lidar com o cadastro
    async function handleSignUp() {
        setLoading(true);
    
        // Validação básica dos campos
        if (!name || !email || !cnpj || !password || !localizacao) {
            Alert.alert("Erro", "Preencha todos os campos.");
            setLoading(false);
            return;
        }
    
        try {
            console.log("Dados enviados para o Supabase:", {
                email,
                password,
                nome: name,
                senha: password,
                localizacao,
                cnpj,
            });
    
            // 1. Cadastrar o usuário no Supabase Auth
            const { data: userData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nome: name,
                        senha: password,
                        localizacao: localizacao,
                        cnpj: cnpj,
                    },
                },
            });
    
            if (authError) {
                console.error("Erro no cadastro do usuário:", authError);
    
                // Se o token expirou, tente renová-lo e cadastrar novamente
                if (authError.message === "jwt expired") {
                    const newSession = await renewTokenBeforeExpiry();
                    if (newSession) {
                        console.log("Token renovado, tentando cadastro novamente...");
                        return handleSignUp(); // Tenta novamente após renovar o token
                    }
                }
    
                Alert.alert("Erro", authError.message);
                setLoading(false);
                return;
            }
    
            console.log("Usuário cadastrado:", userData);
    
            // 2. Redirecionar para a tela de login
            Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
            router.replace('/(auth)/signin/page');
        } catch (error) {
            console.error("Erro durante o cadastro:", error);
            Alert.alert("Erro", "Ocorreu um erro durante o cadastro.");
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
                            <Ionicons name="arrow-back" size={24} color={colors.white} />
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
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                placeholder="Digite seu email..."
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
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
                            <Text style={styles.label}>Localização</Text>
                            <TextInput
                                placeholder="Digite sua localização..."
                                style={styles.input}
                                value={localizacao}
                                onChangeText={setLocalizacao}
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
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
