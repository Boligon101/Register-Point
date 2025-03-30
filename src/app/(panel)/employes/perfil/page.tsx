import React, { useEffect, useState } from "react";
import {
    View, Text, Image, Pressable, SafeAreaView, ScrollView,
    ActivityIndicator, Alert, StyleSheet, Dimensions, Linking
} from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import Nav from "@/src/components/nav";
import { useRouter } from "expo-router";
import styles from "@/assets/styles";
import { PieChart } from "react-native-chart-kit";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const imagemPadrao = require("@/assets/images/imagemPadrao.png");

export default function PerfilEmpresa() {
    const { user, logout } = useAuth();
    const [empresa, setEmpresa] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [departamentos, setDepartamentos] = useState<any[]>([]);
    const [totalFuncionarios, setTotalFuncionarios] = useState<number>(0);
    const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchEmpresaData = async () => {
            if (!user) {
                Alert.alert("Erro", "Usuário não autenticado.");
                return;
            }

            try {
                // Buscar dados da empresa
                const { data: empresaData, error: empresaError } = await supabase
                    .from("empresa")
                    .select("*")
                    .eq("id_usuario", user.id)
                    .single();

                if (empresaError) throw new Error("Erro ao buscar dados da empresa.");
                if (!empresaData) throw new Error("Empresa não encontrada.");

                setEmpresa(empresaData);
                
                // Processar coordenadas do endereço
                if (empresaData.endereco) {
                    const locations = await Location.geocodeAsync(empresaData.endereco);
                    if (locations.length > 0) {
                        setLocation({
                            latitude: locations[0].latitude,
                            longitude: locations[0].longitude
                        });
                    }
                }

                // Buscar funcionários da empresa
                const { data: funcionariosData, error: funcionariosError } = await supabase
                    .from("funcionarios")
                    .select("departamento")
                    .eq("id_empresa", empresaData.id);

                if (funcionariosError) throw new Error("Erro ao buscar funcionários.");

                // Calcular distribuição por departamento
                const departamentosMap = new Map();
                funcionariosData.forEach((func) => {
                    const depto = func.departamento || "Sem departamento";
                    departamentosMap.set(depto, (departamentosMap.get(depto) || 0) + 1);
                });

                const departamentosArray = Array.from(departamentosMap, ([name, count]) => ({
                    name,
                    count,
                    color: getRandomColor(),
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                }));

                setDepartamentos(departamentosArray);
                setTotalFuncionarios(funcionariosData.length);

            } catch (error) {
                console.error("Erro ao buscar dados da empresa:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados da empresa.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmpresaData();
    }, [user]);

    const handleChangePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para alterar a foto da empresa.");
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
                setUploading(true);
                const response = await fetch(uri);
                const blob = await response.blob();
                const arrayBuffer = await new Response(blob).arrayBuffer();
                const fileName = `fotos-empresa/${Date.now()}.jpg`;

                console.log("Iniciando upload da imagem para o Supabase Storage...");

                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('fotos-empresa')
                    .upload(fileName, arrayBuffer, { 
                        contentType: 'image/jpeg', 
                        upsert: false 
                    });

                if (uploadError) {
                    console.error("Erro ao fazer upload da imagem:", uploadError);
                    throw new Error("Erro ao fazer upload da imagem.");
                }

                console.log("Upload da imagem concluído com sucesso!");

                const { error } = await supabase
                    .from("empresa")
                    .update({ foto_empresa: fileName })
                    .eq("id_usuario", user?.id);

                if (error) {
                    console.error("Erro ao atualizar a foto da empresa:", error);
                    throw new Error("Erro ao atualizar a foto da empresa.");
                }

                console.log("Nome do arquivo salvo no banco de dados:", fileName);
                setEmpresa({ ...empresa, foto_empresa: fileName });
                Alert.alert("Sucesso", "Foto da empresa atualizada com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar a foto da empresa:", error);
                Alert.alert("Erro", "Não foi possível atualizar a foto da empresa.");
            } finally {
                setUploading(false);
            }
        }
    };

    const getFotoUrl = (fileName: string) => {
        if (!fileName) return null;
        const { data: urlData } = supabase.storage
            .from('fotos-empresa')
            .getPublicUrl(fileName);
        return urlData.publicUrl;
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const formatarCNPJ = (cnpj: string) => {
        if (!cnpj) return "Não informado";
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    };

    const formatarData = (dataString: string) => {
        if (!dataString) return "Não informado";
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    const abrirLink = (url: string) => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        Linking.openURL(url).catch(err => console.error("Erro ao abrir link:", err));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Nav />
                    
                    {loading ? (
                        <ActivityIndicator size="large" color={"#00A86B"} />
                    ) : empresa ? (
                        <View style={styles.profileContainer}>
                            {/* Foto da empresa */}
                            <Pressable onPress={handleChangePhoto} style={styles.imageContainerPerfil}>
                                <Image
                                    source={empresa.foto_empresa ? { uri: getFotoUrl(empresa.foto_empresa) } : imagemPadrao}
                                    style={styles.profileImage}
                                    onError={(e) => console.log("Erro ao carregar a imagem:", e.nativeEvent.error)}
                                />
                                <Text style={styles.changePhotoText}>
                                    {uploading ? 'Enviando...' : 'Alterar Foto'}
                                </Text>
                            </Pressable>

                            {/* Dados básicos da empresa */}
                            <View style={styles.profileSection}>
                                <Text style={styles.profileLabel}>Nome da Empresa:</Text>
                                <Text style={styles.profileValue}>{empresa.name}</Text>
                                
                                <Text style={styles.profileLabel}>CNPJ:</Text>
                                <Text style={styles.profileValue}>{formatarCNPJ(empresa.cnpj)}</Text>

                                <Text style={styles.profileLabel}>Ramo de Atividade:</Text>
                                <Text style={styles.profileValue}>{empresa.ramo || "Não informado"}</Text>

                                <Text style={styles.profileLabel}>Data de Fundação:</Text>
                                <Text style={styles.profileValue}>{formatarData(empresa.data_fundacao)}</Text>

                                <Text style={styles.profileLabel}>Email:</Text>
                                <Text style={styles.profileValue}>{empresa.email}</Text>

                                <Text style={styles.profileLabel}>Telefone:</Text>
                                <Text style={styles.profileValue}>{empresa.telefone || "Não informado"}</Text>

                                {empresa.descricao && (
                                    <>
                                        <Text style={styles.profileLabel}>Descrição:</Text>
                                        <Text style={styles.profileValue}>{empresa.descricao}</Text>
                                    </>
                                )}
                            </View>

                            {/* Contatos */}
                            {empresa.contatos && (
                                <View style={styles.profileSection}>
                                    <Text style={styles.profileLabel}>Contatos:</Text>
                                    
                                    {empresa.contatos.site && (
                                        <Pressable onPress={() => abrirLink(empresa.contatos.site)}>
                                            <Text style={[styles.profileValue, {color: '#00A86B'}]}>Site: {empresa.contatos.site}</Text>
                                        </Pressable>
                                    )}
                                    
                                    {empresa.contatos.instagram && (
                                        <Pressable onPress={() => abrirLink(`https://instagram.com/${empresa.contatos.instagram.replace('@', '')}`)}>
                                            <Text style={[styles.profileValue, {color: '#00A86B'}]}>Instagram: {empresa.contatos.instagram}</Text>
                                        </Pressable>
                                    )}
                                    
                                    {empresa.contatos.linkedin && (
                                        <Pressable onPress={() => abrirLink(empresa.contatos.linkedin)}>
                                            <Text style={[styles.profileValue, {color: '#00A86B'}]}>LinkedIn: {empresa.contatos.linkedin}</Text>
                                        </Pressable>
                                    )}
                                </View>
                            )}

                            {/* Container para gráfico de pizza */}
                            <View style={styles.stats_chartContainer}>
                                <Text style={styles.stats_chartTitle}>Distribuição por Departamento</Text>
                                <PieChart
                                    data={departamentos}
                                    width={Dimensions.get('window').width - 40}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 168, 107, ${opacity})`,
                                    }}
                                    accessor="count"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                    hasLegend={false}
                                />
                                <View style={styles.stats_legendContainer}>
                                    {departamentos.map((item, index) => (
                                        <View key={index} style={styles.stats_legendItem}>
                                            <View style={[styles.stats_legendColor, { backgroundColor: item.color }]} />
                                            <Text style={styles.stats_legendText}>
                                                {item.name}: {item.count}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>


                            {/* Endereço e Mapa */}
                            <View style={styles.profileSection}>
                                <Text style={styles.profileLabel}>Endereço:</Text>
                                {empresa.endereco ? (
                                    <>
                                        {location && (
                                            <View style={styles.mapContainer}>
                                                <MapView
                                                    style={styles.map}
                                                    initialRegion={{
                                                        latitude: location.latitude,
                                                        longitude: location.longitude,
                                                        latitudeDelta: 0.005,
                                                        longitudeDelta: 0.005,
                                                    }}
                                                >
                                                    <Marker
                                                        coordinate={{
                                                            latitude: location.latitude,
                                                            longitude: location.longitude
                                                        }}
                                                        title="Localização da Empresa"
                                                    />
                                                </MapView>
                                            </View>
                                        )}
                                    </>
                                ) : (
                                    <Text style={styles.profileValue}>Não informado</Text>
                                )}
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.errorText}>Nenhuma empresa encontrada.</Text>
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

