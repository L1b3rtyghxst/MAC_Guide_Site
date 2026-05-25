// Modal for a single monument — adapted from src/components/MonumentModal.tsx
// Includes hero image, description, video iframe, decorative corners, CTA.
(function () {
  const { useEffect } = React;

  function MonumentModal({ monument, isOpen, onClose, isSelected, onToggle }) {
    useEffect(() => {
      if (!isOpen) return;
      const onKey = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }, [isOpen, onClose]);

    if (!isOpen || !monument) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="modal-hero">
            {monument.image ? (
              <img src={monument.image} alt={monument.name} />
            ) : (
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(180deg, ${monument.palette[0]}, ${monument.palette[1]})`
              }} />
            )}
            <div className="modal-hero-grad" />
            <div className="modal-hero-content">
              <span className="modal-cat">{monument.badge}</span>
              <h2>{monument.name}</h2>
              <div className="modal-meta">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  {monument.year} г.
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {monument.addr}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="modal-section">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                Описание
              </h3>
              <p>{monument.descLong || monument.desc}</p>
            </div>

            <div className="modal-section">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="6 4 20 12 6 20 6 4"/>
                </svg>
                Видеообзор
              </h3>
              <div className="video-wrap">
                {monument.videoUrl ? (
                  <iframe
                    src={monument.videoUrl}
                    title={`Видео о ${monument.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="video-empty">
                    Видеообзор будет добавлен позже
                  </div>
                )}
              </div>
            </div>

            <div className="modal-section">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Координаты
              </h3>
              <div className="coords-row">
                <div>
                  <div className="lbl">Широта</div>
                  <div className="val">{monument.coords?.lat.toFixed(4)}°</div>
                </div>
                <div>
                  <div className="lbl">Долгота</div>
                  <div className="val">{monument.coords?.lng.toFixed(4)}°</div>
                </div>
                <div>
                  <div className="lbl">Категория</div>
                  <div className="val">{monument.badge}</div>
                </div>
              </div>
            </div>

            <div className="modal-cta-row">
              <button
                className={`btn ${isSelected ? "btn-ghost" : "btn-brand"}`}
                onClick={() => onToggle(monument.id)}
                style={{ fontSize: 16, padding: "14px 28px" }}
              >
                {isSelected ? "✓ В вашем маршруте" : "Добавить в маршрут"}
              </button>
            </div>
          </div>

          <div className="modal-corner tl" />
          <div className="modal-corner br" />
        </div>
      </div>
    );
  }

  window.MonumentModal = MonumentModal;
})();
