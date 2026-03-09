'use client';
// frontend/src/components/layout/Providers.tsx
// Wrapper cliente para proveedores que necesitan 'use client'
import { UserProvider } from '@/context/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return <UserProvider>{children}</UserProvider>;
}
