import { Stack, router } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainLayout />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

function MainLayout() {
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Controla o estado de loading
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        console.log("Usuário autenticado:", session.user);
        setAuth(session.user);
        setIsAuthenticated(true);
      } else {
        console.log("Nenhum usuário autenticado.");
        setAuth(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Define que carregamento foi concluído
    };

    checkSession(); // Verifica a sessão antes de adicionar o listener

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log("Usuário autenticado:", session.user);
        setAuth(session.user);
        setIsAuthenticated(true);
        router.replace('/(panel)/profile/page');
      } else {
        console.log("Usuário deslogado.");
        setAuth(null);
        setIsAuthenticated(false);
        router.replace('/(auth)/signin/page');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <Stack.Screen name="index" />; // Exibe a tela de loading enquanto verifica autenticação
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(panel)/profile/page" />
      ) : (
        <Stack.Screen name="(auth)/signin/page" />
      )}
    </Stack>
  );
}
