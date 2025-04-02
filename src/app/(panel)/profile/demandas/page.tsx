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
import { Calendar } from "react-native-calendars";
import DemandaModal from "@/src/components/DemandaModal";
import VisualizarDemandaModal from "@/src/components/VisualizarDemandaModal";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns";

type Demanda = {
    id: string;
    nome: string;
    descricao: string;
    data: string;
    ativo: boolean;
    tipo: string;
    funcionarios: {
        funcionario: {
            id: string;
            name: string;
        };
    }[];
};

export default function AgendamentoDemandas() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [empresa, setEmpresa] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [markedDates, setMarkedDates] = useState<any>({});
    const [demandas, setDemandas] = useState<Demanda[]>([]);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const [demandasDaSemana, setDemandasDaSemana] = useState<Demanda[]>([]);
    const [demandasDoMes, setDemandasDoMes] = useState<Demanda[]>([]);
    const [demandasDoDia, setDemandasDoDia] = useState<Demanda[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                
                // 1. Busca a empresa do usuário
                const { data: empresaData, error: empresaError } = await supabase
                    .from("empresa")
                    .select("id, name")
                    .eq("id_usuario", user.id)
                    .single();

                if (empresaError || !empresaData) {
                    throw new Error("Empresa não encontrada");
                }

                setEmpresa(empresaData);
                
                // 2. Carrega demandas existentes
                await loadDemandas(empresaData.id);
                
                // 3. Carrega funcionários
                await fetchFuncionarios(empresaData.id);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                Alert.alert("Erro", error instanceof Error ? error.message : "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    const fetchFuncionarios = async (empresaId: string) => {
        try {
            const { data, error, status } = await supabase
                .from("funcionarios")
                .select("*")
                .eq("id_empresa", empresaId);

            if (error && status !== 406) {
                throw error;
            }

            setFuncionarios(data || []);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
            Alert.alert("Erro", "Não foi possível carregar os funcionários");
        }
    };

    const loadDemandas = async (idEmpresa: string) => {
        try {
            const { data: demandasData, error } = await supabase
                .from("demandas")
                .select(`
                    id,
                    nome,
                    descricao,
                    data,
                    ativo,
                    tipo,
                    demandas_funcionarios(
                        funcionarios:funcionarios(id, name)
                    )
                `)
                .eq("id_empresa", idEmpresa)
                .eq("ativo", true) // Apenas demandas ativas
                .order('data', { ascending: true });
    
            if (error) throw error;
    
            if (demandasData) {
                const demandasFormatadas: Demanda[] = demandasData.map((d: any) => ({
                    id: d.id,
                    nome: d.nome,
                    descricao: d.descricao,
                    data: d.data, // Certifique-se de que o formato é 'YYYY-MM-DD'
                    ativo: d.ativo,
                    tipo: d.tipo,
                    funcionarios: d.demandas_funcionarios.map((df: any) => ({
                        funcionario: {
                            id: df.funcionarios.id,
                            name: df.funcionarios.name
                        }
                    }))
                }));
    
                setDemandas(demandasFormatadas);
                updateDemandasCounters(demandasFormatadas);
                updateMarkedDates(demandasFormatadas);
            }
        } catch (error) {
            console.error("Erro ao carregar demandas:", error);
            Alert.alert("Erro", "Não foi possível carregar as demandas");
        }
    };
    

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
        const newMarkedDates: any = {};
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
    
        demandas.forEach(demanda => {
            const dataDemanda = new Date(demanda.data + "T00:00:00"); // Garante que a conversão de fuso horário não afete
            const dataFormatada = format(dataDemanda, "yyyy-MM-dd");
    
            if (!newMarkedDates[dataFormatada]) {
                newMarkedDates[dataFormatada] = {
                    marked: false, // Remove o ponto verde
                    customStyles: {
                        container: {
                            backgroundColor: "rgba(74, 222, 128, 0.2)", // Mantém apenas o fundo
                            borderRadius: 8,
                        },
                        text: {
                            color: dataDemanda < hoje ? Colors.gray : Colors.white,
                            fontWeight: "bold",
                        },
                    },
                };
            }
        });
    
        setMarkedDates(newMarkedDates);
    };
    

    const handleSaveDemanda = async (demanda: {
        nome: string;
        descricao: string;
        tipo: string;
        funcionarios: string[];
    }) => {
        if (!empresa?.id) return;

        try {
            setLoading(true);
            
            // 1. Insere a demanda principal
            const { data: demandaData, error: demandaError } = await supabase
                .from('demandas')
                .insert({
                    nome: demanda.nome,
                    descricao: demanda.descricao,
                    tipo: demanda.tipo,
                    data: selectedDate,
                    id_empresa: empresa.id,
                    ativo: true
                })
                .select('id')
                .single();

            if (demandaError) throw demandaError;
            
            // 2. Insere os funcionários associados
            const funcionariosDemanda = demanda.funcionarios.map(idFuncionario => ({
                id_demanda: demandaData.id,
                id_funcionario: idFuncionario
            }));

            const { error: funcionariosError } = await supabase
                .from('demandas_funcionarios')
                .insert(funcionariosDemanda);

            if (funcionariosError) throw funcionariosError;
            
            // 3. Recarrega as demandas
            await loadDemandas(empresa.id);
            
            // 4. Fecha o modal
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao salvar demanda:', error);
            Alert.alert('Erro', 'Não foi possível salvar a demanda');
        } finally {
            setLoading(false);
        }
    };

    const handleDayPress = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    
        const demandasNoDia = demandas.filter(d =>
            isSameDay(new Date(d.data + "T00:00:00"), new Date(day.dateString))
        );
    
        setDemandasDoDia(demandasNoDia);
    
        // Atualiza a marcação sem forçar o "selected"
        const updatedMarkedDates = {
            ...markedDates,
            [day.dateString]: {
                ...markedDates[day.dateString],
            },
        };
        setMarkedDates(updatedMarkedDates);
    
        if (demandasNoDia.length > 0) {
            setShowViewModal(true);
        } else {
            setShowModal(true);
        }
    };
    

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pontoScreenContainer}>
                <Nav showBackButton={false} />
                
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.green} />
                        <Text style={{ color: Colors.white, marginTop: 10 }}>
                            Carregando...
                        </Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
                        {/* Título melhorado */}
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
                                Calendário de Demandas
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
                            onDayPress={(day) => {
                                const selectedDate = new Date(day.dateString);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                
                                if (selectedDate >= today) {
                                    handleDayPress(day);
                                }
                            }}
                            markedDates={markedDates}
                            markingType={'period'}
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
                            dayComponent={({date, state, marking}) => {
                                if (!date) return null;
                                
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const dayDate = new Date(date.dateString);
                                const isPast = dayDate < today;
                                
                                return (
                                    <TouchableOpacity 
                                        style={[
                                            { 
                                                width: 36, 
                                                height: 36, 
                                                justifyContent: 'center', 
                                                alignItems: 'center',
                                                borderRadius: 8,
                                                backgroundColor: marking?.selected ? Colors.darckgreen : 
                                                            marking?.customStyles?.container?.backgroundColor || 'transparent',
                                                opacity: isPast ? 0.6 : 1
                                            }
                                        ]}
                                        onPress={() => {
                                            if (!isPast) {
                                                handleDayPress({dateString: date.dateString});
                                            }
                                        }}
                                        disabled={isPast}
                                    >
                                        <Text style={[
                                            { 
                                                color: state === 'disabled' ? Colors.gray : 
                                                    isPast ? Colors.gray : Colors.white,
                                                fontWeight: state === 'today' ? 'bold' : 'normal'
                                            },
                                            marking?.customStyles?.text
                                        ]}>
                                            {date.day}
                                        </Text>
                                        {marking?.marked && (
                                            <View style={{
                                                position: 'absolute',
                                                bottom: 4,
                                                width: 8,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: marking?.dotColor || Colors.green
                                            }} />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        

                    </ScrollView>
                )}
                
                {/* Modais */}
                <DemandaModal
                    visible={showModal}
                    onClose={() => {
                        setShowModal(false);
                        const updatedMarkedDates = { ...markedDates };
                        if (selectedDate) {
                            updatedMarkedDates[selectedDate] = {
                                ...updatedMarkedDates[selectedDate],
                                selected: false
                            };
                            setMarkedDates(updatedMarkedDates);
                        }
                    }}
                    onSave={handleSaveDemanda}
                    selectedDate={selectedDate}
                    loading={loading}
                    empresaId={empresa?.id}
                />
                
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
                    onAddNew={() => {
                        setShowViewModal(false);
                        setShowModal(true);
                    }}
                    onDemandaCancelada={() => loadDemandas(empresa?.id)}
                    isEmpresa={true} // Adicionado
                />

            </View>
        </SafeAreaView>
    );
}
