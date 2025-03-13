// src/context/AuthContext.tsx
import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

interface AuthContextProps {
    user: User | null;
    setAuth: (authUser: User | null) => void;
    logout: () => Promise<void>;
    userType: "empresa" | "funcionario" | null; // Adiciona o tipo de usuário
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userType, setUserType] = useState<"empresa" | "funcionario" | null>(null); // Estado para o tipo de usuário
    const router = useRouter();

    // Função para definir o usuário autenticado
    function setAuth(authUser: User | null) {
        setUser(authUser);
    }

    // Função para realizar o logout
    async function logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Erro ao deslogar:", error.message);
                Alert.alert("Erro", "Não foi possível fazer logout.");
            } else {
                setAuth(null);
                setUserType(null); // Limpa o tipo de usuário
                router.replace('/(auth)/signin/page'); // Navega para a página de login
            }
        } catch (error) {
            console.error("Erro ao deslogar:", error);
            Alert.alert("Erro", "Ocorreu um erro ao fazer logout.");
        }
    }

    // Verifica a sessão do usuário ao carregar o componente
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                console.log("Usuário autenticado:", session.user);
                setAuth(session.user);

                // Verifica se o usuário é uma empresa ou funcionário
                const userId = session.user.id;

                const { data: empresaData } = await supabase
                    .from('empresa')
                    .select('id')
                    .eq('id_usuario', userId)
                    .single();

                const { data: funcionarioData } = await supabase
                    .from('funcionarios')
                    .select('id')
                    .eq('id_usuario', userId)
                    .single();

                if (empresaData) {
                    setUserType("empresa"); // Define o tipo de usuário como empresa
                    console.log("Tipo de usuário: empresa");
                } else if (funcionarioData) {
                    setUserType("funcionario"); // Define o tipo de usuário como funcionário
                    console.log("Tipo de usuário: funcionário");
                } else {
                    Alert.alert("Erro", "Usuário não encontrado em nenhuma tabela.");
                }
            } else {
                console.log("Nenhum usuário autenticado.");
                setAuth(null);
                setUserType(null); // Limpa o tipo de usuário
                router.replace('/(auth)/signin/page'); // Navega para a página de login
            }
        };

        checkSession(); // Verifica a sessão ao carregar o componente

        // Listener para mudanças no estado de autenticação
        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                console.log("Usuário autenticado:", session.user);
                setAuth(session.user);

                // Verifica se o usuário é uma empresa ou funcionário
                const userId = session.user.id;

                const { data: empresaData } = await supabase
                    .from('empresa')
                    .select('id')
                    .eq('id_usuario', userId)
                    .single();

                const { data: funcionarioData } = await supabase
                    .from('funcionarios')
                    .select('id')
                    .eq('id_usuario', userId)
                    .single();

                if (empresaData) {
                    setUserType("empresa"); // Define o tipo de usuário como empresa
                    console.log("Tipo de usuário: empresa");
                    router.replace('/(panel)/profile/page'); // Redireciona para a página da empresa
                } else if (funcionarioData) {
                    setUserType("funcionario"); // Define o tipo de usuário como funcionário
                    console.log("Tipo de usuário: funcionário");
                    router.replace('/(panel)/user/page'); // Redireciona para a página do funcionário
                } else {
                    Alert.alert("Erro", "Usuário não encontrado em nenhuma tabela.");
                }
            } else {
                console.log("Usuário deslogado.");
                setAuth(null);
                setUserType(null); // Limpa o tipo de usuário
                router.replace('/(auth)/signin/page'); // Navega para a página de login
            }
        });

        // Remove o listener ao desmontar o componente
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setAuth, logout, userType }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);