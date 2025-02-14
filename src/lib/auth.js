import { supabase } from './supabase'; // Importe o cliente do Supabase

// Função para renovar o token
export const refreshToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Erro ao renovar o token:", error);
      return null;
    }

    console.log("Token renovado com sucesso:", data);
    return data.session;
  } catch (error) {
    console.error("Erro ao renovar o token:", error);
    return null;
  }
};

// Função para renovar o token antes que ele expire
export const renewTokenBeforeExpiry = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const expiresAt = session.expires_at * 1000; // Converte para milissegundos
  const now = Date.now();

  // Renova o token se faltar menos de 10 minutos para expirar
  if (expiresAt - now < 10 * 60 * 1000) {
    await refreshToken();
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Função para fazer logout
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erro ao fazer logout:", error);
  } else {
    console.log("Usuário deslogado com sucesso.");
  }
};