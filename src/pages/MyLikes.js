import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // adjust path as needed

const MyLikes = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [cart, setCart] = useState([]);  // simple cart state here
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/my-likes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch liked products");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLikedProducts(data);
        } else if (data.likedProducts) {
          setLikedProducts(data.likedProducts);
        }
      })
      .catch(err => {
        console.error("Error fetching likes:", err);
        setLikedProducts([]);
      });
  }, [token]);

  const onAddToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    alert(`Added ${product.name} to cart!`);
  };

  if (!token) {
    return <p>Please log in to see your liked products.</p>;
  }

  return (
    <section className="container py-4">
      <h2 className="text-center mb-4">My Liked Products</h2>

      {likedProducts.length > 0 ? (
        <div className="row justify-content-center">
          {likedProducts.map(product => (
            <div key={product._id} className="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                liked={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">You have no liked products yet.</p>
      )}
    </section>
  );
};

export default MyLikes;
