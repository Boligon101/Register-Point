import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    SafeAreaView, 
    ScrollView, 
    ActivityIndicator, 
    Alert,
    TouchableOpacity
} from "react-native";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";
import styles from "@/assets/styles";
import Nav from "@/src/components/nav";
import Colors from "@/constants/Colors";
import { Calendar, DateData } from "react-native-calendars";
import VisualizarDemandaModal from "@/src/components/VisualizarDemandaModal";
import { format, isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import XDate from 'xdate';

// Tipos de dados
interface Funcionario {
    id: string;
    name: string;
}

interface Demanda {
    id: string;
    nome: string;
    descricao: string;
    data: string;
    ativo: boolean;
    tipo: string;
    funcionarios?: {
        funcionario: Funcionario;
    }[];
}

// Tipos compatíveis com react-native-calendars
type CalendarMarkingProps = {
    marked?: boolean;
    selected?: boolean;
    selectedColor?: string;
    dotColor?: string;
    activeOpacity?: number;
    disableTouchEvent?: boolean;
};

type CalendarCustomStyles = {
    container?: {
        backgroundColor?: string;
        borderRadius?: number;
    };
    text?: {
        color?: string;
        fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    };
};

type CalendarMarkedDate = CalendarMarkingProps & {
    customStyles?: CalendarCustomStyles;
};

type CalendarMarkedDates = {
    [date: string]: CalendarMarkedDate;
};

export default function DemandasFuncionario() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [markedDates, setMarkedDates] = useState<CalendarMarkedDates>({});
    const [demandas, setDemandas] = useState<Demanda[]>([]);
    const [demandasDoDia, setDemandasDoDia] = useState<Demanda[]>([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [demandasDaSemana, setDemandasDaSemana] = useState<Demanda[]>([]);
    const [demandasDoMes, setDemandasDoMes] = useState<Demanda[]>([]);

    useEffect(() => {
        if (!user?.id) return;
        loadDemandasFuncionario();
    }, [user]);

    const loadDemandasFuncionario = async () => {
        if (!user?.id) return;
    
        try {
            setLoading(true);
            
            // 1. Busca o funcionário pelo id_usuario
            const { data: funcionarioData, error: funcionarioError } = await supabase
                .from("funcionarios")
                .select("id")
                .eq("id_usuario", user.id)
                .single();
    
            if (funcionarioError || !funcionarioData) {
                throw new Error("Funcionário não encontrado");
            }
    
            // 2. Busca as demandas com os funcionários associados
            const { data: demandasData, error } = await supabase
                .from("demandas_funcionarios")
                .select(`
                    demandas(id, nome, descricao, data, ativo, tipo),
                    funcionarios(id, name)
                `)
                .eq("id_funcionario", funcionarioData.id)
                .eq("demandas.ativo", true);
    
            if (error) throw error;
    
            if (!demandasData) {
                setDemandas([]);
                setMarkedDates({});
                return;
            }
    
            // Filtra apenas os registros onde demandas não é null
            const demandasValidas = demandasData.filter(d => d.demandas !== null);
    
            // Formata os dados das demandas
            const demandasFormatadas = demandasValidas.map((d: any) => {
                if (!d.demandas || !d.funcionarios) {
                    console.warn("Registro inválido encontrado:", d);
                    return null;
                }
    
                return {
                    id: d.demandas.id,
                    nome: d.demandas.nome,
                    descricao: d.demandas.descricao,
                    data: d.demandas.data,
                    ativo: d.demandas.ativo,
                    tipo: d.demandas.tipo,
                    funcionarios: demandasValidas
                        .filter((df: any) => 
                            df.demandas && df.funcionarios && df.demandas.id === d.demandas.id
                        )
                        .map((df: any) => ({
                            funcionario: {
                                id: df.funcionarios.id,
                                name: df.funcionarios.name
                            }
                        }))
                };
            }).filter(Boolean); 
            
            // Remove demandas duplicadas
            const demandasUnicas = demandasFormatadas.filter(
                (demanda: any, index: number, self: any[]) =>
                    index === self.findIndex((d) => d.id === demanda.id)
            );
    
            setDemandas(demandasUnicas);
            updateMarkedDates(demandasUnicas);
            updateDemandasCounters(demandasUnicas);
    
        } catch (error) {
            console.error("Erro ao carregar demandas:", error);
            Alert.alert("Erro", "Não foi possível carregar suas demandas");
            setDemandas([]);
            setMarkedDates({});
        } finally {
            setLoading(false);
        }
    };

    console.log("DEMANDAS ",demandas)

    const updateDemandasCounters = (demandas: Demanda[]) => {
        const hoje = new Date();
        
        // Demandas da semana
        const inicioSemana = startOfWeek(hoje);
        const fimSemana = endOfWeek(hoje);
        const semana = demandas.filter(d => {
            const dataDemanda = new Date(d.data);
            return dataDemanda >= inicioSemana && dataDemanda <= fimSemana;
        });
        setDemandasDaSemana(semana);
        
        // Demandas do mês
        const inicioMes = startOfMonth(hoje);
        const fimMes = endOfMonth(hoje);
        const mes = demandas.filter(d => {
            const dataDemanda = new Date(d.data);
            return dataDemanda >= inicioMes && dataDemanda <= fimMes;
        });
        setDemandasDoMes(mes);
    };

    const updateMarkedDates = (demandas: Demanda[]) => {
        const newMarkedDates: CalendarMarkedDates = {};
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        demandas.forEach(demanda => {
            const dataDemanda = new Date(demanda.data + "T00:00:00");

            const dataFormatada = format(dataDemanda, "yyyy-MM-dd");
            
            newMarkedDates[dataFormatada] = {
                marked: true,
                dotColor: demanda.ativo ? Colors.green : Colors.gray,
                selected: false,
                selectedColor: Colors.darckgreen,
                customStyles: {
                    container: {
                        backgroundColor: demanda.ativo ? 'rgba(74, 222, 128, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                        borderRadius: 8,
                    },
                    text: {
                        color: dataDemanda < hoje ? Colors.gray : Colors.white,
                        fontWeight: 'bold',
                    },
                },
            };
        });
        
        setMarkedDates(newMarkedDates);
    };

    const handleDayPress = (day: DateData) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(day.dateString);
        
        if (selectedDate < today) return;
        
        setSelectedDate(day.dateString);
        const demandasNoDia = demandas.filter(d =>
            isSameDay(new Date(d.data), selectedDate)
        );
        setDemandasDoDia(demandasNoDia);
        
        // Atualiza markedDates para mostrar a seleção
        const updatedMarkedDates = {
            ...markedDates,
            [day.dateString]: {
                ...markedDates[day.dateString],
                selected: true,
                selectedColor: Colors.darckgreen
            }
        };
        setMarkedDates(updatedMarkedDates);
        
        setShowViewModal(true);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pontoScreenContainer}>
                <Nav showBackButton={false} />
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.green} />
                        <Text style={{ color: Colors.white, marginTop: 10 }}>Carregando...</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 28,
                                fontWeight: '600',
                                color: Colors.white,
                                marginBottom: 10,
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                textShadowColor: 'rgba(74, 222, 128, 0.5)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 3
                            }}>
                                Minhas Demandas
                            </Text>
                            <View style={{
                                height: 3,
                                backgroundColor: Colors.green,
                                width: '40%',
                                alignSelf: 'center',
                                borderRadius: 3
                            }} />
                        </View>
                        
                        {/* Contadores de demandas */}
                        <View style={{ 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            marginBottom: 20
                        }}>
                            <View style={styles.stats_card}>
                                <Text style={styles.stats_cardTitle}>Esta Semana</Text>
                                <Text style={styles.stats_cardValue}>{demandasDaSemana.length}</Text>
                            </View>
                            <View style={styles.stats_card}>
                                <Text style={styles.stats_cardTitle}>Este Mês</Text>
                                <Text style={styles.stats_cardValue}>{demandasDoMes.length}</Text>
                            </View>
                        </View>

                        <Calendar
                            current={new Date().toISOString()}
                            minDate={new Date().toISOString()}
                            onDayPress={handleDayPress}
                            markedDates={markedDates}
                            markingType={'custom'}
                            theme={{
                                backgroundColor: Colors.zinc,
                                calendarBackground: Colors.zinc,
                                textSectionTitleColor: Colors.white,
                                selectedDayBackgroundColor: Colors.darckgreen,
                                selectedDayTextColor: Colors.white,
                                todayTextColor: Colors.green,
                                dayTextColor: Colors.white,
                                textDisabledColor: Colors.gray,
                                dotColor: Colors.green,
                                selectedDotColor: Colors.white,
                                arrowColor: Colors.green,
                                monthTextColor: Colors.white,
                                indicatorColor: Colors.green,
                                textDayFontWeight: '500',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '500',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14
                            }}
                            style={{
                                borderWidth: 1,
                                borderColor: Colors.gray,
                                borderRadius: 10,
                                marginBottom: 20,
                                overflow: 'hidden'
                            }}
                            enableSwipeMonths={true}
                            hideExtraDays={false}
                            renderHeader={(date?: XDate) => {
                                if (!date) return null;
                            
                                const jsDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                                const month = format(jsDate, 'MMMM yyyy');
                                return (
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: 10,
                                        marginBottom: 10
                                    }}>
                                        <Text style={{
                                            color: Colors.white,
                                            fontSize: 18,
                                            fontWeight: 'bold'
                                        }}>
                                            {month}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    </ScrollView>
                )}
                <VisualizarDemandaModal
                    visible={showViewModal}
                    onClose={() => {
                        setShowViewModal(false);
                        const updatedMarkedDates = { ...markedDates };
                        if (selectedDate) {
                            updatedMarkedDates[selectedDate] = {
                                ...updatedMarkedDates[selectedDate],
                                selected: false
                            };
                            setMarkedDates(updatedMarkedDates);
                        }
                    }}
                    demandas={demandasDoDia}
                    selectedDate={selectedDate}
                    onDemandaCancelada={loadDemandasFuncionario}
                    isEmpresa={false} 
                />
            </View>
        </SafeAreaView>
    );
}