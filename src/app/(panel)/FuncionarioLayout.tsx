// src/app/(panel)/FuncionarioLayout.tsx
import { Drawer } from "expo-router/drawer";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

export default function FuncionarioLayout() {
    return (
        <Drawer
            screenOptions={{
                drawerStyle: {
                    backgroundColor: Colors.zinc,
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
                drawerActiveTintColor: Colors.green,
                drawerInactiveTintColor: Colors.white,
                drawerActiveBackgroundColor: 'rgba(72, 187, 120, 0.1)',
                drawerInactiveBackgroundColor: 'transparent',
                drawerHideStatusBarOnOpen: true,
                headerShown: false,
            }}
        >
            <Drawer.Screen
                name="user/perfil/page"
                options={{
                    drawerLabel: "Perfil",
                    title: "Perfil",
                    drawerIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
                }}
            />
            <Drawer.Screen
                name="user/page"
                options={{
                    drawerLabel: "Início",
                    title: "Início",
                    drawerIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
                }}
            />
            <Drawer.Screen
                name="user/HistoricoPontos/page"
                options={{
                    drawerLabel: "Pontos",
                    title: "Pontos",
                    drawerIcon: ({ color }) => <Feather name="clock" size={20} color={color} />,
                }}
            />
            <Drawer.Screen
                name="profile/page"
                options={{
                    drawerItemStyle: { display: "none" },
                }}
            />
            <Drawer.Screen
                name="EmpresaLayout"
                options={{
                    drawerItemStyle: { display: "none" },
                }}
            />
            <Drawer.Screen
                name="FuncionarioLayout"
                options={{
                    drawerItemStyle: { display: "none" },
                }}
            />
            <Drawer.Screen
                name="employes/page"
                options={{
                    drawerItemStyle: { display: "none" },
                }}
            />
            <Drawer.Screen
                name="employes/edit/page"
                options={{
                    drawerItemStyle: { display: "none" },
                }}
            />
            <Drawer.Screen
                name="employes/create/page"
                options={{
                    drawerItemStyle: { display: "none" },
                }}
            />
            <Drawer.Screen
                name="employes/perfil/page"
                options={{
                    drawerItemStyle: { display: "none" },
                }}
            />
        </Drawer>
    );
}