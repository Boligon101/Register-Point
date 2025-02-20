import { Drawer } from 'expo-router/drawer';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function PanelLayout() {
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
        name="profile/page"
        options={{
          drawerLabel: "Início",
          title: "Início",
          drawerIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="employees/page"
        options={{
          drawerLabel: "Funcionários",
          title: "Funcionários",
          drawerIcon: ({ color }) => <Feather name="users" size={20} color={color} />,
        }}
      />
    </Drawer>
  );
}
