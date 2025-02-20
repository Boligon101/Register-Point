import colors from "@/constants/Colors";
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput,
    Pressable, 
    SafeAreaView,
    ScrollView,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import styles from "@/assets/styles";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@rneui/themed";

export default function Signup() {
    const { setAuth, user } = useAuth();
   
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>

                    <View style={styles.formHeader}>
                        <View style={styles.header}>
                            <Text style={styles.LogoText}>
                                Register<Text style={styles.greenText}>Point</Text>
                            </Text>
                        </View>

                        <DrawerToggleButton tintColor={colors.white} />
                    </View>

                    {/* <Text style={styles.slogan}>{user?.name}</Text> */}
                    <Text style={styles.slogan}>{user?.email}</Text>
                    <Text style={styles.slogan}>{user?.id}</Text>

                    <View style={styles.container}>
                        <Button
                            title="Cadastrar Funcionário"
                            onPress={() => router.push('/(panel)/employees/create')}
                            color={colors.green}
                        />

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}