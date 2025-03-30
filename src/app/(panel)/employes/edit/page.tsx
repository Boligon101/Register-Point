import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { supabase } from "@/src/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import styles from "@/assets/styles";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import Nav from "@/src/components/nav";

export default function EditarFuncionario() {
    const { funcionario } = useLocalSearchParams();
    const funcionarioData = JSON.parse(funcionario as string);

    // Lista fixa de departamentos (igual ao formulário de criação)
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

    const [name, setName] = useState(funcionarioData.name);
    const [email, setEmail] = useState(funcionarioData.email);
    const [cpf, setCpf] = useState(funcionarioData.cpf);
    const [dataNascimento, setDataNascimento] = useState(funcionarioData.data_nacimento);
    const [salario, setSalario] = useState(funcionarioData.salario.toString());
    const [cargaHoraria, setCargaHoraria] = useState(funcionarioData.carga_horaria.toString());
    const [numero, setNumero] = useState(funcionarioData.numero);
    const [departamento, setDepartamento] = useState(funcionarioData.departamento || "");

    const handleSalvarEdicao = async () => {
        try {
            const { error } = await supabase
                .from('funcionarios')
                .update({
                    name,
                    email,
                    cpf,
                    data_nacimento: dataNascimento,
                    salario: parseFloat(salario),
                    carga_horaria: parseInt(cargaHoraria, 10),
                    numero,
                    departamento,
                })
                .eq('id', funcionarioData.id);

            if (error) {
                throw new Error("Erro ao atualizar funcionário.");
            }

            Alert.alert('Sucesso', 'Funcionário atualizado com sucesso!');
            router.back(); // Volta para a tela anterior
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Nav showBackButton={true}/>
                    <Text style={styles.slogan}>Editar Funcionário</Text>

                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="CPF"
                            value={cpf}
                            onChangeText={setCpf}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Data de Nascimento (AAAA-MM-DD)"
                            value={dataNascimento}
                            onChangeText={setDataNascimento}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Salário"
                            value={salario}
                            onChangeText={setSalario}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Carga Horária"
                            value={cargaHoraria}
                            onChangeText={setCargaHoraria}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Número"
                            value={numero}
                            onChangeText={setNumero}
                            keyboardType="phone-pad"
                        />

                        {/* Novo campo de departamento */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={styles.label}>Departamento</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={departamento}
                                    onValueChange={(itemValue: string) => setDepartamento(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione um departamento..." value="" />
                                    {departamentos.map((dept) => (
                                        <Picker.Item key={dept.id} label={dept.nome} value={dept.nome} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <Pressable
                            style={styles.button}
                            onPress={handleSalvarEdicao}
                        >
                            <Text style={styles.buttonText}>Salvar</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}