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
var supabase_1 = require("@/src/lib/supabase");
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var expo_router_1 = require("expo-router");
var styles_1 = __importDefault(require("@/assets/styles"));
var CadastroFuncionario = function () {
    var _a = (0, react_1.useState)(""), name = _a[0], setName = _a[1];
    var _b = (0, react_1.useState)(""), cpf = _b[0], setCpf = _b[1];
    var _c = (0, react_1.useState)(""), dataNascimento = _c[0], setDataNascimento = _c[1];
    var _d = (0, react_1.useState)(""), salario = _d[0], setSalario = _d[1];
    var _e = (0, react_1.useState)(""), cargaHoraria = _e[0], setCargaHoraria = _e[1];
    var _f = (0, react_1.useState)(""), email = _f[0], setEmail = _f[1];
    var _g = (0, react_1.useState)(""), numero = _g[0], setNumero = _g[1];
    var _h = (0, react_1.useState)(""), senha = _h[0], setSenha = _h[1];
    var _j = (0, react_1.useState)(null), idEmpresa = _j[0], setIdEmpresa = _j[1];
    var _k = (0, react_1.useState)(true), ativo = _k[0], setAtivo = _k[1];
    var _l = (0, react_1.useState)(false), admin = _l[0], setAdmin = _l[1];
    var _m = (0, react_1.useState)(false), loading = _m[0], setLoading = _m[1];
    (0, react_1.useEffect)(function () {
        var fetchEmpresaId = function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, _a, empresaData, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase.auth.getUser()];
                    case 1:
                        user = (_b.sent()).data.user;
                        if (!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabase_1.supabase
                                .from('empresa')
                                .select('id')
                                .eq('id_usuario', user.id)
                                .single()];
                    case 2:
                        _a = _b.sent(), empresaData = _a.data, error = _a.error;
                        if (error) {
                            console.error('Erro ao buscar empresa:', error);
                        }
                        else if (empresaData) {
                            setIdEmpresa(empresaData.id);
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchEmpresaId();
    }, []);
    var formatarData = function (data) {
        var dataLimpa = data.replace(/\D/g, '');
        if (dataLimpa.length === 8) {
            return "".concat(dataLimpa.slice(4, 8), "-").concat(dataLimpa.slice(2, 4), "-").concat(dataLimpa.slice(0, 2));
        }
        return null;
    };
    var handleCadastro = function () { return __awaiter(void 0, void 0, void 0, function () {
        var dataNascimentoFormatada, _a, authData, authError, _b, funcionarioData, insertError;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading(true);
                    dataNascimentoFormatada = formatarData(dataNascimento);
                    if (!dataNascimentoFormatada) {
                        react_native_1.Alert.alert('Erro', 'Data de nascimento inválida.');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    if (!idEmpresa) {
                        react_native_1.Alert.alert('Erro', 'Empresa não encontrada.');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, supabase_1.supabase.auth.signUp({
                            email: email,
                            password: senha,
                            options: {
                                data: {
                                    display_name: name,
                                },
                            },
                        })];
                case 1:
                    _a = _c.sent(), authData = _a.data, authError = _a.error;
                    if (authError) {
                        react_native_1.Alert.alert('Erro', 'Erro ao criar usuário: ' + authError.message);
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    if (!authData.user) return [3 /*break*/, 3];
                    return [4 /*yield*/, supabase_1.supabase
                            .from('funcionarios')
                            .insert([
                            {
                                name: name,
                                cpf: cpf,
                                data_nacimento: dataNascimentoFormatada,
                                salario: parseFloat(salario),
                                carga_horaria: parseInt(cargaHoraria, 10),
                                email: email,
                                numero: numero,
                                id_empresa: idEmpresa,
                                ativo: ativo,
                                admin: admin,
                                id_usuario: authData.user.id,
                            },
                        ])];
                case 2:
                    _b = _c.sent(), funcionarioData = _b.data, insertError = _b.error;
                    if (insertError) {
                        react_native_1.Alert.alert('Erro', 'Erro ao inserir funcionário: ' + insertError.message);
                    }
                    else {
                        react_native_1.Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso!');
                        // Limpar os campos após o cadastro
                        setName('');
                        setCpf('');
                        setDataNascimento('');
                        setSalario('');
                        setCargaHoraria('');
                        setEmail('');
                        setNumero('');
                        setSenha('');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    react_native_1.Alert.alert('Erro', 'Usuário não foi criado.');
                    _c.label = 4;
                case 4:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
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

          <react_native_1.Text style={styles_1.default.slogan}>Cadastrar Funcionário</react_native_1.Text>

          <react_native_1.View style={styles_1.default.form}>
            <react_native_1.View>
              <react_native_1.Text style={styles_1.default.label}>Nome</react_native_1.Text>
              <react_native_1.TextInput placeholder="Digite o nome do funcionário..." style={styles_1.default.input} value={name} onChangeText={setName}/>
            </react_native_1.View>

            <react_native_1.View>
              <react_native_1.Text style={styles_1.default.label}>CPF</react_native_1.Text>
              <react_native_1.TextInput placeholder="Digite o CPF do funcionário..." style={styles_1.default.input} value={cpf} onChangeText={setCpf}/>
            </react_native_1.View>

            <react_native_1.View>
              <react_native_1.Text style={styles_1.default.label}>Data de Nascimento (DDMMAAAA)</react_native_1.Text>
              <react_native_1.TextInput placeholder="Digite a data de nascimento (DDMMAAAA)..." style={styles_1.default.input} value={dataNascimento} onChangeText={function (text) {
            var dataLimpa = text.replace(/\D/g, '').slice(0, 8);
            setDataNascimento(dataLimpa);
        }} keyboardType="numeric"/>
            </react_native_1.View>

            <react_native_1.View>
              <react_native_1.Text style={styles_1.default.label}>Salário</react_native_1.Text>
              <react_native_1.TextInput placeholder="Digite o salário do funcionário..." style={styles_1.default.input} value={salario} onChangeText={setSalario} keyboardType="numeric"/>
            </react_native_1.View>

            <react_native_1.View>
              <react_native_1.Text style={styles_1.default.label}>Carga Horária (horas)</react_native_1.Text>
              <react_native_1.TextInput placeholder="Digite a carga horária (horas)..." style={styles_1.default.input} value={cargaHoraria} onChangeText={function (text) {
            var horasLimpa = text.replace(/\D/g, '').slice(0, 2);
            setCargaHoraria(horasLimpa);
        }} keyboardType="numeric"/>
            </react_native_1.View>

            <react_native_1.View>
              <react_native_1.Text style={styles_1.default.label}>Email</react_native_1.Text>
              <react_native_1.TextInput placeholder="Digite o email do funcionário..." style={styles_1.default.input} value={email} onChangeText={setEmail} keyboardType="email-address"/>
            </react_native_1.View>

            <react_native_1.View>
              <react_native_1.Text style={styles_1.default.label}>Número</react_native_1.Text>
              <react_native_1.TextInput placeholder="Digite o número do funcionário..." style={styles_1.default.input} value={numero} onChangeText={setNumero} keyboardType="phone-pad"/>
            </react_native_1.View>

            <react_native_1.View>
              <react_native_1.Text style={styles_1.default.label}>Senha</react_native_1.Text>
              <react_native_1.TextInput placeholder="Digite a senha do funcionário..." style={styles_1.default.input} value={senha} onChangeText={setSenha} secureTextEntry/>
            </react_native_1.View>

            <react_native_1.Pressable style={[styles_1.default.button, loading && styles_1.default.buttonDisabled]} onPress={handleCadastro} disabled={loading}>
              <react_native_1.Text style={styles_1.default.buttonText}>
                {loading ? 'Carregando...' : 'Cadastrar Funcionário'}
              </react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.ScrollView>
    </react_native_1.SafeAreaView>);
};
exports.default = CadastroFuncionario;
