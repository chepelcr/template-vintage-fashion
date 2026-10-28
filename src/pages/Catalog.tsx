import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import {
  catalogHref,
  productsContent,
  showsKindFilter,
  showsOfferFilter,
  useCatalogView,
  useCmsPage,
  usePageMeta,
  type CatalogCategory,
  type CatalogFacets,
  type CatalogItem,
  type CatalogParams,
  type ItemKind,
  type SetCatalogParams,
  type SortKey,
} from '@/core';
import { useI18n } from '@/i18n';
import { CategoryDisc } from '@/components/CategoryDisc';
import { Garment, GarmentSkeleton } from '@/components/Garment';
import { Rack, RackItem } from '@/components/Rack';
import { Sheet } from '@/components/Sheet';
import { SectionError } from '@/components/StoreStates';

const SORTS: SortKey[] = ['featured', 'newest', 'price-asc', 'price-desc', 'name'];

const chip =
  'inline-flex min-h-tap shrink-0 items-center gap-2 rounded-full px-4 font-bold text-heading shadow-[inset_0_0_0_2px_var(--rule)] transition-colors hover:shadow-[inset_0_0_0_2px_var(--heading)] aria-pressed:bg-surface-deep aria-pressed:text-ink-on-deep aria-pressed:shadow-none';

/** Type, offers and order: inline on wide screens, in a sheet on phones. */
function Refine({ params, setParams, facets, idPrefix, stacked }: { params: CatalogParams; setParams: SetCatalogParams; facets: CatalogFacets; idPrefix: string; stacked: boolean }) {
  const { t } = useI18n();
  const kinds: Array<{ value: ItemKind | null; key: string }> = [
    { value: null, key: 'catalog.kind.all' },
    { value: 'product', key: 'catalog.kind.product' },
    { value: 'service', key: 'catalog.kind.service' },
  ];
  return (
    <div className={stacked ? 'flex flex-col gap-7' : 'flex flex-wrap items-center gap-3'}>
      {showsKindFilter(facets) && (
        <div role="group" aria-labelledby={`${idPrefix}-kind`} className={stacked ? '' : 'flex items-center gap-2'}>
          <p id={`${idPrefix}-kind`} className={stacked ? 'mb-2 text-sm font-bold text-heading' : 'sr-only'}>
            {t('catalog.kind')}
          </p>
          <div className="flex flex-wrap gap-2">
            {kinds.map(({ value, key }) => (
              <button key={key} type="button" aria-pressed={params.kind === value} className={chip} onClick={() => setParams({ kind: value })}>
                {t(key)}
              </button>
            ))}
          </div>
        </div>
      )}
      {showsOfferFilter(facets) && (
        <label className="inline-flex min-h-tap cursor-pointer items-center gap-3 font-bold text-heading">
          <input type="checkbox" className="h-5 w-5 accent-[color:var(--vf-rust)]" checked={params.sale} onChange={(e) => setParams({ sale: e.target.checked })} />
          {t('catalog.offers')}
        </label>
      )}
      <div className={stacked ? '' : 'ml-auto'}>
        <label htmlFor={`${idPrefix}-sort`} className={stacked ? 'mb-2 block text-sm font-bold text-heading' : 'sr-only'}>
          {t('catalog.sort')}
        </label>
        <select id={`${idPrefix}-sort`} className={`field ${stacked ? '' : 'w-auto min-w-[13rem]'}`} value={params.sort} onChange={(e) => setParams({ sort: e.target.value as SortKey })}>
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {t(`catalog.sort.${s}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function RackGrid({ items, categoryOf }: { items: CatalogItem[]; categoryOf: (id: string | null) => CatalogCategory | undefined }) {
  return (
    <ul className="rack-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <li key={item.id}>
          <Garment item={item} category={categoryOf(item.categoryId)} sizes="(min-width: 1280px) 15rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw" />
        </li>
      ))}
    </ul>
  );
}

export default function Catalog() {
  const { t, plural } = useI18n();
  const cms = useCmsPage('products');
  const content = productsContent(cms.page);
  usePageMeta(cms.page?.title ?? t('catalog.title'), cms.page?.metaDescription);
  const { catalog, params, setParams, query, setQuery, facets, categories, results, active, grouped, selected, uncategorized, categoryOf, clearAll } =
    useCatalogView();
  const [refineOpen, setRefineOpen] = useState(false);
  const refinable = showsKindFilter(facets) || showsOfferFilter(facets) || catalog.items.length > 1;

  return (
    <>
      <div className="page pt-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 max-w-full md:max-w-3xl">
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-3">
                <div className="skeleton h-14 w-72 max-w-full" />
                <div className="skeleton h-5 w-96 max-w-full" />
              </div>
            ) : (
              <>
                <h1 className="text-[clamp(2.5rem,6.5vw,4.5rem)] text-heading">{content.hero.title ?? t('catalog.title')}</h1>
                {content.hero.subtitle && <p className="mt-3 text-lg text-ink-soft">{content.hero.subtitle}</p>}
              </>
            )}
          </div>
          <p aria-live="polite" className="font-bold text-heading">
            {catalog.isLoading ? t('state.loading') : plural('catalog.results', results.length)}
            {selected && <span className="font-normal text-ink-soft"> · {selected.name}</span>}
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex gap-3">
            <label htmlFor="catalog-search" className="sr-only">
              {t('catalog.search')}
            </label>
            <div className="relative min-w-0 flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input id="catalog-search" type="search" className="field rounded-full pl-11" placeholder={t('catalog.search.placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {refinable && (
              <button type="button" className="btn btn-strong px-4 md:hidden" onClick={() => setRefineOpen(true)}>
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                {t('catalog.filters')}
              </button>
            )}
          </div>
          <div className="hidden md:block">
            <Refine params={params} setParams={setParams} facets={facets} idPrefix="bar" stacked={false} />
          </div>
          {categories.length > 1 && (
            <div role="group" aria-label={t('catalog.category')} className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              <button type="button" aria-pressed={!params.category} className={chip} onClick={() => setParams({ category: null })}>
                {t('catalog.category.all')}
                <span className="tabular-nums opacity-70">{facets.total}</span>
              </button>
              {categories.map((c) => (
                <button key={c.id} type="button" aria-pressed={params.category === c.key} className={chip} onClick={() => setParams({ category: c.key })}>
                  {c.name}
                  <span className="tabular-nums opacity-70">{facets.categories.get(c.id) ?? 0}</span>
                </button>
              ))}
            </div>
          )}
          {active && (
            <button type="button" className="btn btn-quiet w-fit px-4 text-sm" onClick={clearAll}>
              <X aria-hidden="true" className="h-4 w-4" />
              {t('catalog.filters.clear')}
            </button>
          )}
        </div>

        {selected?.description && !grouped && <p className="mt-6 max-w-2xl text-lg text-ink-soft">{selected.description}</p>}

        <div className="mt-10">
          {catalog.isLoading ? (
            <div className="grid grid-cols-2 gap-x-[var(--rack-gap)] gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => (
                <GarmentSkeleton key={i} />
              ))}
            </div>
          ) : catalog.isError ? (
            <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
          ) : catalog.items.length === 0 ? (
            <p className="sewn p-6 text-ink-soft">{t('catalog.empty.store')}</p>
          ) : results.length === 0 ? (
            <div className="sewn flex flex-col items-start gap-3 p-8">
              <p className="font-display text-2xl text-heading">{t('catalog.empty.title')}</p>
              <p className="text-ink-soft">{t('catalog.empty.body')}</p>
              <button type="button" className="btn btn-strong mt-2" onClick={clearAll}>
                {t('catalog.filters.clear')}
              </button>
            </div>
          ) : grouped ? (
            <div className="flex flex-col gap-14">
              {categories.map((category, index) => {
                const items = results.filter((i) => i.categoryId === category.id);
                if (!items.length) return null;
                return (
                  <section key={category.id} aria-labelledby={`rack-${category.id}`}>
                    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                      <div className="flex min-w-0 flex-1 basis-[18rem] items-center gap-4">
                        <CategoryDisc category={category} index={index} size="sm" />
                        <div className="min-w-0">
                          <h2 id={`rack-${category.id}`} className="text-[clamp(1.6rem,3.5vw,2.25rem)] text-heading">
                            {category.name}
                          </h2>
                          {category.description && <p className="text-ink-soft">{category.description}</p>}
                        </div>
                      </div>
                      {items.length > 1 && (
                        <Link href={catalogHref({ category: category.key })} className="btn btn-quiet px-4 text-sm">
                          {t('catalog.inCategory', { category: category.name })}
                        </Link>
                      )}
                    </div>
                    <Rack label={category.name}>
                      {items.map((item) => (
                        <RackItem key={item.id}>
                          <Garment item={item} />
                        </RackItem>
                      ))}
                    </Rack>
                  </section>
                );
              })}
              {uncategorized.length > 0 && <RackGrid items={uncategorized} categoryOf={categoryOf} />}
            </div>
          ) : (
            <RackGrid items={results} categoryOf={selected ? () => undefined : categoryOf} />
          )}
        </div>
      </div>

      <Sheet
        open={refineOpen}
        onOpenChange={setRefineOpen}
        title={t('catalog.filters')}
        footer={
          <button type="button" className="btn btn-accent w-full" onClick={() => setRefineOpen(false)}>
            {plural('catalog.filters.show', results.length)}
          </button>
        }
      >
        <Refine params={params} setParams={setParams} facets={facets} idPrefix="sheet" stacked />
      </Sheet>
    </>
  );
}
