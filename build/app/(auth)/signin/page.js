"use strict";
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
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var react_1 = require("react");
var supabase_1 = require("@/src/lib/supabase");
var styles_1 = __importDefault(require("@/assets/styles"));
function Login() {
    var _a = (0, react_1.useState)(""), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(""), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    function handleSignIn() {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, authData, authError, userId, _c, empresaData, empresaError, _d, funcionarioData, funcionarioError;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        setLoading(true);
                        return [4 /*yield*/, supabase_1.supabase.auth.signInWithPassword({
                                email: email,
                                password: password,
                            })];
                    case 1:
                        _b = _e.sent(), authData = _b.data, authError = _b.error;
                        if (authError) {
                            react_native_1.Alert.alert("Erro", authError.message);
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        userId = (_a = authData.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            react_native_1.Alert.alert("Erro", "Usuário não encontrado.");
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from('empresa')
                                .select('id')
                                .eq('id_usuario', userId)
                                .single()];
                    case 2:
                        _c = _e.sent(), empresaData = _c.data, empresaError = _c.error;
                        if (empresaError && empresaError.code !== 'PGRST116') { // PGRST116 = Nenhum resultado encontrado
                            react_native_1.Alert.alert("Erro", "Erro ao verificar empresa.");
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from('funcionarios')
                                .select('id')
                                .eq('id_usuario', userId)
                                .single()];
                    case 3:
                        _d = _e.sent(), funcionarioData = _d.data, funcionarioError = _d.error;
                        if (funcionarioError && funcionarioError.code !== 'PGRST116') {
                            react_native_1.Alert.alert("Erro", "Erro ao verificar funcionário.");
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        // Redireciona com base no tipo de usuário
                        if (empresaData) {
                            expo_router_1.router.replace('/(panel)/profile/page'); // Redireciona para a página da empresa
                        }
                        else if (funcionarioData) {
                            expo_router_1.router.replace('/(panel)/user/page'); // Redireciona para a página do funcionário
                        }
                        else {
                            react_native_1.Alert.alert("Erro", "Usuário não encontrado em nenhuma tabela.");
                        }
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
            <react_native_1.ScrollView contentContainerStyle={styles_1.default.scrollView}>
                <react_native_1.View style={styles_1.default.container}>

                    <react_native_1.View style={styles_1.default.headerStart}>
                        <react_native_1.Text style={styles_1.default.LogoText}>
                            Register<react_native_1.Text style={styles_1.default.greenText}>Point</react_native_1.Text>
                        </react_native_1.Text>
                    </react_native_1.View>

                    <react_native_1.Text style={styles_1.default.slogan}>Transformando o jeito de registrar seu ponto.</react_native_1.Text>

                    <react_native_1.View style={styles_1.default.form}>
                        <react_native_1.View>
                            <react_native_1.Text style={styles_1.default.label}>Email</react_native_1.Text>
                            <react_native_1.TextInput placeholder="Digite seu email..." style={styles_1.default.input} value={email} onChangeText={setEmail}/>
                        </react_native_1.View>

                        <react_native_1.View>
                            <react_native_1.Text style={styles_1.default.label}>Senha</react_native_1.Text>
                            <react_native_1.TextInput placeholder="Digite sua senha..." style={styles_1.default.input} secureTextEntry value={password} onChangeText={setPassword}/>
                        </react_native_1.View>

                        <react_native_1.Pressable style={styles_1.default.button} onPress={handleSignIn}>
                            <react_native_1.Text style={styles_1.default.buttonText}>
                                {loading ? 'Carregando...' : 'Entrar'}
                            </react_native_1.Text>
                        </react_native_1.Pressable>

                        <react_native_1.Text style={styles_1.default.textLink}>
                            Ainda não possui uma conta?{" "}
                            <expo_router_1.Link href='/(auth)/signup/page' style={styles_1.default.link}>
                                Cadastre-se
                            </expo_router_1.Link>
                        </react_native_1.Text>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.ScrollView>
        </react_native_1.SafeAreaView>);
}
exports.default = Login;
