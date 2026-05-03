/**
 * Music-themed animated SVG icons for highlight cards and info blocks.
 * CSS-driven animations — no external dependencies.
 * Respects prefers-reduced-motion via CSS.
 */

const icons = {
  heart:
  <svg className="anim-icon anim-icon--pulse" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 42s-16-10.4-16-22a9 9 0 0 1 16-5.5A9 9 0 0 1 40 20c0 11.6-16 22-16 22z" />
    </svg>,

  notes:
  <svg className="anim-icon anim-icon--bounce" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="34" r="5" />
      <circle cx="36" cy="30" r="5" />
      <path d="M17 34V12l24-4v22" />
      <path d="M17 20l24-4" />
    </svg>,

  people:
  <svg className="anim-icon anim-icon--sway" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="14" r="5" />
      <path d="M6 42v-4a8 8 0 0 1 8-8h8a8 8 0 0 1 8 8v4" />
      <circle cx="34" cy="14" r="5" />
      <path d="M34 30a8 8 0 0 1 8 8v4" />
    </svg>,

  star:
  <svg className="anim-icon anim-icon--spin" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="24 4 29.5 17 44 18.5 33.5 28 36.5 42 24 35.5 11.5 42 14.5 28 4 18.5 18.5 17" />
    </svg>,

  grid:
  <svg className="anim-icon anim-icon--morph" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="14" height="14" rx="3" />
      <rect x="28" y="6" width="14" height="14" rx="3" />
      <rect x="6" y="28" width="14" height="14" rx="3" />
      <rect x="28" y="28" width="14" height="14" rx="3" />
    </svg>,

  feedback:
  <svg className="anim-icon anim-icon--nod" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 38v-4a8 8 0 0 1 8-8h4" />
      <circle cx="16" cy="16" r="6" />
      <path d="M44 18l-12 12-6-6" />
    </svg>,

  handshake:
  <svg className="anim-icon anim-icon--sway" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 8.61a9 9 0 0 0-12.72 0L6 10.73a9 9 0 0 0 0 12.72l1.74 1.74L24 41.46l16.26-16.27 1.74-1.74a9 9 0 0 0 0-12.72L40 8.61" />
      <path d="M24 20v10M20 25h8" />
    </svg>,

  calendar:
  <svg className="anim-icon anim-icon--flip" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="10" width="36" height="32" rx="4" />
      <path d="M16 6v8M32 6v8M6 20h36" />
      <circle cx="24" cy="32" r="3" fill="currentColor" stroke="none" />
    </svg>,

  guitar:
  <svg className="anim-icon anim-icon--bounce" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M36 4l8 8-6 6-8-8z" />
      <path d="M30 10L18 22a10 10 0 1 0 8 8L38 18" />
      <circle cx="20" cy="32" r="3" />
    </svg>,

  door:
  <svg className="anim-icon anim-icon--sway" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="6" width="28" height="36" rx="3" />
      <circle cx="32" cy="24" r="2" fill="currentColor" stroke="none" />
      <path d="M10 42h28" />
      <path d="M18 16l4 4-4 4" />
    </svg>

};

export default function AnimatedIcon({ name, className = '' }) {
  return (
    <div className={`animated-icon-wrap ${className}`}>
      {icons[name] || icons.notes}
    </div>);

}