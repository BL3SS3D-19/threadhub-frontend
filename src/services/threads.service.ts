import { http } from '../lib/http';
import { ThreadResponse, CreateThreadDTO, ThreadFilters, ReplyResponse, CreateReplyDTO } from '../lib/types';

// Todas las llamadas a la API relacionadas con hilos y respuestas.
// La función `http` se encarga de los headers comunes y de propagar
// los errores como excepciones, así que aquí no hay try/catch.
export const threadsService = {

    // Trae todas las respuestas de un hilo dado su ID.
    async getRepliesByThread(threadId: string): Promise<ReplyResponse[]> {
        return http<ReplyResponse[]>(`/api/replies/thread/${threadId}`);
    },

    // Acepta filtros opcionales (ej: { search: 'texto' }) que se serializan
    // como query string. Si no se pasa nada, devuelve todos los hilos.
    async getAllThreads(filters?: ThreadFilters): Promise<ThreadResponse[]> {
        const query = filters
            ? '?' +
            Object.entries(filters)
                .map(([key, value]) => `${key}=${encodeURIComponent(value as string | number)}`)
                .join('&')
            : '';
        return http<ThreadResponse[]>(`/api/threads${query}`);

    },

    async getThreadById(id: string): Promise<ThreadResponse> {
        return http<ThreadResponse>(`/api/threads/${id}`);
    },

    async createThread(data: CreateThreadDTO): Promise<ThreadResponse> {
        return http<ThreadResponse>('/api/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    },

    async createReply(data: CreateReplyDTO): Promise<ReplyResponse> {
        return http<ReplyResponse>(`/api/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    },
}
