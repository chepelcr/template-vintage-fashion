import * as Dialog from '@radix-ui/react-dialog';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart, useCartTotals, useIsDemo, useStore, useStoreName } from '@/core';
import { useI18n } from '@/i18n';
import { BASKET_EVENT } from './AddToCart';
import { ThemeToggle } from './ThemeToggle';

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
  const name = useStoreName();
  const logo = theme?.logoUrl ?? organization?.logoUrl ?? null;
  if (!name) return <span aria-hidden="true" className="skeleton block h-8 w-24 max-w-full" />;
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      {logo ? <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" /> : <ButtonMark className="h-8 w-8 shrink-0" />}
      <span className="font-display text-base sm:text-xl min-w-0 flex-1 break-words [overflow-wrap:anywhere] leading-tight">{name}</span>
    </span>
  );
}

export function Header() {
  const { t, plural } = useI18n();
  const name = useStoreName();
  const isDemo = useIsDemo();
  const { count } = useCartTotals();
  const openCart = useCart((s) => s.open);
  const isActive = useIsActive();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [adds, setAdds] = useState(0);

  useEffect(() => {
    const onAdded = () => setAdds((n) => n + 1);
    window.addEventListener(BASKET_EVENT, onAdded);
    return () => window.removeEventListener(BASKET_EVENT, onAdded);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header ref={headerRef} className="relative z-30 bg-surface">
      {isDemo && <p className="bg-[color:var(--vf-mustard)] px-4 py-1.5 text-center text-xs font-semibold text-[color:var(--vf-ink)] sm:text-sm">{t('demo.notice')}</p>}
      <div className="page flex min-h-14 items-center gap-1.5 sm:min-h-16 sm:gap-2 py-1">
        <Link href="/" title={name || undefined} aria-label={name || undefined} className="flex min-h-tap items-center min-w-0 flex-1 rounded-full pr-1 text-heading lg:flex-initial lg:max-w-[16rem]">
          <StoreMark />
        </Link>

        <nav aria-label={t('nav.primary')} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className="nav-link flex min-h-tap items-center rounded-full px-3 text-base font-bold text-ink-soft transition-colors hover:text-heading aria-[current=page]:text-heading"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />

        <button type="button" onClick={openCart} className="btn btn-strong shrink-0 !gap-1.5 !px-2 sm:!px-3">
          <ShoppingBag key={adds} aria-hidden="true" className={`h-5 w-5 ${adds ? 'basket-settle' : ''}`} />
          <span className="hidden sm:inline">{t('nav.cart')}</span>
          <span aria-hidden="true" className="grid h-6 min-w-6 place-items-center rounded-full bg-[color:var(--vf-mustard)] px-1.5 text-sm font-bold tabular-nums text-[color:var(--vf-ink)]">
            {count}
          </span>
          <span className="sr-only">{plural('nav.cart.count', count)}</span>
        </button>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="icon-btn shrink-0 text-heading hover:bg-surface-quiet lg:hidden" aria-label={t('nav.menu')}>
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal container={headerRef.current}>
            <Dialog.Overlay className="overlay fixed inset-0 z-40 bg-[color:var(--scrim)]" />
            <Dialog.Content className="nav-menu fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto overscroll-contain rounded-b-2xl bg-surface pb-[max(.75rem,env(safe-area-inset-bottom))] text-ink shadow-lift">
              <div aria-hidden="true" className="stripes h-3 w-full" />
              <div className="px-4 pt-[env(safe-area-inset-top)]">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl text-heading">{t('nav.menu')}</Dialog.Title>
                  <Dialog.Description className="sr-only">{t('nav.primary')}</Dialog.Description>
                  <Dialog.Close className="icon-btn -mr-2 text-heading hover:bg-surface-quiet" aria-label={t('nav.close')}>
                    <X aria-hidden="true" className="h-6 w-6" />
                  </Dialog.Close>
                </div>
                <nav aria-label={t('nav.primary')} className="mt-1">
                  <ul className="flex flex-col divide-y divide-[color:var(--rule)]">
                    {NAV.map(({ href, key }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={isActive(href) ? 'page' : undefined}
                          className="flex min-h-tap items-center justify-between px-3 font-display text-xl text-heading aria-[current=page]:text-accent-text"
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
