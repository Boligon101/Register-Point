// src/app/(panel)/_layout.js
import { Drawer } from 'expo-router/drawer';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Text } from 'react-native'; 

export default function PanelLayout() {
  const { user } = useAuth(); // Verifica se o usuário está autenticado

  if (!user) {
    return <Text>Usuário não autenticado</Text>; 
  }

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
        headerShown: false, // Oculta o header para todas as telas do Drawer
      }}
    >
      <Drawer.Screen
        name="profile/page"
        options={{
          drawerLabel: "Início",
          title: "Início",
          drawerIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="employes/page"
        options={{
          drawerLabel: "Funcionários",
          title: "Funcionários",
          drawerIcon: ({ color }) => <Feather name="users" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="employes/create/page"
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
    </Drawer>
  );
}