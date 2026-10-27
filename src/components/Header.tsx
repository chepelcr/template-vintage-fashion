import * as Dialog from '@radix-ui/react-dialog';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart, useCartTotals, useIsDemo, useStore } from '@/core';
import { useI18n } from '@/i18n';
import { BASKET_EVENT } from './AddToCart';

export const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/products', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
] as const;

export function useIsActive() {
  const [location] = useLocation();
  return (href: string) => (href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`));
}

/** The default mark when the store has no logo: a four-hole sewing button. */
export function ButtonMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <circle cx="20" cy="20" r="19" style={{ fill: 'var(--accent)' }} />
      <circle cx="20" cy="20" r="14" fill="none" strokeOpacity="0.4" strokeWidth="1.5" style={{ stroke: 'var(--accent-ink)' }} />
      {[
        [15.6, 15.6],
        [24.4, 15.6],
        [15.6, 24.4],
        [24.4, 24.4],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.3" style={{ fill: 'var(--surface)' }} />
      ))}
    </svg>
  );
}

function StoreMark() {
  const { organization, theme } = useStore();
  const logo = theme?.logoUrl ?? organization?.logoUrl ?? null;
  if (!organization) return <span aria-hidden="true" className="skeleton block h-8 w-40" />;
  return (
    <span className="flex items-center gap-3">
      {logo ? <img src={logo} alt="" className="h-10 w-10 rounded-full object-cover" /> : <ButtonMark />}
      <span className="font-display text-lg leading-none sm:text-2xl">{organization.name}</span>
    </span>
  );
}

export function Header() {
  const { t, plural } = useI18n();
  const isDemo = useIsDemo();
  const { count } = useCartTotals();
  const openCart = useCart((s) => s.open);
  const isActive = useIsActive();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adds, setAdds] = useState(0);

  useEffect(() => {
    const onAdded = () => setAdds((n) => n + 1);
    window.addEventListener(BASKET_EVENT, onAdded);
    return () => window.removeEventListener(BASKET_EVENT, onAdded);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className="relative z-30 bg-surface">
      {isDemo && <p className="bg-[color:var(--vf-mustard)] px-4 py-1.5 text-center text-xs font-semibold text-[color:var(--vf-ink)] sm:text-sm">{t('demo.notice')}</p>}
      <div className="page flex h-16 items-center gap-3 sm:h-20">
        <Link href="/" className="rounded-full py-1 pr-2 text-heading">
          <StoreMark />
        </Link>

        <nav aria-label={t('nav.primary')} className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className="nav-link flex min-h-tap items-center rounded-full px-3.5 font-bold text-ink-soft transition-colors hover:text-heading aria-[current=page]:text-heading"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" onClick={openCart} className="btn btn-strong ml-auto gap-2.5 pl-4 pr-2 md:ml-4">
          <ShoppingBag key={adds} aria-hidden="true" className={`h-5 w-5 ${adds ? 'basket-settle' : ''}`} />
          <span className="hidden sm:inline">{t('nav.cart')}</span>
          <span aria-hidden="true" className="grid h-7 min-w-[1.75rem] place-items-center rounded-full bg-[color:var(--vf-mustard)] px-1.5 text-sm font-bold tabular-nums text-[color:var(--vf-ink)]">
            {count}
          </span>
          <span className="sr-only">{plural('nav.cart.count', count)}</span>
        </button>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="icon-btn text-heading hover:bg-surface-quiet md:hidden" aria-label={t('nav.menu')}>
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="overlay fixed inset-0 z-40 bg-[color:var(--scrim)]" />
            <Dialog.Content className="sheet fixed inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-[1.5rem] bg-surface pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div aria-hidden="true" className="stripes h-3 w-full" />
              <div className="px-5 pt-4">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-2xl text-heading">{t('nav.menu')}</Dialog.Title>
                  <Dialog.Description className="sr-only">{t('nav.primary')}</Dialog.Description>
                  <Dialog.Close className="icon-btn -mr-2 text-heading hover:bg-surface-quiet" aria-label={t('nav.close')}>
                    <X aria-hidden="true" className="h-6 w-6" />
                  </Dialog.Close>
                </div>
                <nav aria-label={t('nav.primary')} className="mt-3">
                  <ul className="flex flex-col divide-y divide-[color:var(--rule)]">
                    {NAV.map(({ href, key }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          aria-current={isActive(href) ? 'page' : undefined}
                          className="flex min-h-[3.5rem] items-center justify-between font-display text-2xl text-heading aria-[current=page]:text-accent-text"
                        >
                          {t(key)}
                          {isActive(href) && <span aria-hidden="true" className="stripes h-4 w-4 rounded-full" />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
