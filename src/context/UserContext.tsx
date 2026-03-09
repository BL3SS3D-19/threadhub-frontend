'use client';
// frontend/src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthUser } from '../services/auth.service';

interface UserContextType {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Al montar, intentamos obtener el usuario actual desde la cookie
    useEffect(() => {
        authService
            .me()
            .then((u) => setUser(u))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserContextType {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUser debe usarse dentro de <UserProvider>');
    }
    return ctx;
}
