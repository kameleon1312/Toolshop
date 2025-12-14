import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import { fetchProducts } from "./data/products";
import "./styles/layout.scss";

const App = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- POBIERANIE PRODUKTÓW Z API ---
  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  // --- KOSZYK ---
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const handleChangeQuantity = (id, delta) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- STAN ŁADOWANIA ---
  if (loading) {
    return (
      <div className="loading-screen">
        <p>Ładowanie produktów...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar cartCount={cartCount} />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <Home products={products} onAddToCart={handleAddToCart} />
            }
          />
          <Route
            path="/catalog"
            element={
              <Catalog products={products} onAddToCart={handleAddToCart} />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                products={products}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onRemove={handleRemoveFromCart}
                onChangeQuantity={handleChangeQuantity}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
