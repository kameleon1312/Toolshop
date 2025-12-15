import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/components/navbar.scss";

const Navbar = ({ cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* === LOGO === */}
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">💎</span>
          <span className="navbar__logo-text">FANCYSHOP</span>
        </Link>

        {/* === SEARCH (desktop) === */}
        <div className="navbar__search">
          <input
            type="text"
            placeholder="Szukaj produktów, kategorii lub marek..."
            aria-label="Wyszukiwarka"
          />
        </div>

        {/* === DESKTOP LINKS === */}
        <nav
          className={`navbar__links ${isMenuOpen ? "navbar__links--open" : ""}`}
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
            onClick={closeMenu}
          >
            Start
          </NavLink>

          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
            onClick={closeMenu}
          >
            Sklep
          </NavLink>
        </nav>

        {/* === ACTION BUTTONS (CART + BURGER) === */}
        <div className="navbar__actions">
          {/* CART */}
          <Link to="/cart" className="navbar__cart" onClick={closeMenu}>
            <span className="navbar__cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* BURGER */}
          <button
            className={`navbar__toggle ${
              isMenuOpen ? "navbar__toggle--active" : ""
            }`}
            onClick={toggleMenu}
            aria-label="Przełącz menu"
          >
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
          </button>
        </div>
      </div>

      {/* === SEARCH (mobile) === */}
      <div className="navbar__search navbar__search--mobile">
        <input type="text" placeholder="Szukaj produktów..." />
      </div>
    </header>
  );
};

export default Navbar;
