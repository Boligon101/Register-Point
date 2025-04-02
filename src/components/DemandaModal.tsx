import React, { useState, useEffect, useCallback } from "react";
import { 
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    TextInput, 
    ScrollView, 
    Alert,
    ActivityIndicator,
    SafeAreaView
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import Colors from "@/constants/Colors";
import styles from "@/assets/styles";

type Funcionario = {
    id: string;
    name: string;
    departamento: string; // Adicione esta linha se existir no seu banco
};

interface DemandaModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (demanda: {
        nome: string;
        descricao: string;
        tipo: string;
        funcionarios: string[];
    }) => Promise<void>;
    selectedDate: string;
    loading: boolean;
    empresaId: string;
}

const tiposDemanda = [
    "Reunião",
    "Tarefa",
    "Projeto",
    "Manutenção",
    "Outro"
];

const DemandaModal: React.FC<DemandaModalProps> = ({
    visible,
    onClose,
    onSave,
    selectedDate,
    loading,
    empresaId
}) => {
    const { user } = useAuth();
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tipo, setTipo] = useState(tiposDemanda[0]);
    const [selectedFuncionarios, setSelectedFuncionarios] = useState<string[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loadingFuncionarios, setLoadingFuncionarios] = useState(true);

    const fetchFuncionarios = useCallback(async () => {
        if (!empresaId) {
            setLoadingFuncionarios(false);
            return;
        }

        try {
            setLoadingFuncionarios(true);
            const { data, error } = await supabase
                .from('funcionarios')
                .select('id, name, departamento') // Mudei para buscar departamento ao invés de email
                .eq('id_empresa', empresaId)
                .order('name', { ascending: true }); // Ordena por nome

            if (error) throw error;
            setFuncionarios(data || []);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            Alert.alert('Erro', 'Não foi possível carregar os funcionários');
        } finally {
            setLoadingFuncionarios(false);
        }
    }, [empresaId]);

    useEffect(() => {
        if (visible) {
            fetchFuncionarios();
        }
    }, [visible, fetchFuncionarios]);

    const [errors, setErrors] = useState({
        nome: '',
        descricao: '',
        funcionarios: ''
    });
    
    const validate = () => {
        const newErrors = {
            nome: nome.trim() ? '' : 'Nome é obrigatório',
            descricao: descricao.trim() ? '' : 'Descrição é obrigatória',
            funcionarios: selectedFuncionarios.length ? '' : 'Selecione pelo menos um funcionário'
        };
        
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };
    
    const handleSave = async () => {
        if (!validate()) return;
    
        try {
            await onSave({
                nome,
                descricao,
                tipo,
                funcionarios: selectedFuncionarios
            });
            
            // Reset form
            setNome('');
            setDescricao('');
            setTipo(tiposDemanda[0]);
            setSelectedFuncionarios([]);
            setErrors({
                nome: '',
                descricao: '',
                funcionarios: ''
            });
        } catch (error) {
            console.error('Erro ao salvar demanda:', error);
        }
    };

    const toggleFuncionario = (id: string) => {
        setSelectedFuncionarios(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        );
    };

    if (loadingFuncionarios) {
        return (
            <Modal transparent visible={visible} onRequestClose={onClose}>
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color={Colors.green} />
                        <Text style={{ color: Colors.white, marginTop: 10 }}>
                            Carregando funcionários...
                        </Text>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, width: '100%' }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[styles.modalContent, { width: '90%', alignSelf: 'center', marginVertical: 20 }]}>
                        <Text style={styles.modalTitle}>Nova Demanda</Text>
                        <Text style={styles.modalSubtitle}><Text style={styles.modal_subtitle}>Data: </Text>{selectedDate}</Text>

                        <TextInput
                            style={[styles.input, errors.nome && styles.inputError]}
                            placeholder="Digite o nome"
                            placeholderTextColor={Colors.gray}
                            value={nome}
                            onChangeText={(text) => {
                                setNome(text);
                                if (errors.nome && text.trim()) {
                                    setErrors({...errors, nome: ''});
                                }
                            }}
                        />
                        {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

                        <View style={styles.fieldContainer}>
                            <Text style={styles.modal_subtitle}>Descrição</Text>
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                placeholder="Descreva a demanda..."
                                placeholderTextColor={Colors.gray}
                                multiline
                                value={descricao}
                                onChangeText={setDescricao}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.modal_subtitle}>Tipo</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={tipo}
                                    style={styles.picker}
                                    onValueChange={setTipo}
                                >
                                    {tiposDemanda.map((tipo, index) => (
                                        <Picker.Item key={index} label={tipo} value={tipo} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.modal_subtitle}>Atribuir a:</Text>
                            {funcionarios.length > 0 ? (
                                <ScrollView 
                                    style={{ 
                                        maxHeight: 150,
                                        backgroundColor: Colors.white,
                                        borderRadius: 8,
                                    }}
                                    nestedScrollEnabled
                                >
                                    {funcionarios.map(func => (
                                        <TouchableOpacity
                                            key={func.id}
                                            style={{
                                                padding: 12,
                                                backgroundColor: selectedFuncionarios.includes(func.id) 
                                                    ? Colors.lightGreen 
                                                    : Colors.white,
                                                borderRadius: 5,
                                                marginBottom: 5,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}
                                            onPress={() => toggleFuncionario(func.id)}
                                        >
                                            <Text style={{ 
                                                color: selectedFuncionarios.includes(func.id) 
                                                    ? Colors.darckgreen 
                                                    : Colors.zinc,
                                                fontWeight: '500'
                                            }}>
                                                {func.name}
                                            </Text>
                                            <Text style={{ 
                                                color: selectedFuncionarios.includes(func.id) 
                                                    ? Colors.white 
                                                    : Colors.darckgreen,
                                                fontSize: 12
                                            }}>
                                                {func.departamento}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <Text style={{ color: Colors.white }}>
                                    Nenhum funcionário disponível
                                </Text>
                            )}
                        </View>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleSave}
                                disabled={loading || selectedFuncionarios.length === 0}
                            >
                                <Text style={styles.buttonText}>
                                    {loading ? "Salvando..." : "Agendar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

export default DemandaModal;