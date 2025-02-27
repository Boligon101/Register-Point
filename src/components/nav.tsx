import styles from "@/assets/styles";
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Pressable, View, Text } from "react-native";

// Componente Nav
export default function Nav({ showBackButton = false }) {
    return (
        <View style={styles.formHeader}>
            {/* Botão de voltar (opcional) */}
            {showBackButton && (
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                </Pressable>
            )}

            {/* Título */}
            <View style={styles.header}>
                <Text style={styles.LogoText}>
                    Register<Text style={styles.greenText}>Point</Text>
                </Text>
            </View>

            {/* Botão do Drawer (menu lateral) */}
            <DrawerToggleButton tintColor={colors.white} />
        </View>
    );
}