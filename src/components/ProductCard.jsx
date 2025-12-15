import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/product-card.scss";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__image-wrap">
        {product.badge && (
          <span className="product-card__badge">{product.badge}</span>
        )}
        <img src={product.image} alt={product.title || product.name} />
      </Link>
      <div className="product-card__info">
        <h3 className="product-card__title">{product.title || product.name}</h3>
        <p className="product-card__category">{product.category}</p>
        <div className="product-card__bottom">
          <span className="product-card__price">{product.price} zł</span>
          <button
            className="product-card__btn"
            onClick={() => onAddToCart(product)}
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
