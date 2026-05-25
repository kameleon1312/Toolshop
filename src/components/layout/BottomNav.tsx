import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, selectItemCount } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUiStore } from '@/store/uiStore';
import '@/styles/components/bottom-nav.scss';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function BottomNav() {
  const itemCount    = useCartStore(selectItemCount);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { openSearch, searchOpen } = useUiStore();

  const location = useLocation();
  const isCatalogActive =
    location.pathname === '/catalog' || location.pathname.startsWith('/category/');

  return (
    <nav className="bottom-nav" aria-label="Nawigacja główna">
      <div className="bottom-nav__bar">

        {/* Dom */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
          aria-label="Strona główna"
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span className="bottom-nav__label">Dom</span>
        </NavLink>

        {/* Sklep */}
        <NavLink
          to="/catalog"
          className={() => `bottom-nav__item${isCatalogActive ? ' active' : ''}`}
          aria-label="Sklep"
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          <span className="bottom-nav__label">Sklep</span>
        </NavLink>

        {/* Szukaj */}
        <button
          className={`bottom-nav__item${searchOpen ? ' active' : ''}`}
          onClick={openSearch}
          aria-label="Szukaj produktów"
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <span className="bottom-nav__label">Szukaj</span>
        </button>

        {/* Ulubione */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
          aria-label={`Ulubione${wishlistCount > 0 ? ` — ${wishlistCount}` : ''}`}
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <AnimatePresence mode="wait">
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  className="bottom-nav__badge"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1,   opacity: 1 }}
                  exit={{    scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.18, ease: EASE }}
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <span className="bottom-nav__label">Ulubione</span>
        </NavLink>

        {/* Koszyk */}
        <NavLink
          to="/cart"
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
          aria-label={`Koszyk${itemCount > 0 ? ` — ${itemCount}` : ''}`}
        >
          <span className="bottom-nav__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <AnimatePresence mode="wait">
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  className="bottom-nav__badge"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1,   opacity: 1 }}
                  exit={{    scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.18, ease: EASE }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <span className="bottom-nav__label">Koszyk</span>
        </NavLink>

      </div>
    </nav>
  );
}
