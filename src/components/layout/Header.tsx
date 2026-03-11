'use client';
import Link from 'next/link';
import { LogOut, User as UserIcon, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import st8_logo from './media/st8_logo.jpg';

export function Header() {
  const { user, isLoading, logout } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full !important bg-black border-b border-border/40 backdrop-blur supports-[backdrop-filter]:">
      <div className="container flex h-20 max-w-5xl items-center justify-between !important bg-black">
        <a href="/" className="flex items-center gap-2" aria-label="HiloHub Home">
          <Image src={st8_logo} alt="Logo ST8" className="w-20" />
        </a>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <>
              {/* Badge de rol */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'user'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                {user.role === 'user' ? 'Miembro' : 'Invitado'}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.email} data-ai-hint="profile person" />
                      <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.role === 'user' ? (user as any).username || 'Miembro' : 'Invitado'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'user' && (
                    <DropdownMenuItem asChild className='hover: bg-[white] !important'>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/auth">
                <Eye className="mr-2 h-4 w-4" />
                Acceder
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
