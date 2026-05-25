import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hero } from '@/components/sections/Hero';
import { Categories } from '@/components/sections/Categories';
import { RecentlyViewed } from '@/components/sections/RecentlyViewed';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { useProducts } from '@/hooks/useProducts';
import '@/styles/pages/home.scss';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sectionAnim = {
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.6, ease: EASE },
};

export function Home() {
  const { data: products, isLoading } = useProducts();
  const featured    = products?.slice(0, 8)  ?? [];
  const featureImgs = products?.slice(8, 11) ?? [];

  return (
    <PageWrapper>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── Shop by Category ─────────────────────────────────────────── */}
      <section className="home-categories">
        <div className="home-categories__inner">
          <motion.div className="home-categories__header" {...sectionAnim}>
            <div>
              <p className="eyebrow">Przeglądaj według kategorii</p>
              <h2 className="section-title">Kategorie</h2>
            </div>
            <Link to="/catalog" className="btn-ghost">Cały katalog</Link>
          </motion.div>
          <Categories />
        </div>
      </section>

      {/* ── Feature banner ───────────────────────────────────────────── */}
      <section className="home-feature" aria-label="Polecane produkty">
        <div className="home-feature__inner">
          <motion.div
            className="home-feature__copy"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <p className="home-feature__kicker">Bestsellery sezonu</p>
            <h2 className="home-feature__title">
              Wybrane<br />Dla Ciebie.
            </h2>
            <p className="home-feature__sub">
              Ręcznie wyselekcjonowane bestsellery — od elektroniki
              po biżuterię i odzież premium.
            </p>
            <Link to="/catalog" className="home-feature__btn">
              Odkryj teraz
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {featureImgs.length > 0 && (
            <motion.div
              className="home-feature__visual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              aria-hidden="true"
            >
              {featureImgs.map((p) => (
                <div key={p.id} className="home-feature__visual-item">
                  <img src={p.image} alt="" loading="lazy" decoding="async" />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Featured grid ────────────────────────────────────────────── */}
      <section className="home-featured">
        <div className="home-featured__inner">
          <motion.div className="home-featured__header" {...sectionAnim}>
            <div>
              <p className="eyebrow">Polecane</p>
              <h2 className="section-title">Wybrane produkty</h2>
            </div>
            <Link to="/catalog" className="btn-ghost">Wszystkie</Link>
          </motion.div>

          <div className="home-featured__grid">
            {isLoading
              ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        </div>
      </section>

      {/* ── Recently Viewed ──────────────────────────────────────────── */}
      <RecentlyViewed />

    </PageWrapper>
  );
}
