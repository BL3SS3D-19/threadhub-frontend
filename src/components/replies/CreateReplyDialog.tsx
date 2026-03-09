import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { threadsService } from '@/services/threads.service';
import type { ReplyResponse, ThreadResponse } from '@/lib/types';

interface Props {
    onCreated?: (reply: ReplyResponse) => void;
    threadId: string;
}

export function CreateReplyDialog({ threadId, onCreated }: Props) {
    const { user } = useUser();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);


        try {
            if (!user) {
                throw new Error('Debes iniciar sesion para crear una respuesta.');
            } else if (user.role == 'guest') {
                throw new Error('Debes crear una cuenta para crear contenido');
            }

            const newReply = await threadsService.createReply({
                content,
                authorId: user.id,
                threadId
            });

            setContent(' ');
            onCreated?.(newReply);

        } catch (err: any) {
            setError(err.message || 'Error al crear la respuesta');
        } finally {
            setLoading(false);
        }
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0B0B10] px-6 py-5 shadow-md shadow-black/40 hover:border-red-500 hover:ring-2 hover:ring-red-500/40"
        >
            <textarea
                placeholder="Escribe tu respuesta..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-32 w-full resize-none rounded-lg border border-slate-700 bg-[#050509] px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#170fdb] focus:ring-2 focus:ring-[#170fdb]-500/40"
                required
            />

            {error && <p>{error}</p>}

            <div className="mt-6 flex justify-center">
                <button
                    disabled={loading}
                    className="rounded-full bg-[#170fdb] px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/40 transition hover:bg-[#fff] hover:text-[#170fdb] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Enviando...' : 'Responder'}
                </button>
            </div>
        </form>
    );
}