// data/products.js
export const fetchProducts = async () => {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();

    return data.map((p) => ({
      id: p.id.toString(),
      name: p.title,
      price: p.price,
      category: p.category,
      badge: null,
      image: p.image,
      description: p.description,
    }));
  } catch (err) {
    console.error("Błąd pobierania produktów:", err);
    return [];
  }
};