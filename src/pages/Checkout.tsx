import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, selectTotal } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';
import { PageWrapper } from '@/components/ui/PageWrapper';
import '@/styles/pages/checkout.scss';

type Step = 'shipping' | 'payment' | 'confirm';

const STEPS: { id: Step; label: string }[] = [
  { id: 'shipping', label: 'Dostawa' },
  { id: 'payment', label: 'Płatność' },
  { id: 'confirm', label: 'Potwierdzenie' },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="checkout__steps">
      {STEPS.map((step, i) => (
        <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div className={`checkout__step${i === idx ? ' checkout__step--active' : ''}${i < idx ? ' checkout__step--done' : ''}`}>
            <div className="checkout__step-num">
              {i < idx ? '✓' : i + 1}
            </div>
            <span className="checkout__step-label">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="checkout__step-line" />}
        </div>
      ))}
    </div>
  );
}

export function Checkout() {
  const [step, setStep] = useState<Step>('shipping');
  const [orderNum] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());
  const { items, clearCart } = useCartStore();
  const total = useCartStore(selectTotal);

  const handleShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setStep('confirm');
  };

  if (items.length === 0 && step !== 'confirm') {
    return (
      <div className="checkout">
        <div className="checkout__inner">
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: 12 }}>
              Koszyk jest pusty
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
              Dodaj produkty do koszyka, aby przejść do kasy.
            </p>
            <Link to="/catalog" className="btn-primary">Przejdź do sklepu</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
    <div className="checkout">
      <div className="checkout__inner">
        <div className="checkout__header">
          <h1>Kasa</h1>
          <p>Bezpieczne i szybkie zakupy</p>
        </div>

        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          {step === 'shipping' && (
            <motion.div
              key="shipping"
              className="checkout__panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Dane dostawy</h2>
              <form className="checkout__form" onSubmit={handleShipping}>
                <div className="checkout__form-row">
                  <div className="checkout__field">
                    <label htmlFor="first-name">Imię</label>
                    <input id="first-name" type="text" placeholder="Jan" required autoComplete="given-name" inputMode="text" />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="last-name">Nazwisko</label>
                    <input id="last-name" type="text" placeholder="Kowalski" required autoComplete="family-name" inputMode="text" />
                  </div>
                </div>
                <div className="checkout__field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="jan@example.com" required autoComplete="email" inputMode="email" />
                </div>
                <div className="checkout__field">
                  <label htmlFor="address">Adres</label>
                  <input id="address" type="text" placeholder="ul. Przykładowa 1/2" required autoComplete="street-address" inputMode="text" />
                </div>
                <div className="checkout__form-row">
                  <div className="checkout__field">
                    <label htmlFor="city">Miasto</label>
                    <input id="city" type="text" placeholder="Warszawa" required autoComplete="address-level2" inputMode="text" />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="postal">Kod pocztowy</label>
                    <input id="postal" type="text" placeholder="00-000" required autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{2}-[0-9]{3}" />
                  </div>
                </div>
                <div className="checkout__actions">
                  <Link to="/cart" className="btn-ghost">← Wróć</Link>
                  <button type="submit" className="btn-primary">
                    Dalej: Płatność →
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              className="checkout__panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Płatność</h2>
              <form className="checkout__form" onSubmit={handlePayment}>
                <div className="checkout__field">
                  <label htmlFor="card-num">Numer karty</label>
                  <input id="card-num" type="text" placeholder="1234 5678 9012 3456" required maxLength={19} autoComplete="cc-number" inputMode="numeric" />
                </div>
                <div className="checkout__form-row">
                  <div className="checkout__field">
                    <label htmlFor="expiry">Ważność</label>
                    <input id="expiry" type="text" placeholder="MM/RR" required maxLength={5} autoComplete="cc-exp" inputMode="numeric" />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="cvv">CVV</label>
                    <input id="cvv" type="password" placeholder="•••" required maxLength={4} autoComplete="cc-csc" inputMode="numeric" />
                  </div>
                </div>
                <div className="checkout__field">
                  <label htmlFor="card-name">Imię i nazwisko na karcie</label>
                  <input id="card-name" type="text" placeholder="JAN KOWALSKI" required autoComplete="cc-name" />
                </div>

                <div style={{
                  padding: '14px 16px',
                  background: 'var(--color-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  marginTop: 4,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Do zapłaty:</span>
                    <strong style={{ color: 'var(--color-gold-bright)' }}>{formatPrice(total)}</strong>
                  </div>
                </div>

                <div className="checkout__actions">
                  <button type="button" className="btn-ghost" onClick={() => setStep('shipping')}>
                    ← Wróć
                  </button>
                  <button type="submit" className="btn-primary">
                    Zapłać {formatPrice(total)}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              className="checkout__panel"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="checkout__success">
                <div className="checkout__success-icon">✓</div>
                <h2>Dziękujemy za zamówienie!</h2>
                <p>Twoje zamówienie zostało przyjęte i jest w trakcie realizacji.</p>
                <p>Potwierdzenie zostanie wysłane na podany adres email.</p>
                <div className="checkout__success-order">
                  <span>Numer zamówienia</span>
                  <strong>#{orderNum}</strong>
                </div>
                <Link to="/catalog" className="btn-primary">
                  Kontynuuj zakupy
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </PageWrapper>
  );
}
