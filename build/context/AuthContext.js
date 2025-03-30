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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
var react_1 = require("react");
var expo_router_1 = require("expo-router");
var supabase_1 = require("../lib/supabase");
var react_native_1 = require("react-native");
var AuthContext = (0, react_1.createContext)({});
var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(null), userType = _c[0], setUserType = _c[1]; // Estado para o tipo de usuário
    var router = (0, expo_router_1.useRouter)();
    // Função para definir o usuário autenticado
    function setAuth(authUser) {
        setUser(authUser);
    }
    // Função para realizar o logout
    function logout() {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase.auth.signOut()];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error("Erro ao deslogar:", error.message);
                            react_native_1.Alert.alert("Erro", "Não foi possível fazer logout.");
                        }
                        else {
                            setAuth(null);
                            setUserType(null); // Limpa o tipo de usuário
                            router.replace('/(auth)/signin/page'); // Navega para a página de login
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Erro ao deslogar:", error_1);
                        react_native_1.Alert.alert("Erro", "Ocorreu um erro ao fazer logout.");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Verifica a sessão do usuário ao carregar o componente
    (0, react_1.useEffect)(function () {
        var checkSession = function () { return __awaiter(void 0, void 0, void 0, function () {
            var session, userId, empresaData, funcionarioData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase.auth.getSession()];
                    case 1:
                        session = (_a.sent()).data.session;
                        if (!session) return [3 /*break*/, 4];
                        console.log("Usuário autenticado:", session.user);
                        setAuth(session.user);
                        userId = session.user.id;
                        return [4 /*yield*/, supabase_1.supabase
                                .from('empresa')
                                .select('id')
                                .eq('id_usuario', userId)
                                .single()];
                    case 2:
                        empresaData = (_a.sent()).data;
                        return [4 /*yield*/, supabase_1.supabase
                                .from('funcionarios')
                                .select('id')
                                .eq('id_usuario', userId)
                                .single()];
                    case 3:
                        funcionarioData = (_a.sent()).data;
                        if (empresaData) {
                            setUserType("empresa"); // Define o tipo de usuário como empresa
                            console.log("Tipo de usuário: empresa");
                        }
                        else if (funcionarioData) {
                            setUserType("funcionario"); // Define o tipo de usuário como funcionário
                            console.log("Tipo de usuário: funcionário");
                        }
                        else {
                            react_native_1.Alert.alert("Erro", "Usuário não encontrado em nenhuma tabela.");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        console.log("Nenhum usuário autenticado.");
                        setAuth(null);
                        setUserType(null); // Limpa o tipo de usuário
                        router.replace('/(auth)/signin/page'); // Navega para a página de login
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        checkSession(); // Verifica a sessão ao carregar o componente
        // Listener para mudanças no estado de autenticação
        var authListener = supabase_1.supabase.auth.onAuthStateChange(function (_event, session) { return __awaiter(void 0, void 0, void 0, function () {
            var userId, empresaData, funcionarioData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!session) return [3 /*break*/, 3];
                        console.log("Usuário autenticado:", session.user);
                        setAuth(session.user);
                        userId = session.user.id;
                        return [4 /*yield*/, supabase_1.supabase
                                .from('empresa')
                                .select('id')
                                .eq('id_usuario', userId)
                                .single()];
                    case 1:
                        empresaData = (_a.sent()).data;
                        return [4 /*yield*/, supabase_1.supabase
                                .from('funcionarios')
                                .select('id')
                                .eq('id_usuario', userId)
                                .single()];
                    case 2:
                        funcionarioData = (_a.sent()).data;
                        if (empresaData) {
                            setUserType("empresa"); // Define o tipo de usuário como empresa
                            console.log("Tipo de usuário: empresa");
                            router.replace('/(panel)/profile/page'); // Redireciona para a página da empresa
                        }
                        else if (funcionarioData) {
                            setUserType("funcionario"); // Define o tipo de usuário como funcionário
                            console.log("Tipo de usuário: funcionário");
                            router.replace('/(panel)/user/page'); // Redireciona para a página do funcionário
                        }
                        else {
                            react_native_1.Alert.alert("Erro", "Usuário não encontrado em nenhuma tabela.");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("Usuário deslogado.");
                        setAuth(null);
                        setUserType(null); // Limpa o tipo de usuário
                        router.replace('/(auth)/signin/page'); // Navega para a página de login
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); }).data;
        // Remove o listener ao desmontar o componente
        return function () {
            authListener.subscription.unsubscribe();
        };
    }, []);
    return (<AuthContext.Provider value={{ user: user, setAuth: setAuth, logout: logout, userType: userType }}>
            {children}
        </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
var useAuth = function () { return (0, react_1.useContext)(AuthContext); };
exports.useAuth = useAuth;
