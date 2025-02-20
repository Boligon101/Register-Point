import { createClient } from '@supabase/supabase-js';

// Inicialize o cliente Supabase com suas credenciais
const supabase = createClient('https://vtbzarnrukqecuphffem.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Ynphcm5ydWtxZWN1cGhmZmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzI0OTEsImV4cCI6MjA1NDk0ODQ5MX0.FMruIMwUBZ4WgSj_EGlbtCaruZ1cZf7LkcF3jnYSgWw');

// Função para buscar dados da tabela empresa
export async function fetchEmpresas() {
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
}

export default supabase; // Exportação padrão do cliente Supabase