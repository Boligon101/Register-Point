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
var AuthContext_1 = require("@/src/context/AuthContext");
var supabase_1 = require("@/src/lib/supabase");
var expo_router_1 = require("expo-router");
var native_1 = require("@react-navigation/native");
var vector_icons_1 = require("@expo/vector-icons"); // Importe os ícones
var styles_1 = __importDefault(require("@/assets/styles"));
var Colors_1 = __importDefault(require("@/constants/Colors"));
var nav_1 = __importDefault(require("@/src/components/nav"));
var formatarDataNascimento = function (data) {
    if (!data)
        return "N/A";
    // Converte a data do formato ISO (AAAA-MM-DD) para DD/MM/AAAA
    var _a = data.split('T')[0].split('-'), ano = _a[0], mes = _a[1], dia = _a[2];
    return "".concat(dia, "/").concat(mes, "/").concat(ano);
};
function Funcionarios() {
    var _this = this;
    var user = (0, AuthContext_1.useAuth)().user;
    var _a = (0, react_1.useState)([]), funcionarios = _a[0], setFuncionarios = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(""), searchQuery = _d[0], setSearchQuery = _d[1];
    var fetchFuncionarios = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, empresa, empresaError, _b, funcionariosData, funcionariosError, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!user) {
                        setError("Usuário não autenticado.");
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from('empresa')
                            .select('id')
                            .eq('id_usuario', user.id)
                            .single()];
                case 2:
                    _a = _c.sent(), empresa = _a.data, empresaError = _a.error;
                    if (empresaError || !empresa) {
                        throw new Error("Empresa não encontrada.");
                    }
                    return [4 /*yield*/, supabase_1.supabase
                            .from('funcionarios')
                            .select('*')
                            .eq('id_empresa', empresa.id)];
                case 3:
                    _b = _c.sent(), funcionariosData = _b.data, funcionariosError = _b.error;
                    if (funcionariosError) {
                        throw new Error("Erro ao buscar funcionários.");
                    }
                    setFuncionarios(funcionariosData || []);
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _c.sent();
                    console.error('Erro ao buscar funcionários:', error_1);
                    if (error_1 instanceof Error) {
                        react_native_1.Alert.alert('Erro', error_1.message);
                    }
                    else {
                        react_native_1.Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
                    }
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [user]);
    // Recarrega os dados sempre que a tela receber foco
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        fetchFuncionarios();
    }, [fetchFuncionarios]));
    // Função para excluir um funcionário
    var handleExcluirFuncionario = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var error_3, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from('funcionarios')
                            .delete()
                            .eq('id', id)];
                case 1:
                    error_3 = (_a.sent()).error;
                    if (error_3) {
                        throw new Error("Erro ao excluir funcionário.");
                    }
                    // Atualiza a lista de funcionários após a exclusão
                    setFuncionarios(funcionarios.filter(function (funcionario) { return funcionario.id !== id; }));
                    react_native_1.Alert.alert('Sucesso', 'Funcionário excluído com sucesso!');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Erro ao excluir funcionário:', error_2);
                    if (error_2 instanceof Error) {
                        react_native_1.Alert.alert('Erro', error_2.message);
                    }
                    else {
                        react_native_1.Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Função para editar um funcionário
    var handleEditarFuncionario = function (funcionario) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expo_router_1.router.push({
                        pathname: "/(panel)/employes/edit/page",
                        params: { funcionario: JSON.stringify(funcionario) },
                    })];
                case 1:
                    _a.sent();
                    // Recarrega os dados após retornar da tela de edição
                    fetchFuncionarios();
                    return [2 /*return*/];
            }
        });
    }); };
    // Função para filtrar funcionários pelo nome
    var filteredFuncionarios = funcionarios.filter(function (funcionario) {
        return funcionario.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    if (loading) {
        return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
                <react_native_1.View style={styles_1.default.loadingContainer}>
                    <react_native_1.ActivityIndicator size="large" color={Colors_1.default.green}/>
                </react_native_1.View>
            </react_native_1.SafeAreaView>);
    }
    if (error) {
        return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
                <react_native_1.View style={styles_1.default.container}>
                    <react_native_1.Text style={styles_1.default.errorText}>{error}</react_native_1.Text>
                </react_native_1.View>
            </react_native_1.SafeAreaView>);
    }
    return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
            <react_native_1.ScrollView contentContainerStyle={styles_1.default.scrollView}>
                <react_native_1.View style={styles_1.default.container}>
                    <nav_1.default showBackButton={false}/>

                    <react_native_1.Text style={styles_1.default.slogan}>Funcionários da Empresa</react_native_1.Text>

                    <react_native_1.Pressable style={styles_1.default.buttonAdd} onPress={function () { return expo_router_1.router.push("/(panel)/employes/create/page"); }}>
                        <react_native_1.Text style={styles_1.default.buttonText}>Adicionar Funcionário</react_native_1.Text>
                    </react_native_1.Pressable>

                    <react_native_1.View style={styles_1.default.form}>
                        {/* Barra de pesquisa */}
                        <react_native_1.TextInput style={styles_1.default.searchInput} placeholder="Pesquisar funcionário..." value={searchQuery} onChangeText={setSearchQuery}/>
                        {filteredFuncionarios.length > 0 ? (filteredFuncionarios.map(function (funcionario) { return (<react_native_1.View key={funcionario.id} style={styles_1.default.funcionarioItem}>
                                    <react_native_1.Text style={styles_1.default.funcionarioName}>{funcionario.name}</react_native_1.Text>
                                    <react_native_1.Text style={styles_1.default.funcionarioDetail}>Email: {funcionario.email}</react_native_1.Text>
                                    <react_native_1.Text style={styles_1.default.funcionarioDetail}>CPF: {funcionario.cpf}</react_native_1.Text>
                                    <react_native_1.Text style={styles_1.default.funcionarioDetail}>
                                        Data de Nascimento: {formatarDataNascimento(funcionario.data_nacimento)}
                                    </react_native_1.Text>
                                    <react_native_1.Text style={styles_1.default.funcionarioDetail}>Salário: R$ {funcionario.salario}</react_native_1.Text>
                                    <react_native_1.Text style={styles_1.default.funcionarioDetail}>Carga Horária: {funcionario.carga_horaria} horas</react_native_1.Text>
                                    <react_native_1.Text style={styles_1.default.funcionarioDetail}>Número: {funcionario.numero}</react_native_1.Text>

                                    {/* Botões de ação */}
                                    <react_native_1.View style={styles_1.default.actionsContainer}>
                                        <react_native_1.Pressable style={styles_1.default.editButton} onPress={function () { return handleEditarFuncionario(funcionario); }}>
                                            <vector_icons_1.Feather name="edit" size={24} color={Colors_1.default.green}/>
                                        </react_native_1.Pressable>
                                        <react_native_1.Pressable style={styles_1.default.deleteButton} onPress={function () { return handleExcluirFuncionario(funcionario.id); }}>
                                            <vector_icons_1.MaterialIcons name="delete" size={24} color={"red"}/>
                                        </react_native_1.Pressable>
                                    </react_native_1.View>
                                </react_native_1.View>); })) : (<react_native_1.Text>Nenhum funcionário encontrado.</react_native_1.Text>)}
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.ScrollView>
        </react_native_1.SafeAreaView>);
}
exports.default = Funcionarios;
