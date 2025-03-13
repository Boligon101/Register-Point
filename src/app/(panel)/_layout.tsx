// src/app/(panel)/_layout.js
import { useAuth } from "@/src/context/AuthContext";
import { ActivityIndicator, View, Text } from "react-native"; // Importe o Text
import EmpresaLayout from "./EmpresaLayout";
import FuncionarioLayout from "./FuncionarioLayout";
import Colors from "@/constants/Colors";

export default function PanelLayout() {
    const { user, userType } = useAuth(); // Obtém o usuário autenticado e o tipo de usuário

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.green} />
            </View>
        );
    }

    // Redireciona para o layout apropriado com base no tipo de usuário
    if (userType === "empresa") {
        return <EmpresaLayout />;
    } else if (userType === "funcionario") {
        return <FuncionarioLayout />;
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Usuário não encontrado em nenhuma tabela.</Text>
            </View>
        );
    }
}