'use client';

import { formatDistanceToNow } from 'date-fns';

import { ThreadResponse, ReplyResponse, UserResponse } from '@/lib/types';

interface ThreadViewProps {
  thread: ThreadResponse;
  replies?: ReplyResponse[];
  // onReply se pasa por si en algún momento se quiere mover
  // el formulario de respuesta dentro de este componente.
  onReply?: (content: string) => void;
}

// Vista de detalle de un hilo: muestra el post original en la parte
// superior y debajo la lista de respuestas ordenadas por fecha de creación
// (el orden lo controla la API, aquí solo renderizamos).
export function ThreadView({ thread, replies = [], onReply }: ThreadViewProps) {
  return (
    <div className="space-y-6">
      {/* Post original */}
      <div>
        <h1 className="text-2xl font-bold whitespace-pre-wrap break-words">{thread.title}</h1>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
          {thread.content}
        </p>
        <p className="text-sm text-muted-foreground">by {thread.author.username}</p>
      </div>

      {/* Lista de respuestas */}
      <div className="space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="rounded-2xl border border-slate-800 bg-[#0B0B10] px-6 py-5 shadow-md shadow-black/40 transition hover:border-red-500">
            <p className="text-sm text-muted-foreground">{reply.author.username}</p>
            <p className='whitespace-pre-wrap break-words'>{reply.content}</p>
            <time className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
            </time>
          </div>
        ))}
      </div>
    </div>
  );
}