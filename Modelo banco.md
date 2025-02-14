
-- Tabela de Empresas
CREATE TABLE IF NOT EXISTS Empresa (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Funcionários
CREATE TABLE IF NOT EXISTS Funcionario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  dataNascimento DATE NOT NULL,
  salario NUMERIC(10, 2) NOT NULL,
  cargaHoraria INTEGER NOT NULL,
  empresaId INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT TRUE,
  documentoPath TEXT -- Opcional: caminho do documento no Supabase Storage
);

-- Tabela de Registro de Ponto com Auditoria
CREATE TABLE IF NOT EXISTS Ponto (
  id SERIAL PRIMARY KEY,
  funcionarioId INTEGER REFERENCES Funcionario(id) ON DELETE CASCADE,
  entrada TIMESTAMP NOT NULL,
  saida TIMESTAMP,
  localizacaoEntrada VARCHAR(255) NOT NULL,
  localizacaoSaida VARCHAR(255),
  ausente BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criadoEm TIMESTAMP DEFAULT NOW(),
  atualizadoEm TIMESTAMP
);

-- Tabela de Auditoria para Registro de Ponto
CREATE TABLE IF NOT EXISTS LogPonto (
  id SERIAL PRIMARY KEY,
  pontoId INTEGER REFERENCES Ponto(id) ON DELETE CASCADE,
  funcionarioId INTEGER REFERENCES Funcionario(id) ON DELETE CASCADE,
  alteracao TEXT NOT NULL,
  dataAlteracao TIMESTAMP DEFAULT NOW()
);

-- Tabela de Documentos dos Funcionários
CREATE TABLE IF NOT EXISTS Documento (
  id SERIAL PRIMARY KEY,
  funcionarioId INTEGER REFERENCES Funcionario(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- Ex: "Contrato", "Comprovante"
  caminhoArquivo TEXT NOT NULL -- Caminho do arquivo no Supabase Storage
);

-- Tabela de Mensagens Internas da Empresa para os Funcionários
CREATE TABLE IF NOT EXISTS Mensagem (
  id SERIAL PRIMARY KEY,
  empresaId INTEGER REFERENCES Empresa(id) ON DELETE CASCADE,
  funcionarioId INTEGER REFERENCES Funcionario(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  enviadaEm TIMESTAMP DEFAULT NOW(),
  lida BOOLEAN DEFAULT FALSE
);