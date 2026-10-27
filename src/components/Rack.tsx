import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n';

/**
 * A rail with garments hanging from it. It scrolls sideways with snap; the
 * arrows appear only when the rail overflows and stop at either end.
 */
export function Rack({ children, label }: { children: ReactNode; label: string }) {
  const { t } = useI18n();
  const scroller = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const measure = () => {
      const max = node.scrollWidth - node.clientWidth;
      setEdges({ start: node.scrollLeft <= 2, end: node.scrollLeft >= max - 2 });
    };
    measure();
    node.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      node.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, []);

  const scrollBy = (direction: 1 | -1) => {
    const node = scroller.current;
    node?.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: 'smooth' });
  };
  const overflows = !(edges.start && edges.end);

  return (
    <div className="relative">
      <div className="relative">
        <div aria-hidden="true" className="rail-line -inset-x-[var(--gutter)]" />
        <ul
          ref={scroller}
          aria-label={label}
          className="relative -mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-[var(--rack-gap)] overflow-x-auto px-[var(--gutter)] pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </ul>
      </div>
      {overflows && (
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="icon-btn btn-quiet disabled:opacity-40" disabled={edges.start} onClick={() => scrollBy(-1)} aria-label={t('rack.previous')}>
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button type="button" className="icon-btn btn-quiet disabled:opacity-40" disabled={edges.end} onClick={() => scrollBy(1)} aria-label={t('rack.next')}>
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function RackItem({ children }: { children: ReactNode }) {
  return <li className="w-[58%] shrink-0 snap-start sm:w-[31%] lg:w-[calc((100%-3*var(--rack-gap))/4)] xl:w-[calc((100%-4*var(--rack-gap))/5)]">{children}</li>;
}
