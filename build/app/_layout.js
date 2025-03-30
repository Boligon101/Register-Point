"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/app/_layout.js
var expo_router_1 = require("expo-router");
var AuthContext_1 = require("../context/AuthContext");
function Layout() {
    return (<AuthContext_1.AuthProvider>
      <expo_router_1.Stack>
        <expo_router_1.Stack.Screen name="index" options={{ headerShown: false }}/>
        <expo_router_1.Stack.Screen name="(auth)/signin/page" options={{ headerShown: false }}/>
        <expo_router_1.Stack.Screen name="(auth)/signup/page" options={{ headerShown: false }}/>
        <expo_router_1.Stack.Screen name="(panel)" options={{ headerShown: false }}/>
      </expo_router_1.Stack>
    </AuthContext_1.AuthProvider>);
}
exports.default = Layout;
