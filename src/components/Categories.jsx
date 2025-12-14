import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/categories.scss";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from FakeStore API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Błąd pobierania kategorii:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="loading-text">Ładowanie kategorii...</p>;

  return (
    <section className="categories-shell">
      <header className="categories-header">
        <h2>Popularne kategorie</h2>
        <p>Znajdź produkty w interesujących Cię kategoriach.</p>
      </header>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <Link
            to={`/category/${cat}`}
            key={index}
            className="category-card"
          >
            <div className="category-icon">📦</div> {/* Możesz potem mapować emoji do kategorii */}
            <p className="category-label">{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;