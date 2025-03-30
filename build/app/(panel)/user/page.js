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
var AuthContext_1 = require("@/src/context/AuthContext");
var Location = __importStar(require("expo-location"));
var styles_1 = __importDefault(require("@/assets/styles"));
var nav_1 = __importDefault(require("@/src/components/nav"));
function PontoFuncionario() {
    var _this = this;
    var user = (0, AuthContext_1.useAuth)().user;
    var _a = (0, react_1.useState)(false), pontoIniciado = _a[0], setPontoIniciado = _a[1];
    var _b = (0, react_1.useState)(false), loadingPonto = _b[0], setLoadingPonto = _b[1];
    var _c = (0, react_1.useState)(null), startTime = _c[0], setStartTime = _c[1];
    var _d = (0, react_1.useState)(null), endTime = _d[0], setEndTime = _d[1];
    var _e = (0, react_1.useState)(null), startLocation = _e[0], setStartLocation = _e[1];
    var _f = (0, react_1.useState)(null), endLocation = _f[0], setEndLocation = _f[1];
    var getLocation = function () { return __awaiter(_this, void 0, void 0, function () {
        var status, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Location.requestForegroundPermissionsAsync()];
                case 1:
                    status = (_a.sent()).status;
                    if (status !== 'granted') {
                        react_native_1.Alert.alert("Erro", "Permissão de localização negada.");
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, Location.getCurrentPositionAsync({})];
                case 2:
                    location = _a.sent();
                    return [2 /*return*/, "".concat(location.coords.latitude, ", ").concat(location.coords.longitude)];
            }
        });
    }); };
    var iniciarPonto = function () { return __awaiter(_this, void 0, void 0, function () {
        var now, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingPonto(true);
                    now = new Date().toISOString();
                    return [4 /*yield*/, getLocation()];
                case 1:
                    location = _a.sent();
                    if (!location) {
                        setLoadingPonto(false);
                        return [2 /*return*/];
                    }
                    setStartTime(now);
                    setStartLocation(location);
                    setPontoIniciado(true);
                    setLoadingPonto(false);
                    react_native_1.Alert.alert("Ponto iniciado!", "Hor\u00E1rio: ".concat(now, "\nLocaliza\u00E7\u00E3o: ").concat(location));
                    return [2 /*return*/];
            }
        });
    }); };
    var finalizarPonto = function () { return __awaiter(_this, void 0, void 0, function () {
        var now, location, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user || !startTime || !startLocation) {
                        react_native_1.Alert.alert("Erro", "Você precisa iniciar o ponto primeiro.");
                        return [2 /*return*/];
                    }
                    setLoadingPonto(true);
                    now = new Date().toISOString();
                    return [4 /*yield*/, getLocation()];
                case 1:
                    location = _a.sent();
                    if (!location) {
                        setLoadingPonto(false);
                        return [2 /*return*/];
                    }
                    setEndTime(now);
                    setEndLocation(location);
                    setPontoIniciado(false);
                    return [4 /*yield*/, supabase_1.supabase.from("pontos").insert({
                            id_usuario: user.id,
                            entrada: startTime,
                            location_entrada: startLocation,
                            saida: now,
                            location_saida: location,
                            ativo: true,
                            ausencia: false
                        })];
                case 2:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Erro ao registrar ponto:", error);
                        react_native_1.Alert.alert("Erro", "Não foi possível registrar o ponto.");
                    }
                    else {
                        react_native_1.Alert.alert("Ponto finalizado!", "Hor\u00E1rio: ".concat(now, "\nLocaliza\u00E7\u00E3o: ").concat(location));
                    }
                    setStartTime(null);
                    setStartLocation(null);
                    setEndTime(null);
                    setEndLocation(null);
                    setLoadingPonto(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<react_native_1.SafeAreaView style={styles_1.default.safeArea}>
            <react_native_1.View style={styles_1.default.container}>
                <nav_1.default showBackButton={false}/>

                <react_native_1.Text style={styles_1.default.slogan}>Bater o Ponto</react_native_1.Text>

                <react_native_1.Pressable style={[styles_1.default.button, pontoIniciado ? styles_1.default.buttonEnd : styles_1.default.buttonStart]} onPress={pontoIniciado ? finalizarPonto : iniciarPonto} disabled={loadingPonto}>
                    {loadingPonto ? (<react_native_1.ActivityIndicator size="small" color={"#FFF"}/>) : (<react_native_1.Text style={styles_1.default.buttonText}>
                            {pontoIniciado ? "Finalizar Ponto" : "Iniciar Ponto"}
                        </react_native_1.Text>)}
                </react_native_1.Pressable>
            </react_native_1.View>
        </react_native_1.SafeAreaView>);
}
exports.default = PontoFuncionario;
