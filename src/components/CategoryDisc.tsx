import { Link } from 'wouter';
import { catalogHref, onColor, parseHex, type CatalogCategory } from '@/core';
import { useI18n } from '@/i18n';

// Palette rotation, only for categories the store left without a colour.
const ROTATION = ['#B4532A', '#D9A23A', '#6F7A35', '#3B2418'];

/** A rack size divider: the category's name on a disc that hangs from the rail. */
export function CategoryDisc({ category, count, index, size = 'md' }: { category: CatalogCategory; count?: number; index: number; size?: 'sm' | 'md' }) {
  const { plural } = useI18n();
  const fill = (parseHex(category.backgroundColor) ? category.backgroundColor : null) ?? ROTATION[index % ROTATION.length];
  const ink = onColor(fill);
  const disc = (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <mask id={`disc-${category.id}`}>
          <rect width="100" height="100" fill="#fff" />
          <circle cx="50" cy="22" r="6.5" fill="#000" />
          <rect x="47" y="-2" width="6" height="24" fill="#000" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="49" fill={fill} mask={`url(#disc-${category.id})`} />
      <circle cx="50" cy="50" r="48.5" fill="none" strokeOpacity="0.18" strokeWidth="1" mask={`url(#disc-${category.id})`} style={{ stroke: 'var(--vf-chocolate)' }} />
    </svg>
  );

  if (size === 'sm') {
    return (
      <span aria-hidden="true" className="relative block h-12 w-12 shrink-0">
        {disc}
      </span>
    );
  }

  return (
    <Link href={catalogHref({ category: category.key })} className="hang group block w-[var(--disc-w)] rounded-full">
      <span className="disc relative block aspect-square w-full">
        {disc}
        <span className="absolute inset-x-[12%] bottom-[14%] top-[36%] flex flex-col items-center justify-center text-center" style={{ color: ink }}>
          <span className="line-clamp-3 font-display text-[0.98rem] leading-[1.1] group-hover:underline">{category.name}</span>
          {count !== undefined && <span className="mt-1 text-xs font-semibold opacity-85">{plural('category.count', count)}</span>}
        </span>
      </span>
    </Link>
  );
}
