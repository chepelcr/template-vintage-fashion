/** The 70s band: rust, mustard and avocado stripes. */
export function Stripes({ className = 'h-6 sm:h-8' }: { className?: string }) {
  return <div aria-hidden="true" className={`stripes w-full ${className}`} />;
}
