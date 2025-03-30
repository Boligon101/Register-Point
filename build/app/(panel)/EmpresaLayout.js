"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app/(panel)/EmpresaLayout.tsx
var drawer_1 = require("expo-router/drawer");
var Colors_1 = __importDefault(require("@/constants/Colors"));
var vector_icons_1 = require("@expo/vector-icons");
function EmpresaLayout() {
    return (<drawer_1.Drawer screenOptions={{
            drawerStyle: {
                backgroundColor: Colors_1.default.zinc,
                borderTopWidth: 0,
                paddingTop: 32,
                width: '60%',
            },
            drawerLabelStyle: {
                marginLeft: -5,
                fontSize: 16,
                fontWeight: '500',
            },
            drawerItemStyle: {
                borderRadius: 8,
                marginHorizontal: 10,
                marginVertical: 5,
            },
            drawerActiveTintColor: Colors_1.default.green,
            drawerInactiveTintColor: Colors_1.default.white,
            drawerActiveBackgroundColor: 'rgba(72, 187, 120, 0.1)',
            drawerInactiveBackgroundColor: 'transparent',
            drawerHideStatusBarOnOpen: true,
            headerShown: false,
        }}>
            <drawer_1.Drawer.Screen name="profile/page" options={{
            drawerLabel: "Início",
            title: "Início",
            drawerIcon: function (_a) {
                var color = _a.color;
                return <vector_icons_1.Feather name="home" size={20} color={color}/>;
            },
        }}/>
            <drawer_1.Drawer.Screen name="employes/page" options={{
            drawerLabel: "Funcionários",
            title: "Funcionários",
            drawerIcon: function (_a) {
                var color = _a.color;
                return <vector_icons_1.Feather name="users" size={20} color={color}/>;
            },
        }}/>
            <drawer_1.Drawer.Screen name="employes/create/page" options={{
            drawerItemStyle: { display: "none" },
        }}/>
            <drawer_1.Drawer.Screen name="employes/edit/page" options={{
            drawerItemStyle: { display: "none" },
        }}/>
            <drawer_1.Drawer.Screen name="user/page" options={{
            drawerItemStyle: { display: "none" },
        }}/>
            <drawer_1.Drawer.Screen name="EmpresaLayout" options={{
            drawerItemStyle: { display: "none" },
        }}/>
            <drawer_1.Drawer.Screen name="FuncionarioLayout" options={{
            drawerItemStyle: { display: "none" },
        }}/>
            <drawer_1.Drawer.Screen name="user/HistoricoPontos/page" options={{
            drawerItemStyle: { display: "none" },
        }}/>
            <drawer_1.Drawer.Screen name="user/perfil/page" options={{
            drawerItemStyle: { display: "none" },
        }}/>
        </drawer_1.Drawer>);
}
exports.default = EmpresaLayout;
