import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { FilterSheet } from '@/components/catalog/FilterSheet';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { capitalize } from '@/utils/format';
import type { SortOption } from '@/types';
import '@/styles/pages/catalog.scss';

const CATEGORY_LABELS: Record<string, string> = {
  electronics:        'Elektronika',
  jewelery:           'Biżuteria',
  "men's clothing":   'Odzież męska',
  "women's clothing": 'Odzież damska',
};

export function Catalog() {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categoryName ? decodeURIComponent(categoryName) : null
  );
  const [sortBy, setSortBy]         = useState<SortOption>('default');
  const [maxPrice, setMaxPrice]     = useState<number>(Infinity);
  const [sheetOpen, setSheetOpen]   = useState(false);

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] }           = useCategories();

  const priceMax = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price), 0)),
    [products]
  );

  const filtered = useMemo(() => {
    let list = activeCategory
      ? products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase())
      : [...products];

    if (maxPrice !== Infinity) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    switch (sortBy) {
      case 'price-asc':  list = list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list = list.sort((a, b) => b.rating.rate - a.rating.rate); break;
      case 'name':       list = list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return list;
  }, [products, activeCategory, sortBy, maxPrice]);

  const activeFilterCount =
    (activeCategory ? 1 : 0) +
    (maxPrice !== Infinity ? 1 : 0) +
    (sortBy !== 'default' ? 1 : 0);

  const handleReset = () => {
    setActiveCategory(null);
    setMaxPrice(Infinity);
    setSortBy('default');
  };

  const pageTitle = activeCategory
    ? (CATEGORY_LABELS[activeCategory] ?? capitalize(activeCategory))
    : 'Cały katalog';

  return (
    <PageWrapper>
      <div className="catalog">
        <div className="catalog__inner">
          <motion.div
            className="catalog__header"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow">Sklep</p>
            <h1>{pageTitle}</h1>
            {activeCategory && (
              <p>Produkty z kategorii &ldquo;{CATEGORY_LABELS[activeCategory] ?? activeCategory}&rdquo;</p>
            )}
          </motion.div>

          <div className="catalog__controls">

            {/* Desktop: category pills */}
            <div className="catalog__filters">
              <button
                className={`catalog__filter-btn${!activeCategory ? ' catalog__filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(null)}
              >
                Wszystkie
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`catalog__filter-btn${activeCategory === cat ? ' catalog__filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {CATEGORY_LABELS[cat] ?? capitalize(cat)}
                </button>
              ))}
            </div>

            {/* Mobile: filter sheet trigger */}
            <button
              className={`catalog__filter-trigger${activeFilterCount > 0 ? ' catalog__filter-trigger--active' : ''}`}
              onClick={() => setSheetOpen(true)}
              aria-label={`Otwórz filtry${activeFilterCount > 0 ? ` — ${activeFilterCount} aktywnych` : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" y1="6"  x2="20" y2="6"  />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filtry
              {activeFilterCount > 0 && (
                <span className="catalog__filter-badge">{activeFilterCount}</span>
              )}
            </button>

            {/* Sort — desktop only (mobile uses sheet) */}
            <div className="catalog__sort">
              <label htmlFor="sort-select">Sortuj:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="default">Domyślnie</option>
                <option value="price-asc">Cena rosnąco</option>
                <option value="price-desc">Cena malejąco</option>
                <option value="rating">Ocena</option>
                <option value="name">Nazwa A–Z</option>
              </select>
            </div>

            {/* Price range — desktop only (mobile uses sheet) */}
            {!isLoading && priceMax > 0 && (
              <div className="catalog__price-filter">
                <label htmlFor="price-range" className="catalog__price-label">
                  Max: <strong>
                    {maxPrice === Infinity ? `${priceMax} $` : `${maxPrice} $`}
                  </strong>
                </label>
                <input
                  id="price-range"
                  type="range"
                  className="catalog__price-range"
                  min={0}
                  max={priceMax}
                  step={5}
                  value={maxPrice === Infinity ? priceMax : maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaxPrice(val >= priceMax ? Infinity : val);
                  }}
                />
              </div>
            )}

            {!isLoading && (
              <span className="catalog__count">{filtered.length} prod.</span>
            )}
          </div>

          <div className="catalog__grid">
            {isLoading
              ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
              : filtered.length === 0
              ? (
                <div className="catalog__empty">
                  <p>Brak produktów spełniających kryteria.</p>
                  <button className="btn-ghost" onClick={handleReset}>
                    Resetuj filtry
                  </button>
                </div>
              )
              : filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        </div>
      </div>

      <FilterSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        priceMax={priceMax}
        resultCount={filtered.length}
        activeFilterCount={activeFilterCount}
        onReset={handleReset}
      />
    </PageWrapper>
  );
}
