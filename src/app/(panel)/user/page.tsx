import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert, SafeAreaView } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";
import * as Location from 'expo-location';
import styles from "@/assets/styles";
import Nav from "@/src/components/nav";

export default function PontoFuncionario() {
    const { user } = useAuth();
    const [pontoIniciado, setPontoIniciado] = useState<boolean>(false);
    const [loadingPonto, setLoadingPonto] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [startLocation, setStartLocation] = useState<string | null>(null);
    const [endLocation, setEndLocation] = useState<string | null>(null);

    const getLocation = async (): Promise<string | null> => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Erro", "Permissão de localização negada.");
            return null;
        }
        let location = await Location.getCurrentPositionAsync({});
        return `${location.coords.latitude}, ${location.coords.longitude}`;
    };

    const iniciarPonto = async () => {
        setLoadingPonto(true);
        const now = new Date().toISOString();
        const location = await getLocation();
        if (!location) {
            setLoadingPonto(false);
            return;
        }

        setStartTime(now);
        setStartLocation(location);
        setPontoIniciado(true);
        setLoadingPonto(false);

        Alert.alert("Ponto iniciado!", `Horário: ${now}\nLocalização: ${location}`);
    };

    const finalizarPonto = async () => {
        if (!user || !startTime || !startLocation) {
            Alert.alert("Erro", "Você precisa iniciar o ponto primeiro.");
            return;
        }

        setLoadingPonto(true);
        const now = new Date().toISOString();
        const location = await getLocation();
        if (!location) {
            setLoadingPonto(false);
            return;
        }

        setEndTime(now);
        setEndLocation(location);
        setPontoIniciado(false);

        const { error } = await supabase.from("pontos").insert({
            id_usuario: user.id,
            entrada: startTime,
            location_entrada: startLocation,
            saida: now,
            location_saida: location,
            ativo: true,
            ausencia: false
        });

        if (error) {
            console.error("Erro ao registrar ponto:", error);
            Alert.alert("Erro", "Não foi possível registrar o ponto.");
        } else {
            Alert.alert("Ponto finalizado!", `Horário: ${now}\nLocalização: ${location}`);
        }

        setStartTime(null);
        setStartLocation(null);
        setEndTime(null);
        setEndLocation(null);
        setLoadingPonto(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Nav showBackButton={false} />

                <Text style={styles.slogan}>Bater o Ponto</Text>

                <Pressable
                    style={[styles.button, pontoIniciado ? styles.buttonEnd : styles.buttonStart]}
                    onPress={pontoIniciado ? finalizarPonto : iniciarPonto}
                    disabled={loadingPonto}
                >
                    {loadingPonto ? (
                        <ActivityIndicator size="small" color={"#FFF"} />
                    ) : (
                        <Text style={styles.buttonText}>
                            {pontoIniciado ? "Finalizar Ponto" : "Iniciar Ponto"}
                        </Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
