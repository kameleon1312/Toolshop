import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/hero.scss";

const Hero = () => {
  return (
    <section className="hero-shell">
      <div className="hero-inner">

        {/* ===== LEFT CONTENT ===== */}
        <div className="hero-content">
          <p className="hero-eyebrow">Ekskluzywne produkty dla Ciebie</p>

          <h1 className="hero-title">
            Twój styl. <span>Twój wybór. Twój sklep.</span>
          </h1>

          <p className="hero-lead">
            Odkryj odzież, biżuterię i elektronikę w eleganckim, nowoczesnym stylu.
            Idealny wybór dla każdego, kto ceni design i jakość.
          </p>

          <div className="hero-actions">
            <Link to="/catalog" className="btn-primary">
              Przeglądaj produkty
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
            <span className="hero-card__icon">👗</span>
            <p>Stylowa odzież</p>
          </div>

          <div className="hero-card hero-card--secondary">
            <span className="hero-card__icon">💍</span>
            <p>Elegancka biżuteria</p>
          </div>

          <div className="hero-card hero-card--tertiary">
            <span className="hero-card__icon">📱</span>
            <p>Drobna elektronika</p>
          </div>

          <div className="hero-glow"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
