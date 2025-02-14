import colors from "@/constants/colors";
import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, TextInput } from "react-native";
import styles from "@/assets/styles";

export default function Login() {
    const [email, setEmail] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignIn() {
        setLoading(true);
        
        console.log("Email enviado:", email);
        console.log("Senha enviada:", password);

        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.LogoText}>
                    Register<Text style={{ color: colors.green }}>Point</Text>
                </Text>
                <Text style={styles.slogan}>Transformando o jeito de registrar seu ponto.</Text>
            </View>

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
                    <Text style={styles.buttonText}>Entrar</Text>
                </Pressable>

                <Text style={styles.textLink}>
                    Ainda não possui uma conta?{" "}
                    <Link href='/(auth)/signup/page' style={styles.link}>Cadastre-se</Link>
                </Text>
            </View>
        </View>
    );
}