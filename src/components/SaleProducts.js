import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const SaleProducts = ({ handleAddToCart }) => {
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/sale`)
      .then(res => res.json())
      .then(data => {
        console.log("Sale products fetched:", data);
        setSaleProducts(data);
      })
      .catch(err => console.error("Error fetching sale products:", err));
  }, []);

  if (!saleProducts.length) return <p>No discounted products right now.</p>;

  return (
    <section className="container py-4">
      <h2 className="text-center mb-4 text-dark">Products on Sale 🔥</h2>
      <div className="row justify-content-center">
        {saleProducts.map((product) => (
          <div key={product._id} className="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              onSelect={() => {}}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SaleProducts;