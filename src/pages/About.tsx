import { aboutContent, paragraphs, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CmsIcon } from '@/components/CmsIcon';
import { Placeholder } from '@/components/Placeholder';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';
import { Stripes } from '@/components/Stripes';

export default function About() {
  const { t } = useI18n();
  const cms = useCmsPage('about');
  const about = aboutContent(cms.page);
  usePageMeta(cms.page?.title ?? t('nav.about'), cms.page?.metaDescription);
  const story = paragraphs(about.story.content);

  return (
    <>
      <section className="on-deep bg-surface-deep text-ink-on-deep">
        <div className="page grid gap-10 py-12 md:grid-cols-12 md:items-center md:py-16">
          <div className={about.hero.image ? 'md:col-span-6' : 'md:col-span-10'}>
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-3">
                <div className="skeleton-deep h-14 w-64" />
                <div className="skeleton-deep h-5 w-80 max-w-full" />
              </div>
            ) : cms.isError ? (
              <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
            ) : (
              <>
                <h1 className="text-[clamp(2.6rem,7vw,4.75rem)]">{about.hero.title ?? t('nav.about')}</h1>
                {about.hero.subtitle && <p className="mt-5 max-w-xl text-lg text-ink-on-deep-soft">{about.hero.subtitle}</p>}
              </>
            )}
          </div>
          {about.hero.image && (
            <div className="frame aspect-[4/3] bg-surface-deep-raised md:col-span-6">
              <StoreImage src={about.hero.image} alt="" priority sizes="(min-width: 768px) 45vw, 100vw" maxWidth={1280} fallback={<Placeholder tone="deep" />} />
            </div>
          )}
        </div>
        <Stripes />
      </section>

      <div className="page">
        {(about.story.title || story.length > 0) && (
          <section className="grid gap-10 pt-16 md:grid-cols-12 md:items-center">
            <div className={about.story.image ? 'md:col-span-7' : 'md:col-span-9'}>
              {about.story.title && <h2 className="text-[clamp(2rem,4.5vw,3rem)] text-heading">{about.story.title}</h2>}
              <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-lg text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            {about.story.image && (
              <div className="flex gap-3 md:col-span-5">
                <div className="frame aspect-[4/5] flex-1 bg-surface-quiet shadow-soft">
                  <StoreImage src={about.story.image} alt="" sizes="(min-width: 768px) 35vw, 100vw" maxWidth={960} fallback={<Placeholder />} />
                </div>
                <div aria-hidden="true" className="stripes-v w-4 shrink-0 rounded-full" />
              </div>
            )}
          </section>
        )}

        {about.values.items.length > 0 && (
          <section className="pt-16">
            {about.values.title && <h2 className="mb-6 text-[clamp(2rem,4.5vw,3rem)] text-heading">{about.values.title}</h2>}
            <ul className="grid gap-4 md:grid-cols-3">
              {about.values.items.map((value) => (
                <li key={value.title} className="sewn flex flex-col gap-3 px-6 py-6">
                  <CmsIcon icon={value.icon} className="h-6 w-6 text-accent-text" strokeWidth={1.8} />
                  <h3 className="text-xl text-heading">{value.title}</h3>
                  {value.description && <p className="text-ink-soft">{value.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
