import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, selectItemCount } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useLenis } from '@/providers/LenisProvider';
import '@/styles/components/navbar.scss';

const NAV_LINKS = [
  { to: '/',         label: 'Start',    end: true  },
  { to: '/catalog',  label: 'Sklep',    end: false },
  { to: '/wishlist', label: 'Ulubione', end: false },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const location = useLocation();

  const { openDrawer }  = useCartStore();
  const itemCount       = useCartStore(selectItemCount);
  const { openSearch }  = useUiStore();
  const wishlistCount   = useWishlistStore((s) => s.items.length);

  const lenis = useLenis();

  const isHome     = location.pathname === '/';
  const onDarkHero = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    setMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      if (lenis) { lenis.scrollTo(0, { duration: 1.2 }); }
      else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }
  }, [isHome, lenis]);

  const cls = [
    'navbar',
    scrolled   && 'navbar--scrolled',
    onDarkHero && 'navbar--on-dark',
  ].filter(Boolean).join(' ');

  return (
    <header className={cls} role="banner">
      <div className="navbar__inner">

        {/* LEFT — desktop nav / mobile burger */}
        <div className="navbar__left">
          <nav className="navbar__nav" aria-label="Główna nawigacja">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
              >
                {link.label}
                {link.to === '/wishlist' && wishlistCount > 0 && (
                  <span className="navbar__wishlist-count">{wishlistCount}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            className={`navbar__burger${menuOpen ? ' navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={menuOpen}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        {/* CENTER — logo */}
        <Link to="/" className="navbar__logo" onClick={handleLogoClick}>
          <div className="navbar__logo-mark" aria-hidden="true">FS</div>
          <span className="navbar__logo-text">FancyShop</span>
        </Link>

        {/* RIGHT — actions */}
        <div className="navbar__right">
          <button
            className="navbar__action-btn"
            onClick={openSearch}
            aria-label="Szukaj produktów"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <button
            className="navbar__action-btn"
            onClick={openDrawer}
            aria-label={`Koszyk${itemCount > 0 ? ` — ${itemCount} produktów` : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <AnimatePresence mode="wait">
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  className="badge"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1,   opacity: 1 }}
                  exit={{    scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.18, ease: EASE }}
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="navbar__mobile-menu"
            aria-label="Menu mobilne"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {link.to === '/wishlist' && wishlistCount > 0 && (
                  <span className="navbar__wishlist-count">{wishlistCount}</span>
                )}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
