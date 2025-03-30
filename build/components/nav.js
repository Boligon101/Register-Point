"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var drawer_1 = require("@react-navigation/drawer");
var expo_router_1 = require("expo-router");
var styles_1 = __importDefault(require("@/assets/styles"));
var Colors_1 = __importDefault(require("@/constants/Colors"));
// Componente Nav
function Nav(_a) {
    var _b = _a.showBackButton, showBackButton = _b === void 0 ? false : _b;
    return (<react_native_1.View style={styles_1.default.formHeader}>
            {/* Modo com botão de voltar */}
            {showBackButton ? (<>
                    <react_native_1.Pressable style={styles_1.default.backButton} onPress={function () { return expo_router_1.router.back(); }}>
                        <vector_icons_1.Ionicons name="arrow-back" size={24} color={Colors_1.default.white}/>
                    </react_native_1.Pressable>

                    {/* Título */}
                    <react_native_1.View style={styles_1.default.header}>
                        <react_native_1.Text style={styles_1.default.LogoText}>
                            Register<react_native_1.Text style={styles_1.default.greenText}>Point</react_native_1.Text>
                        </react_native_1.Text>
                    </react_native_1.View>
                </>) : (
        // Modo sem botão de voltar
        <>
                    {/* Título */}
                    <react_native_1.View style={styles_1.default.headerLeft}>
                        <react_native_1.Text style={styles_1.default.LogoText}>
                            Register<react_native_1.Text style={styles_1.default.greenText}>Point</react_native_1.Text>
                        </react_native_1.Text>
                    </react_native_1.View>

                    {/* Botão do Drawer (menu lateral) */}
                    <drawer_1.DrawerToggleButton tintColor={Colors_1.default.white}/>
                </>)}
        </react_native_1.View>);
}
exports.default = Nav;
