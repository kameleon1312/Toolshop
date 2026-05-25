import { useEffect, useState, type RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/format';
import '@/styles/components/buy-bar.scss';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface BuyBarProps {
  product: Product;
  actionsRef: RefObject<HTMLDivElement | null>;
  inWishlist: boolean;
  onAdd: () => void;
  onWishlist: () => void;
}

export function BuyBar({ product, actionsRef, inWishlist, onAdd, onWishlist }: BuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [actionsRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="buy-bar"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 80, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <div className="buy-bar__inner">
            <div className="buy-bar__product">
              <div className="buy-bar__img">
                <img src={product.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="buy-bar__info">
                <p className="buy-bar__name">{product.name}</p>
                <p className="buy-bar__price">{formatPrice(product.price)}</p>
              </div>
            </div>

            <div className="buy-bar__actions">
              <button
                className={`buy-bar__wishlist${inWishlist ? ' buy-bar__wishlist--active' : ''}`}
                onClick={onWishlist}
                aria-label={inWishlist ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              >
                <svg viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>

              <button className="buy-bar__add" onClick={onAdd}>
                Dodaj do koszyka
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
