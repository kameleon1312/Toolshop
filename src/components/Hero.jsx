import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/hero.scss";

const Hero = () => {
  return (
    <section className="hero-shell">
      <div className="hero-inner">

        {/* ===== LEFT CONTENT ===== */}
        <div className="hero-content">
          <p className="hero-eyebrow">Nowoczesny e-commerce z narzędziami</p>

          <h1 className="hero-title">
            Twoje narzędzia.{" "}
            <span>Twój warsztat. Twój frontendowy Toolshop.</span>
          </h1>

          <p className="hero-lead">
            Zbudowany w React + Vite, zaprojektowany jak prawdziwy sklep
            internetowy. Skupiony na UI/UX, architekturze komponentów i jakości
            kodu — idealny projekt do portfolio.
          </p>

          <div className="hero-actions">
            <Link to="/catalog" className="btn-primary">
              Przeglądaj narzędzia
            </Link>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              Zobacz kod na GitHub
            </a>
          </div>
        </div>

        {/* ===== RIGHT VISUAL ZONE ===== */}
        <div className="hero-visual">
          <div className="hero-card hero-card--primary">
            <span className="hero-card__icon">⚡</span>
            <p>Mocne elektronarzędzia</p>
          </div>

          <div className="hero-card hero-card--secondary">
            <span className="hero-card__icon">✅</span>
            <p>Wybrane jak do własnego warsztatu</p>
          </div>

          <div className="hero-glow"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
