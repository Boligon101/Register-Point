import React, { useEffect, useState } from "react";
import {
    View, Text, Image, Pressable, SafeAreaView, ScrollView,
    ActivityIndicator, Alert, TextInput, Modal
} from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import Nav from "@/src/components/nav";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import styles from "@/assets/styles";
import * as FileSystem from 'expo-file-system';

const imagemPadrao = require("@/assets/images/imagemPadrao.png");

export default function PerfilFuncionario() {
    const { user, logout } = useAuth();
    const [funcionario, setFuncionario] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [telefone, setTelefone] = useState<string>("");

    useEffect(() => {
        const fetchFuncionario = async () => {
            if (!user) {
                Alert.alert("Erro", "Usuário não autenticado.");
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("funcionarios")
                    .select("*")
                    .eq("id_usuario", user.id)
                    .single();

                if (error) throw new Error("Erro ao buscar funcionário.");

                setFuncionario(data);
                setTelefone(formatarTelefone(data.numero));

                if (data.id_empresa) {
                    const { data: empresa, error: empresaError } = await supabase
                        .from("empresa")
                        .select("name")
                        .eq("id", data.id_empresa)
                        .single();

                    if (empresaError) throw new Error("Erro ao buscar empresa.");
                    setFuncionario((prev: any) => ({ ...prev, empresa_nome: empresa.name }));
                }
            } catch (error) {
                console.error("Erro ao buscar funcionário:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do funcionário.");
            } finally {
                setLoading(false);
            }
        };

        fetchFuncionario();
    }, [user]);

    const formatarTelefone = (numero: string) => {
        if (!numero) return "Não informado";
        const numerosApenas = numero.replace(/\D/g, "");

        if (numerosApenas.length === 12) {
            return numerosApenas.replace(/^(\d{2})(\d{5})(\d{5})$/, "($1) $2-$3");
        } else if (numerosApenas.length === 11) {
            return numerosApenas.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        } else if (numerosApenas.length === 10) {
            return numerosApenas.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
        } else {
            return "Número inválido";
        }
    };

    const calcularIdade = (dataNascimento: string) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return idade;
    };

    const handleChangePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para alterar a foto de perfil.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];

            try {
                const response = await fetch(uri);
                const blob = await response.blob();
                const arrayBuffer = await new Response(blob).arrayBuffer();
                const fileName = `fotos-perfil/${Date.now()}.jpg`;

                console.log("URI da imagem selecionada:", uri);
                console.log("Nome do arquivo gerado:", fileName);

                console.log("Iniciando upload da imagem para o Supabase Storage...");

                const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('fotos-perfil')
                .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: false });

                if (uploadError) {
                    console.error("Erro ao fazer upload da imagem:", uploadError);
                    throw new Error("Erro ao fazer upload da imagem.");
                }

                console.log("Upload da imagem concluído com sucesso!");

                const { error } = await supabase
                    .from("funcionarios")
                    .update({ foto_perfil: fileName })
                    .eq("id_usuario", user?.id);

                if (error) {
                    console.error("Erro ao atualizar a foto de perfil:", error);
                    throw new Error("Erro ao atualizar a foto de perfil.");
                }

                console.log("Nome do arquivo salvo no banco de dados:", fileName);

                setFuncionario({ ...funcionario, foto_perfil: fileName });
                Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar a foto de perfil:", error);
                Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
            }
        }
    };

    // Função para construir a URL completa da imagem
    const getFotoUrl = (fileName: string) => {
        if (!fileName) return null;
        const { data: urlData } = supabase.storage
            .from('fotos-perfil')
            .getPublicUrl(fileName);

        console.log("URL gerada para a imagem:", urlData.publicUrl);
        return urlData.publicUrl;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Nav />
                    
                    {loading ? (
                        <ActivityIndicator size="large" color={"#00A86B"} />
                    ) : funcionario ? (
                        <View style={styles.profileContainer}>
                            {/* Foto de perfil */}
                            <Pressable onPress={handleChangePhoto} style={styles.imageContainerPerfil}>
                                <Image
                                    source={funcionario.foto_perfil ? { uri: getFotoUrl(funcionario.foto_perfil) } : imagemPadrao}
                                    style={styles.profileImage}
                                    onError={(e) => console.log("Erro ao carregar a imagem:", e.nativeEvent.error)}
                                />
                                <Text style={styles.changePhotoText}>Alterar Foto</Text>
                            </Pressable>

                            {/* Dados pessoais */}
                            <View style={styles.profileSection}>
                                <Text style={styles.profileLabel}>Nome:</Text>
                                <Text style={styles.profileValue}>{funcionario.name}</Text>

                                <Text style={styles.profileLabel}>Idade:</Text>
                                <Text style={styles.profileValue}>{funcionario.data_nascimento ? calcularIdade(funcionario.data_nascimento) + " anos" : "Não informado"}</Text>

                                <Text style={styles.profileLabel}>Email:</Text>
                                <Text style={styles.profileValue}>{funcionario.email}</Text>

                                <Text style={styles.profileLabel}>Telefone:</Text>
                                <Text style={styles.profileValue}>{formatarTelefone(funcionario.numero)}</Text>
                            </View>

                            {/* Dados da empresa */}
                            <View style={styles.profileSection}>
                                <Text style={styles.profileLabel}>Empresa:</Text>
                                <Text style={styles.profileValue}>{funcionario.empresa_nome || "Não informado"}</Text>

                                <Text style={styles.profileLabel}>Carga Horária:</Text>
                                <Text style={styles.profileValue}>{funcionario.carga_horaria || "Não informado"}</Text>

                                <Text style={styles.profileLabel}>Salário:</Text>
                                <Text style={styles.profileValue}>{funcionario.salario || "Não informado"}</Text>
                            </View>

                        </View>
                    ) : (
                        <Text style={styles.errorText}>Nenhum funcionário encontrado.</Text>
                    )}

                    {/* Botão de logout */}
                    <Pressable style={[styles.button, styles.logoutButton]} onPress={logout}>
                        <Text style={styles.buttonText}>Deslogar</Text>
                    </Pressable>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}