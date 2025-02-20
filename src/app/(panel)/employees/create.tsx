import colors from "@/constants/Colors";
import { 
    View, 
    Text, 
    TextInput,
    Pressable, 
    SafeAreaView,
    ScrollView,
    Alert
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import styles from "@/assets/styles";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useAuth } from "@/src/context/AuthContext";

export default function CreateEmployee() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpf, setCPF] = useState("");
    const [numero, setNumero] = useState("");
    const [salario, setSalario] = useState("");  // Novo campo para salário
    const [cargaHoraria, setCargaHoraria] = useState("");  // Novo campo para carga horária
    const [dataNascimento, setDataNascimento] = useState("");  // Novo campo para data de nascimento
    const [loading, setLoading] = useState(false);

    const { setAuth, user } = useAuth();

    async function handleCreate() {
        setLoading(true);

    // Verifica se o ID da empresa está presente nos metadados do usuário
    if (!user?.user_metadata?.id_empresa) {
        Alert.alert("Erro", "ID da empresa não encontrado!");
        setLoading(false);
        return;
    }

    console.log("ID empresa: ", user.user_metadata.id_empresa);

    // Agora você pode continuar com o cadastro, usando o ID da empresa
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                cpf,
                numero,
                id_empresa: user.user_metadata.id_empresa,  // Usando o ID da empresa do metadado
                salario,
                cargaHoraria
            
            }
        }
    });

    if (error) {
        Alert.alert("Erro", error.message);
        setLoading(false);
        return;
    }

    Alert.alert("Sucesso", "Funcionário cadastrado com sucesso!");
    setLoading(false);
    router.replace('/(panel)/employees/page'); // Redireciona para a lista de funcionários
}
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>

                    <View style={styles.formHeader}>
                        <View style={styles.header}>
                            <Text style={styles.LogoText}>
                                Adicionar<Text style={styles.greenText}> Funcionário</Text>
                            </Text>
                        </View>

                        <DrawerToggleButton tintColor={colors.white} />
                    </View>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Nome Completo</Text>
                            <TextInput
                                placeholder="Nome Completo..."
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Número</Text>
                            <TextInput
                                placeholder="Número..."
                                style={styles.input}
                                keyboardType="numeric"
                                value={numero}
                                onChangeText={setNumero}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>CPF</Text>
                            <TextInput
                                placeholder="CPF..."
                                style={styles.input}
                                value={cpf}
                                onChangeText={setCPF}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                placeholder="Email..."
                                style={styles.input}
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                placeholder="Senha..."
                                style={styles.input}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        {/* Novo campo para Salário */}
                        <View>
                            <Text style={styles.label}>Salário</Text>
                            <TextInput
                                placeholder="Salário..."
                                style={styles.input}
                                keyboardType="numeric"
                                value={salario}
                                onChangeText={setSalario}
                            />
                        </View>
                        {/* Novo campo para Carga Horária */}
                        <View>
                            <Text style={styles.label}>Carga Horária</Text>
                            <TextInput
                                placeholder="Carga Horária..."
                                style={styles.input}
                                keyboardType="numeric"
                                value={cargaHoraria}
                                onChangeText={setCargaHoraria}
                            />
                        </View>
                        {/* Novo campo para Data de Nascimento */}
                        <View>
                            <Text style={styles.label}>Data de Nascimento</Text>
                            <TextInput
                                placeholder="Data de Nascimento (YYYY-MM-DD)..."
                                style={styles.input}
                                value={dataNascimento}
                                onChangeText={setDataNascimento}
                            />
                        </View>

                        <Pressable style={styles.button} onPress={handleCreate}>
                            <Text style={styles.buttonText}>
                                {loading ? 'Cadastrando...' : 'Cadastrar' }
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
