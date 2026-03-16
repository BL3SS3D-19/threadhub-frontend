import { http } from '../lib/http';
import { CreateUserDTO, UserResponse } from '../lib/types';

// Servicio de usuarios: operaciones CRUD sobre el recurso /api/users.
// Nota: el login/registro con cookie JWT está en auth.service.ts.
// Este servicio se usa principalmente para consultas de perfil.
export const usersService = {

    /**
     * Registrar un nuevo usuario.
     * En la práctica, el registro con JWT se hace via authService.register;
     * este método queda disponible si se necesita un flujo alternativo sin cookie.
     */
    async register(data: CreateUserDTO): Promise<UserResponse> {
        return http<UserResponse>('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    },

    /**
     * Login de usuario via /api/users/login.
     * Ver auth.service.ts para el login con cookie httpOnly.
     */
    async login(email: string, password: string): Promise<UserResponse> {
        return http<UserResponse>('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
    },

    async getUserById(id: string): Promise<UserResponse> {
        return http<UserResponse>(`/api/users/${id}`);
    },

    async getUserByUsername(username: string): Promise<UserResponse> {
        return http<UserResponse>(`/api/users/username/${username}`);
    },
};
