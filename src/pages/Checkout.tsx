import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, selectTotal } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';
import { PageWrapper } from '@/components/ui/PageWrapper';
import type { CartItem } from '@/types';
import '@/styles/pages/checkout.scss';

type Step = 'shipping' | 'payment' | 'confirm';

const STEPS: { id: Step; label: string }[] = [
  { id: 'shipping', label: 'Dostawa'       },
  { id: 'payment',  label: 'Płatność'      },
  { id: 'confirm',  label: 'Potwierdzenie' },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function fmtExpiry(v: string) {
  const n = v.replace(/\D/g, '').slice(0, 4);
  return n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
}

type Errors = Record<string, string>;

function validateShipping(v: Record<string, string>): Errors {
  const e: Errors = {};
  if (!v.firstName?.trim())                          e.firstName = 'Imię jest wymagane';
  if (!v.lastName?.trim())                           e.lastName  = 'Nazwisko jest wymagane';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email ?? '')) e.email = 'Nieprawidłowy email';
  if (!v.address?.trim())                            e.address   = 'Adres jest wymagany';
  if (!v.city?.trim())                               e.city      = 'Miasto jest wymagane';
  if (!/^\d{2}-\d{3}$/.test(v.postal ?? ''))        e.postal    = 'Format: 00-000';
  return e;
}
function validatePayment(v: Record<string, string>): Errors {
  const e: Errors = {};
  if (v.cardNum?.replace(/\s/g, '').length !== 16)   e.cardNum  = 'Wpisz 16-cyfrowy numer';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v.expiry ?? '')) e.expiry = 'Format: MM/RR';
  if (!/^\d{3,4}$/.test(v.cvv ?? ''))                e.cvv      = 'Wpisz 3–4 cyfry';
  if (!v.cardName?.trim())                            e.cardName = 'Imię na karcie jest wymagane';
  return e;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="checkout__steps">
      {STEPS.map((step, i) => (
        <div key={step.id} className="checkout__step-wrap">
          <div className={`checkout__step${i === idx ? ' checkout__step--active' : ''}${i < idx ? ' checkout__step--done' : ''}`}>
            <div className="checkout__step-num">
              {i < idx
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                : i + 1}
            </div>
            <span className="checkout__step-label">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="checkout__step-line" />}
        </div>
      ))}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          className="checkout__field-error"
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{    opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18 }}
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function OrderSummary({ items, total }: { items: CartItem[]; total: number }) {
  return (
    <aside className="checkout__sidebar">
      <div className="checkout__summary">
        <h3 className="checkout__summary-title">Twoje zamówienie</h3>
        <div className="checkout__summary-items">
          {items.map((item) => (
            <div key={item.id} className="checkout__summary-item">
              <div className="checkout__summary-img">
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="checkout__summary-qty">{item.quantity}</span>
              </div>
              <div className="checkout__summary-info">
                <p className="checkout__summary-name">{item.name}</p>
                <p className="checkout__summary-price">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout__summary-totals">
          <div className="checkout__summary-row">
            <span>Dostawa</span>
            <span className="checkout__summary-free">Bezpłatna</span>
          </div>
          <div className="checkout__summary-row checkout__summary-row--total">
            <span>Razem</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function Checkout() {
  const [step, setStep]   = useState<Step>('shipping');
  const [orderNum]        = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());
  const { items, clearCart } = useCartStore();
  const total              = useCartStore(selectTotal);

  const [snapshot]   = useState<{ items: CartItem[]; total: number }>(
    () => ({ items: [...items], total })
  );

  // ── Shipping state ──
  const [sv, setSv] = useState({ firstName:'', lastName:'', email:'', address:'', city:'', postal:'' });
  const [se, setSe] = useState<Errors>({});

  // ── Payment state ──
  const [pv, setPv] = useState({ cardNum:'', expiry:'', cvv:'', cardName:'' });
  const [pe, setPe] = useState<Errors>({});

  const handleShippingBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errs = validateShipping({ ...sv, [name]: value });
    setSe((prev) => ({ ...prev, [name]: errs[name] ?? '' }));
  };

  const handlePaymentBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errs = validatePayment({ ...pv, [name]: value });
    setPe((prev) => ({ ...prev, [name]: errs[name] ?? '' }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateShipping(sv);
    if (Object.keys(errs).length) { setSe(errs); return; }
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validatePayment(pv);
    if (Object.keys(errs).length) { setPe(errs); return; }
    clearCart();
    setStep('confirm');
  };

  if (items.length === 0 && step !== 'confirm') {
    return (
      <PageWrapper>
        <div className="checkout">
          <div className="checkout__inner">
            <div className="checkout__empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <h2>Koszyk jest pusty</h2>
              <p>Dodaj produkty, aby przejść do kasy.</p>
              <Link to="/catalog" className="btn-primary">Przejdź do sklepu</Link>
            </div>
          </div>
        </div>
      </PageWrapper>
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

          {step === 'confirm' ? (
            <SuccessScreen orderNum={orderNum} />
          ) : (
            <div className="checkout__layout">
              <div className="checkout__main">
                <AnimatePresence mode="wait">

                  {step === 'shipping' && (
                    <motion.div key="shipping" className="checkout__panel"
                      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease: EASE }}
                    >
                      <h2>Dane dostawy</h2>
                      <form className="checkout__form" onSubmit={handleShippingSubmit} noValidate>
                        <div className="checkout__form-row">
                          <div className="checkout__field">
                            <label htmlFor="firstName">Imię</label>
                            <input id="firstName" name="firstName" type="text" placeholder="Jan"
                              value={sv.firstName} autoComplete="given-name"
                              onChange={(e) => { setSv(p => ({ ...p, firstName: e.target.value })); setSe(p => ({ ...p, firstName: '' })); }}
                              onBlur={handleShippingBlur}
                              className={se.firstName ? 'is-error' : ''}
                            />
                            <FieldError msg={se.firstName} />
                          </div>
                          <div className="checkout__field">
                            <label htmlFor="lastName">Nazwisko</label>
                            <input id="lastName" name="lastName" type="text" placeholder="Kowalski"
                              value={sv.lastName} autoComplete="family-name"
                              onChange={(e) => { setSv(p => ({ ...p, lastName: e.target.value })); setSe(p => ({ ...p, lastName: '' })); }}
                              onBlur={handleShippingBlur}
                              className={se.lastName ? 'is-error' : ''}
                            />
                            <FieldError msg={se.lastName} />
                          </div>
                        </div>

                        <div className="checkout__field">
                          <label htmlFor="email">Email</label>
                          <input id="email" name="email" type="email" placeholder="jan@example.com"
                            value={sv.email} autoComplete="email" inputMode="email"
                            onChange={(e) => { setSv(p => ({ ...p, email: e.target.value })); setSe(p => ({ ...p, email: '' })); }}
                            onBlur={handleShippingBlur}
                            className={se.email ? 'is-error' : ''}
                          />
                          <FieldError msg={se.email} />
                        </div>

                        <div className="checkout__field">
                          <label htmlFor="address">Adres</label>
                          <input id="address" name="address" type="text" placeholder="ul. Przykładowa 1/2"
                            value={sv.address} autoComplete="street-address"
                            onChange={(e) => { setSv(p => ({ ...p, address: e.target.value })); setSe(p => ({ ...p, address: '' })); }}
                            onBlur={handleShippingBlur}
                            className={se.address ? 'is-error' : ''}
                          />
                          <FieldError msg={se.address} />
                        </div>

                        <div className="checkout__form-row">
                          <div className="checkout__field">
                            <label htmlFor="city">Miasto</label>
                            <input id="city" name="city" type="text" placeholder="Warszawa"
                              value={sv.city} autoComplete="address-level2"
                              onChange={(e) => { setSv(p => ({ ...p, city: e.target.value })); setSe(p => ({ ...p, city: '' })); }}
                              onBlur={handleShippingBlur}
                              className={se.city ? 'is-error' : ''}
                            />
                            <FieldError msg={se.city} />
                          </div>
                          <div className="checkout__field">
                            <label htmlFor="postal">Kod pocztowy</label>
                            <input id="postal" name="postal" type="text" placeholder="00-000"
                              value={sv.postal} autoComplete="postal-code" inputMode="numeric"
                              onChange={(e) => { setSv(p => ({ ...p, postal: e.target.value })); setSe(p => ({ ...p, postal: '' })); }}
                              onBlur={handleShippingBlur}
                              className={se.postal ? 'is-error' : ''}
                            />
                            <FieldError msg={se.postal} />
                          </div>
                        </div>

                        <div className="checkout__actions">
                          <Link to="/cart" className="btn-ghost">← Wróć</Link>
                          <button type="submit" className="btn-primary">Dalej: Płatność →</button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {step === 'payment' && (
                    <motion.div key="payment" className="checkout__panel"
                      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease: EASE }}
                    >
                      <h2>Płatność</h2>
                      <form className="checkout__form" onSubmit={handlePaymentSubmit} noValidate>

                        <div className="checkout__field">
                          <label htmlFor="cardNum">Numer karty</label>
                          <input id="cardNum" name="cardNum" type="text" placeholder="1234 5678 9012 3456"
                            value={pv.cardNum} autoComplete="cc-number" inputMode="numeric"
                            onChange={(e) => { setPv(p => ({ ...p, cardNum: fmtCard(e.target.value) })); setPe(p => ({ ...p, cardNum: '' })); }}
                            onBlur={handlePaymentBlur}
                            className={pe.cardNum ? 'is-error' : ''}
                          />
                          <FieldError msg={pe.cardNum} />
                        </div>

                        <div className="checkout__form-row">
                          <div className="checkout__field">
                            <label htmlFor="expiry">Ważność</label>
                            <input id="expiry" name="expiry" type="text" placeholder="MM/RR"
                              value={pv.expiry} autoComplete="cc-exp" inputMode="numeric" maxLength={5}
                              onChange={(e) => { setPv(p => ({ ...p, expiry: fmtExpiry(e.target.value) })); setPe(p => ({ ...p, expiry: '' })); }}
                              onBlur={handlePaymentBlur}
                              className={pe.expiry ? 'is-error' : ''}
                            />
                            <FieldError msg={pe.expiry} />
                          </div>
                          <div className="checkout__field">
                            <label htmlFor="cvv">CVV</label>
                            <input id="cvv" name="cvv" type="password" placeholder="•••"
                              value={pv.cvv} autoComplete="cc-csc" inputMode="numeric" maxLength={4}
                              onChange={(e) => { setPv(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })); setPe(p => ({ ...p, cvv: '' })); }}
                              onBlur={handlePaymentBlur}
                              className={pe.cvv ? 'is-error' : ''}
                            />
                            <FieldError msg={pe.cvv} />
                          </div>
                        </div>

                        <div className="checkout__field">
                          <label htmlFor="cardName">Imię i nazwisko na karcie</label>
                          <input id="cardName" name="cardName" type="text" placeholder="JAN KOWALSKI"
                            value={pv.cardName} autoComplete="cc-name"
                            onChange={(e) => { setPv(p => ({ ...p, cardName: e.target.value.toUpperCase() })); setPe(p => ({ ...p, cardName: '' })); }}
                            onBlur={handlePaymentBlur}
                            className={pe.cardName ? 'is-error' : ''}
                          />
                          <FieldError msg={pe.cardName} />
                        </div>

                        <div className="checkout__actions">
                          <button type="button" className="btn-ghost" onClick={() => setStep('shipping')}>← Wróć</button>
                          <button type="submit" className="btn-primary">Zapłać {formatPrice(snapshot.total)}</button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              <OrderSummary items={snapshot.items} total={snapshot.total} />
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.10, delayChildren: 0.45 } },
};
const line = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function SuccessScreen({ orderNum }: { orderNum: string }) {
  return (
    <div className="checkout__success-wrap">
      <motion.div
        className="checkout__success-icon"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </motion.div>

      <motion.div className="checkout__success-body" variants={stagger} initial="hidden" animate="show">
        <motion.h2 variants={line}>Dziękujemy za zamówienie!</motion.h2>
        <motion.p variants={line}>Twoje zamówienie zostało przyjęte i jest w trakcie realizacji.</motion.p>
        <motion.p variants={line}>Potwierdzenie zostanie wysłane na podany adres email.</motion.p>

        <motion.div className="checkout__success-order" variants={line}>
          <span>Numer zamówienia</span>
          <strong>#{orderNum}</strong>
        </motion.div>

        <motion.div variants={line}>
          <Link to="/catalog" className="btn-primary">Kontynuuj zakupy</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
