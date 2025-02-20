import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useEffect, useState } from "react"; // Adicione useEffect e useState

export default function Profile() {
    const { setAuth, user } = useAuth();
    const [empresas, setEmpresas] = useState([]); // Estado para armazenar as empresas

    // Função para buscar dados da tabela empresa
    const fetchEmpresas = async () => {
        const { data, error } = await supabase
            .from('empresa') // Tabela de empresas
            .select('*') // Seleciona todos os campos
            .order('id', { ascending: true }); // Ordena pela ID (ou qualquer campo que desejar)

        if (error) {
            console.error("Erro ao carregar os dados:", error);
            return null;
        }

        console.log("Dados das empresas carregados com sucesso:", data);
        return data;  // Retorna os dados das empresas
    };

    // Carregar as empresas ao montar o componente
    useEffect(() => {
        const loadEmpresas = async () => {
            const data = await fetchEmpresas();
            if (data) {
                setEmpresas(data);
            }
        };

        loadEmpresas();
    }, []);

    async function handleSignout() {
        const { error } = await supabase.auth.signOut();
        setAuth(null);

        if (error) {
            Alert.alert("Error", 'Erro ao tentar sair da conta');
            return;
        }
    }

    return (
        <View style={styles.container}>
            <Text>Pagina De Perfil</Text>
            <Text>{user?.email}</Text>
            <Text>{user?.id}</Text>

            {/* Exibir a lista de empresas */}
            {empresas.map(empresa => (
                <View key={empresa.id}>
                    <Text>{empresa.nome}</Text>
                    <Text>{empresa.descricao}</Text>
                </View>
            ))}

            <Button
                title="Deslogar"
                onPress={handleSignout}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});