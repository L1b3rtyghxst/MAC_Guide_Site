// YandexMap — adapted from src/components/RouteMap.tsx
// Loads ymaps API lazily, mounts a map, draws pedestrian multi-route
// between user location (if any) and selected monuments. Falls back to
// average-center if no selection.
(function () {
  const { useEffect, useRef } = React;

  let ymapsLoadPromise = null;
  function loadYmaps() {
    if (window.ymaps && window.ymaps.Map) return Promise.resolve(window.ymaps);
    if (ymapsLoadPromise) return ymapsLoadPromise;
    ymapsLoadPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://api-maps.yandex.ru/2.1/?apikey=028cc64e-282c-42f8-a42a-c7c6694e920f&lang=ru_RU";
      s.async = true;
      s.onload = () => {
        window.ymaps.ready(() => resolve(window.ymaps));
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return ymapsLoadPromise;
  }

  function monumentIconSVG(selected, number) {
    const fill = selected ? "#5f0909" : "#8c6f60";
    const stroke = selected ? "#b88b3b" : "#dcc5ae";
    const num = number != null && number !== "" ? number : "";
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40">
        <defs>
          <filter id="sh" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
          </filter>
        </defs>
        <g filter="url(#sh)">
          <circle cx="16" cy="16" r="12" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
          <polygon points="16,26 11,36 21,36" fill="${fill}"/>
          ${num !== "" ? `<text x="16" y="20" text-anchor="middle" font-size="12" font-family="Inter, system-ui" fill="#fff" font-weight="700">${num}</text>` : ""}
        </g>
      </svg>`;
  }

  function YandexMap({ monuments, selectedMonuments, userLocation, onMonumentClick, onMapClick }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const routeRef = useRef(null);
    const clickHandlerRef = useRef(onMapClick);
    clickHandlerRef.current = onMapClick;

    // Init once
    useEffect(() => {
      let cancelled = false;
      loadYmaps().then((ymaps) => {
        if (cancelled || !containerRef.current) return;
        const center = userLocation
          ? [userLocation.lat, userLocation.lng]
          : monuments.length
            ? [
                monuments.reduce((s, m) => s + m.coords.lat, 0) / monuments.length,
                monuments.reduce((s, m) => s + m.coords.lng, 0) / monuments.length,
              ]
            : [55.7558, 37.6173];
        const map = new ymaps.Map(containerRef.current, {
          center, zoom: 12,
          controls: ["zoomControl"],
        }, { suppressMapOpenBlock: true });
        mapRef.current = map;

        // Empty-area click → set user location (used as manual-location fallback)
        map.events.add("click", (e) => {
          const coords = e.get("coords");
          if (coords && clickHandlerRef.current) {
            clickHandlerRef.current(coords);
          }
        });
      }).catch((e) => console.warn("[ymaps] load failed", e));
      return () => {
        cancelled = true;
        try { mapRef.current && mapRef.current.destroy(); } catch (e) {}
        mapRef.current = null;
      };
      // eslint-disable-next-line
    }, []);

    // Sync placemarks and route on data changes
    useEffect(() => {
      const map = mapRef.current;
      const ymaps = window.ymaps;
      if (!map || !ymaps) return;
      map.geoObjects.removeAll();
      routeRef.current = null;

      // Monument placemarks
      monuments.forEach((m) => {
        const idx = selectedMonuments.findIndex((s) => s.id === m.id);
        const selected = idx >= 0;
        const num = selected ? String(idx + 1) : "";
        const svg = monumentIconSVG(selected, num);
        const pm = new ymaps.Placemark(
          [m.coords.lat, m.coords.lng],
          {
            hintContent: m.name,
            balloonContent: `
              <div style="min-width:200px;font-family:Inter,system-ui,sans-serif">
                ${m.image ? `<img src="${m.image}" alt="" style="width:100%;height:90px;object-fit:cover;border-radius:6px 6px 0 0"/>` : ""}
                <div style="padding:8px 10px">
                  <div style="font-weight:700;color:#2f211c;font-size:13px;font-family:'Cormorant Garamond',serif">${m.name}</div>
                  <div style="font-size:12px;color:#6d564a;margin-top:4px;line-height:1.4">${m.desc}</div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:11px;color:#8c7365">
                    <span>${m.year} г.</span>
                    ${selected ? `<span style="background:#5f0909;color:white;padding:2px 8px;border-radius:9999px;font-size:10px">#${num} в маршруте</span>` : ""}
                  </div>
                </div>
              </div>`,
          },
          {
            iconLayout: "default#image",
            iconImageHref: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
            iconImageSize: [32, 40],
            iconImageOffset: [-16, -36],
          }
        );
        pm.events.add("click", () => onMonumentClick && onMonumentClick(m));
        map.geoObjects.add(pm);
      });

      // User location
      if (userLocation) {
        const uSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
            <circle cx="13" cy="13" r="11" fill="#3d6b8d" opacity="0.25"/>
            <circle cx="13" cy="13" r="6" fill="#3d6b8d"/>
            <circle cx="13" cy="13" r="6" fill="none" stroke="white" stroke-width="2"/>
          </svg>`;
        const me = new ymaps.Placemark(
          [userLocation.lat, userLocation.lng],
          { hintContent: "Вы здесь" },
          {
            iconLayout: "default#image",
            iconImageHref: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(uSvg),
            iconImageSize: [26, 26],
            iconImageOffset: [-13, -13],
          }
        );
        map.geoObjects.add(me);
      }

      // Build multi-route if there's a user location + selection
      if (selectedMonuments.length > 0 && ymaps.multiRouter) {
        const refPoints = [];
        if (userLocation) refPoints.push([userLocation.lat, userLocation.lng]);
        selectedMonuments.forEach((m) => refPoints.push([m.coords.lat, m.coords.lng]));
        if (refPoints.length >= 2) {
          const mr = new ymaps.multiRouter.MultiRoute(
            { referencePoints: refPoints, params: { routingMode: "pedestrian" } },
            {
              boundsAutoApply: false,
              routeStrokeWidth: 4,
              routeStrokeColor: "#850f0f",
              routeActiveStrokeWidth: 6,
              routeActiveStrokeColor: "#5f0909",
              wayPointStartIconColor: "#3d6b8d",
              wayPointFinishIconColor: "#5f0909",
            }
          );
          map.geoObjects.add(mr);
          routeRef.current = mr;
        }
      }

      // Auto-fit bounds
      try {
        const bounds = map.geoObjects.getBounds();
        if (bounds) {
          map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 50, duration: 400 });
        }
      } catch (e) {}
    }, [monuments, selectedMonuments, userLocation, onMonumentClick]);

    return <div ref={containerRef} className="ymap-host" />;
  }

  window.YandexMap = YandexMap;
})();
