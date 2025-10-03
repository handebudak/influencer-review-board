'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface DashboardNavProps {
  user: any;
}

export default function DashboardNav({ user }: DashboardNavProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CreatorHub
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

