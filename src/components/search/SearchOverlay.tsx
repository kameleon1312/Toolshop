import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '@/store/uiStore';
import { useProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { formatPrice } from '@/utils/format';
import '@/styles/ui/search-overlay.scss';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const QUICK_LINKS = [
  { label: 'Elektronika',   to: '/category/electronics' },
  { label: 'Biżuteria',     to: '/category/jewelery' },
  { label: 'Odzież damska', to: "/category/women's%20clothing" },
  { label: 'Odzież męska',  to: "/category/men's%20clothing" },
];

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery]         = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const debouncedQuery            = useDebounce(query, 180);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const navigate                  = useNavigate();
  const { data: products = [] }   = useProducts();

  const results = debouncedQuery.length > 1
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  useEffect(() => { setActiveIdx(-1); }, [results]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter' && activeIdx >= 0) {
        e.preventDefault();
        navigate(`/product/${results[activeIdx].id}`);
        onClose();
      } else if (e.key === 'Enter' && query.length > 1) {
        navigate(`/catalog?q=${encodeURIComponent(query)}`);
        onClose();
      }
    },
    [activeIdx, results, query, navigate, onClose],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); onClose(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const hasResults = results.length > 0;
  const isEmpty    = debouncedQuery.length > 1 && !hasResults;

  return (
    <motion.div
      className="search-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Wyszukiwarka"
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,   scale: 1     }}
      exit={{    opacity: 0, y: -10, scale: 0.97  }}
      transition={{ duration: 0.22, ease: EASE }}
    >
      {/* Input row */}
      <div className="search-panel__input-row">
        <svg className="search-panel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          className="search-panel__input"
          placeholder="Szukaj produktów, kategorii..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          aria-label="Pole wyszukiwania"
          aria-autocomplete="list"
        />
        {query && (
          <button className="search-panel__clear" onClick={() => setQuery('')} aria-label="Wyczyść">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
        <kbd className="search-panel__kbd">Esc</kbd>
      </div>

      {/* Body */}
      <div className="search-panel__body" role="listbox">

        {/* Quick categories — shown when idle */}
        {debouncedQuery.length <= 1 && (
          <div className="search-panel__quick">
            <p className="search-panel__label">Kategorie</p>
            <div className="search-panel__chips">
              {QUICK_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="search-panel__chip" onClick={onClose}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {isEmpty && (
          <p className="search-panel__empty">
            Brak wyników dla &ldquo;<strong>{debouncedQuery}</strong>&rdquo;
          </p>
        )}

        {/* Results list */}
        {hasResults && results.map((p, i) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className={`search-panel__item${i === activeIdx ? ' search-panel__item--active' : ''}`}
            onClick={onClose}
            role="option"
            aria-selected={i === activeIdx}
          >
            <div className="search-panel__item-img">
              <img src={p.image} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="search-panel__item-info">
              <p className="search-panel__item-name">{p.name}</p>
              <p className="search-panel__item-cat">{p.category}</p>
            </div>
            <span className="search-panel__item-price">{formatPrice(p.price)}</span>
          </Link>
        ))}

        {/* View-all footer */}
        {hasResults && (
          <Link
            to={`/catalog?q=${encodeURIComponent(debouncedQuery)}`}
            className="search-panel__view-all"
            onClick={onClose}
          >
            Pokaż wszystkie wyniki dla &ldquo;{debouncedQuery}&rdquo;
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>

      {/* Keyboard hints */}
      <div className="search-panel__hints" aria-hidden="true">
        <span><kbd>↑↓</kbd> nawiguj</span>
        <span><kbd>↵</kbd> otwórz</span>
        <span><kbd>Esc</kbd> zamknij</span>
      </div>
    </motion.div>
  );
}

export function SearchOverlay() {
  const { searchOpen, closeSearch, openSearch } = useUiStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!searchOpen) openSearch();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen, openSearch]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="search-overlay__backdrop" onClick={closeSearch} aria-hidden="true" />
          <div className="search-overlay__wrap">
            <SearchPanel key="panel" onClose={closeSearch} />
            <button
              className="search-overlay__close"
              onClick={closeSearch}
              aria-label="Zamknij wyszukiwarkę"
            >
              Zamknij
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
