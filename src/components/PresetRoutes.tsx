import { Monument } from '../types/monument';
import { cn } from '../utils/cn';

interface PresetRoutesProps {
  allMonuments: Monument[];
  onSelectAllRoute: () => void;
  onSelectCategoryRoute: (category: Monument['category']) => void;
  currentSelection: Monument[];
}

const presetRoutes = [
  {
    id: 'all',
    name: 'Полный маршрут',
    description: 'Все памятники — идеально для полноценной экскурсии',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    color: 'from-rose-800 to-rose-900',
    category: null
  },
  {
    id: 'memorial',
    name: 'Мемориалы',
    description: 'Памятные места и мемориальные комплексы',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'from-amber-600 to-amber-700',
    category: 'memorial' as Monument['category']
  },
  {
    id: 'statue',
    name: 'Статуи и скульптуры',
    description: 'Памятники великим деятелям истории и культуры',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'from-stone-600 to-stone-700',
    category: 'statue' as Monument['category']
  },
  {
    id: 'architectural',
    name: 'Архитектурные памятники',
    description: 'Триумфальные арки и архитектурные сооружения',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'from-emerald-700 to-emerald-800',
    category: 'architectural' as Monument['category']
  }
];

export function PresetRoutes({ allMonuments, onSelectAllRoute, onSelectCategoryRoute, currentSelection }: PresetRoutesProps) {
  const getCategoryCount = (category: Monument['category'] | null) => {
    if (!category) return allMonuments.length;
    return allMonuments.filter(m => m.category === category).length;
  };

  const isRouteActive = (category: Monument['category'] | null) => {
    if (!category) {
      return currentSelection.length === allMonuments.length;
    }
    const categoryMonuments = allMonuments.filter(m => m.category === category);
    return categoryMonuments.every(m => currentSelection.some(s => s.id === m.id)) 
           && currentSelection.length === categoryMonuments.length;
  };

  return (
    <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl border-2 border-stone-300 p-6">
      <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Готовые маршруты
      </h3>
      
      <div className="grid gap-3">
        {presetRoutes.map((route) => {
          const isActive = isRouteActive(route.category);
          const count = getCategoryCount(route.category);
          
          return (
            <button
              key={route.id}
              onClick={() => route.category ? onSelectCategoryRoute(route.category) : onSelectAllRoute()}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl text-left transition-all border-2',
                isActive 
                  ? 'bg-gradient-to-r ' + route.color + ' text-white border-transparent shadow-lg'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300 hover:shadow-md'
              )}
            >
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                isActive ? 'bg-white/20' : 'bg-gradient-to-br ' + route.color + ' text-white'
              )}>
                {route.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg">{route.name}</h4>
                <p className={cn(
                  'text-sm truncate',
                  isActive ? 'text-white/80' : 'text-stone-500'
                )}>
                  {route.description}
                </p>
              </div>
              <div className={cn(
                'flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium',
                isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              )}>
                {count} {count === 1 ? 'место' : count < 5 ? 'места' : 'мест'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
