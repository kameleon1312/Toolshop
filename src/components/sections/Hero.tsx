import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import '@/styles/components/hero.scss';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%_';

function useMatrixScramble(target: string, startDelay = 0): string {
  const [output, setOutput] = useState(() =>
    Array.from(target).map((c) => (c === ' ' || c === '.' ? c : '_')).join(''),
  );

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    timerId = setTimeout(() => {
      let frame = 0;
      const FPC = 4;

      intervalId = setInterval(() => {
        const next = Array.from(target)
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (char === '.') return frame >= i * FPC + FPC ? '.' : '_';
            const settlesAt = i * FPC + FPC;
            if (frame >= settlesAt) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');

        setOutput(next);
        frame++;

        if (frame > (target.length - 1) * FPC + FPC + 3) {
          setOutput(target);
          clearInterval(intervalId);
        }
      }, 55);
    }, startDelay);

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [target, startDelay]);

  return output;
}

export function Hero() {
  const { data: products } = useProducts();
  const visual = products?.slice(0, 3) ?? [];

  const line1 = useMatrixScramble('NOWY', 200);
  const line2 = useMatrixScramble('STANDARD.', 700);

  return (
    <section className="hero" aria-label="Hero">

      {/* ── Left — content ────────────────────────────────────────────── */}
      <motion.div
        className="hero__content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <h1 className="hero__title" aria-label="Nowy Standard.">
          <span className="hero__title-fill" aria-hidden="true">{line1}</span>
          <span className="hero__title-stroke" aria-hidden="true">{line2}</span>
        </h1>

        <motion.p
          className="hero__desc"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
        >
          Odkryj starannie dobrane produkty premium — elektronika,
          biżuteria i&nbsp;odzież dla wymagających.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
        >
          <Link to="/catalog" className="hero__btn-primary">Kup teraz</Link>
          <Link to="/catalog" className="hero__btn-ghost">Przeglądaj kolekcję</Link>
        </motion.div>
      </motion.div>

      {/* ── Right — product collage ────────────────────────────────────── */}
      <div className="hero__visual" aria-hidden="true">
        {visual.length > 0 ? (
          <div className="hero__grid">
            {visual.map((p, i) => (
              <motion.div
                key={p.id}
                className="hero__grid-item"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE }}
              >
                <img
                  src={p.image}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="hero__grid-placeholder" />
        )}
      </div>

    </section>
  );
}
