import React from "react";
import { Link } from "react-router-dom";
import "../styles/cart.scss";

const Cart = ({ cart, onRemove, onChangeQuantity }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="cart-shell">
      <header className="cart-header">
        <h2>Twój koszyk</h2>
      </header>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Twój koszyk jest pusty.</p>
          <Link to="/catalog" className="btn-primary">
            Przejdź do sklepu
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item__info">
                  <img src={item.image} alt={item.title || item.name} />
                  <div>
                    <h3>{item.title || item.name}</h3>
                    <p>{item.category}</p>
                    <p>{item.price} zł / szt.</p>
                  </div>
                </div>

                <div className="cart-item__actions">
                  <div className="cart-item__qty">
                    <button onClick={() => onChangeQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onChangeQuantity(item.id, 1)}>+</button>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => onRemove(item.id)}
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p>Razem: <span>{total.toFixed(2)} zł</span></p>
            <button className="btn-primary" disabled>
              Kontynuuj do płatności (mock)
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
