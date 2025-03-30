import { supabase } from "@/src/lib/supabase";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, SafeAreaView, ScrollView, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "@/assets/styles";

const CadastroFuncionario = () => {
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [dataNascimento, setDataNascimento] = useState<string>("");
  const [salario, setSalario] = useState<string>("");
  const [cargaHoraria, setCargaHoraria] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [departamento, setDepartamento] = useState<string>("");
  const [idEmpresa, setIdEmpresa] = useState<string | null>(null);
  const [ativo, setAtivo] = useState<boolean>(true);
  const [admin, setAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Lista fixa de departamentos
  const departamentos = [
    { id: "1", nome: "Administrativo" },
    { id: "2", nome: "Financeiro" },
    { id: "3", nome: "RH" },
    { id: "4", nome: "TI" },
    { id: "5", nome: "Vendas" },
    { id: "6", nome: "Marketing" },
    { id: "7", nome: "Produção" },
    { id: "8", nome: "Logística" },
  ];

  useEffect(() => {
    const fetchEmpresaId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: empresaData, error } = await supabase
          .from('empresa')
          .select('id')
          .eq('id_usuario', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar empresa:', error);
        } else if (empresaData) {
          setIdEmpresa(empresaData.id);
        }
      }
    };

    fetchEmpresaId();
  }, []);

  const formatarData = (data: string): string | null => {
    const dataLimpa = data.replace(/\D/g, '');
    if (dataLimpa.length === 8) {
      return `${dataLimpa.slice(4, 8)}-${dataLimpa.slice(2, 4)}-${dataLimpa.slice(0, 2)}`;
    }
    return null;
  };

  const handleCadastro = async () => {
    setLoading(true);
    
    const dataNascimentoFormatada = formatarData(dataNascimento);

    if (!dataNascimentoFormatada) {
      Alert.alert('Erro', 'Data de nascimento inválida.');
      setLoading(false);
      return;
    }

    if (!idEmpresa) {
      Alert.alert('Erro', 'Empresa não encontrada.');
      setLoading(false);
      return;
    }

    if (!departamento) {
      Alert.alert('Erro', 'Selecione um departamento.');
      setLoading(false);
      return;
    }

    // Criação do usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: senha,
      options: {
          data: {
              display_name: name, 
          },
      },
    });

    if (authError) {
      Alert.alert('Erro', 'Erro ao criar usuário: ' + authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Inserção do funcionário na tabela funcionarios
      const { data: funcionarioData, error: insertError } = await supabase
        .from('funcionarios')
        .insert([
          {
            name,
            cpf,
            data_nascimento: dataNascimentoFormatada,
            salario: parseFloat(salario),
            carga_horaria: parseInt(cargaHoraria, 10),
            email,
            numero,
            id_empresa: idEmpresa,
            ativo,
            admin,
            id_usuario: authData.user.id,
            departamento, 
            foto_perfil: 'imagemPadrao.jpg' // Imagem padrão
          },
        ]);

      if (insertError) {
        Alert.alert('Erro', 'Erro ao inserir funcionário: ' + insertError.message);
      } else {
        Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso!');
        // Limpar os campos após o cadastro
        setName('');
        setCpf('');
        setDataNascimento('');
        setSalario('');
        setCargaHoraria('');
        setEmail('');
        setNumero('');
        setSenha('');
        setDepartamento('');
      }
    } else {
      Alert.alert('Erro', 'Usuário não foi criado.');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.formHeader}>
            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            <View style={styles.header}>
              <Text style={styles.LogoText}>
                Register<Text style={styles.greenText}>Point</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.slogan}>Cadastrar Funcionário</Text>

          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                placeholder="Digite o nome do funcionário..."
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                placeholder="Digite o CPF do funcionário..."
                style={styles.input}
                value={cpf}
                onChangeText={setCpf}
              />
            </View>

            <View>
              <Text style={styles.label}>Data de Nascimento (DDMMAAAA)</Text>
              <TextInput
                placeholder="Digite a data de nascimento (DDMMAAAA)..."
                style={styles.input}
                value={dataNascimento}
                onChangeText={(text) => {
                  const dataLimpa = text.replace(/\D/g, '').slice(0, 8);
                  setDataNascimento(dataLimpa);
                }}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text style={styles.label}>Salário</Text>
              <TextInput
                placeholder="Digite o salário do funcionário..."
                style={styles.input}
                value={salario}
                onChangeText={setSalario}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text style={styles.label}>Carga Horária (horas)</Text>
              <TextInput
                placeholder="Digite a carga horária (horas)..."
                style={styles.input}
                value={cargaHoraria}
                onChangeText={(text) => {
                  const horasLimpa = text.replace(/\D/g, '').slice(0, 2);
                  setCargaHoraria(horasLimpa);
                }}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text style={styles.label}>Departamento</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={departamento}
                  onValueChange={(itemValue) => setDepartamento(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione um departamento..." value="" />
                  {departamentos.map((dept) => (
                    <Picker.Item key={dept.id} label={dept.nome} value={dept.nome} />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Digite o email do funcionário..."
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text style={styles.label}>Número</Text>
              <TextInput
                placeholder="Digite o número do funcionário..."
                style={styles.input}
                value={numero}
                onChangeText={setNumero}
                keyboardType="phone-pad"
              />
            </View>

            <View>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                placeholder="Digite a senha do funcionário..."
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            <Pressable 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleCadastro}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Carregando...' : 'Cadastrar Funcionário'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CadastroFuncionario;