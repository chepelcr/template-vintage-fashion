import { Link } from 'wouter';
import { isPurchasable, type CatalogCategory, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from './AddToCart';
import { Availability } from './Availability';
import { Hanger } from './Hanger';
import { Placeholder } from './Placeholder';
import { Price } from './Price';
import { StoreImage } from './StoreImage';

/**
 * A product hanging on the rack: hanger, photo, then its tag and details.
 * It swings when pointed at or focused (CSS only; still under reduced motion).
 */
export function Garment({ item, category, sizes = '(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 58vw', headingLevel = 'h3' }: { item: CatalogItem; category?: CatalogCategory; sizes?: string; headingLevel?: 'h2' | 'h3' }) {
  const { t } = useI18n();
  const Heading = headingLevel;
  return (
    <article className="hang group relative flex h-full flex-col">
      <div className="garment">
        <Hanger className="mx-auto" />
        <div className={`frame-sm relative -mt-1 aspect-[3/4] bg-surface-quiet shadow-soft transition-shadow group-hover:shadow-lift ${isPurchasable(item) ? '' : 'saturate-[0.35]'}`}>
          <StoreImage src={item.imageUrl} alt="" sizes={sizes} maxWidth={720} fallback={<Placeholder />} />
          {item.kind === 'service' && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-surface-deep px-2.5 py-1 text-xs font-bold text-ink-on-deep">{t('product.service')}</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 pt-3.5">
        {category && <p className="text-sm text-ink-soft">{category.name}</p>}
        <Heading className="font-text text-base font-bold leading-snug text-heading">
          <Link href={`/products/${item.id}`} className="rounded-sm after:absolute after:inset-0 after:content-[''] group-hover:underline">
            {item.name}
          </Link>
        </Heading>
        {item.duration && <p className="text-sm text-ink-soft">{t('product.duration', { duration: item.duration })}</p>}
        <div className="mt-auto flex flex-col gap-1.5 pt-1">
          <Price item={item} />
          <div className="flex flex-wrap gap-x-3">
            <Availability item={item} showDuration={false} />
          </div>
        </div>
        <div className="relative z-10 pt-2">
          <AddToCart item={item} variant="compact" tone="quiet" className="w-full" />
        </div>
      </div>
    </article>
  );
}

export function GarmentSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col">
      <div className="mx-auto h-[calc(var(--hanger-w)*0.38)] w-[var(--hanger-w)] rounded-t-full bg-[color:var(--rule)]" />
      <div className="frame-sm skeleton -mt-1 aspect-[3/4]" />
      <div className="skeleton mt-3.5 h-4 w-1/3" />
      <div className="skeleton mt-2 h-5 w-3/4" />
      <div className="skeleton mt-3 h-7 w-24" />
    </div>
  );
}
