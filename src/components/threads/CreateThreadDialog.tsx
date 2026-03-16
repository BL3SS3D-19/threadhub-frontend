import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { CreateThreadDTO, ThreadResponse, UserResponse } from '@/lib/types';
import { threadsService } from '@/services/threads.service';

interface Props {
  // Callback opcional que se ejecuta tras crear el hilo con éxito,
  // útil para que el padre pueda refrescar la lista sin recargar la página.
  onCreated?: (thread: ThreadResponse) => void;
}

// Formulario inline para crear un nuevo hilo. La validación de rol
// se hace aquí mismo antes de llamar a la API, para dar feedback rápido
// sin necesidad de un round-trip al servidor.
export function CreateThreadDialog({ onCreated }: Props) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Los invitados (guest) pueden leer pero no crear contenido
      if (!user) {
        throw new Error('Debes iniciar sesion para crear un hilo');
      } else if (user.role == 'guest') {
        throw new Error('Debes crear una cuenta para crear contenido');
      }

      const newThread = await threadsService.createThread({
        title,
        content,
        authorId: user.id
      });

      // Limpiamos el formulario solo si la petición fue exitosa
      setTitle('');
      setContent('');

      if (onCreated) onCreated(newThread);
    } catch (err: any) {
      setError(err.message || 'Failed to create thread');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0B0B10] px-6 py-5 shadow-md shadow-black/40"
    >
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-base font-semibold text-white">
          Crea una nueva conversacion
        </h2>
      </div>

      <div className="space-y-3">
        <input
          placeholder="Titulo:"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-[#050509] px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#170fdb] focus:ring-2 focus:ring-[#170fdb]-500/40"
          required
        />
        <textarea
          placeholder="Escribe tu mensaje aqui..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-32 w-full resize-none rounded-lg border border-slate-700 bg-[#050509] px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#170fdb] focus:ring-2 focus:ring-[#170fdb]-500/40"
          required
        />
        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#170fdb] px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/40 transition hover:bg-[#fff] hover:text-[#170fdb] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating...' : 'Create Thread'}
        </button>
      </div>
    </form>
  );
}
