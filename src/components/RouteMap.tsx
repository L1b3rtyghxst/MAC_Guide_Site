import { Map, Placemark} from "@pbe/react-yandex-maps";
import type { Monument } from "../types/monument";
import { useEffect, useMemo, useRef, useState } from "react";

interface RouteMapProps {
  monuments: Monument[];
  selectedMonuments: Monument[];
  userLocation: { lat: number; lng: number } | null;
  onMonumentClick: (monument: Monument) => void;
}

export default function RouteMap({
  monuments,
  selectedMonuments,
  userLocation,
  onMonumentClick,
}: RouteMapProps) {
  const defaultCenter = useMemo<[number, number]>(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (monuments.length > 0) {
      const lat =
        monuments.reduce((s, m) => s + m.coordinates.lat, 0) / monuments.length;
      const lng =
        monuments.reduce((s, m) => s + m.coordinates.lng, 0) / monuments.length;
      return [lat, lng];
    }
    return [55.7558, 37.6173];
  }, [userLocation, monuments]);

  const getMonumentNumber = (monument: Monument): number => {
    const index = selectedMonuments.findIndex((m) => m.id === monument.id);
    return index + 1;
  };

  const isSelected = (monument: Monument): boolean =>
    selectedMonuments.some((m) => m.id === monument.id);


  const mapRef = useRef<any>(null);
  const ymapsRef = useRef<any>(null);
  const multiRouteRef = useRef<any>(null);

  const [navEnabled] = useState(true);

  const handleMapLoad = (ymaps: any) => {
    ymapsRef.current = ymaps;
  };

  useEffect(() => {
    const ymaps = ymapsRef.current;
    const map = mapRef.current;

    if (!ymaps || !map) return;

    if (!navEnabled) {
      if (multiRouteRef.current) {
        map.geoObjects.remove(multiRouteRef.current);
        multiRouteRef.current = null;
      }
      return;
    }

    if (!userLocation || selectedMonuments.length === 0) {
      if (multiRouteRef.current) {
        map.geoObjects.remove(multiRouteRef.current);
        multiRouteRef.current = null;
      }
      return;
    }

    const refPoints: Array<[number, number]> = [
      [userLocation.lat, userLocation.lng],
      ...selectedMonuments.map(
        (m) => [m.coordinates.lat, m.coordinates.lng] as [number, number]
      ),
    ];

    if (multiRouteRef.current) {
      map.geoObjects.remove(multiRouteRef.current);
      multiRouteRef.current = null;
    }

    const multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: refPoints,
        params: {
          routingMode: "pedestrian",
        },
      },
      {
        boundsAutoApply: false,
        routeStrokeWidth: 4,
        routeStrokeColor: "#9f1239",
        routeActiveStrokeWidth: 6,
        routeActiveStrokeColor: "#9f1239",
        wayPointStartIconColor: "#3b82f6",
        wayPointFinishIconColor: "#9f1239",
      }
    );

    map.geoObjects.add(multiRoute);
    multiRouteRef.current = multiRoute;

    if (refPoints.length > 1 && ymaps.util && ymaps.util.bounds) {
      const bounds = ymaps.util.bounds.fromPoints(refPoints);
      map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 });
    }
  }, [selectedMonuments, userLocation, navEnabled]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border-2 border-stone-300">
      <Map
        defaultState={{
          center: defaultCenter,
          zoom: 12,
        }}
        width="100%"
        height="100%"
        options={{ suppressMapOpenBlock: true }}
        modules={[
          "control.ZoomControl",
          "control.GeolocationControl",
          "multiRouter.MultiRoute",
          "util.bounds",
        ]}
        instanceRef={mapRef}
        onLoad={handleMapLoad}
      >
        
        {/* пользователь */}
        {userLocation && (
          <Placemark
            geometry={[userLocation.lat, userLocation.lng]}
            options={{
              iconLayout: "default#image",
              iconImageHref:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                    <circle cx="12" cy="12" r="6" fill="#3b82f6"/>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>
                  </svg>
                `),
              iconImageSize: [24, 24],
              iconImageOffset: [-12, -12],
            }}
            properties={{
              hintContent: "Вы здесь",
            }}
          />
        )}

        {/* памятники с красивыми SVG-иконками */}
        {monuments.map((monument) => {
          const selected = isSelected(monument);
          const number = selected ? getMonumentNumber(monument) : "";

          const fill = selected ? "#9f1239" : "#78716c";
          const stroke = selected ? "#fbbf24" : "#d6d3d1";

          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="38">
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.35)"/>
                </filter>
              </defs>
              <g filter="url(#shadow)">
                <circle cx="15" cy="15" r="11" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
                <polygon points="15,24 10,34 20,34" fill="${fill}"/>
                ${
                  number
                    ? `<text x="15" y="18" text-anchor="middle" font-size="11" font-family="system-ui" fill="#fff" font-weight="700">${number}</text>`
                    : ""
                }
              </g>
            </svg>
          `;

          return (
            <Placemark
              key={monument.id}
              geometry={[
                monument.coordinates.lat,
                monument.coordinates.lng,
              ]}
              options={{
                iconLayout: "default#image",
                iconImageHref:
                  "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
                iconImageSize: [30, 38],
                iconImageOffset: [-15, -34],
              }}

              properties={{
                hintContent: monument.name,
                balloonContent: `
                  <div style="min-width:180px">
                  <img src="${monument.imageUrl}" alt="${monument.name}" style="width:100%;height:80px;object-fit:cover;border-radius:6px 6px 0 0" />
                  <div style="padding:6px 8px">
                    <div style="font-weight:600;color:#1f2937;font-size:12px;">${monument.name}</div>
                    <div style="font-size:11px;color:#4b5563;margin-top:4px;max-height:32px;overflow:hidden;text-overflow:ellipsis;">
                      ${monument.shortDescription}
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:10px;color:#6b7280;">
                      <span>📍 ${monument.year} г.</span>
                      ${
                        selected && number
                          ? `<span style="background:#9f1239;color:white;padding:2px 6px;border-radius:9999px;font-size:9px;">#${number} в маршруте</span>`
                          : ""
                      }
                    </div>
                  </div>
                </div>
              `,
              }}
              onClick={() => onMonumentClick(monument)}
            />
          );
        })}
      </Map>

      {/* легенда */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-xs font-bold text-stone-700 mb-2">Легенда</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-800 to-rose-700 border-2 border-amber-400"></div>
            <span className="text-xs text-stone-600">Уже в маршруте</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-stone-500 to-stone-600 border-2 border-stone-300"></div>
            <span className="text-xs text-stone-600">Не в маршруте</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
              <span className="text-xs text-stone-600">Вы здесь</span>
            </div>
          
          )}
        </div>
      </div>

      {/* инфо о маршруте */}
      {selectedMonuments.length > 0 && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
          <div className="text-xs font-bold text-stone-700 mb-1">Маршрут</div>
          <div className="text-lg font-bold text-rose-800">
            {selectedMonuments.length} точек
          </div>
        </div>
      )}
    </div>
  );
}
