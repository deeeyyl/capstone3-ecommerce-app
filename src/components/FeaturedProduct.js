import React, { useContext } from 'react';
import ProductCard from './ProductCard';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

const FeaturedProducts = ({ products }) => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const notyf = new Notyf();

  const likedProductIds = user?.likedProducts || [];
  console.log("User liked products IDs:", likedProductIds);

const handleAddToCart = async (product) => {
  console.log("Add to cart clicked for product:", product._id);
  if (!token) {
    alert("Please log in to add items to cart.");
    return;
  }

  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        quantity: 1,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Failed to add to cart:", errorData.message || res.statusText);
      alert("Failed to add to cart: " + (errorData.message || "Unknown error"));
      return;
    }

    const data = await res.json();
    console.log("Product added to cart:", data);
    // Optionally show a success notification or refresh cart here

  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Error adding to cart");
  }
};

  const handleLike = async (product, currentlyLiked) => {
    console.log(`Toggling like for product ${product._id}. Currently liked? ${currentlyLiked}`);

    if (!token) {
      alert("Please log in to like products.");
      return;
    }

    const endpoint = currentlyLiked
      ? `${process.env.REACT_APP_API_BASE_URL}/users/unlike/${product._id}`
      : `${process.env.REACT_APP_API_BASE_URL}/users/like/${product._id}`;
    console.log("Like/unlike endpoint:", endpoint);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`Failed to toggle like. Status: ${res.status}, Response: ${text}`);
        notyf.error("Failed to update like.");
        return;
      }

      notyf.success(currentlyLiked ? "Product unliked." : "Product liked.");

      // TODO: Refresh user context here if needed
      console.log("Like toggle successful for product:", product._id);
    } catch (error) {
      console.error("Error toggling like:", error);
      notyf.error("Error toggling like.");
    }
  };

  const featured = products.slice(0, 8);
  console.log("Featured products:", featured.map(p => p._id));

  return (
    <div className="row justify-content-center featured-container">
      <h1 className='text-dark text-center'>Featured Products</h1>
      {featured.map((product) => (
        <div key={product._id} className="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
          <ProductCard
            product={product}
            onSelect={() => {}}
            onAddToCart={handleAddToCart}
            liked={likedProductIds.includes(product._id)}
            onLike={handleLike}
          />
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;

