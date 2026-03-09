
'use client';
import { useState, Suspense, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useThreads } from '@/hooks/useThreads';
import { ThreadView } from '@/components/replies/ThreadView';
import { CreateReplyButton } from '@/components/replies/CreateReplyButton';
import { CreateReplyDialog } from '@/components/replies/CreateReplyDialog';
import { SearchInput } from '@/components/replies/SearchInput';


export default function ThreadPageContent() {
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [showReplyForm, setShowReplyForm] = useState(false);

  const { thread, replies, loading, error, refresh } =
    useThreads({ threadId: id as string });

  const formRef = useRef<HTMLDivElement | null>(null);

  // ✅ SIEMPRE declarar hooks antes de returns
  useEffect(() => {
    if (showReplyForm && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [showReplyForm]);

  // ahora sí puedes hacer returns condicionales
  if (!id || typeof id !== 'string') {
    return <div>Hilo no válido</div>;
  }

  if (loading) {
    return <div className="container py-8">Cargando hilo...</div>;
  }

  if (error || !thread) {
    return <div className="container py-8">Hilo no encontrado</div>;
  }

  return (
    <main className="min-h-screen bg-[#050509] text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col px-6 pb-10 pt-8">

        {/* HEADER ACTION */}
        <header className="mb-8 flex justify-center">
          <div className="flex w-full max-w-sm justify-center">
            <CreateReplyButton
              onClick={() => setShowReplyForm(true)}
            />
          </div>
        </header>

        {/* THREAD + RESPUESTAS */}
        <ThreadView thread={thread} replies={replies} />

        {/* FORMULARIO */}
        <div ref={formRef} className="flex justify-center pt-8">
          {showReplyForm && (
            <CreateReplyDialog
              threadId={id}
              onCreated={() => {
                refresh();
                setShowReplyForm(false);
              }}
            />
          )}
        </div>

      </div>
    </main>
  );
}