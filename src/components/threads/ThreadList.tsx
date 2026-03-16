import Link from 'next/link';

import { ThreadResponse } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ThreadListProps {
  threads: ThreadResponse[];
}

// Renderiza la lista de hilos del foro. Cada tarjeta enlaza
// a la página de detalle del hilo (/threads/[id]).
export function ThreadList({ threads }: ThreadListProps) {
  if (threads.length === 0) {
    return <p>No hay hilos todavía.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {threads.map((thread) => (
        <Link href={`/threads/${thread.id}`} key={thread.id} className="block">
          <li className="rounded-2xl border border-slate-800 bg-[#0B0B10] px-6 py-5 shadow-md shadow-black/40 transition hover:border-red-500"
          >

            <h3 className="mb-2 text-lg font-semibold text-slate-50">
              {thread.title}
            </h3>

            {/* Vista previa del contenido: máx. 220 caracteres para no reventar la tarjeta */}
            <p className="mb-4 line-clamp-2 text-sm text-slate-300">
              {thread.content.slice(0, 220)}…
            </p>

            {/* Pie de tarjeta: autor · nº respuestas · tiempo relativo */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>por {thread.author.username}</span>

              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="text-slate-400">💬</span>
                  <span>{thread.replyCount}</span>
                </span>
                <time className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                </time>
              </span>
            </div>
          </li>
        </Link>
      ))}
    </ul>
  );
}