import { useEffect, useRef } from 'react';

/**
 * Enhanced canvas-based musical particle system.
 * Dual-layer: floating musical notes + small orbiting dots.
 * Subtle connecting lines between nearby particles.
 * Faint audio waveform along the bottom.
 * Desktop: particles gravitate toward mouse cursor.
 * Respects prefers-reduced-motion — renders nothing if set.
 */
const NOTES = ['\u2669', '\u266A', '\u266B', '\u266C', '\u266D', '\u266F', '\uD834\uDD1E'];
const NOTE_COUNT = 30;
const DOT_COUNT = 18;
const CONNECT_DIST = 140;
const GRAVITATE_DIST = 200; // radius of mouse influence
const GRAVITATE_FORCE = 0.012; // pull strength

/* Maroon + ember colour palette */
const COLORS = [
[123, 30, 45], // maroon
[168, 56, 50], // ember
[123, 30, 45], // maroon
[212, 117, 58] // amber accent
];

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createNote(w, h, seedY) {
  const c = pickColor();
  return {
    kind: 'note',
    x: Math.random() * w,
    y: seedY ?? h + 20,
    size: Math.random() * 16 + 12,
    speed: Math.random() * 0.35 + 0.12,
    opacity: Math.random() * 0.14 + 0.08, // darker: was 0.09+0.04
    note: NOTES[Math.floor(Math.random() * NOTES.length)],
    wobbleFreq: Math.random() * 0.015 + 0.003,
    wobbleAmp: Math.random() * 28 + 10,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.008,
    r: c[0], g: c[1], b: c[2],
    t: Math.random() * 300,
    trail: []
  };
}

function createDot(w, h, seedY) {
  const c = pickColor();
  return {
    kind: 'dot',
    x: Math.random() * w,
    y: seedY ?? h + 10,
    size: Math.random() * 3 + 1.5,
    speed: Math.random() * 0.5 + 0.2,
    opacity: Math.random() * 0.18 + 0.08, // darker: was 0.12+0.04
    wobbleFreq: Math.random() * 0.02 + 0.005,
    wobbleAmp: Math.random() * 15 + 5,
    r: c[0], g: c[1], b: c[2],
    t: Math.random() * 300
  };
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function MusicParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w, h;
    const particles = [];
    let waveT = 0;

    // Mouse tracking (desktop only)
    const isTouch = isTouchDevice();
    const mouse = { x: -9999, y: -9999, active: false };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onMouseLeave = () => {mouse.active = false;};

    if (!isTouch) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
    }

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    resize();

    // Seed particles
    for (let i = 0; i < NOTE_COUNT; i++) {
      particles.push(createNote(w, h, Math.random() * h));
    }
    for (let i = 0; i < DOT_COUNT; i++) {
      particles.push(createDot(w, h, Math.random() * h));
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      waveT += 0.008;

      // --- Draw faint waveform along bottom third ---
      const waveY = h * 0.75;
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= w; x += 4) {
        const y = waveY +
        Math.sin(x * 0.008 + waveT) * 18 +
        Math.sin(x * 0.015 - waveT * 1.3) * 10 +
        Math.sin(x * 0.003 + waveT * 0.5) * 25;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(123, 30, 45, 0.06)'; // darker: was 0.04
      ctx.lineWidth = 2;
      ctx.stroke();

      // Second waveform layer
      ctx.beginPath();
      ctx.moveTo(0, waveY + 20);
      for (let x = 0; x <= w; x += 4) {
        const y = waveY + 20 +
        Math.sin(x * 0.006 - waveT * 0.7) * 14 +
        Math.sin(x * 0.012 + waveT * 1.1) * 8;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(168, 56, 50, 0.05)'; // darker: was 0.03
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- Draw connecting lines between close particles ---
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.055; // darker: was 0.035
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(123, 30, 45, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // --- Update & draw particles ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.t += 1;
        p.y -= p.speed;
        p.x += Math.sin(p.t * p.wobbleFreq) * 0.5;

        // Mouse gravitation (desktop only)
        if (!isTouch && mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < GRAVITATE_DIST && dist > 1) {
            const force = GRAVITATE_FORCE * (1 - dist / GRAVITATE_DIST);
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        if (p.y < -50) {
          if (p.kind === 'note') {
            particles[i] = createNote(w, h);
          } else {
            particles[i] = createDot(w, h);
          }
          continue;
        }

        if (p.kind === 'note') {
          p.rotation += p.rotSpeed;

          // Store trail position
          p.trail.push({ x: p.x, y: p.y, opacity: p.opacity * 0.4 });
          if (p.trail.length > 6) p.trail.shift();

          // Draw trail
          for (let t = 0; t < p.trail.length; t++) {
            const tp = p.trail[t];
            const tAlpha = t / p.trail.length * tp.opacity * 0.3;
            ctx.beginPath();
            ctx.arc(tp.x, tp.y, p.size * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${tAlpha})`;
            ctx.fill();
          }

          // Draw note
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.font = `${p.size}px serif`;
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.note, 0, 0);
          ctx.restore();
        } else {
          // Draw dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (!isTouch) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="py-[0px] font-thin hero-particles"
      aria-hidden="true" />);


}