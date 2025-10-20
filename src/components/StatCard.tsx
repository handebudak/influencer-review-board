'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  color: 'lightBlue' | 'lavender' | 'mint' | 'skyBlue';
}

export default function StatCard({ title, value, color }: StatCardProps) {
  const colorClasses = {
    lightBlue: 'bg-gradient-to-br from-zinc-100 to-zinc-200 border-zinc-300 text-zinc-700',
    lavender: 'bg-gradient-to-br from-zinc-200 to-zinc-300 border-zinc-400 text-zinc-800',
    mint: 'bg-gradient-to-br from-zinc-300 to-zinc-400 border-zinc-500 text-zinc-900',
    skyBlue: 'bg-gradient-to-br from-zinc-400 to-zinc-500 border-zinc-600 text-white',
  };

  const valueColors = {
    lightBlue: 'text-zinc-600',
    lavender: 'text-zinc-700',
    mint: 'text-zinc-800',
    skyBlue: 'text-zinc-900',
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <p className="text-sm font-semibold mb-2">{title}</p>
      <p className={`text-4xl font-black ${valueColors[color]}`}>{value}</p>
    </div>
  );
}

