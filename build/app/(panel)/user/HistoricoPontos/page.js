"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var react_native_maps_1 = __importStar(require("react-native-maps"));
var supabase_1 = require("@/src/lib/supabase");
var AuthContext_1 = require("@/src/context/AuthContext");
var styles_1 = __importDefault(require("@/assets/styles"));
var Colors_1 = __importDefault(require("@/constants/Colors"));
var nav_1 = __importDefault(require("@/src/components/nav"));
var MonthPicker_1 = __importDefault(require("@/src/components/MonthPicker"));
function HistoricoPontos() {
    var _this = this;
    var user = (0, AuthContext_1.useAuth)().user;
    var _a = (0, react_1.useState)([]), pontos = _a[0], setPontos = _a[1];
    var _b = (0, react_1.useState)([]), filteredPontos = _b[0], setFilteredPontos = _b[1];
    var _c = (0, react_1.useState)(null), expandedDay = _c[0], setExpandedDay = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    // Estado para o mês selecionado
    var _e = (0, react_1.useState)(new Date()), mesSelecionado = _e[0], setMesSelecionado = _e[1];
    var _f = (0, react_1.useState)(false), showMonthPicker = _f[0], setShowMonthPicker = _f[1];
    (0, react_1.useEffect)(function () {
        var fetchPontos = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!user)
                            return [2 /*return*/];
                        setLoading(true);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pontos")
                                .select("*")
                                .eq("id_usuario", user.id)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Erro ao buscar pontos:", error);
                        }
                        else {
                            setPontos(data || []);
                            filterPontosByMes(data || [], mesSelecionado);
                        }
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchPontos();
    }, [user]);
    // Filtra os pontos pelo mês selecionado
    var filterPontosByMes = function (pontos, mes) {
        var startOfMonth = new Date(mes.getFullYear(), mes.getMonth(), 1);
        var endOfMonth = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
        var filtered = pontos.filter(function (ponto) {
            var entradaDate = new Date(ponto.entrada);
            return entradaDate >= startOfMonth && entradaDate <= endOfMonth;
        });
        setFilteredPontos(filtered);
    };
    (0, react_1.useEffect)(function () {
        filterPontosByMes(pontos, mesSelecionado);
    }, [mesSelecionado]);
    // Agrupar pontos por dia
    var pontosPorDia = filteredPontos.reduce(function (acc, ponto) {
        var dia = ponto.entrada.split("T")[0];
        if (!acc[dia])
            acc[dia] = [];
        acc[dia].push(ponto);
        return acc;
    }, {});
    // Função para calcular a região do mapa
    var calculateMapRegion = function (entrada, saida) {
        var entradaCoords = entrada.split(",").map(parseFloat);
        var saidaCoords = saida.split(",").map(parseFloat);
        var midLat = (entradaCoords[0] + saidaCoords[0]) / 2;
        var midLng = (entradaCoords[1] + saidaCoords[1]) / 2;
        var latDelta = Math.abs(entradaCoords[0] - saidaCoords[0]) * 1.5;
        var lngDelta = Math.abs(entradaCoords[1] - saidaCoords[1]) * 1.5;
        return {
            latitude: midLat,
            longitude: midLng,
            latitudeDelta: latDelta || 0.01,
            longitudeDelta: lngDelta || 0.01,
        };
    };
    // Função para calcular horas trabalhadas manualmente
    var calcularHorasTrabalhadas = function (entrada, saida) {
        var entradaDate = new Date(entrada);
        var saidaDate = new Date(saida);
        if (isNaN(entradaDate.getTime()) || isNaN(saidaDate.getTime())) {
            return 'Data inválida';
        }
        var entradaHoras = entradaDate.getHours();
        var entradaMinutos = entradaDate.getMinutes();
        var saidaHoras = saidaDate.getHours();
        var saidaMinutos = saidaDate.getMinutes();
        var entradaTotalMinutos = entradaHoras * 60 + entradaMinutos;
        var saidaTotalMinutos = saidaHoras * 60 + saidaMinutos;
        var diffMinutos = saidaTotalMinutos - entradaTotalMinutos;
        var horas = Math.floor(diffMinutos / 60);
        var minutos = diffMinutos % 60;
        return "".concat(horas, " horas e ").concat(minutos, " minutos");
    };
    // Função para ajustar o fuso horário
    var ajustarFusoHorario = function (data) {
        var date = new Date(data);
        var offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offset);
        return date;
    };
    var formatarData = function (data) {
        var date = new Date(data);
        var formattedDate = date.toLocaleDateString("pt-BR", {
            weekday: "long", // Dia da semana por extenso
            day: "2-digit", // Dia em 2 dígitos
            month: "long", // Mês por extenso
        });
        // Capitalizar a primeira letra e deixar a última letra em minúscula
        return formattedDate
            .replace(/\b\w/g, function (match) { return match.toUpperCase(); }) // Primeira letra maiúscula
            .replace(/(\w)(?=\w*$)/g, function (match) { return match.toLowerCase(); }); // Última letra minúscula
    };
    // Função para formatar o horário em português
    var formatarHorario = function (data) {
        var date = ajustarFusoHorario(data);
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    // Função para formatar o mês e ano
    var formatarMesAno = function (data) {
        var mes = data.toLocaleDateString("pt-BR", { month: "long" });
        var ano = data.getFullYear().toString();
        return "".concat(mes.toUpperCase(), " ").concat(ano);
    };
    // Função para lidar com a seleção do mês
    var handleSelectMonth = function (monthIndex) {
        var newDate = new Date(mesSelecionado);
        newDate.setMonth(monthIndex);
        setMesSelecionado(newDate);
        setShowMonthPicker(false);
    };
    if (loading) {
        return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
                <react_native_1.View style={styles_1.default.loadingContainer}>
                    <react_native_1.ActivityIndicator size="large" color={Colors_1.default.green}/>
                </react_native_1.View>
            </react_native_1.SafeAreaView>);
    }
    return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
            <react_native_1.View style={styles_1.default.ponto_container}>
                <nav_1.default showBackButton={false}/>
                <react_native_1.Text style={styles_1.default.slogan}>Histórico de Pontos</react_native_1.Text>

                <react_native_1.View style={styles_1.default.ponto_form}>
                    {/* Botão para selecionar mês */}
                    <react_native_1.Pressable onPress={function () { return setShowMonthPicker(true); }} style={styles_1.default.monthButton}>
                        <vector_icons_1.MaterialIcons name="calendar-today" size={20} color={Colors_1.default.zinc} style={{ marginRight: 8 }}/>
                        <react_native_1.Text style={styles_1.default.monthButtonText}>{formatarMesAno(mesSelecionado)}</react_native_1.Text>
                    </react_native_1.Pressable>

                    {/* Seletor de meses personalizado */}
                    <MonthPicker_1.default visible={showMonthPicker} onClose={function () { return setShowMonthPicker(false); }} onSelectMonth={handleSelectMonth}/>

                    <react_native_1.FlatList data={Object.keys(pontosPorDia)} keyExtractor={function (item) { return item; }} renderItem={function (_a) {
            var item = _a.item;
            return (<react_native_1.View>
                                <react_native_1.Pressable onPress={function () { return setExpandedDay(expandedDay === item ? null : item); }} style={expandedDay === item ? styles_1.default.dateHeader : styles_1.default.funcionarioItemClosed}>
                                    <react_native_1.Text style={expandedDay === item
                    ? styles_1.default.dateHeaderText // Quando expandido
                    : styles_1.default.funcionarioDetail // Quando fechado
                }>
                                        {formatarData(item)} {/* Aplica a formatação de data aqui */}
                                    </react_native_1.Text>
                                </react_native_1.Pressable>

                                {expandedDay === item && (<react_native_1.View style={styles_1.default.funcionarioItemExpanded}>
                                        {pontosPorDia[item].map(function (ponto, index) { return (<react_native_1.View key={index} style={styles_1.default.pontoContainer}>
                                                <react_native_1.Text style={styles_1.default.funcionarioDetail}>
                                                    Entrada: {formatarHorario(ponto.entrada)}
                                                </react_native_1.Text>
                                                <react_native_1.Text style={styles_1.default.funcionarioDetail}>
                                                    Saída: {formatarHorario(ponto.saida)}
                                                </react_native_1.Text>
                                                <react_native_1.Text style={styles_1.default.funcionarioDetail}>
                                                    Horas trabalhadas: {calcularHorasTrabalhadas(ponto.entrada, ponto.saida)}
                                                </react_native_1.Text>

                                                <react_native_maps_1.default style={styles_1.default.map} initialRegion={calculateMapRegion(ponto.location_entrada, ponto.location_saida)}>
                                                    <react_native_maps_1.Marker coordinate={{
                            latitude: parseFloat(ponto.location_entrada.split(",")[0]),
                            longitude: parseFloat(ponto.location_entrada.split(",")[1]),
                        }} title="Entrada"/>
                                                    <react_native_maps_1.Marker coordinate={{
                            latitude: parseFloat(ponto.location_saida.split(",")[0]),
                            longitude: parseFloat(ponto.location_saida.split(",")[1]),
                        }} title="Saída" pinColor="red"/>
                                                </react_native_maps_1.default>
                                            </react_native_1.View>); })}
                                    </react_native_1.View>)}
                            </react_native_1.View>);
        }}/>


                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.SafeAreaView>);
}
exports.default = HistoricoPontos;
