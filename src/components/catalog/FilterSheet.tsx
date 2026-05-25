import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { capitalize } from '@/utils/format';
import type { SortOption } from '@/types';
import '@/styles/components/filter-sheet.scss';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CATEGORY_LABELS: Record<string, string> = {
  electronics:        'Elektronika',
  jewelery:           'Biżuteria',
  "men's clothing":   'Odzież męska',
  "women's clothing": 'Odzież damska',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default',    label: 'Domyślnie'      },
  { value: 'price-asc',  label: 'Cena rosnąco'   },
  { value: 'price-desc', label: 'Cena malejąco'  },
  { value: 'rating',     label: 'Ocena'           },
  { value: 'name',       label: 'Nazwa A–Z'       },
];

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  priceMax: number;
  resultCount: number;
  activeFilterCount: number;
  onReset: () => void;
}

export function FilterSheet({
  isOpen, onClose,
  categories, activeCategory, setActiveCategory,
  sortBy, setSortBy,
  maxPrice, setMaxPrice, priceMax,
  resultCount, activeFilterCount, onReset,
}: FilterSheetProps) {

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else         document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const displayPrice = maxPrice === Infinity ? priceMax : maxPrice;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="filter-sheet-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="filter-sheet-overlay__backdrop" onClick={onClose} aria-hidden="true" />

          <motion.div
            className="filter-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Filtry i sortowanie"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{    y: '100%' }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className="filter-sheet__handle" aria-hidden="true">
              <span />
            </div>

            <div className="filter-sheet__header">
              <p className="filter-sheet__title">
                Filtry
                {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
              </p>
              <button className="filter-sheet__close" onClick={onClose} aria-label="Zamknij filtry">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="filter-sheet__body">

              {/* Kategoria */}
              <div>
                <p className="filter-sheet__section-label">Kategoria</p>
                <div className="filter-sheet__categories">
                  <button
                    className={`filter-sheet__cat-btn${!activeCategory ? ' filter-sheet__cat-btn--active' : ''}`}
                    onClick={() => setActiveCategory(null)}
                  >
                    Wszystkie
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`filter-sheet__cat-btn${activeCategory === cat ? ' filter-sheet__cat-btn--active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {CATEGORY_LABELS[cat] ?? capitalize(cat)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sortowanie */}
              <div>
                <p className="filter-sheet__section-label">Sortowanie</p>
                <div className="filter-sheet__sort-options">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`filter-sheet__sort-btn${sortBy === opt.value ? ' filter-sheet__sort-btn--active' : ''}`}
                      onClick={() => setSortBy(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cena */}
              {priceMax > 0 && (
                <div>
                  <div className="filter-sheet__price-row">
                    <p className="filter-sheet__section-label" style={{ marginBottom: 0 }}>Cena maksymalna</p>
                    <span className="filter-sheet__price-value">{displayPrice} $</span>
                  </div>
                  <input
                    type="range"
                    className="filter-sheet__range"
                    min={0}
                    max={priceMax}
                    step={5}
                    value={displayPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMaxPrice(val >= priceMax ? Infinity : val);
                    }}
                    aria-label="Maksymalna cena"
                  />
                </div>
              )}

            </div>

            <div className="filter-sheet__footer">
              <button className="filter-sheet__reset" onClick={onReset}>
                Resetuj
              </button>
              <button className="filter-sheet__apply" onClick={onClose}>
                Pokaż {resultCount} produktów
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
