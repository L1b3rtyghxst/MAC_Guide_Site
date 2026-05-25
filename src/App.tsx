import { useState, useCallback, useMemo } from 'react';
import { Monument } from './types/monument';
import { monuments } from './data/monuments';
import { Header } from './components/Header';
import { MonumentCard } from './components/MonumentCard';
import { MonumentModal } from './components/MonumentModal';
import { RoutePanel } from './components/RoutePanel';
import { PresetRoutes } from './components/PresetRoutes';
import RouteMap from './components/RouteMap';

type ViewMode = 'grid' | 'map';

type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

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

// Nearest neighbor algorithm for route optimization
function optimizeRoute(
  monuments: Monument[], 
  startLocation: { lat: number; lng: number }
): Monument[] {
  if (monuments.length <= 1) return monuments;
  
  const remaining = [...monuments];
  const optimized: Monument[] = [];
  let currentLocation = startLocation;
  
  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    
    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateDistance(
        currentLocation.lat, currentLocation.lng,
        remaining[i].coordinates.lat, remaining[i].coordinates.lng
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    const nearest = remaining.splice(nearestIndex, 1)[0];
    optimized.push(nearest);
    currentLocation = nearest.coordinates;
  }
  
  return optimized;
}

export function App() {
  const [selectedMonuments, setSelectedMonuments] = useState<Monument[]>([]);
  const [modalMonument, setModalMonument] = useState<Monument | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Monument['category'] | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredMonuments = useMemo(() => {
    if (categoryFilter === 'all') return monuments;
    return monuments.filter(m => m.category === categoryFilter);
  }, [categoryFilter]);

  const handleGetLocation = useCallback(() => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('success');
      },
      () => {
        // Fallback to Moscow center if geolocation fails
        setUserLocation({ lat: 55.7558, lng: 37.6173 });
        setLocationStatus('success');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleToggleMonument = useCallback((monument: Monument) => {
    setSelectedMonuments(prev => {
      const exists = prev.find(m => m.id === monument.id);
      if (exists) {
        return prev.filter(m => m.id !== monument.id);
      }
      return [...prev, monument];
    });
  }, []);

  const handleClearRoute = useCallback(() => {
    setSelectedMonuments([]);
  }, []);

  const handleSelectAllRoute = useCallback(() => {
    if (userLocation) {
      setSelectedMonuments(optimizeRoute(monuments, userLocation));
    } else {
      setSelectedMonuments([...monuments]);
    }
  }, [userLocation]);

  const handleSelectCategoryRoute = useCallback((category: Monument['category']) => {
    const categoryMonuments = monuments.filter(m => m.category === category);
    if (userLocation) {
      setSelectedMonuments(optimizeRoute(categoryMonuments, userLocation));
    } else {
      setSelectedMonuments(categoryMonuments);
    }
  }, [userLocation]);

  const handleOptimizeRoute = useCallback(() => {
    if (!userLocation || selectedMonuments.length === 0) return;
    
    setIsOptimizing(true);
    setTimeout(() => {
      setSelectedMonuments(optimizeRoute(selectedMonuments, userLocation));
      setIsOptimizing(false);
    }, 500);
  }, [userLocation, selectedMonuments]);

  const handleReorderMonuments = useCallback((reordered: Monument[]) => {
    setSelectedMonuments(reordered);
  }, []);

  const isMonumentSelected = useCallback((monument: Monument) => {
    return selectedMonuments.some(m => m.id === monument.id);
  }, [selectedMonuments]);

  const getMonumentOrder = useCallback((monument: Monument) => {
    const index = selectedMonuments.findIndex(m => m.id === monument.id);
    return index >= 0 ? index + 1 : undefined;
  }, [selectedMonuments]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100">
      <Header 
        onGetLocation={handleGetLocation}
        locationStatus={locationStatus}
        userLocation={userLocation}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Monuments list */}
          <div className="lg:col-span-2 space-y-6">
            {/* View mode toggle and Category filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* View mode toggle */}
              <div className="flex bg-white rounded-lg border border-stone-300 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all text-sm
                    ${viewMode === 'grid'
                      ? 'bg-gradient-to-r from-rose-800 to-rose-900 text-white shadow-md'
                      : 'text-stone-600 hover:bg-stone-100'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Список
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all text-sm
                    ${viewMode === 'map'
                      ? 'bg-gradient-to-r from-rose-800 to-rose-900 text-white shadow-md'
                      : 'text-stone-600 hover:bg-stone-100'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Карта
                </button>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Все' },
                  { value: 'memorial', label: 'Мемориалы' },
                  { value: 'statue', label: 'Статуи' },
                  { value: 'monument', label: 'Памятники' },
                  { value: 'architectural', label: 'Архитектура' }
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value as Monument['category'] | 'all')}
                    className={`
                      px-3 py-1.5 rounded-full font-medium transition-all text-sm
                      ${categoryFilter === cat.value
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-300'
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'grid' ? (
              /* Monuments grid */
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredMonuments.map((monument) => (
                  <MonumentCard
                    key={monument.id}
                    monument={monument}
                    isSelected={isMonumentSelected(monument)}
                    onSelect={handleToggleMonument}
                    onViewDetails={setModalMonument}
                    orderNumber={getMonumentOrder(monument)}
                  />
                ))}
              </div>
            ) : (
              /* Map view */
              <div className="h-[600px] rounded-2xl overflow-hidden shadow-lg border-2 border-stone-300">
                <RouteMap
                  monuments={filteredMonuments}
                  selectedMonuments={selectedMonuments}
                  userLocation={userLocation}
                  onMonumentClick={handleToggleMonument}
                />
              </div>
            )}
          </div>

          {/* Right column - Route panel */}
          <div className="space-y-6">
            <RoutePanel
              selectedMonuments={selectedMonuments}
              onRemove={handleToggleMonument}
              onClear={handleClearRoute}
              onReorder={handleReorderMonuments}
              userLocation={userLocation}
              onOptimizeRoute={handleOptimizeRoute}
              isOptimizing={isOptimizing}
            />

            <PresetRoutes
              allMonuments={monuments}
              onSelectAllRoute={handleSelectAllRoute}
              onSelectCategoryRoute={handleSelectCategoryRoute}
              currentSelection={selectedMonuments}
            />

            {/* Info card */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Как это работает?</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Выберите памятники для вашего маршрута или воспользуйтесь готовыми маршрутами. 
                    Определите ваше местоположение для оптимизации порядка посещения — 
                    маршрут начнётся с ближайшего к вам памятника.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 mt-16 py-8 border-t-4 border-amber-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Маршруты по памятникам</span>
          </div>
          <p className="text-stone-400 text-sm">
            Исследуйте историческое наследие • Создавайте уникальные маршруты
          </p>
          <p className="text-stone-500 text-xs mt-4">
            © 2024 Историческое наследие. Все права защищены.
          </p>
        </div>
      </footer>

      {/* Modal */}
      <MonumentModal
        monument={modalMonument}
        isOpen={!!modalMonument}
        onClose={() => setModalMonument(null)}
        isSelected={modalMonument ? isMonumentSelected(modalMonument) : false}
        onToggleSelect={handleToggleMonument}
      />
    </div>
  );
}
