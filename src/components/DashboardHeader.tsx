'use client';

interface DashboardHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-zinc-800 border-b border-zinc-700 flex items-center px-4 lg:px-6 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between w-full max-w-full">
        {/* Left side - Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-full max-w-xs lg:max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-700 border border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 text-white placeholder:text-zinc-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side - User Info */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-zinc-500 rounded-full"></span>
          </button>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-zinc-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

