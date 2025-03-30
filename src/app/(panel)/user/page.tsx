import React, { useState, useEffect } from "react";
import { 
    View, Text, Pressable, ActivityIndicator, Alert, 
    SafeAreaView, Animated, Easing 
} from "react-native";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";
import * as Location from 'expo-location';
import styles from "@/assets/styles";
import Nav from "@/src/components/nav";
import Colors from "@/constants/Colors";

export default function PontoFuncionario() {
    const { user } = useAuth();
    const [pontoIniciado, setPontoIniciado] = useState<boolean>(false);
    const [loadingPonto, setLoadingPonto] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
    const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString());
    const [funcionario, setFuncionario] = useState<any>(null);
    const [empresa, setEmpresa] = useState<any>(null);
    const [timeWorked, setTimeWorked] = useState<string>("00:00:00");
    
    // Animações
    const buttonScale = new Animated.Value(1);
    const pulseAnim = new Animated.Value(0);

    // Animação de pulso para o botão quando ativo
    useEffect(() => {
        if (pontoIniciado) {
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
            return () => animation.stop();
        } else {
            pulseAnim.setValue(0);
        }
    }, [pontoIniciado]);

    // Animação ao pressionar o botão
    const animateButton = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const capitalizeWords = (text: string) => {
        return text.toLowerCase().replace(/\b\w/g, (match, index) =>
            index === 0 || !/\b(de|da|do|dos|das|e|a|o|as|os)\b/.test(match.toLowerCase()) 
                ? match.toUpperCase() 
                : match.toLowerCase()
        );
    };
    

    // Atualizar relógio e formatar data corretamente
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
            setCurrentDate(capitalizeWords(now.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            })));
            
            if (pontoIniciado && startTime) {
                const diff = now.getTime() - startTime.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
                setTimeWorked(`${hours}:${minutes}:${seconds}`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [pontoIniciado, startTime]);
    // Carregar dados do funcionário e empresa
    useEffect(() => {
        const loadData = async () => {
            if (!user?.id) return;

            try {
                const { data: funcionarioData, error: funcError } = await supabase
                    .from("funcionarios")
                    .select("id, name, id_empresa")
                    .eq("id_usuario", user.id)
                    .single();

                if (funcError) throw funcError;
                setFuncionario(funcionarioData);

                if (funcionarioData?.id_empresa) {
                    const { data: empresaData, error: empresaError } = await supabase
                        .from("empresa")
                        .select("name")
                        .eq("id", funcionarioData.id_empresa)
                        .single();

                    if (empresaError) throw empresaError;
                    setEmpresa(empresaData);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };

        loadData();
    }, [user]);

    const getLocation = async (): Promise<string | null> => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Erro", "Permissão de localização negada.");
            return null;
        }
        let location = await Location.getCurrentPositionAsync({});
        return `${location.coords.latitude}, ${location.coords.longitude}`;
    };

    const handlePonto = async () => {
        animateButton();
        
        if (pontoIniciado) {
            await finalizarPonto();
        } else {
            await iniciarPonto();
        }
    };

    const iniciarPonto = async () => {
        setLoadingPonto(true);
        const location = await getLocation();
        if (!location) {
            setLoadingPonto(false);
            return;
        }

        const now = new Date();
        setStartTime(now);
        setTimeWorked("00:00:00");
        setPontoIniciado(true);
        setLoadingPonto(false);
    };

    const finalizarPonto = async () => {
        if (!user || !startTime || !funcionario) {
            Alert.alert("Erro", "Você precisa iniciar o ponto primeiro.");
            return;
        }

        // Verificar se trabalhou pelo menos 5 minutos
        const now = new Date();
        const diffMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);
        if (diffMinutes < 1) {
            Alert.alert("Aviso", "Você precisa trabalhar pelo menos 5 minutos para registrar o ponto.");
            return;
        }

        setLoadingPonto(true);
        const location = await getLocation();
        if (!location) {
            setLoadingPonto(false);
            return;
        }

        // Remova tempo_trabalhado da inserção se a coluna não existir
        const { error } = await supabase.from("pontos").insert({
            id_funcionario: funcionario.id,
            id_usuario: user.id,
            entrada: startTime.toISOString(),
            location_entrada: await getLocation(),
            saida: now.toISOString(),
            location_saida: location,
            ativo: true,
            ausencia: false
        });

        if (error) {
            console.error("Erro ao registrar ponto:", error);
            Alert.alert("Erro", "Não foi possível registrar o ponto.");
        } else {
            Alert.alert("Sucesso", "Ponto registrado com sucesso!");
        }

        setStartTime(null);
        setPontoIniciado(false);
        setLoadingPonto(false);
        setTimeWorked("00:00:00");
    };

    const canFinalize = () => {
        if (!pontoIniciado || !startTime) return false;
        const now = new Date();
        const diffMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);
        return diffMinutes >= 1;
    };

    // Estilo interpolado para a animação de pulso
    const pulseStyle = {
        transform: [{
            scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2]
            })
        }],
        opacity: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0]
        })
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pontoScreenContainer}>
                <Nav showBackButton={false} />
                
                {/* Relógio no topo com sombra */}
                <View style={styles.clockHeader}>
                    <Text style={styles.timeText}>{currentTime}</Text>
                    <Text style={styles.dateText}>{currentDate}</Text>
                </View>

                <View style={{ 
                    borderBottomColor: Colors.gray,
                    borderBottomWidth: 1,
                    marginVertical: 15,
                    width: '100%' 
                    }} 
                />
                
                {/* Linha com informações e tempo trabalhado */}
                <View style={styles.infoRow}>
                    <View style={styles.infoColumn}>
                        {empresa && (
                            <Text style={styles.empresaName}>{empresa.name}</Text>
                        )}
                        {funcionario && (
                            <Text style={styles.funcionarioName}>{funcionario.name}</Text>
                        )}
                    </View>
                    
                    <View style={styles.timeWorkedContainer}>
                        <Text style={styles.timeWorkedText}>Trabalhado</Text>
                        <Text style={styles.timeWorkedValue}>{timeWorked}</Text>
                    </View>
                </View>
                
                {/* Botão centralizado com área de toque aumentada */}
                <View style={styles.centerContainer}>
                    <View style={styles.buttonWrapper}>
                        {/* Área de toque invisível maior */}
                        <Pressable
                            style={styles.buttonTouchArea}
                            onPress={handlePonto}
                            disabled={loadingPonto || (pontoIniciado && !canFinalize())}
                        />
                        
                        {/* Efeito de pulso quando ativo */}
                        {pontoIniciado && (
                            <Animated.View style={[styles.pulseEffect, pulseStyle]} />
                        )}
                        
                        {/* Botão visível */}
                        <Animated.View 
                            style={[
                                styles.roundButton,
                                { transform: [{ scale: buttonScale }] },
                                pontoIniciado && !canFinalize() && styles.roundButtonDisabled
                            ]}
                        >
                            {loadingPonto ? (
                                <ActivityIndicator size="small" color={"#FFF"} />
                            ) : (
                                <Text style={styles.roundButtonText}>
                                    {pontoIniciado ? "Finalizar" : "Iniciar"}
                                </Text>
                            )}
                        </Animated.View>
                    </View>
                </View>
                
                {/* Status na parte inferior */}
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>
                        {pontoIniciado 
                            ? (canFinalize() 
                                ? "Ponto em andamento - pode finalizar" 
                                : "Aguarde 5 minutos para finalizar")
                            : "Pronto para bater o ponto"}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}