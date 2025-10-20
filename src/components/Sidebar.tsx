'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  user?: { name?: string | null; email?: string | null };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'All Applications', href: '/dashboard' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="hidden lg:flex w-64 bg-zinc-900 border-r border-zinc-800 sticky top-0 h-screen flex-col flex-shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">IRB</span>
          </div>
          <div>
            <span className="text-lg font-bold text-white">Influencer</span>
            <span className="text-sm text-zinc-400 block">Review Board</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive(item.href)
                  ? 'bg-zinc-700 text-white shadow-lg'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }
            `}
          >
            <div className={`w-2 h-2 rounded-full ${isActive(item.href) ? 'bg-white' : 'bg-zinc-500'}`}></div>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center space-x-3 px-4 py-3 bg-zinc-800/50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-semibold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

