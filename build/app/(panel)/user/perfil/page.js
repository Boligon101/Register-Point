"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var nav_1 = __importDefault(require("@/src/components/nav"));
var ImagePicker = __importStar(require("expo-image-picker"));
var styles_1 = __importDefault(require("@/assets/styles"));
var FileSystem = __importStar(require("expo-file-system"));
var imagemPadrao = require("@/assets/images/imagemPadrao.jpg");
function PerfilFuncionario() {
    var _this = this;
    var _a = (0, AuthContext_1.useAuth)(), user = _a.user, logout = _a.logout;
    var _b = (0, react_1.useState)(null), funcionario = _b[0], setFuncionario = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(""), telefone = _d[0], setTelefone = _d[1];
    (0, react_1.useEffect)(function () {
        var fetchFuncionario = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error, _b, empresa_1, empresaError, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!user) {
                            react_native_1.Alert.alert("Erro", "Usuário não autenticado.");
                            return [2 /*return*/];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, 6, 7]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("funcionarios")
                                .select("*")
                                .eq("id_usuario", user.id)
                                .single()];
                    case 2:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw new Error("Erro ao buscar funcionário.");
                        setFuncionario(data);
                        setTelefone(formatarTelefone(data.numero));
                        if (!data.id_empresa) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("empresa")
                                .select("name")
                                .eq("id", data.id_empresa)
                                .single()];
                    case 3:
                        _b = _c.sent(), empresa_1 = _b.data, empresaError = _b.error;
                        if (empresaError)
                            throw new Error("Erro ao buscar empresa.");
                        setFuncionario(function (prev) { return (__assign(__assign({}, prev), { empresa_nome: empresa_1.name })); });
                        _c.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_1 = _c.sent();
                        console.error("Erro ao buscar funcionário:", error_1);
                        react_native_1.Alert.alert("Erro", "Não foi possível carregar os dados do funcionário.");
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        fetchFuncionario();
    }, [user]);
    var formatarTelefone = function (numero) {
        if (!numero)
            return "Não informado";
        var numerosApenas = numero.replace(/\D/g, "");
        if (numerosApenas.length === 12) {
            return numerosApenas.replace(/^(\d{2})(\d{5})(\d{5})$/, "($1) $2-$3");
        }
        else if (numerosApenas.length === 11) {
            return numerosApenas.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        }
        else if (numerosApenas.length === 10) {
            return numerosApenas.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
        }
        else {
            return "Número inválido";
        }
    };
    var calcularIdade = function (dataNascimento) {
        var hoje = new Date();
        var nascimento = new Date(dataNascimento);
        var idade = hoje.getFullYear() - nascimento.getFullYear();
        var mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };
    var handleChangePhoto = function () { return __awaiter(_this, void 0, void 0, function () {
        var status, result, uri, fileExt, fileName, file, _a, uploadData, uploadError, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ImagePicker.requestMediaLibraryPermissionsAsync()];
                case 1:
                    status = (_b.sent()).status;
                    if (status !== 'granted') {
                        react_native_1.Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para alterar a foto de perfil.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                        })];
                case 2:
                    result = _b.sent();
                    if (!!result.canceled) return [3 /*break*/, 8];
                    uri = result.assets[0].uri;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 7, , 8]);
                    fileExt = uri.split('.').pop();
                    fileName = "".concat(user === null || user === void 0 ? void 0 : user.id, "_").concat(Date.now(), ".").concat(fileExt);
                    console.log("URI da imagem selecionada:", uri);
                    console.log("Nome do arquivo gerado:", fileName);
                    return [4 /*yield*/, FileSystem.readAsStringAsync(uri, {
                            encoding: FileSystem.EncodingType.Base64,
                        })];
                case 4:
                    file = _b.sent();
                    console.log("Iniciando upload da imagem para o Supabase Storage...");
                    return [4 /*yield*/, supabase_1.supabase.storage
                            .from('fotos-perfil')
                            .upload(fileName, file, {
                            contentType: "image/".concat(fileExt),
                        })];
                case 5:
                    _a = _b.sent(), uploadData = _a.data, uploadError = _a.error;
                    if (uploadError) {
                        console.error("Erro ao fazer upload da imagem:", uploadError);
                        throw new Error("Erro ao fazer upload da imagem.");
                    }
                    console.log("Upload da imagem concluído com sucesso!");
                    return [4 /*yield*/, supabase_1.supabase
                            .from("funcionarios")
                            .update({ foto_perfil: fileName })
                            .eq("id_usuario", user === null || user === void 0 ? void 0 : user.id)];
                case 6:
                    error = (_b.sent()).error;
                    if (error) {
                        console.error("Erro ao atualizar a foto de perfil:", error);
                        throw new Error("Erro ao atualizar a foto de perfil.");
                    }
                    console.log("Nome do arquivo salvo no banco de dados:", fileName);
                    setFuncionario(__assign(__assign({}, funcionario), { foto_perfil: fileName }));
                    react_native_1.Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _b.sent();
                    console.error("Erro ao atualizar a foto de perfil:", error_2);
                    react_native_1.Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Função para construir a URL completa da imagem
    var getFotoUrl = function (fileName) {
        if (!fileName)
            return null;
        var urlData = supabase_1.supabase.storage
            .from('fotos-perfil')
            .getPublicUrl(fileName).data;
        console.log("URL gerada para a imagem:", urlData.publicUrl);
        return urlData.publicUrl;
    };
    return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
            <react_native_1.ScrollView contentContainerStyle={styles_1.default.scrollView}>
                <react_native_1.View style={styles_1.default.container}>
                    <nav_1.default />
                    
                    {loading ? (<react_native_1.ActivityIndicator size="large" color={"#00A86B"}/>) : funcionario ? (<react_native_1.View style={styles_1.default.profileContainer}>
                            {/* Foto de perfil */}
                            <react_native_1.Pressable onPress={handleChangePhoto} style={styles_1.default.imageContainerPerfil}>
                                <react_native_1.Image source={funcionario.foto_perfil ? { uri: getFotoUrl(funcionario.foto_perfil) } : imagemPadrao} style={styles_1.default.profileImage} onError={function (e) { return console.log("Erro ao carregar a imagem:", e.nativeEvent.error); }}/>
                                <react_native_1.Text style={styles_1.default.changePhotoText}>Alterar Foto</react_native_1.Text>
                            </react_native_1.Pressable>

                            {/* Dados pessoais */}
                            <react_native_1.View style={styles_1.default.profileSection}>
                                <react_native_1.Text style={styles_1.default.profileLabel}>Nome:</react_native_1.Text>
                                <react_native_1.Text style={styles_1.default.profileValue}>{funcionario.name}</react_native_1.Text>

                                <react_native_1.Text style={styles_1.default.profileLabel}>Idade:</react_native_1.Text>
                                <react_native_1.Text style={styles_1.default.profileValue}>{funcionario.data_nascimento ? calcularIdade(funcionario.data_nascimento) + " anos" : "Não informado"}</react_native_1.Text>

                                <react_native_1.Text style={styles_1.default.profileLabel}>Email:</react_native_1.Text>
                                <react_native_1.Text style={styles_1.default.profileValue}>{funcionario.email}</react_native_1.Text>

                                <react_native_1.Text style={styles_1.default.profileLabel}>Telefone:</react_native_1.Text>
                                <react_native_1.Text style={styles_1.default.profileValue}>{formatarTelefone(funcionario.numero)}</react_native_1.Text>
                            </react_native_1.View>

                            {/* Dados da empresa */}
                            <react_native_1.View style={styles_1.default.profileSection}>
                                <react_native_1.Text style={styles_1.default.profileLabel}>Empresa:</react_native_1.Text>
                                <react_native_1.Text style={styles_1.default.profileValue}>{funcionario.empresa_nome || "Não informado"}</react_native_1.Text>

                                <react_native_1.Text style={styles_1.default.profileLabel}>Carga Horária:</react_native_1.Text>
                                <react_native_1.Text style={styles_1.default.profileValue}>{funcionario.carga_horaria || "Não informado"}</react_native_1.Text>

                                <react_native_1.Text style={styles_1.default.profileLabel}>Salário:</react_native_1.Text>
                                <react_native_1.Text style={styles_1.default.profileValue}>{funcionario.salario || "Não informado"}</react_native_1.Text>
                            </react_native_1.View>

                        </react_native_1.View>) : (<react_native_1.Text style={styles_1.default.errorText}>Nenhum funcionário encontrado.</react_native_1.Text>)}

                    {/* Botão de logout */}
                    <react_native_1.Pressable style={[styles_1.default.button, styles_1.default.logoutButton]} onPress={logout}>
                        <react_native_1.Text style={styles_1.default.buttonText}>Deslogar</react_native_1.Text>
                    </react_native_1.Pressable>

                </react_native_1.View>
            </react_native_1.ScrollView>
        </react_native_1.SafeAreaView>);
}
exports.default = PerfilFuncionario;
