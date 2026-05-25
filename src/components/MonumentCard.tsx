import { Monument } from '../types/monument';
import { cn } from '../utils/cn';

interface MonumentCardProps {
  monument: Monument;
  isSelected: boolean;
  onSelect: (monument: Monument) => void;
  onViewDetails: (monument: Monument) => void;
  orderNumber?: number;
}

const categoryLabels = {
  memorial: 'Мемориал',
  statue: 'Статуя',
  monument: 'Памятник',
  architectural: 'Архитектура'
};

const categoryColors = {
  memorial: 'bg-rose-900/20 text-rose-800 border-rose-800/30',
  statue: 'bg-amber-900/20 text-amber-800 border-amber-800/30',
  monument: 'bg-stone-700/20 text-stone-700 border-stone-600/30',
  architectural: 'bg-emerald-900/20 text-emerald-800 border-emerald-800/30'
};

export function MonumentCard({ monument, isSelected, onSelect, onViewDetails, orderNumber }: MonumentCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 transition-all duration-300 bg-gradient-to-b from-stone-50 to-stone-100 shadow-md hover:shadow-xl',
        isSelected 
          ? 'border-amber-600 ring-2 ring-amber-500/30' 
          : 'border-stone-300 hover:border-stone-400'
      )}
    >
      {/* Selection indicator */}
      {isSelected && orderNumber && (
        <div className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold shadow-lg">
          {orderNumber}
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={monument.imageUrl}
          alt={monument.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
        
        {/* Category badge */}
        <span className={cn(
          'absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full border',
          categoryColors[monument.category]
        )}>
          {categoryLabels[monument.category]}
        </span>

        {/* Year */}
        <div className="absolute bottom-3 left-3 text-amber-400 font-semibold text-lg">
          {monument.year} г.
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-stone-800 mb-2 line-clamp-2">
          {monument.name}
        </h3>
        <p className="text-stone-600 text-sm mb-3 line-clamp-2">
          {monument.shortDescription}
        </p>
        <p className="text-stone-500 text-xs flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {monument.address}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(monument)}
            className="flex-1 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors"
          >
            Подробнее
          </button>
          <button
            onClick={() => onSelect(monument)}
            className={cn(
              'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all',
              isSelected
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-gradient-to-r from-rose-800 to-rose-900 text-white hover:from-rose-700 hover:to-rose-800'
            )}
          >
            {isSelected ? 'Убрать' : 'Добавить'}
          </button>
        </div>
      </div>
    </div>
  );
}
