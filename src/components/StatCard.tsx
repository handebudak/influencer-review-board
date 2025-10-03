'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  color: 'lightBlue' | 'lavender' | 'mint' | 'skyBlue';
}

export default function StatCard({ title, value, color }: StatCardProps) {
  const colorClasses = {
    lightBlue: 'bg-[#E3F5FF] border-[#B1E3FF]',
    lavender: 'bg-[#E5ECF6] border-[#95A4FC]',
    mint: 'bg-[#E8F8F0] border-[#BAEDBD]',
    skyBlue: 'bg-[#E3F5FF] border-[#A8C5DA]',
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${colorClasses[color]} shadow-sm hover:shadow-md transition-all`}>
      <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
      <p className="text-4xl font-black text-gray-900">{value}</p>
    </div>
  );
}

