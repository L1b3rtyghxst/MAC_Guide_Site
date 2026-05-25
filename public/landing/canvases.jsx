// Canvas background animations
// HeroCanvas — drifting golden dust particles + soft brand fog
// MapCanvas — stylized topographic map with route polyline and pulsing pins

(function () {
  const { useRef, useEffect } = React;

  // ---------- Hero Canvas ----------
  function HeroCanvas() {
    const ref = useRef(null);
    useEffect(() => {
      const canvas = ref.current;
      const ctx = canvas.getContext("2d");
      let raf, particles = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
      const mouse = { x: 0, y: 0, has: false };

      function resize() {
        const r = canvas.parentElement.getBoundingClientRect();
        W = r.width; H = r.height;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function seed() {
        const count = Math.min(110, Math.floor((W * H) / 14000));
        particles = new Array(count).fill(0).map(() => ({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.18,
          vy: -Math.random() * 0.25 - 0.05,
          a: Math.random() * 0.7 + 0.2,
          phase: Math.random() * Math.PI * 2,
        }));
      }

      function tick() {
        ctx.clearRect(0, 0, W, H);

        // soft radial glow at top
        const g = ctx.createRadialGradient(W * 0.35, H * 0.15, 0, W * 0.35, H * 0.15, Math.max(W, H) * 0.6);
        g.addColorStop(0, "rgba(184,139,59,0.10)");
        g.addColorStop(0.5, "rgba(184,139,59,0.02)");
        g.addColorStop(1, "rgba(184,139,59,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        // burgundy fog from corner
        const g2 = ctx.createRadialGradient(W * 0.85, H * 0.85, 0, W * 0.85, H * 0.85, Math.max(W, H) * 0.55);
        g2.addColorStop(0, "rgba(133,15,15,0.07)");
        g2.addColorStop(1, "rgba(133,15,15,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, W, H);

        const t = performance.now() / 1000;
        for (let p of particles) {
          // gentle sway
          p.x += p.vx + Math.sin(t * 0.6 + p.phase) * 0.15;
          p.y += p.vy;
          if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;

          // mouse attraction
          if (mouse.has) {
            const dx = mouse.x - p.x, dy = mouse.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 16000) {
              const f = (1 - d2 / 16000) * 0.4;
              p.x += dx * 0.002 * f;
              p.y += dy * 0.002 * f;
            }
          }

          const alpha = p.a * (0.6 + 0.4 * Math.sin(t * 1.5 + p.phase));
          ctx.beginPath();
          ctx.fillStyle = `rgba(184,139,59,${alpha})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          // halo
          ctx.beginPath();
          ctx.fillStyle = `rgba(240,220,174,${alpha * 0.18})`;
          ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        raf = requestAnimationFrame(tick);
      }

      function onMove(e) {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        mouse.has = true;
      }
      function onLeave() { mouse.has = false; }

      resize(); seed(); tick();
      window.addEventListener("resize", () => { resize(); seed(); });
      canvas.parentElement.addEventListener("mousemove", onMove);
      canvas.parentElement.addEventListener("mouseleave", onLeave);
      return () => {
        cancelAnimationFrame(raf);
      };
    }, []);
    return React.createElement("canvas", { ref, className: "hero-canvas" });
  }

  // ---------- Map Canvas ----------
  function MapCanvas({ points }) {
    const ref = useRef(null);
    useEffect(() => {
      const canvas = ref.current;
      const ctx = canvas.getContext("2d");
      let raf, W = 0, H = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      function resize() {
        const r = canvas.parentElement.getBoundingClientRect();
        W = r.width; H = r.height;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      // pseudo-random topo lines based on noise
      function noise(x, y, seed) {
        return (
          Math.sin(x * 0.013 + seed) * 0.5 +
          Math.sin(y * 0.011 + seed * 1.7) * 0.5 +
          Math.sin((x + y) * 0.007 + seed * 0.5) * 0.3
        );
      }

      function drawBase() {
        // parchment base
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, "#fbf3e6");
        bg.addColorStop(1, "#efe0c9");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // park polygons (soft green washes)
        ctx.fillStyle = "rgba(112,150,110,0.18)";
        ctx.beginPath(); ctx.ellipse(W * 0.22, H * 0.72, W * 0.18, H * 0.12, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W * 0.78, H * 0.22, W * 0.14, H * 0.10, -0.4, 0, Math.PI * 2); ctx.fill();

        // river
        ctx.strokeStyle = "rgba(61,107,141,0.45)";
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-20, H * 0.35);
        ctx.bezierCurveTo(W * 0.3, H * 0.2, W * 0.55, H * 0.6, W + 20, H * 0.45);
        ctx.stroke();
        ctx.strokeStyle = "rgba(61,107,141,0.18)";
        ctx.lineWidth = 22;
        ctx.stroke();

        // street grid
        ctx.strokeStyle = "rgba(133,15,15,0.10)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 14; i++) {
          const y = (i / 14) * H + (Math.sin(i) * 6);
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + Math.cos(i) * 20); ctx.stroke();
        }
        for (let i = 0; i < 18; i++) {
          const x = (i / 18) * W + (Math.cos(i) * 8);
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + Math.sin(i) * 14, H); ctx.stroke();
        }

        // diagonal big avenues
        ctx.strokeStyle = "rgba(133,15,15,0.22)";
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-20, H * 0.85); ctx.lineTo(W + 20, H * 0.10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-20, H * 0.10); ctx.lineTo(W + 20, H * 0.78); ctx.stroke();

        // topographic-ish contour lines using noise
        ctx.strokeStyle = "rgba(143,104,36,0.18)";
        ctx.lineWidth = 1;
        for (let level = -1; level <= 1; level += 0.15) {
          ctx.beginPath();
          let started = false;
          for (let x = 0; x <= W; x += 6) {
            const y = H * 0.5 + noise(x, level * 200, level * 3) * H * 0.35;
            if (!started) { ctx.moveTo(x, y); started = true; }
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // paper grain
        ctx.globalAlpha = 0.05;
        for (let i = 0; i < 400; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? "#5f0909" : "#8f6824";
          ctx.fillRect(Math.random() * W, Math.random() * H, 1.2, 1.2);
        }
        ctx.globalAlpha = 1;
      }

      // animated route + pins
      let progress = 0;
      function drawRoute() {
        const pts = points.map((p) => ({ x: p.x * W, y: p.y * H }));

        // dashed path under
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(95,9,9,0.18)";
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.setLineDash([]);

        // animated drawn segment
        const total = pts.length - 1;
        const animLen = total * progress;
        const segIdx = Math.floor(animLen);
        const segT = animLen - segIdx;

        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgba(133,15,15,0.95)";
        ctx.shadowColor = "rgba(133,15,15,0.45)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i <= segIdx; i++) ctx.lineTo(pts[i].x, pts[i].y);
        if (segIdx < pts.length - 1) {
          const a = pts[segIdx], b = pts[segIdx + 1];
          ctx.lineTo(a.x + (b.x - a.x) * segT, a.y + (b.y - a.y) * segT);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // pins
        const t = performance.now() / 600;
        pts.forEach((p, i) => {
          const visible = i <= segIdx + 0.01;
          const pulse = 1 + 0.25 * Math.sin(t + i);
          if (!visible) return;

          // outer ring
          ctx.beginPath();
          ctx.fillStyle = "rgba(184,139,59,0.18)";
          ctx.arc(p.x, p.y, 22 * pulse, 0, Math.PI * 2);
          ctx.fill();

          // accent ring
          ctx.beginPath();
          ctx.strokeStyle = "#b88b3b";
          ctx.lineWidth = 2;
          ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
          ctx.stroke();

          // pin body
          ctx.beginPath();
          ctx.fillStyle = "#5f0909";
          ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
          ctx.fill();

          // number
          ctx.fillStyle = "white";
          ctx.font = "bold 12px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(i + 1), p.x, p.y + 0.5);
        });

        // "you are here" marker
        const me = { x: W * 0.18, y: H * 0.85 };
        const meP = 1 + 0.4 * Math.sin(t * 1.2);
        ctx.beginPath();
        ctx.fillStyle = "rgba(61,107,141,0.22)";
        ctx.arc(me.x, me.y, 16 * meP, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#3d6b8d";
        ctx.arc(me.x, me.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.arc(me.x, me.y, 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      function tick() {
        drawBase();
        progress = Math.min(1, progress + 0.0035);
        if (progress >= 1) {
          // pause then restart
          setTimeout(() => { progress = 0; }, 2200);
          progress = 1.0001;
        }
        drawRoute();
        raf = requestAnimationFrame(tick);
      }

      resize(); tick();
      window.addEventListener("resize", resize);
      return () => cancelAnimationFrame(raf);
    }, [points]);
    return React.createElement("canvas", { ref });
  }

  window.HeroCanvas = HeroCanvas;
  window.MapCanvas = MapCanvas;
})();
