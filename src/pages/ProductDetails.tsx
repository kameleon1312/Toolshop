import { useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUiStore } from '@/store/uiStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { ProductCard } from '@/components/product/ProductCard';
import { BuyBar } from '@/components/product/BuyBar';
import { RecentlyViewed } from '@/components/sections/RecentlyViewed';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { formatPrice, capitalize } from '@/utils/format';
import '@/styles/pages/product-details.scss';

const CATEGORY_LABELS: Record<string, string> = {
  electronics:        'Elektronika',
  jewelery:           'Biżuteria',
  "men's clothing":   'Odzież męska',
  "women's clothing": 'Odzież damska',
};

function StarRating({ rate }: { rate: number }) {
  const filled = Math.round(rate);
  return (
    <div className="product-details__rating-stars" aria-label={`Ocena ${rate.toFixed(1)} na 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`star${i < filled ? ' star--filled' : ''}`} aria-hidden="true">★</span>
      ))}
    </div>
  );
}

export function ProductDetails() {
  const actionsRef = useRef<HTMLDivElement>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams<{ id: string }>();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add);
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: all = [] } = useProducts();
  const { addItem, openDrawer } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const addToast = useUiStore((s) => s.addToast);

  const related = product
    ? all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  const inWishlist = product ? has(product.id) : false;

  const handleAdd = () => {
    if (!product || addedToCart) return;
    addItem(product);
    addToast('Dodano do koszyka');
    setAddedToCart(true);
    setTimeout(() => { setAddedToCart(false); openDrawer(); }, 1200);
  };

  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [product?.id]);

  const handleWishlist = () => {
    if (!product) return;
    toggle(product);
    addToast(inWishlist ? 'Usunięto z ulubionych' : 'Dodano do ulubionych', inWishlist ? 'info' : 'success');
  };

  if (isError) {
    return (
      <PageWrapper>
        <div className="product-details">
          <div className="product-details__inner">
            <div className="product-details__not-found">
              <h2>Produkt nie istnieje</h2>
              <p>Nie znaleźliśmy produktu o podanym ID.</p>
              <Link to="/catalog" className="btn-primary">Wróć do katalogu</Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const catLabel = product ? (CATEGORY_LABELS[product.category] ?? capitalize(product.category)) : '';

  return (
    <PageWrapper>
      <div className="product-details">
        <div className="product-details__inner">
          <nav className="product-details__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Start</Link>
            <span aria-hidden="true">/</span>
            <Link to="/catalog">Sklep</Link>
            {product && (
              <>
                <span aria-hidden="true">/</span>
                <Link to={`/category/${encodeURIComponent(product.category)}`}>
                  {catLabel}
                </Link>
                <span aria-hidden="true">/</span>
                <span style={{ color: 'var(--color-text-1)' }}>
                  {product.name.slice(0, 32)}…
                </span>
              </>
            )}
          </nav>

          <div className="product-details__layout">
            <motion.div
              className="product-details__image"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {isLoading ? (
                <Skeleton width="100%" height="100%" />
              ) : (
                <img src={product!.image} alt={product!.name} loading="eager" />
              )}
            </motion.div>

            <motion.div
              className="product-details__info"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {isLoading ? (
                <>
                  <Skeleton variant="text"  width="40%" height={12} style={{ marginBottom: 12 }} />
                  <Skeleton variant="title" width="85%" height={32} style={{ marginBottom: 8 }} />
                  <Skeleton variant="title" width="60%" height={32} style={{ marginBottom: 20 }} />
                  <Skeleton variant="text"  width="55%" height={12} style={{ marginBottom: 16 }} />
                  <Skeleton variant="text"  width="100%" height={12} style={{ marginBottom: 8 }} />
                  <Skeleton variant="text"  width="90%"  height={12} style={{ marginBottom: 8 }} />
                  <Skeleton variant="text"  width="70%"  height={12} style={{ marginBottom: 28 }} />
                  <Skeleton height={44} style={{ borderRadius: 999 }} />
                </>
              ) : (
                <>
                  <p className="product-details__category">{catLabel}</p>
                  <h1 className="product-details__name">{product!.name}</h1>

                  {product!.rating && (
                    <div className="product-details__rating">
                      <StarRating rate={product!.rating.rate} />
                      <span>{product!.rating.rate.toFixed(1)}</span>
                      <span>({product!.rating.count} opinii)</span>
                    </div>
                  )}

                  <p className="product-details__price">
                    {formatPrice(product!.price)}
                    <small>USD</small>
                  </p>

                  <hr className="product-details__rule" />

                  <p className="product-details__description">{product!.description}</p>

                  <div ref={actionsRef} className="product-details__actions">
                    <motion.button
                      className={`btn-primary product-details__add-btn${addedToCart ? ' product-details__add-btn--added' : ''}`}
                      onClick={handleAdd}
                      whileTap={{ scale: 0.97 }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {addedToCart ? (
                          <motion.span key="added" style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                            Dodano!
                          </motion.span>
                        ) : (
                          <motion.span key="add"
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                          >
                            Dodaj do koszyka
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <motion.button
                      className={`btn-ghost product-details__wish-btn${inWishlist ? ' product-details__wish-btn--active' : ''}`}
                      onClick={handleWishlist}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                      {inWishlist ? 'W ulubionych' : 'Ulubione'}
                    </motion.button>
                  </div>

                  <div className="product-details__meta">
                    <div className="product-details__meta-row">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      <span>Bezpłatna dostawa od 200 zł</span>
                    </div>
                    <div className="product-details__meta-row">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      <span>Zwrot w ciągu 30 dni</span>
                    </div>
                    <div className="product-details__meta-row">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <span>Bezpieczne płatności SSL</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          <RecentlyViewed excludeId={id} />

          {related.length > 0 && (
            <motion.section
              className="product-details__related"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="product-details__related-header">
                <p className="eyebrow">Może cię zainteresować</p>
                <h2 className="section-title">Powiązane produkty</h2>
              </div>
              <div className="product-details__related-grid">
                {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      {product && (
        <BuyBar
          product={product}
          actionsRef={actionsRef}
          inWishlist={inWishlist}
          onAdd={handleAdd}
          onWishlist={handleWishlist}
        />
      )}
    </PageWrapper>
  );
}
