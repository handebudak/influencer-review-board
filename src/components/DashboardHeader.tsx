'use client';

interface DashboardHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full max-w-full">
        {/* Left side - Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-full max-w-xs lg:max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-gray-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right side - User Info */}
        <div className="flex items-center gap-3">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

