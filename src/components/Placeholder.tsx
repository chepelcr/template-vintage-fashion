import { ProductFallbackIcon } from './CmsIcon';

/** Identity placeholder: a 70s sunrise of rust, mustard and avocado under the store's fallback icon. */
export function Placeholder({ label, tone = 'light' }: { label?: string; tone?: 'light' | 'deep' }) {
  const deep = tone === 'deep';
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${deep ? 'bg-surface-deep-raised text-ink-on-deep-soft' : 'bg-surface-quiet text-heading'}`}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 w-full opacity-40" viewBox="0 0 100 50" preserveAspectRatio="xMidYMax meet">
        <path d="M8 50a42 42 0 0 1 84 0" fill="none" stroke="var(--stripe-1)" strokeWidth="7" />
        <path d="M17 50a33 33 0 0 1 66 0" fill="none" stroke="var(--stripe-2)" strokeWidth="7" />
        <path d="M26 50a24 24 0 0 1 48 0" fill="none" stroke="var(--stripe-3)" strokeWidth="7" />
      </svg>
      <ProductFallbackIcon className="relative h-10 w-10 -translate-y-3" strokeWidth={1.5} />
    </div>
  );
}
