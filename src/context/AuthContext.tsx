import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router"; // Importe o useRouter
import { supabase } from "../lib/supabase"; // Importe o supabase

interface AuthContextProps {
    user: User | null;
    setAuth: (authUser: User | null) => void;
    logout: () => Promise<void>; // Adiciona a função de logout
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter(); // Use o useRouter para navegação

    // Função para definir o usuário autenticado
    function setAuth(authUser: User | null) {
        setUser(authUser);
    }

    // Função para realizar o logout
    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Erro ao deslogar:", error.message);
        } else {
            setAuth(null);
            router.replace('/(auth)/signin/page'); // Navega para a página de login
        }
    }

    // Verifica a sessão do usuário ao carregar o componente
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                console.log("Usuário autenticado:", session.user);
                setAuth(session.user);
                router.push('/(panel)/profile/page'); // Navega para a página de perfil
            } else {
                console.log("Nenhum usuário autenticado.");
                setAuth(null);
                router.replace('/(auth)/signin/page'); // Navega para a página de login
            }
        };

        checkSession(); // Verifica a sessão ao carregar o componente

        // Listener para mudanças no estado de autenticação
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                console.log("Usuário autenticado:", session.user);
                setAuth(session.user);
                router.push('/(panel)/profile/page'); // Navega para a página de perfil
            } else {
                console.log("Usuário deslogado.");
                setAuth(null);
                router.replace('/(auth)/signin/page'); // Navega para a página de login
            }
        });

        // Remove o listener ao desmontar o componente
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);