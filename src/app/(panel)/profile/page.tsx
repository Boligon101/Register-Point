import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, SafeAreaView, Pressable } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/context/AuthContext';
import colors from '@/constants/Colors';
import styles from '@/assets/styles';
import Nav from '@/build/components/nav';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth * 1.5; // Largura maior que a tela para permitir scroll
const chartHeight = 220;

// Tipos para os dados
type Funcionario = {
    id: string;
    name: string;
    departamento?: string;
    carga_horaria: number;
};

type Ponto = {
    id: string;
    entrada: string;
    saida: string;
    id_funcionario: string;
    ausencia: boolean;
};

type Estatisticas = {
    horasTrabalhadas: {
        name: string;
        horas: number;
        color: string;
    }[];
    atrasos: {
        name: string;
        atrasos: number;
        departamento: string;
    }[];
    horasExtras: {
        name: string;
        horasExtras: number;
        departamento: string;
    }[];
    departamentos: {
        departamento: string;
        horasTrabalhadas: number;
        atrasos: number;
    }[];
    heatmap: {
        hora: string;
        entradas: number;
        saidas: number;
    }[];
};

const EstatisticasScreen = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dadosEstatisticos, setDadosEstatisticos] = useState<Estatisticas | null>(null);
    const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'trimestre'>('semana');


    // Configuração dos gráficos com largura aumentada
    const chartConfig = {
        backgroundColor: colors.white,
        backgroundGradientFrom: colors.white,
        backgroundGradientTo: colors.white,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.green
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            if (!user) return;

            try {
                // 1. Obter ID da empresa
                const { data: empresa, error: empresaError } = await supabase
                    .from('empresa')
                    .select('id')
                    .eq('id_usuario', user.id)
                    .single();

                if (empresaError || !empresa) throw new Error('Empresa não encontrada');

                // 2. Obter funcionários
                const { data: funcionarios, error: funcError } = await supabase
                    .from('funcionarios')
                    .select('*')
                    .eq('id_empresa', empresa.id);

                if (funcError) throw new Error('Erro ao buscar funcionários');

                // 3. Obter pontos
                const { data: pontos, error: pontosError } = await supabase
                    .from('pontos')
                    .select('*')
                    .in('id_funcionario', funcionarios.map(f => f.id));

                if (pontosError) throw new Error('Erro ao buscar registros de ponto');

                // Processar dados
                const estatisticas = processarDados(funcionarios, pontos);
                setDadosEstatisticos(estatisticas);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [user, periodo]);

    const processarDados = (funcionarios: Funcionario[], pontos: Ponto[]): Estatisticas => {
        return {
            horasTrabalhadas: calcularHorasTrabalhadas(funcionarios, pontos),
            atrasos: calcularAtrasos(funcionarios, pontos),
            horasExtras: calcularHorasExtras(funcionarios, pontos),
            departamentos: calcularPorDepartamento(funcionarios, pontos),
            heatmap: gerarHeatmap(pontos)
        };
    };

    // Funções de cálculo (implementações simplificadas)
    const calcularHorasTrabalhadas = (funcionarios: Funcionario[], pontos: Ponto[]) => {
        const horasTotais = pontos.reduce((total, ponto) => {
            if (ponto.entrada && ponto.saida && !ponto.ausencia) {
                const entrada = new Date(ponto.entrada);
                const saida = new Date(ponto.saida);
                return total + (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
            }
            return total;
        }, 0);

        const horasPrevistas = funcionarios.reduce((total, func) => {
            return total + (func.carga_horaria * 20); // 20 dias úteis
        }, 0);

        return [
            { name: 'Cumpridas', horas: horasTotais, color: colors.green },
            { name: 'Faltantes', horas: Math.max(0, horasPrevistas - horasTotais), color: colors.red }
        ];
    };

    const calcularAtrasos = (funcionarios: Funcionario[], pontos: Ponto[]) => {
        return funcionarios
            .map(funcionario => {
                const pontosFunc = pontos.filter(p => p.id_funcionario === funcionario.id);

                const atrasos = pontosFunc.reduce((total, ponto) => {
                    if (ponto.entrada && !ponto.ausencia) {
                        const horaEntrada = new Date(ponto.entrada);
                        const horaEsperada = new Date(ponto.entrada);
                        horaEsperada.setHours(8, 0, 0, 0); // Horário esperado: 08:00

                        if (horaEntrada > horaEsperada) {
                            return total + 1;
                        }
                    }
                    return total;
                }, 0);

                return {
                    name: funcionario.name,
                    atrasos,
                    departamento: funcionario.departamento || 'Sem departamento'
                };
            })
            .sort((a, b) => b.atrasos - a.atrasos)
            .slice(0, 5);
    };

    const calcularHorasExtras = (funcionarios: Funcionario[], pontos: Ponto[]) => {
        return funcionarios
            .map(funcionario => {
                const pontosFunc = pontos.filter(p => p.id_funcionario === funcionario.id);

                const horasExtras = pontosFunc.reduce((total, ponto) => {
                    if (ponto.entrada && ponto.saida && !ponto.ausencia) {
                        const entrada = new Date(ponto.entrada);
                        const saida = new Date(ponto.saida);
                        const horasTrabalhadas = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
                        const horasDia = funcionario.carga_horaria / 5; // Considerando 5 dias por semana

                        if (horasTrabalhadas > horasDia) {
                            return total + (horasTrabalhadas - horasDia);
                        }
                    }
                    return total;
                }, 0);

                return {
                    name: funcionario.name,
                    horasExtras: Math.round(horasExtras * 10) / 10, // Arredonda para 1 decimal
                    departamento: funcionario.departamento || 'Sem departamento'
                };
            })
            .sort((a, b) => b.horasExtras - a.horasExtras)
            .slice(0, 5);
    };

    const calcularPorDepartamento = (funcionarios: Funcionario[], pontos: Ponto[]) => {
        const deptMap = new Map<string, { horas: number, atrasos: number }>();

        funcionarios.forEach(func => {
            const dept = func.departamento || 'Sem departamento';
            if (!deptMap.has(dept)) {
                deptMap.set(dept, { horas: 0, atrasos: 0 });
            }

            const pontosFunc = pontos.filter(p => p.id_funcionario === func.id);

            // Calcular horas trabalhadas
            const horas = pontosFunc.reduce((total, ponto) => {
                if (ponto.entrada && ponto.saida && !ponto.ausencia) {
                    const entrada = new Date(ponto.entrada);
                    const saida = new Date(ponto.saida);
                    return total + (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
                }
                return total;
            }, 0);

            // Calcular atrasos
            const atrasos = pontosFunc.reduce((total, ponto) => {
                if (ponto.entrada && !ponto.ausencia) {
                    const horaEntrada = new Date(ponto.entrada);
                    const horaEsperada = new Date(ponto.entrada);
                    horaEsperada.setHours(8, 0, 0, 0);

                    if (horaEntrada > horaEsperada) {
                        return total + 1;
                    }
                }
                return total;
            }, 0);

            const deptData = deptMap.get(dept)!;
            deptMap.set(dept, {
                horas: deptData.horas + horas,
                atrasos: deptData.atrasos + atrasos
            });
        });

        return Array.from(deptMap.entries()).map(([dept, dados]) => ({
            departamento: dept,
            horasTrabalhadas: Math.round(dados.horas * 10) / 10,
            atrasos: dados.atrasos
        }));
    };

    const gerarHeatmap = (pontos: Ponto[]) => {
        const heatmap = Array(24).fill(0).map((_, i) => ({
            hora: i,
            entradas: 0,
            saidas: 0
        }));

        pontos.forEach(ponto => {
            if (ponto.entrada && !ponto.ausencia) {
                const hora = new Date(ponto.entrada).getHours();
                heatmap[hora].entradas++;
            }

            if (ponto.saida && !ponto.ausencia) {
                const hora = new Date(ponto.saida).getHours();
                heatmap[hora].saidas++;
            }
        });

        return heatmap.map(h => ({
            hora: `${h.hora}h`,
            entradas: h.entradas,
            saidas: h.saidas
        }));
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.green} />
            </SafeAreaView>
        );
    }

    if (!dadosEstatisticos) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Não foi possível carregar os dados estatísticos</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.stats_container}>
                    <Nav showBackButton={false} />


                    <Text style={styles.slogan}>Estatísticas da Empresa</Text>

                    {/* Seletor de Período */}
                    <View style={styles.stats_periodContainer}>
                        {['semana', 'mes', 'trimestre'].map((item) => (
                            <Pressable
                                key={item}
                                style={[
                                    styles.stats_periodButton,
                                    periodo === item && styles.stats_periodButtonActive
                                ]}
                                onPress={() => setPeriodo(item as any)}
                            >
                                <Text style={[
                                    styles.stats_periodButtonText,
                                    periodo === item && styles.stats_periodButtonTextActive
                                ]}>
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Cards de Resumo */}
                    <View style={styles.stats_cardsContainer}>
                        <View style={styles.stats_card}>
                            <Text style={styles.stats_cardTitle}>Total Horas</Text>
                            <Text style={styles.stats_cardValue}>
                                {dadosEstatisticos.horasTrabalhadas[0].horas}h
                            </Text>
                        </View>

                        <View style={styles.stats_card}>
                            <Text style={styles.stats_cardTitle}>Média Atrasos</Text>
                            <Text style={styles.stats_cardValue}>
                                {(dadosEstatisticos.atrasos.reduce((a, b) => a + b.atrasos, 0) / dadosEstatisticos.atrasos.length).toFixed(1)}
                            </Text>
                        </View>
                    </View>

                    {/* Container para gráfico de pizza */}
                    <View style={styles.stats_chartContainer}>
                        <Text style={styles.stats_chartTitle}>Horas Trabalhadas</Text>
                        <PieChart
                            data={dadosEstatisticos.horasTrabalhadas}
                            width={screenWidth - 40}
                            height={200}
                            chartConfig={chartConfig}
                            accessor="horas"
                            backgroundColor="transparent"
                            paddingLeft="0"
                            absolute
                            hasLegend={false}
                        />
                        <View style={styles.stats_legendContainer}>
                            {dadosEstatisticos.horasTrabalhadas.map((item, index) => (
                                <View key={index} style={styles.stats_legendItem}>
                                    <View style={[styles.stats_legendColor, { backgroundColor: item.color }]} />
                                    <Text style={styles.stats_legendText}>
                                        {item.name}: {item.horas}h
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Gráfico de Barras com Scroll Horizontal */}
                    <View style={styles.stats_chartContainer}>
                        <Text style={styles.stats_chartTitle}>Top 5 Atrasos</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={{ paddingRight: 20 }}
                        >
                            <BarChart
                                data={{
                                    labels: dadosEstatisticos.atrasos.map(a => a.name),
                                    datasets: [{ data: dadosEstatisticos.atrasos.map(a => a.atrasos) }]
                                }}
                                width={chartWidth}
                                height={chartHeight}
                                yAxisLabel=""
                                yAxisSuffix=""
                                fromZero
                                withHorizontalLabels={true}
                                withVerticalLabels={true}
                                showBarTops={false}
                                chartConfig={{
                                    ...chartConfig,
                                    color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`
                                }}
                                style={styles.stats_chart}
                            />
                        </ScrollView>
                    </View>

                    {/* Gráfico de Horas Extras com Scroll Horizontal */}
                    <View style={styles.stats_chartContainer}>
                        <Text style={styles.stats_chartTitle}>Top 5 Horas Extras</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={{ paddingRight: 20 }}
                        >
                            <BarChart
                                data={{
                                    labels: dadosEstatisticos.horasExtras.map(h => h.name),
                                    datasets: [{ data: dadosEstatisticos.horasExtras.map(h => h.horasExtras) }]
                                }}
                                width={chartWidth}
                                height={chartHeight}
                                yAxisLabel=""
                                yAxisSuffix="h"
                                fromZero
                                chartConfig={{
                                    ...chartConfig,
                                    color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`
                                }}
                                style={styles.stats_chart}
                            />
                        </ScrollView>
                    </View>

                    {/* Gráfico de Linhas com Scroll Horizontal */}
                    <View style={styles.stats_chartContainer}>
                        <Text style={styles.stats_chartTitle}>Horários de Ponto</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={{ paddingRight: 20 }}
                        >
                            <LineChart
                                data={{
                                    labels: dadosEstatisticos.heatmap.map(h => h.hora),
                                    datasets: [{
                                        data: dadosEstatisticos.heatmap.map(h => h.entradas)
                                    }]
                                }}
                                width={chartWidth}
                                height={chartHeight}
                                chartConfig={{
                                    ...chartConfig,
                                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`
                                }}
                                bezier
                                style={styles.stats_chart}
                            />
                        </ScrollView>
                    </View>


                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EstatisticasScreen;