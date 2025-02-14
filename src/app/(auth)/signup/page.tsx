import colors from "@/constants/colors";
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
import { router } from "expo-router";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import styles from "@/assets/styles";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cnpj, setCnpj] = useState("");
    // const [localizacao, setLocalizacao] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignUp() {
        setLoading(true);
        
        console.log("Nome enviado:", name);
        console.log("Email enviado:", email);
        console.log("Senha enviada:", password);
        console.log("CNPJ enviado:", cnpj);
        // console.log("Localização enviada:", localizacao);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name, 
                    cnpj: cnpj,
                    senha: password 
                }
            }
        });
        
        
        if (error) {
            console.error("Erro no Supabase:", error);
            Alert.alert("Erro", error.message);
            setLoading(false);
            return;
        }

        console.log("Usuário cadastrado:", data);

        setLoading(false);
        router.replace('/(auth)/signin/page');
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