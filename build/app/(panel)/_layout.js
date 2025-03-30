"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app/(panel)/_layout.js
var AuthContext_1 = require("@/src/context/AuthContext");
var react_native_1 = require("react-native"); // Importe o Text
var EmpresaLayout_1 = __importDefault(require("./EmpresaLayout"));
var FuncionarioLayout_1 = __importDefault(require("./FuncionarioLayout"));
var Colors_1 = __importDefault(require("@/constants/Colors"));
function PanelLayout() {
    var _a = (0, AuthContext_1.useAuth)(), user = _a.user, userType = _a.userType; // Obtém o usuário autenticado e o tipo de usuário
    if (!user) {
        return (<react_native_1.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <react_native_1.ActivityIndicator size="large" color={Colors_1.default.green}/>
            </react_native_1.View>);
    }
    // Redireciona para o layout apropriado com base no tipo de usuário
    if (userType === "empresa") {
        return <EmpresaLayout_1.default />;
    }
    else if (userType === "funcionario") {
        return <FuncionarioLayout_1.default />;
    }
    else {
        return (<react_native_1.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <react_native_1.Text>Usuário não encontrado em nenhuma tabela.</react_native_1.Text>
            </react_native_1.View>);
    }
}
exports.default = PanelLayout;
