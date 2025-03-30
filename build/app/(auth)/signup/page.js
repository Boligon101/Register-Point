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
var expo_router_1 = require("expo-router");
var supabase_1 = require("@/src/lib/supabase");
var styles_1 = __importDefault(require("@/assets/styles"));
function AdicionarEmpresa() {
    var _a = (0, react_1.useState)(""), nomeEmpresa = _a[0], setNomeEmpresa = _a[1];
    var _b = (0, react_1.useState)(""), cnpj = _b[0], setCnpj = _b[1];
    var _c = (0, react_1.useState)(""), emailEmpresa = _c[0], setEmailEmpresa = _c[1];
    var _d = (0, react_1.useState)(""), telefoneEmpresa = _d[0], setTelefoneEmpresa = _d[1];
    var _e = (0, react_1.useState)(""), senha = _e[0], setSenha = _e[1];
    var _f = (0, react_1.useState)(false), mostrarSenha = _f[0], setMostrarSenha = _f[1];
    var _g = (0, react_1.useState)(false), loading = _g[0], setLoading = _g[1];
    function handleAdicionarEmpresa() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, authError, _b, empresa, empresaError, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        setLoading(true);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, supabase_1.supabase.auth.signUp({
                                email: emailEmpresa,
                                password: senha, // Usa a senha fornecida pelo usuário
                                options: {
                                    data: {
                                        name: nomeEmpresa,
                                        role: "admin", // Adiciona um campo para identificar o tipo de usuário
                                    },
                                },
                            })];
                    case 2:
                        _a = _c.sent(), user = _a.data, authError = _a.error;
                        if (authError) {
                            throw authError;
                        }
                        // Verificar se o usuário foi criado
                        if (!user.user) {
                            throw new Error("Erro ao criar usuário: usuário não foi criado.");
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .rpc('criar_empresa', {
                                nome_empresa: nomeEmpresa,
                                cnpj: cnpj,
                                email_empresa: emailEmpresa,
                                telefone_empresa: telefoneEmpresa,
                                id_usuario: user.user.id,
                            })];
                    case 3:
                        _b = _c.sent(), empresa = _b.data, empresaError = _b.error;
                        if (empresaError) {
                            throw empresaError;
                        }
                        react_native_1.Alert.alert("Sucesso", "Empresa adicionada com sucesso!");
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _c.sent();
                        if (error_1 instanceof Error) {
                            react_native_1.Alert.alert("Erro", error_1.message);
                        }
                        else {
                            react_native_1.Alert.alert("Erro", "Ocorreu um erro desconhecido.");
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
            <react_native_1.ScrollView contentContainerStyle={styles_1.default.scrollView}>
                <react_native_1.View style={styles_1.default.container}>
                    <react_native_1.View style={styles_1.default.formHeader}>
                        <react_native_1.Pressable style={styles_1.default.backButton} onPress={function () { return expo_router_1.router.back(); }}>
                            <vector_icons_1.Ionicons name="arrow-back" size={24} color="white"/>
                        </react_native_1.Pressable>

                        <react_native_1.View style={styles_1.default.header}>
                            <react_native_1.Text style={styles_1.default.LogoText}>
                                Register<react_native_1.Text style={styles_1.default.greenText}>Point</react_native_1.Text>
                            </react_native_1.Text>
                        </react_native_1.View>
                    </react_native_1.View>

                    <react_native_1.Text style={styles_1.default.slogan}>Adicionar Empresa</react_native_1.Text>

                    <react_native_1.View style={styles_1.default.form}>
                        <react_native_1.View>
                            <react_native_1.Text style={styles_1.default.label}>Nome da Empresa</react_native_1.Text>
                            <react_native_1.TextInput placeholder="Digite o nome da empresa..." style={styles_1.default.input} value={nomeEmpresa} onChangeText={setNomeEmpresa}/>
                        </react_native_1.View>

                        <react_native_1.View>
                            <react_native_1.Text style={styles_1.default.label}>CNPJ</react_native_1.Text>
                            <react_native_1.TextInput placeholder="Digite o CNPJ da empresa..." style={styles_1.default.input} value={cnpj} onChangeText={setCnpj}/>
                        </react_native_1.View>

                        <react_native_1.View>
                            <react_native_1.Text style={styles_1.default.label}>Email da Empresa</react_native_1.Text>
                            <react_native_1.TextInput placeholder="Digite o email da empresa..." style={styles_1.default.input} value={emailEmpresa} onChangeText={setEmailEmpresa} keyboardType="email-address"/>
                        </react_native_1.View>

                        <react_native_1.View>
                            <react_native_1.Text style={styles_1.default.label}>Telefone da Empresa</react_native_1.Text>
                            <react_native_1.TextInput placeholder="Digite o telefone da empresa..." style={styles_1.default.input} value={telefoneEmpresa} onChangeText={setTelefoneEmpresa} keyboardType="phone-pad"/>
                        </react_native_1.View>

                        <react_native_1.View>
                            <react_native_1.Text style={styles_1.default.label}>Senha</react_native_1.Text>
                            <react_native_1.View style={styles_1.default.passwordContainer}>
                                <react_native_1.TextInput placeholder="Digite sua senha..." style={styles_1.default.passwordInput} value={senha} onChangeText={setSenha} secureTextEntry={!mostrarSenha}/>
                                <react_native_1.Pressable style={styles_1.default.passwordToggle} onPress={function () { return setMostrarSenha(!mostrarSenha); }}>
                                    <vector_icons_1.Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={24} color="gray"/>
                                </react_native_1.Pressable>
                            </react_native_1.View>
                        </react_native_1.View>

                        <react_native_1.Pressable style={[styles_1.default.button, loading && styles_1.default.buttonDisabled]} onPress={handleAdicionarEmpresa} disabled={loading}>
                            <react_native_1.Text style={styles_1.default.buttonText}>
                                {loading ? 'Carregando...' : 'Adicionar Empresa'}
                            </react_native_1.Text>
                        </react_native_1.Pressable>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.ScrollView>
        </react_native_1.SafeAreaView>);
}
exports.default = AdicionarEmpresa;
