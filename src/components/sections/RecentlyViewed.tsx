import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { formatPrice, capitalize } from '@/utils/format';
import '@/styles/components/recently-viewed.scss';

const CATEGORY_LABELS: Record<string, string> = {
  electronics:        'Elektronika',
  jewelery:           'Biżuteria',
  "men's clothing":   'Odzież męska',
  "women's clothing": 'Odzież damska',
};

interface RecentlyViewedProps {
  excludeId?: string;
}

export function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const { items, clear } = useRecentlyViewedStore();
  const visible = excludeId ? items.filter((p) => p.id !== excludeId) : items;

  if (visible.length === 0) return null;

  return (
    <motion.section
      className="recently-viewed"
      aria-label="Ostatnio oglądane"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="recently-viewed__inner">
        <div className="recently-viewed__header">
          <div className="recently-viewed__titles">
            <p className="eyebrow">Historia przeglądania</p>
            <h2>Ostatnio oglądane</h2>
          </div>
          <button className="recently-viewed__clear" onClick={clear} aria-label="Wyczyść historię">
            Wyczyść
          </button>
        </div>

        <div className="recently-viewed__track" role="list">
          {visible.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="recently-viewed__card"
              role="listitem"
              aria-label={product.name}
            >
              <div className="recently-viewed__card-img">
                <img src={product.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="recently-viewed__card-body">
                <p className="recently-viewed__card-cat">
                  {CATEGORY_LABELS[product.category] ?? capitalize(product.category)}
                </p>
                <p className="recently-viewed__card-name">{product.name}</p>
                <p className="recently-viewed__card-price">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
