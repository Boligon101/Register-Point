import React, { useState } from "react";
import { 
    View, Text, TextInput, Pressable, SafeAreaView, 
    ScrollView, Alert, StyleSheet, Image, Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import styles from "@/assets/styles";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const imagemPadrao = require('@/assets/images/imagemPadrao.png');

// Lista de ramos pré-definidos
const RAMOS_EMPRESA = [
    'Tecnologia',
    'Saúde',
    'Educação',
    'Construção Civil',
    'Comércio Varejista',
    'Indústria',
    'Serviços Financeiros',
    'Alimentício',
    'Transporte e Logística',
    'Outros'
];

export default function AdicionarEmpresa() {
    // Estados básicos
    const [nomeEmpresa, setNomeEmpresa] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [emailEmpresa, setEmailEmpresa] = useState("");
    const [telefoneEmpresa, setTelefoneEmpresa] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Estados para novos campos
    const [ramo, setRamo] = useState(RAMOS_EMPRESA[0]);
    const [dataFundacao, setDataFundacao] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [endereco, setEndereco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);
    const [contatos, setContatos] = useState({
        site: "",
        instagram: "",
        linkedin: "",
        facebook: ""
    });
    
    // Estados para foto e localização
    const [fotoEmpresa, setFotoEmpresa] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [coordenadas, setCoordenadas] = useState({
        latitude: null as number | null,
        longitude: null as number | null
    });

    // Função para formatar CNPJ
    const formatarCNPJ = (text: string) => {
        let cleaned = text.replace(/\D/g, '');
        cleaned = cleaned.substring(0, 14);
        
        let formatted = cleaned;
        if (cleaned.length > 2) {
            formatted = `${cleaned.substring(0, 2)}.${cleaned.substring(2)}`;
        }
        if (cleaned.length > 5) {
            formatted = `${formatted.substring(0, 6)}.${formatted.substring(6)}`;
        }
        if (cleaned.length > 8) {
            formatted = `${formatted.substring(0, 10)}/${formatted.substring(10)}`;
        }
        if (cleaned.length > 12) {
            formatted = `${formatted.substring(0, 15)}-${formatted.substring(15)}`;
        }
        
        setCnpj(formatted);
    };

    // Função para validar CNPJ
    const validarCNPJ = (cnpj: string) => {
        cnpj = cnpj.replace(/[^\d]/g, '');
        return cnpj.length === 14;
    };

    // Função para formatar telefone
    const formatarTelefone = (text: string) => {
        let cleaned = text.replace(/\D/g, '');
        cleaned = cleaned.substring(0, 11);
        
        let formatted = cleaned;
        if (cleaned.length > 0) {
            formatted = `(${cleaned.substring(0, 2)}`;
        }
        if (cleaned.length > 2) {
            formatted = `${formatted}) ${cleaned.substring(2)}`;
        }
        if (cleaned.length > 7) {
            formatted = `${formatted.substring(0, 10)}-${formatted.substring(10)}`;
        }
        
        setTelefoneEmpresa(formatted);
    };

    // Função para selecionar foto
    const handleChangePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para adicionar a foto da empresa.");
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
            setFotoEmpresa(uri);
        }
    };


    // Função para buscar localização
    const buscarLocalizacao = async () => {
        setBuscandoLocalizacao(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos da permissão de localização.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const enderecos = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (enderecos.length > 0) {
                const enderecoFormatado = `${enderecos[0].street}, ${enderecos[0].district}, ${enderecos[0].city} - ${enderecos[0].region}`;
                setEndereco(enderecoFormatado);
                setCoordenadas({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            }
        } catch (error) {
            console.error("Erro ao buscar localização:", error);
            Alert.alert("Erro", "Não foi possível obter a localização.");
        } finally {
            setBuscandoLocalizacao(false);
        }
    };

    // Função para formatar data
    const formatarData = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
    };

    // Função para lidar com mudança de data
    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDataFundacao(selectedDate);
        }
    };

    // Função para fazer upload da foto - Versão Corrigida
    const uploadFoto = async () => {
        if (!fotoEmpresa) return null;
        
        setUploading(true);
        try {
            const response = await fetch(fotoEmpresa);
            const blob = await response.blob();
            const arrayBuffer = await new Response(blob).arrayBuffer();
            
            // Alterado para usar um bucket específico para empresas
            const fileName = `fotos-empresa/${Date.now()}.jpg`;

            console.log("Iniciando upload da imagem para o Supabase Storage...");

            // 1. Primeiro fazemos o upload para o storage
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('fotos-empresa') // Bucket específico para empresas
                .upload(fileName, arrayBuffer, { 
                    contentType: 'image/jpeg',
                    upsert: false
                });

            if (uploadError) {
                console.error("Erro ao fazer upload da imagem:", uploadError);
                throw new Error("Erro ao fazer upload da imagem.");
            }

            console.log("Upload da imagem concluído com sucesso!");
            return fileName;

        } catch (error) {
            console.error("Erro no upload da foto:", error);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    async function handleAdicionarEmpresa() {
        setLoading(true);
    
        try {
            // 1. Primeiro fazemos o upload da foto (se existir)
            let fotoFileName = null;
            if (fotoEmpresa) {
                try {
                    fotoFileName = await uploadFoto();
                    console.log('Foto uploadada com sucesso:', fotoFileName);
                } catch (uploadError) {
                    console.error('Erro no upload da foto:', uploadError);
                    throw new Error('Falha ao enviar a foto da empresa');
                }
            }
    
            // 2. Criar o usuário no Auth
            const { data: user, error: authError } = await supabase.auth.signUp({
                email: emailEmpresa,
                password: senha,
                options: {
                    data: {
                        name: nomeEmpresa,
                        role: "admin",
                    },
                },
            });
    
            if (authError) {
                console.error('Erro ao criar usuário:', authError);
                throw authError;
            }
    
            if (!user?.user) {
                throw new Error("Usuário não foi criado corretamente");
            }
    
            console.log('Usuário criado com ID:', user.user.id);
    
            // 3. Preparar os dados da empresa
            const empresaData = {
                name: nomeEmpresa,
                cnpj: cnpj.replace(/\D/g, ''),
                email: emailEmpresa,
                telefone: telefoneEmpresa.replace(/\D/g, ''),
                id_usuario: user.user.id,
                ramo: ramo,
                data_fundacao: dataFundacao.toISOString(),
                endereco: coordenadas.latitude && coordenadas.longitude 
                    ? `${coordenadas.latitude}, ${coordenadas.longitude}`
                    : null,
                descricao: descricao,
                contatos: contatos,
                foto_empresa: fotoFileName,
                ativo: true,
                admin: true
            };
    
            console.log('Dados da empresa a serem inseridos:', empresaData);
    
            // 4. Inserir na tabela empresa
            const { data: insertedEmpresa, error: empresaError } = await supabase
                .from('empresa')
                .insert(empresaData)
                .select()
                .single();
    
            if (empresaError) {
                console.error('Erro ao inserir empresa:', empresaError);
                throw empresaError;
            }
    
            console.log('Empresa criada com sucesso:', insertedEmpresa);
            Alert.alert("Sucesso", "Empresa cadastrada com sucesso!");
            router.back();
    
        } catch (error: unknown) {
            let errorMessage = "Ocorreu um erro no cadastro.";
            
            if (error instanceof Error) {
                errorMessage = error.message;
                console.error("Erro completo:", error);
            }
            
            // Verificação específica para erros do Supabase
            if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = error.message as string;
            }
    
            Alert.alert("Erro", errorMessage);
        } finally {
            setLoading(false);
        }
    }

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

                    <Text style={styles.slogan}>Adicionar Empresa</Text>

                    <View style={styles.form}>
                        {/* Nome da Empresa */}
                        <View>
                            <Text style={styles.label}>Nome da Empresa*</Text>
                            <TextInput
                                placeholder="Digite o nome da empresa..."
                                style={styles.input}
                                value={nomeEmpresa}
                                onChangeText={setNomeEmpresa}
                            />
                        </View>

                        {/* CNPJ */}
                        <View>
                            <Text style={styles.label}>CNPJ*</Text>
                            <TextInput
                                placeholder="Digite o CNPJ da empresa..."
                                style={styles.input}
                                value={cnpj}
                                onChangeText={formatarCNPJ}
                                keyboardType="numeric"
                                maxLength={18}
                            />
                        </View>

                        {/* Email */}
                        <View>
                            <Text style={styles.label}>Email da Empresa*</Text>
                            <TextInput
                                placeholder="Digite o email da empresa..."
                                style={styles.input}
                                value={emailEmpresa}
                                onChangeText={setEmailEmpresa}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Telefone */}
                        <View>
                            <Text style={styles.label}>Telefone da Empresa*</Text>
                            <TextInput
                                placeholder="Digite o telefone da empresa..."
                                style={styles.input}
                                value={telefoneEmpresa}
                                onChangeText={formatarTelefone}
                                keyboardType="phone-pad"
                                maxLength={15}
                            />
                        </View>

                        {/* Foto da Empresa */}
                        <View style={styles.photoSection}>
                            <Text style={styles.label}>Foto da Empresa</Text>
                            <Pressable 
                                onPress={handleChangePhoto} 
                                style={styles.imageContainerPerfil}
                            >
                                <Image
                                    source={fotoEmpresa 
                                        ? { uri: fotoEmpresa } // Pré-visualização da imagem selecionada
                                        : imagemPadrao}
                                    style={styles.profileImage}
                                    onError={(e) => console.log("Erro ao carregar imagem:", e)}
                                />
                                <Text style={styles.changePhotoText}>
                                    {fotoEmpresa ? 'Alterar Foto' : 'Adicionar Foto'}
                                </Text>
                            </Pressable>
                            {uploading && <Text style={styles.uploadingText}>Enviando foto...</Text>}
                        </View>


                        {/* Ramo */}
                        <View>
                            <Text style={styles.label}>Ramo da Empresa*</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={ramo}
                                    onValueChange={(itemValue) => setRamo(itemValue)}
                                    style={styles.picker}
                                >
                                    {RAMOS_EMPRESA.map((item) => (
                                        <Picker.Item key={item} label={item} value={item} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Data de Fundação */}
                        <View>
                            <Text style={styles.label}>Data de Fundação*</Text>
                            <Pressable 
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{formatarData(dataFundacao)}</Text>
                                <Ionicons name="calendar" size={20} color="#555" />
                            </Pressable>
                            
                            {showDatePicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={dataFundacao}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onChangeDate}
                                    maximumDate={new Date()}
                                    locale="pt-BR"
                                />
                            )}
                        </View>

                        {/* Endereço */}
                        <View>
                            <Text style={styles.label}>Endereço*</Text>
                            <View style={styles.addressContainer}>
                                <TextInput
                                    placeholder="Digite o endereço ou use sua localização atual"
                                    style={[styles.input, styles.addressInput]}
                                    value={endereco}
                                    onChangeText={setEndereco}
                                />
                                <Pressable 
                                    style={styles.locationButton}
                                    onPress={buscarLocalizacao}
                                    disabled={buscandoLocalizacao}
                                >
                                    <Ionicons 
                                        name="location" 
                                        size={20} 
                                        color={buscandoLocalizacao ? "#aaa" : "#00A86B"} 
                                    />
                                </Pressable>
                            </View>
                            {coordenadas.latitude && (
                                <Text style={styles.coordinatesText}>
                                    Coordenadas: {coordenadas.latitude.toFixed(6)}, {coordenadas.longitude?.toFixed(6)}
                                </Text>
                            )}
                        </View>

                        {/* Contatos */}
                        <View>
                            <Text style={styles.label}>Site</Text>
                            <TextInput
                                placeholder="https://empresa.com"
                                style={styles.input}
                                value={contatos.site}
                                onChangeText={(text) => setContatos({...contatos, site: text})}
                                keyboardType="url"
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Instagram</Text>
                            <TextInput
                                placeholder="@empresa_oficial"
                                style={styles.input}
                                value={contatos.instagram}
                                onChangeText={(text) => setContatos({...contatos, instagram: text})}
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>LinkedIn</Text>
                            <TextInput
                                placeholder="linkedin.com/company/empresa"
                                style={styles.input}
                                value={contatos.linkedin}
                                onChangeText={(text) => setContatos({...contatos, linkedin: text})}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Descrição */}
                        <View>
                            <Text style={styles.label}>Descrição da Empresa</Text>
                            <TextInput
                                placeholder="Fale sobre sua empresa..."
                                style={[styles.input, styles.descriptionInput]}
                                value={descricao}
                                onChangeText={setDescricao}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        {/* Senha */}
                        <View>
                            <Text style={styles.label}>Senha*</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder="Digite sua senha..."
                                    style={styles.passwordInput}
                                    value={senha}
                                    onChangeText={setSenha}
                                    secureTextEntry={!mostrarSenha}
                                />
                                <Pressable 
                                    style={styles.passwordToggle}
                                    onPress={() => setMostrarSenha(!mostrarSenha)}
                                >
                                    <Ionicons 
                                        name={mostrarSenha ? "eye-off" : "eye"} 
                                        size={24} 
                                        color="gray" 
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {/* Botão de cadastro */}
                        <Pressable 
                            style={[styles.button, loading && styles.buttonDisabled]} 
                            onPress={handleAdicionarEmpresa}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Carregando...' : 'Cadastrar Empresa'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
