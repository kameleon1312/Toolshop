import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: 'calc(var(--navbar-height) + 40px) 20px 60px',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(5rem, 15vw, 10rem)',
        fontWeight: 700,
        lineHeight: 1,
        color: 'var(--color-border-glow)',
        marginBottom: 16,
      }}>
        404
      </p>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        marginBottom: 12,
      }}>
        Strona nie istnieje
      </h1>
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--color-text-muted)',
        maxWidth: 380,
        lineHeight: 1.6,
        marginBottom: 32,
      }}>
        Wygląda na to, że ta strona nie istnieje lub została przeniesiona.
        Wróć do strony głównej i spróbuj ponownie.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary">Strona główna</Link>
        <Link to="/catalog" className="btn-ghost">Przeglądaj sklep</Link>
      </div>
    </motion.div>
  );
}
