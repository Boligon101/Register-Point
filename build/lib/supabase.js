"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
var react_native_1 = require("react-native");
require("react-native-url-polyfill/auto");
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
var supabase_js_1 = require("@supabase/supabase-js");
var supabase_1 = require("@/constants/supabase");
var supabaseUrl = supabase_1.supaUrl;
var supabaseAnonKey = supabase_1.anonKey;
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: async_storage_1.default,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
react_native_1.AppState.addEventListener('change', function (state) {
    if (state === 'active') {
        exports.supabase.auth.startAutoRefresh();
    }
    else {
        exports.supabase.auth.stopAutoRefresh();
    }
});
