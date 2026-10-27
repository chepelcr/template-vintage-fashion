/**
 * A wooden hanger. Its hook wraps the rail at (54, 9) of a 120-wide box, so
 * the rail and the swing pivot sit at 7.5 % of the hanger's width (index.css).
 * Width comes from --hanger-w.
 */
export function Hanger({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 46" className={`block h-auto w-[var(--hanger-w)] overflow-visible ${className}`}>
      <path d="M60 23V9A6 6 0 0 0 48 9v3" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--hook)' }} />
      <path
        d="M60 21c-20 5-40 11-53 17-3.5 1.6-2.6 6 1 6h104c3.6 0 4.5-4.4 1-6-13-6-33-12-53-17Z" style={{ fill: 'var(--hanger)' }} />
      <path d="M14 40.5h92" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" style={{ stroke: 'var(--vf-chocolate)' }} />
      <circle cx="60" cy="22" r="2.4" style={{ fill: 'var(--hook)' }} />
    </svg>
  );
}
