import { Monument } from '../types/monument';
import { cn } from '../utils/cn';

interface MonumentModalProps {
  monument: Monument | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: (monument: Monument) => void;
}

const categoryLabels = {
  memorial: 'Мемориал',
  statue: 'Статуя',
  monument: 'Памятник',
  architectural: 'Архитектура'
};

export function MonumentModal({ monument, isOpen, onClose, isSelected, onToggleSelect }: MonumentModalProps) {
  if (!isOpen || !monument) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-b from-stone-50 to-stone-100 rounded-2xl shadow-2xl border-2 border-stone-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-stone-800/80 hover:bg-stone-800 text-white rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero image */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
          <img
            src={monument.imageUrl}
            alt={monument.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-amber-600 text-white rounded-full mb-3">
              {categoryLabels[monument.category]}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {monument.name}
            </h2>
            <div className="flex items-center gap-4 text-stone-300">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {monument.year} г.
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {monument.address}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Описание
            </h3>
            <p className="text-stone-700 leading-relaxed">
              {monument.description}
            </p>
          </div>

          {/* Video */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Видеообзор
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
              <iframe
                src={monument.videoUrl}
                title={`Видео о ${monument.name}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-center">
            <button
              onClick={() => onToggleSelect(monument)}
              className={cn(
                'px-8 py-3 text-lg font-semibold rounded-xl transition-all shadow-lg',
                isSelected
                  ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  : 'bg-gradient-to-r from-rose-800 to-rose-900 text-white hover:from-rose-700 hover:to-rose-800'
              )}
            >
              {isSelected ? '✓ Добавлен в маршрут' : 'Добавить в маршрут'}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-br-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-rose-900/5 rounded-tl-full pointer-events-none" />
      </div>
    </div>
  );
}
