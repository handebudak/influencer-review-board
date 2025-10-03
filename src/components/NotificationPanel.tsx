'use client';

export default function NotificationPanel() {
  const notifications = [
    {
      id: 1,
      title: 'You have a bug that needs...',
      time: 'Just now',
      bgColor: 'bg-slate-50',
    },
    {
      id: 2,
      title: 'New user registered',
      time: '59 minutes ago',
      bgColor: 'bg-slate-50',
    },
    {
      id: 3,
      title: 'Andi Lane subscribed to you',
      time: 'Today, 11:59 AM',
      bgColor: 'bg-slate-50',
    },
    {
      id: 4,
      title: 'Released a new version',
      time: '2 hours ago',
      bgColor: 'bg-slate-50',
    },
    {
      id: 5,
      title: 'Modified a data in Page X',
      time: 'Today, 11:59 AM',
      bgColor: 'bg-slate-50',
    },
    {
      id: 6,
      title: 'Deleted a page in Project X',
      time: 'Feb 2, 2023',
      bgColor: 'bg-slate-50',
    },
  ];

  return (
    <div className="hidden xl:block w-64 bg-white border-l border-gray-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Notifications */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-3 rounded-xl ${notif.bgColor} hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {notif.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

