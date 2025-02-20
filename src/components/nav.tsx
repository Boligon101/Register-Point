import styles from "@/assets/styles";
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View, Text } from "react-native";

// Adiciona a prop "showBackButton"
export default function Nav({ showBackButton = false }) {
    return (
        <View style={styles.formHeader}>
            
            {showBackButton && (
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                </Pressable>
            )}

            <View style={styles.header}>
                <Text style={styles.LogoText}>
                    Register<Text style={styles.greenText}>Point</Text> 
                </Text>
            </View>

        </View>
    );
}
