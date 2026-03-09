'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ThreadList } from '@/components/threads/ThreadList';
import { SearchInput } from '@/components/replies/SearchInput';
import { CreateThreadDialog } from '@/components/threads/CreateThreadDialog';
import { useThreads } from '@/hooks/useThreads';
import { CreateThreadButton } from '@/components/threads/CreateThreadButton';

export function ThreadsContent() {
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get('query') || '';
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState(queryFromUrl);
    const { threads, loading, error, refresh } = useThreads({ filters: { search: searchTerm } });
    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setSearchTerm(queryFromUrl);
    }, [queryFromUrl]);

    useEffect(() => {
        if (showForm && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showForm]);

    return (
        <main className="min-h-screen bg-[#050509] text-slate-100">
            <div className="mx-auto flex max-w-6xl flex-col px-6 pb-10 pt-8">
                <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end md:w-auto">
                        <div className="w-full sm:w-80">
                            <SearchInput value={searchTerm} onChange={setSearchTerm} />
                        </div>
                        <CreateThreadButton onClick={() => setShowForm(true)} />
                    </div>
                </header>
                {loading && <p className="text-sm text-slate-400">Cargando hilos...</p>}
                {error && <p className="text-sm text-red-400">Error: {error}</p>}
                {!loading && !error && <ThreadList threads={threads} />}
                <div ref={formRef} className="flex justify-center pt-8">
                    {showForm && (
                        <CreateThreadDialog onCreated={() => { refresh(); setShowForm(false); }} />
                    )}
                </div>
            </div>
        </main>
    );
}