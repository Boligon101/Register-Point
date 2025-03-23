import React from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import colors from "@/constants/Colors";
import styles from "@/assets/styles";

// Interface para as props
interface MonthPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectMonth: (monthIndex: number) => void;
}

// Lista de meses
const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Componente MonthPicker
const MonthPicker: React.FC<MonthPickerProps> = ({ visible, onClose, onSelectMonth }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Selecione o Mês</Text>
                    {months.map((month, index) => (
                        <Pressable
                            key={index}
                            style={styles.monthItem}
                            onPress={() => onSelectMonth(index)}
                        >
                            <Text style={styles.monthText}>{month}</Text>
                        </Pressable>
                    ))}
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default MonthPicker;