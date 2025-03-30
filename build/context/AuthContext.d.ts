/// <reference types="react" />
import { User } from "@supabase/supabase-js";
interface AuthContextProps {
    user: User | null;
    setAuth: (authUser: User | null) => void;
    logout: () => Promise<void>;
    userType: "empresa" | "funcionario" | null;
}
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react").JSX.Element;
export declare const useAuth: () => AuthContextProps;
export {};
