import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { catalogHref, paragraphs, usePageMeta, useProductView } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from '@/components/AddToCart';
import { Garment } from '@/components/Garment';
import { Hanger } from '@/components/Hanger';
import { Placeholder } from '@/components/Placeholder';
import { Price } from '@/components/Price';
import { QuantityStepper } from '@/components/QuantityStepper';
import { Rack, RackItem } from '@/components/Rack';
import { StoreImage } from '@/components/StoreImage';
import { SectionError } from '@/components/StoreStates';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t, plural } = useI18n();
  const { item, catalog, category, related, max, quantity, setQuantity } = useProductView(id);
  usePageMeta(item?.name, item?.description);

  if (catalog.isLoading) {
    return (
      <div aria-hidden="true" className="page grid gap-10 pt-10 md:grid-cols-12">
        <div className="frame-sm skeleton mt-12 aspect-[3/4] md:col-span-5" />
        <div className="flex flex-col gap-4 pt-12 md:col-span-7">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-14 w-3/4" />
          <div className="skeleton h-9 w-36" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (catalog.isError) {
    return (
      <div className="page pt-16">
        <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page pt-16">
        <div className="sewn flex flex-col items-start gap-4 p-8 md:p-10">
          <h1 className="text-[clamp(2.2rem,5vw,3.25rem)] text-heading">{t('product.notFound.title')}</h1>
          <p className="max-w-xl text-lg text-ink-soft">{t('product.notFound.body')}</p>
          <Link href="/products" className="btn btn-strong">
            {t('product.back')}
          </Link>
        </div>
      </div>
    );
  }

  const text = paragraphs(item.description);
  const stock = item.availability;
  const stockText =
    stock.state === 'sold_out'
      ? t('product.soldOut')
      : stock.state === 'low'
        ? plural('product.low', stock.quantity)
        : stock.state === 'in_stock'
          ? t('product.spec.inStock')
          : null;
  const facts = [
    category && { label: t('product.spec.category'), value: category.name },
    stockText && { label: t('product.spec.availability'), value: stockText, alert: stock.state !== 'in_stock' },
    item.kind === 'service' && { label: t('product.spec.type'), value: t('product.service') },
    item.duration && { label: t('product.spec.duration'), value: item.duration },
    item.difficulty && { label: t('product.spec.level'), value: item.difficulty },
  ].filter(Boolean) as Array<{ label: string; value: string; alert?: boolean }>;

  return (
    <>
      <div className="page pt-6">
        <Link href={category ? catalogHref({ category: category.key }) : '/products'} className="inline-flex min-h-tap items-center gap-2 font-bold text-heading hover:underline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {category ? category.name : t('product.back')}
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="relative md:col-span-5 [--hanger-w:9rem] sm:[--hanger-w:10rem]">
            <div aria-hidden="true" className="rail-line -left-[var(--gutter)] -right-6 md:-left-[50vw]" />
            <div className="garment hero-garment relative mx-auto w-[min(26rem,86%)]">
              <Hanger className="mx-auto" />
              <div className="frame-sm relative -mt-1.5 aspect-[3/4] bg-surface-quiet shadow-lift">
                <StoreImage src={item.imageUrl} alt={item.name} priority sizes="(min-width: 768px) 26rem, 86vw" maxWidth={1080} fallback={<Placeholder label={t('product.imageMissing')} />} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:col-span-7 md:pt-10">
            <h1 className="text-[clamp(2.2rem,5vw,3.75rem)] text-heading">{item.name}</h1>
            <Price item={item} size="lg" />
            {text.length > 0 && (
              <div className="flex max-w-[60ch] flex-col gap-3 text-lg text-ink-soft">
                {text.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <section aria-labelledby="garment-label" className="sewn max-w-md px-6 py-5">
                <h2 id="garment-label" className="font-display text-lg text-heading">
                  {t('product.specs')}
                </h2>
                <dl className="mt-2 divide-y divide-[color:var(--rule)]">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex items-baseline justify-between gap-4 py-2">
                      <dt className="text-ink-soft">{fact.label}</dt>
                      <dd className={`text-right font-bold ${fact.alert ? 'text-offer' : 'text-heading'}`}>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {item.availability.state !== 'sold_out' && <QuantityStepper value={quantity} max={max} onChange={setQuantity} label={item.name} />}
              <AddToCart item={item} quantity={quantity} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="page pt-20">
          <h2 id="related" className="mb-6 text-[clamp(1.8rem,4vw,2.5rem)] text-heading">
            {t('product.related')}
          </h2>
          <Rack label={t('product.related')}>
            {related.map((r) => (
              <RackItem key={r.id}>
                <Garment item={r} category={catalog.categories.find((c) => c.id === r.categoryId)} />
              </RackItem>
            ))}
          </Rack>
        </section>
      )}
    </>
  );
}
