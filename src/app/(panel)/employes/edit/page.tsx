import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
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

    const [name, setName] = useState(funcionarioData.name);
    const [email, setEmail] = useState(funcionarioData.email);
    const [cpf, setCpf] = useState(funcionarioData.cpf);
    const [dataNascimento, setDataNascimento] = useState(funcionarioData.data_nacimento);
    const [salario, setSalario] = useState(funcionarioData.salario.toString());
    const [cargaHoraria, setCargaHoraria] = useState(funcionarioData.carga_horaria.toString());
    const [numero, setNumero] = useState(funcionarioData.numero);

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