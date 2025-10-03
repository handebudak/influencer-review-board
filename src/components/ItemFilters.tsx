'use client';

import CustomSelect from './CustomSelect';

interface ItemFiltersProps {
  filters: {
    status: string;
    riskLevel: string;
    tag: string;
    search: string;
  };
  onFilterChange: (filters: Record<string, string>) => void;
  allTags: string[];
}

export default function ItemFilters({ filters, onFilterChange, allTags }: ItemFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const statusOptions = [
    { value: '', label: 'Tümü' },
    { value: 'NEW', label: 'Yeni' },
    { value: 'IN_REVIEW', label: 'İnceleniyor' },
    { value: 'APPROVED', label: 'Onaylandı' },
    { value: 'REJECTED', label: 'Reddedildi' },
  ];

  const riskOptions = [
    { value: '', label: 'Tümü' },
    { value: 'LOW', label: 'Düşük' },
    { value: 'MEDIUM', label: 'Orta' },
    { value: 'HIGH', label: 'Yüksek' },
  ];

  const tagOptions = [
    { value: '', label: 'Tümü' },
    ...allTags.map(tag => ({ value: tag, label: tag })),
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Arama
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="İsim, marka, influencer..."
            className="w-full px-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
          />
        </div>

        <CustomSelect
          value={filters.status}
          onChange={(value) => updateFilter('status', value)}
          options={statusOptions}
          label="Durum"
        />

        <CustomSelect
          value={filters.riskLevel}
          onChange={(value) => updateFilter('riskLevel', value)}
          options={riskOptions}
          label="Risk Seviyesi"
        />

        <CustomSelect
          value={filters.tag}
          onChange={(value) => updateFilter('tag', value)}
          options={tagOptions}
          label="Kategori"
        />
      </div>

      {(filters.status || filters.riskLevel || filters.tag || filters.search) && (
        <div className="flex justify-end">
          <button
            onClick={() => onFilterChange({ status: '', riskLevel: '', tag: '', search: '' })}
            className="text-sm text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}

