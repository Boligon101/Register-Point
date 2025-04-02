import React from "react";
import { 
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    ScrollView, 
    Alert
} from "react-native";
import { supabase } from "@/src/lib/supabase";
import Colors from "@/constants/Colors";
import styles from "@/assets/styles";

interface Funcionario {
    id: string;
    name: string;
}


interface VisualizarDemandaModalProps {
    visible: boolean;
    onClose: () => void;
    demandas: any[];
    selectedDate: string;
    onAddNew?: () => void; 
    onDemandaCancelada?: () => void;
    isEmpresa: boolean;  // Define se é empresa ou funcionário
}

const VisualizarDemandaModal: React.FC<VisualizarDemandaModalProps> = ({
    visible,
    onClose,
    demandas,
    selectedDate,
    onAddNew,
    onDemandaCancelada,
    isEmpresa
}) => {
    const handleCancelDemanda = async (id: string) => {
        try {
            const { error } = await supabase
                .from("demandas")
                .update({ ativo: false })
                .eq("id", id);
                
            if (error) throw error;
            
            Alert.alert("Sucesso", "Demanda cancelada com sucesso!");
            
            if (onDemandaCancelada) {
                onDemandaCancelada();
            }
            
            onClose();
        } catch (error) {
            console.error("Erro ao cancelar demanda:", error);
            Alert.alert("Erro", "Não foi possível cancelar a demanda");
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { width: '90%', maxHeight: '80%' }]}>
                    <Text style={styles.modalTitle}>Demandas para {selectedDate}</Text>
                    
                    {demandas.length === 0 ? (
                        <Text style={{ color: Colors.white, textAlign: 'center', marginVertical: 20 }}>
                            Nenhuma demanda encontrada para esta data.
                        </Text>
                    ) : (
                        <ScrollView style={{ marginBottom: 20 }}>
                            {demandas.map((demanda, index) => (
                                <View 
                                    key={demanda.id} 
                                    style={[
                                        styles.funcionarioItem, 
                                        index === demandas.length - 1 && styles.funcionarioItemLast
                                    ]}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.funcionarioNameList}>{demanda.nome}</Text>
                                        <Text style={{ 
                                            color: demanda.ativo ? Colors.green : Colors.gray,
                                            fontSize: 12
                                        }}>
                                            {demanda.ativo ? 'Ativa' : 'Cancelada'}
                                        </Text>
                                    </View>
                                    <Text style={{ color: Colors.lightGray, marginTop: 4 }}>
                                        Tipo: {demanda.tipo}
                                    </Text>
                                    <Text style={{ color: Colors.lightGray, marginTop: 4 }}>
                                        {demanda.descricao}
                                    </Text>
                                    <View style={{ marginTop: 8 }}>
                                        <Text style={{ color: Colors.green, fontWeight: '500' }}>
                                            Responsáveis:
                                        </Text>
                                        {demanda.funcionarios.map((f: any) => (
                                            <Text key={f.funcionario.id} style={{ color: Colors.lightGray }}>
                                                • {f.funcionario.name}
                                            </Text>
                                        ))}
                                    </View>

                                    {/* Empresa pode cancelar demandas, funcionário não */}
                                    {isEmpresa && demanda.ativo && (
                                        <TouchableOpacity
                                            style={[styles.button, styles.cancelButton, { 
                                                marginTop: 8,
                                                backgroundColor: Colors.red,
                                                borderColor: Colors.red
                                            }]}
                                            onPress={() => handleCancelDemanda(demanda.id)}
                                        >
                                            <Text style={styles.buttonText}>Cancelar Demanda</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>

                        {/* Apenas empresas podem criar novas demandas */}
                        {isEmpresa && onAddNew && (
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={() => {
                                    onClose();
                                    onAddNew();
                                }}
                            >
                                <Text style={styles.buttonText}>Nova Demanda</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};


export default VisualizarDemandaModal;