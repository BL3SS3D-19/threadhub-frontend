const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function http<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (options.headers) {
        new Headers(options.headers).forEach((value, key) => {
            headers.set(key, value);
        });
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // envía cookies HTTP-only automáticamente
    });

    // Controlamos los errores en las peticiones
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error en la peticion HTTP');
    }

    // Para respuestas 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
