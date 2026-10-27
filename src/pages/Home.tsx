import { Link } from 'wouter';
import { categoriesWithItems, facetsFor, featuredItems, homeContent, paragraphs, useCatalog, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CategoryDisc } from '@/components/CategoryDisc';
import { CmsIcon } from '@/components/CmsIcon';
import { Garment, GarmentSkeleton } from '@/components/Garment';
import { Hanger } from '@/components/Hanger';
import { Placeholder } from '@/components/Placeholder';
import { Rack, RackItem } from '@/components/Rack';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';
import { Stripes } from '@/components/Stripes';

export default function Home() {
  const { t } = useI18n();
  const cms = useCmsPage('home');
  const home = homeContent(cms.page);
  const catalog = useCatalog();
  usePageMeta(cms.page?.title, cms.page?.metaDescription);

  const featured = featuredItems(catalog.items, 10);
  const racks = categoriesWithItems(catalog.categories, catalog.items);
  const counts = facetsFor(catalog.items).categories;
  const categoryOf = (id: string | null) => catalog.categories.find((c) => c.id === id);
  const story = paragraphs(home.story.content);

  return (
    <>
      <section className="on-deep relative overflow-hidden bg-surface-deep text-ink-on-deep">
        <div className="page grid items-center gap-x-8 gap-y-12 pb-14 pt-10 md:grid-cols-12 md:pb-16 md:pt-14">
          <div className={home.hero.image ? 'md:col-span-7' : 'md:col-span-10'}>
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-4">
                <div className="skeleton-deep h-8 w-44" />
                <div className="skeleton-deep h-16 w-full" />
                <div className="skeleton-deep h-16 w-4/5" />
                <div className="skeleton-deep h-5 w-3/4" />
              </div>
            ) : cms.isError ? (
              <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
            ) : (
              <>
                {home.hero.badge && <p className="price-tag mb-6 text-base">{home.hero.badge}</p>}
                {home.hero.title && <h1 className="text-[clamp(2.6rem,7vw,5.25rem)]">{home.hero.title}</h1>}
                {home.hero.subtitle && <p className="mt-6 max-w-[36rem] text-lg text-ink-on-deep-soft">{home.hero.subtitle}</p>}
                <div className="mt-9 flex flex-wrap gap-3">
                  {home.hero.ctaPrimary && (
                    <Link href="/products" className="btn btn-accent">
                      {home.hero.ctaPrimary}
                    </Link>
                  )}
                  {home.hero.ctaSecondary && (
                    <Link href="/contact" className="btn btn-on-deep">
                      {home.hero.ctaSecondary}
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>

          {home.hero.image && (
            <div className="relative md:col-span-5 [--hanger-w:8rem] sm:[--hanger-w:9rem]">
              <div aria-hidden="true" className="rail-line -left-[var(--gutter)] -right-[50vw] md:-left-6" />
              <div className="relative flex items-start justify-center gap-3">
                <div aria-hidden="true" className="mt-[calc((var(--hanger-w)_-_5.5rem)_*_0.075)] hidden opacity-80 lg:block">
                  <Hanger className="[--hanger-w:5.5rem]" />
                </div>
                <div className="garment hero-garment w-[min(19rem,64vw)] shrink-0 md:w-[min(19rem,100%)]">
                  <Hanger className="mx-auto" />
                  <div className="frame-sm -mt-1.5 aspect-[4/5] bg-surface-deep-raised shadow-lift">
                    <StoreImage src={home.hero.image} alt="" priority sizes="(min-width: 768px) 19rem, 64vw" maxWidth={900} fallback={<Placeholder tone="deep" />} />
                  </div>
                </div>
                <div aria-hidden="true" className="mt-[calc((var(--hanger-w)_-_5.5rem)_*_0.075)] hidden opacity-80 lg:block">
                  <Hanger className="[--hanger-w:5.5rem]" />
                </div>
              </div>
            </div>
          )}
        </div>
        <Stripes />
      </section>

      {(racks.length > 0 || catalog.isLoading) && (
        <section aria-labelledby={home.categories.title ? 'home-dividers' : undefined} className="page pt-14">
          {(home.categories.title || home.categories.subtitle) && (
            <div className="mb-6 max-w-2xl">
              {home.categories.title && (
                <h2 id="home-dividers" className="text-[clamp(2rem,4.5vw,3rem)] text-heading">
                  {home.categories.title}
                </h2>
              )}
              {home.categories.subtitle && <p className="mt-2 text-lg text-ink-soft">{home.categories.subtitle}</p>}
            </div>
          )}
          {catalog.isLoading ? (
            <div aria-hidden="true" className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="skeleton aspect-square w-[var(--disc-w)] shrink-0 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="relative">
              <div aria-hidden="true" className="disc-rail -inset-x-[var(--gutter)]" />
              <ul className="relative -mx-[var(--gutter)] flex snap-x scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] pb-2 pt-0.5 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden">
                {racks.map((category, index) => (
                  <li key={category.id} className="shrink-0 snap-start">
                    <CategoryDisc category={category} count={counts.get(category.id) ?? 0} index={index} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section aria-labelledby={home.featured.title ? 'home-rack' : undefined} className="page pt-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {home.featured.badge && <p className="mb-2 font-bold text-accent-text">{home.featured.badge}</p>}
            {home.featured.title && (
              <h2 id="home-rack" className="text-[clamp(2rem,4.5vw,3rem)] text-heading">
                {home.featured.title}
              </h2>
            )}
            {home.featured.subtitle && <p className="mt-2 text-lg text-ink-soft">{home.featured.subtitle}</p>}
          </div>
          {catalog.items.length > 0 && (
            <Link href="/products" className="btn btn-quiet">
              {t('catalog.viewAll')}
            </Link>
          )}
        </div>
        {catalog.isLoading ? (
          <div className="grid grid-cols-2 gap-[var(--rack-gap)] sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <GarmentSkeleton key={i} />
            ))}
          </div>
        ) : catalog.isError ? (
          <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
        ) : featured.length === 0 ? (
          <p className="sewn p-6 text-ink-soft">{t('catalog.empty.store')}</p>
        ) : (
          <Rack label={home.featured.title ?? t('catalog.title')}>
            {featured.map((item) => (
              <RackItem key={item.id}>
                <Garment item={item} category={categoryOf(item.categoryId)} />
              </RackItem>
            ))}
          </Rack>
        )}
      </section>

      {home.benefits.length > 0 && (
        <section className="page pt-16">
          <ul className="grid gap-4 md:grid-cols-3">
            {home.benefits.map((benefit) => (
              <li key={benefit.title} className="sewn flex gap-4 px-6 py-6">
                <CmsIcon icon={benefit.icon} className="mt-1 h-6 w-6 shrink-0 text-accent-text" strokeWidth={1.8} />
                <div>
                  <h3 className="text-xl text-heading">{benefit.title}</h3>
                  {benefit.description && <p className="mt-1.5 text-ink-soft">{benefit.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(home.story.title || story.length > 0) && (
        <section className="page pt-20">
          <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-12">
            {home.story.image && (
              <div className="flex gap-3 md:col-span-6">
                <div aria-hidden="true" className="stripes-v w-4 shrink-0 rounded-full" />
                <div className="frame aspect-[4/3] flex-1 bg-surface-quiet shadow-soft">
                  <StoreImage src={home.story.image} alt="" sizes="(min-width: 768px) 45vw, 100vw" maxWidth={1280} fallback={<Placeholder />} />
                </div>
              </div>
            )}
            <div className={home.story.image ? 'md:col-span-6' : 'md:col-span-9'}>
              {home.story.title && <h2 className="text-[clamp(2rem,4.5vw,3rem)] text-heading">{home.story.title}</h2>}
              <div className="mt-4 flex max-w-[60ch] flex-col gap-3 text-lg text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link href="/about" className="btn btn-quiet mt-7">
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {(home.cta.title || home.cta.description) && (
        <section className="page pt-20">
          <div className="flex flex-col gap-6 rounded-frame bg-[color:var(--vf-mustard)] p-8 text-[color:var(--vf-ink)] md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              {home.cta.title && <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] text-[color:var(--vf-chocolate)]">{home.cta.title}</h2>}
              {home.cta.description && <p className="mt-2 text-lg">{home.cta.description}</p>}
            </div>
            {home.cta.buttonText && (
              <Link href="/contact" className="btn btn-strong shrink-0">
                {home.cta.buttonText}
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
