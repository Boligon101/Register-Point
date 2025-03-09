// src/app/_layout.js
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signin/page" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup/page" options={{ headerShown: false }} />
        <Stack.Screen name="(panel)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}