import { Monument } from '../types/monument';
import { cn } from '../utils/cn';

interface RoutePanelProps {
  selectedMonuments: Monument[];
  onRemove: (monument: Monument) => void;
  onClear: () => void;
  onReorder: (monuments: Monument[]) => void;
  userLocation: { lat: number; lng: number } | null;
  onOptimizeRoute: () => void;
  isOptimizing: boolean;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function RoutePanel({ 
  selectedMonuments, 
  onRemove, 
  onClear, 
  userLocation, 
  onOptimizeRoute,
  isOptimizing
}: RoutePanelProps) {
  const totalDistance = selectedMonuments.reduce((acc, monument, index) => {
    if (index === 0) {
      if (userLocation) {
        return calculateDistance(
          userLocation.lat, userLocation.lng,
          monument.coordinates.lat, monument.coordinates.lng
        );
      }
      return 0;
    }
    const prev = selectedMonuments[index - 1];
    return acc + calculateDistance(
      prev.coordinates.lat, prev.coordinates.lng,
      monument.coordinates.lat, monument.coordinates.lng
    );
  }, 0);

  const estimatedTime = Math.round((totalDistance / 5) * 60); // 5 km/h walking speed

  if (selectedMonuments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl border-2 border-stone-300 p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-700 mb-2">Маршрут пуст</h3>
        <p className="text-stone-500 text-sm">
          Добавьте памятники, чтобы создать свой маршрут, или выберите готовый маршрут ниже
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl border-2 border-stone-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Ваш маршрут
          </h3>
          <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
            {selectedMonuments.length} {selectedMonuments.length === 1 ? 'памятник' : 
              selectedMonuments.length < 5 ? 'памятника' : 'памятников'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-stone-300">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-amber-600">{totalDistance.toFixed(1)} км</div>
          <div className="text-sm text-stone-500">Общее расстояние</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-amber-600">~{estimatedTime} мин</div>
          <div className="text-sm text-stone-500">Время пешком</div>
        </div>
      </div>

      {/* Route items */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {selectedMonuments.map((monument, index) => (
          <div 
            key={monument.id}
            className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-stone-200"
          >
            {/* Order number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>

            {/* Monument info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-stone-800 truncate">{monument.name}</h4>
              <p className="text-xs text-stone-500 truncate">{monument.address}</p>
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove(monument)}
              className="flex-shrink-0 p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-stone-300 space-y-3">
        <button
          onClick={onOptimizeRoute}
          disabled={!userLocation || isOptimizing}
          className={cn(
            "w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
            userLocation 
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg"
              : "bg-stone-300 text-stone-500 cursor-not-allowed"
          )}
        >
          {isOptimizing ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Оптимизация...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Оптимизировать маршрут
            </>
          )}
        </button>
        
        {!userLocation && (
          <p className="text-xs text-stone-500 text-center">
            Для оптимизации маршрута необходимо определить ваше местоположение
          </p>
        )}

        <button
          onClick={onClear}
          className="w-full py-2 px-4 rounded-xl font-medium text-stone-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
        >
          Очистить маршрут
        </button>
      </div>
    </div>
  );
}
