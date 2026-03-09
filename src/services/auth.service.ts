// frontend/src/services/auth.service.ts
import { http } from '../lib/http';

export interface AuthUser {
    id: string;
    email: string;
    role: 'guest' | 'user';
    username?: string;
}

export const authService = {
    /**
     * Acceso guest: solo email, genera cookie con role="guest"
     */
    async guestAccess(email: string): Promise<{ role: 'guest'; email: string }> {
        return http<{ role: 'guest'; email: string }>('/api/auth/guest', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    /**
     * Login con email + password, genera cookie con role="user"
     */
    async login(email: string, password: string): Promise<{ role: 'user'; user: AuthUser }> {
        return http<{ role: 'user'; user: AuthUser }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    /**
     * Registro de nuevo usuario, genera cookie con role="user"
     */
    async register(
        username: string,
        email: string,
        password: string,
        avatarUrl?: string
    ): Promise<{ role: 'user'; user: AuthUser }> {
        return http<{ role: 'user'; user: AuthUser }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, avatarUrl }),
        });
    },

    /**
     * Obtiene el usuario actual desde la cookie (llama a /auth/me)
     */
    async me(): Promise<AuthUser> {
        return http<AuthUser>('/api/auth/me');
    },

    /**
     * Cierra sesión: limpia la cookie en el backend
     */
    async logout(): Promise<void> {
        await http<void>('/api/auth/logout', { method: 'POST' });
    },
};
