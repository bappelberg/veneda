"use client";

import { createContext, useContext, useState, useEffect, ReactNode} from "react";
import { apiFetch } from "@/lib/api";

function getRoleFromToken(token: string): string | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role ?? null
    } catch {
        return null;
    }
}

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsAuthenticated(!!token);
        setIsAdmin(token ? getRoleFromToken(token) === "ADMIN" : false);
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await apiFetch<AuthResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setIsAuthenticated(true);
        setIsAdmin(getRoleFromToken(data.accessToken) === "ADMIN");
    }
    const register = async (registerData: RegisterData) => {
        const data = await apiFetch<AuthResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify(registerData),
            skipAuth: true,
        });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setIsAuthenticated(true);
        setIsAdmin(getRoleFromToken(data.accessToken) === "ADMIN");
    }

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
        setIsAdmin(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
