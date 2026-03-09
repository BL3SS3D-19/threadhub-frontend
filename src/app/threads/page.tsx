import { Suspense } from 'react';
import { ThreadsContent } from './threadsContent';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050509]" />}>
      <ThreadsContent />
    </Suspense>
  );
}