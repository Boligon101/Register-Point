import React, { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";
import styles from "@/assets/styles";
import Colors from "@/constants/Colors";
import Nav from "@/src/components/nav";
import { differenceInHours, differenceInMinutes } from "date-fns";
import MonthPicker from "@/src/components/MonthPicker";

interface Ponto {
    id: number;
    entrada: string;
    saida: string;
    location_entrada: string;
    location_saida: string;
}

export default function HistoricoPontos() {
    const { user } = useAuth();
    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [filteredPontos, setFilteredPontos] = useState<Ponto[]>([]);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Estado para o mês selecionado
    const [mesSelecionado, setMesSelecionado] = useState<Date>(new Date());
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    useEffect(() => {
        const fetchPontos = async () => {
            if (!user) return;
            setLoading(true);

            const { data, error } = await supabase
                .from("pontos")
                .select("*")
                .eq("id_usuario", user.id);

            if (error) {
                console.error("Erro ao buscar pontos:", error);
            } else {
                setPontos(data || []);
                filterPontosByMes(data || [], mesSelecionado);
            }

            setLoading(false);
        };

        fetchPontos();
    }, [user]);

    // Filtra os pontos pelo mês selecionado
    const filterPontosByMes = (pontos: Ponto[], mes: Date) => {
        const startOfMonth = new Date(mes.getFullYear(), mes.getMonth(), 1);
        const endOfMonth = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);

        const filtered = pontos.filter((ponto) => {
            const entradaDate = new Date(ponto.entrada);
            return entradaDate >= startOfMonth && entradaDate <= endOfMonth;
        });

        setFilteredPontos(filtered);
    };

    useEffect(() => {
        filterPontosByMes(pontos, mesSelecionado);
    }, [mesSelecionado]);

    // Agrupar pontos por dia
    const pontosPorDia = filteredPontos.reduce((acc: Record<string, Ponto[]>, ponto) => {
        const dia = ponto.entrada.split("T")[0];
        if (!acc[dia]) acc[dia] = [];
        acc[dia].push(ponto);
        return acc;
    }, {});

    // Função para calcular a região do mapa
    const calculateMapRegion = (entrada: string, saida: string) => {
        const entradaCoords = entrada.split(",").map(parseFloat);
        const saidaCoords = saida.split(",").map(parseFloat);

        const midLat = (entradaCoords[0] + saidaCoords[0]) / 2;
        const midLng = (entradaCoords[1] + saidaCoords[1]) / 2;

        const latDelta = Math.abs(entradaCoords[0] - saidaCoords[0]) * 1.5;
        const lngDelta = Math.abs(entradaCoords[1] - saidaCoords[1]) * 1.5;

        return {
            latitude: midLat,
            longitude: midLng,
            latitudeDelta: latDelta || 0.01,
            longitudeDelta: lngDelta || 0.01,
        };
    };

    // Função para calcular horas trabalhadas manualmente
    const calcularHorasTrabalhadas = (entrada: string, saida: string) => {
        const entradaDate = new Date(entrada);
        const saidaDate = new Date(saida);

        if (isNaN(entradaDate.getTime()) || isNaN(saidaDate.getTime())) {
            return 'Data inválida';
        }

        const entradaHoras = entradaDate.getHours();
        const entradaMinutos = entradaDate.getMinutes();

        const saidaHoras = saidaDate.getHours();
        const saidaMinutos = saidaDate.getMinutes();

        const entradaTotalMinutos = entradaHoras * 60 + entradaMinutos;
        const saidaTotalMinutos = saidaHoras * 60 + saidaMinutos;

        const diffMinutos = saidaTotalMinutos - entradaTotalMinutos;

        const horas = Math.floor(diffMinutos / 60);
        const minutos = diffMinutos % 60;

        return `${horas} horas e ${minutos} minutos`;
    };


    // Função para ajustar o fuso horário
    const ajustarFusoHorario = (data: string) => {
        const date = new Date(data);
        const offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offset);
        return date;
    };

    const formatarData = (data: string) => {
        const date = new Date(data);
        const formattedDate = date.toLocaleDateString("pt-BR", {
            weekday: "long", // Dia da semana por extenso
            day: "2-digit", // Dia em 2 dígitos
            month: "long", // Mês por extenso
        });
    
        // Capitalizar a primeira letra e deixar a última letra em minúscula
        return formattedDate
            .replace(/\b\w/g, (match) => match.toUpperCase()) // Primeira letra maiúscula
            .replace(/(\w)(?=\w*$)/g, (match) => match.toLowerCase()); // Última letra minúscula
    };
    
    
    

    // Função para formatar o horário em português
    const formatarHorario = (data: string) => {
        const date = ajustarFusoHorario(data);
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Função para formatar o mês e ano
    const formatarMesAno = (data: Date) => {
        const mes = data.toLocaleDateString("pt-BR", { month: "long" });
        const ano = data.getFullYear().toString();
        return `${mes.toUpperCase()} ${ano}`;
    };

    // Função para lidar com a seleção do mês
    const handleSelectMonth = (monthIndex: number) => {
        const newDate = new Date(mesSelecionado);
        newDate.setMonth(monthIndex);
        setMesSelecionado(newDate);
        setShowMonthPicker(false);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.green} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.ponto_container}>
                <Nav showBackButton={false} />
                <Text style={styles.slogan}>Histórico de Pontos</Text>

                <View style={styles.ponto_form}>
                    {/* Botão para selecionar mês */}
                    <Pressable
                        onPress={() => setShowMonthPicker(true)}
                        style={styles.monthButton}
                    >
                        <MaterialIcons name="calendar-today" size={20} color={Colors.zinc} style={{ marginRight: 8 }} />
                        <Text style={styles.monthButtonText}>{formatarMesAno(mesSelecionado)}</Text>
                    </Pressable>

                    {/* Seletor de meses personalizado */}
                    <MonthPicker
                        visible={showMonthPicker}
                        onClose={() => setShowMonthPicker(false)}
                        onSelectMonth={handleSelectMonth}
                    />

                    <FlatList
                        data={Object.keys(pontosPorDia)}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <View>
                                <Pressable
                                    onPress={() => setExpandedDay(expandedDay === item ? null : item)}
                                    style={expandedDay === item ? styles.dateHeader : styles.funcionarioItemClosed}
                                >
                                    <Text
                                        style={
                                            expandedDay === item
                                                ? styles.dateHeaderText // Quando expandido
                                                : styles.funcionarioDetail // Quando fechado
                                        }
                                    >
                                        {formatarData(item)} {/* Aplica a formatação de data aqui */}
                                    </Text>
                                </Pressable>

                                {expandedDay === item && (
                                    <View style={styles.funcionarioItemExpanded}>
                                        {pontosPorDia[item].map((ponto, index) => (
                                            <View key={index} style={styles.pontoContainer}>
                                                <Text style={styles.funcionarioDetail}>
                                                    Entrada: {formatarHorario(ponto.entrada)}
                                                </Text>
                                                <Text style={styles.funcionarioDetail}>
                                                    Saída: {formatarHorario(ponto.saida)}
                                                </Text>
                                                <Text style={styles.funcionarioDetail}>
                                                    Horas trabalhadas: {calcularHorasTrabalhadas(ponto.entrada, ponto.saida)}
                                                </Text>

                                                <MapView
                                                    style={styles.map}
                                                    initialRegion={calculateMapRegion(ponto.location_entrada, ponto.location_saida)}
                                                >
                                                    <Marker
                                                        coordinate={{
                                                            latitude: parseFloat(ponto.location_entrada.split(",")[0]),
                                                            longitude: parseFloat(ponto.location_entrada.split(",")[1]),
                                                        }}
                                                        title="Entrada"
                                                    />
                                                    <Marker
                                                        coordinate={{
                                                            latitude: parseFloat(ponto.location_saida.split(",")[0]),
                                                            longitude: parseFloat(ponto.location_saida.split(",")[1]),
                                                        }}
                                                        title="Saída"
                                                        pinColor="red"
                                                    />
                                                </MapView>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}
                    />


                </View>
            </View>
        </SafeAreaView>
    );
}