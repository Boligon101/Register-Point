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
var supabase_1 = require("@/src/lib/supabase");
var expo_router_1 = require("expo-router");
var styles_1 = __importDefault(require("@/assets/styles"));
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var nav_1 = __importDefault(require("@/src/components/nav"));
function EditarFuncionario() {
    var _this = this;
    var funcionario = (0, expo_router_1.useLocalSearchParams)().funcionario;
    var funcionarioData = JSON.parse(funcionario);
    var _a = (0, react_1.useState)(funcionarioData.name), name = _a[0], setName = _a[1];
    var _b = (0, react_1.useState)(funcionarioData.email), email = _b[0], setEmail = _b[1];
    var _c = (0, react_1.useState)(funcionarioData.cpf), cpf = _c[0], setCpf = _c[1];
    var _d = (0, react_1.useState)(funcionarioData.data_nacimento), dataNascimento = _d[0], setDataNascimento = _d[1];
    var _e = (0, react_1.useState)(funcionarioData.salario.toString()), salario = _e[0], setSalario = _e[1];
    var _f = (0, react_1.useState)(funcionarioData.carga_horaria.toString()), cargaHoraria = _f[0], setCargaHoraria = _f[1];
    var _g = (0, react_1.useState)(funcionarioData.numero), numero = _g[0], setNumero = _g[1];
    var handleSalvarEdicao = function () { return __awaiter(_this, void 0, void 0, function () {
        var error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from('funcionarios')
                            .update({
                            name: name,
                            email: email,
                            cpf: cpf,
                            data_nacimento: dataNascimento,
                            salario: parseFloat(salario),
                            carga_horaria: parseInt(cargaHoraria, 10),
                            numero: numero,
                        })
                            .eq('id', funcionarioData.id)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        throw new Error("Erro ao atualizar funcionário.");
                    }
                    react_native_1.Alert.alert('Sucesso', 'Funcionário atualizado com sucesso!');
                    expo_router_1.router.back(); // Volta para a tela anterior
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Erro ao atualizar funcionário:', error_1);
                    if (error_1 instanceof Error) {
                        react_native_1.Alert.alert('Erro', error_1.message);
                    }
                    else {
                        react_native_1.Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<react_native_safe_area_context_1.SafeAreaView style={styles_1.default.safeArea}>
              <react_native_gesture_handler_1.ScrollView contentContainerStyle={styles_1.default.scrollView}>
                <react_native_1.View style={styles_1.default.container}>

                    <nav_1.default showBackButton={true}/>
                    <react_native_1.Text style={styles_1.default.slogan}>Editar Funcionário</react_native_1.Text>

                    <react_native_1.View style={styles_1.default.form}>
                        <react_native_1.TextInput style={styles_1.default.input} placeholder="Nome" value={name} onChangeText={setName}/>
                        <react_native_1.TextInput style={styles_1.default.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address"/>
                        <react_native_1.TextInput style={styles_1.default.input} placeholder="CPF" value={cpf} onChangeText={setCpf}/>
                        <react_native_1.TextInput style={styles_1.default.input} placeholder="Data de Nascimento (AAAA-MM-DD)" value={dataNascimento} onChangeText={setDataNascimento}/>
                        <react_native_1.TextInput style={styles_1.default.input} placeholder="Salário" value={salario} onChangeText={setSalario} keyboardType="numeric"/>
                        <react_native_1.TextInput style={styles_1.default.input} placeholder="Carga Horária" value={cargaHoraria} onChangeText={setCargaHoraria} keyboardType="numeric"/>
                        <react_native_1.TextInput style={styles_1.default.input} placeholder="Número" value={numero} onChangeText={setNumero} keyboardType="phone-pad"/>

                        <react_native_1.Pressable style={styles_1.default.button} onPress={handleSalvarEdicao}>
                            <react_native_1.Text style={styles_1.default.buttonText}>Salvar</react_native_1.Text>
                        </react_native_1.Pressable>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_gesture_handler_1.ScrollView>
        </react_native_safe_area_context_1.SafeAreaView>);
}
exports.default = EditarFuncionario;
