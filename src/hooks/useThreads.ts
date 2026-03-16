// hooks/useThreads.ts
import { useState, useEffect } from 'react';
import { threadsService } from '@/services/threads.service';
import type { ThreadResponse, ThreadFilters, ReplyResponse } from '@/lib/types';

interface UseThreadsProps {
    filters?: ThreadFilters;
    // Si se proporciona threadId, el hook carga ese hilo concreto + sus respuestas.
    // Si no, carga la lista completa de hilos aplicando los filtros opcionales.
    threadId?: string;
}

// Hook unificado para hilos. Gestiona dos modos de uso:
//
//   1. Lista: useThreads({ filters }) → devuelve `threads`
//   2. Detalle: useThreads({ threadId }) → devuelve `thread` + `replies`
//
// En ambos casos expone `refresh` para que los componentes puedan
// actualizar los datos tras crear un nuevo hilo/respuesta sin recargar.
export function useThreads({ filters, threadId }: UseThreadsProps) {
    const [threads, setThreads] = useState<ThreadResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [thread, setThread] = useState<ThreadResponse | null>(null);
    const [replies, setReplies] = useState<ReplyResponse[]>([]);

    const fetchThreads = async () => {
        if (!threadId) {
            setLoading(true);
            setError(null);
        }
        try {
            const data = await threadsService.getAllThreads(filters);
            setThreads(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching threads');
        } finally {
            setLoading(false);
        }
    };

    // Lanza las dos peticiones en paralelo para reducir el tiempo de carga
    // de la página de detalle del hilo.
    const fetchThreadWithReplies = async () => {
        if (threadId) {
            setLoading(true);
            setError(null);
            try {
                const [threadData, repliesData] = await Promise.all([
                    threadsService.getThreadById(threadId),
                    threadsService.getRepliesByThread(threadId)
                ]);
                setThread(threadData);
                setReplies(repliesData);
            } catch (err: any) {
                setError(err.message || 'Error fetching thread');
            } finally {
                setLoading(false);
            }
        }
    };

    // Se vuelve a ejecutar si cambia el término de búsqueda o el hilo que se está viendo.
    useEffect(() => {
        if (threadId) {
            fetchThreadWithReplies();
        } else {
            fetchThreads();
        }
    }, [filters?.search, threadId]);

    return {
        threads,
        thread,
        replies,
        loading,
        error,
        refresh: threadId ? fetchThreadWithReplies : fetchThreads
    };
}
