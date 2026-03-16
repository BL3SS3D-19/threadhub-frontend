'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthUser } from '../services/auth.service';

interface UserContextType {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Proveedor global de sesión. Envuelve la app desde layout.tsx a través de Providers.tsx.
// Al montar, hace una llamada a /auth/me para hidratar el estado con la cookie
// existente; si falla (sin sesión o expirada) simplemente deja user = null.
export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authService
            .me()
            .then((u) => setUser(u))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    // El logout llama al backend para que invalide la cookie httpOnly;
    // independientemente del resultado, borramos el user del estado local.
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

// Hook de conveniencia. Lanza si se usa fuera de UserProvider para
// detectar errores de configuración early en desarrollo.
export function useUser(): UserContextType {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUser debe usarse dentro de <UserProvider>');
    }
    return ctx;
}
