import React, { useContext, useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Notyf } from 'notyf';
import Swal from 'sweetalert2';

const formatPrice = (price) => {
  if (price == null) return "₱0.00";
  return `₱${Number(price).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const ProductCard = ({ product, onSelect, onAddToCart, liked: likedProp = false }) => {
  const { user, fetchUserDetails } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const notyf = new Notyf();

  const [liked, setLiked] = useState(likedProp);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = (e) => {
    e.stopPropagation(); 
    setShowFullDescription((prev) => !prev);
  };

  const desc = product.description || "";
 const isOnSale = product.sale?.isOnSale === true;
const salePrice = isOnSale && product.sale?.salePrice ? product.sale.salePrice : null;

useEffect(() => {
  if (user && user.likedProducts) {
    const isLiked = user.likedProducts.some(
      (likedProd) => likedProd._id.toString() === product._id.toString()
    );
    setLiked(isLiked);
  } else {
    setLiked(false);
  }
}, [user, product._id]);

  const handleClick = () => {
    onSelect(product);
  };

  const handleAddToCart = async (product) => {
  console.log("Add to cart clicked for product:", product._id);
  if (!token) {
     Swal.fire({
    icon: 'warning',
    title: 'Oops...',
    text: 'Please log in to add items to cart.',
    confirmButtonText: 'OK'
  });
    return;
  }
 
    const isOnSale = product.sale?.isOnSale && product.sale?.discountPercentage > 0;
    const salePrice = isOnSale
    ? product.price * (1 - product.sale.discountPercentage / 100)
    : product.price;

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
        price: salePrice,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Failed to add to cart:", errorData.message || res.statusText);
      notyf.error("Failed to add to cart: " + (errorData.message || "Unknown error"));
      return;
    }

    const data = await res.json();
    console.log("Product added to cart:", data);
    notyf.success("Product added to cart:", data);

  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Error adding to cart");
  }
};
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!token) {
      alert("Please log in to like products.");
      return;
    }

    try {
      const endpoint = liked
        ? `${process.env.REACT_APP_API_BASE_URL}/users/unlike/${product._id}`
        : `${process.env.REACT_APP_API_BASE_URL}/users/like/${product._id}`;

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
        alert(`Failed to toggle like: ${res.status}`);
        return;
      }

      setLiked(!liked);
      if (fetchUserDetails) {
        fetchUserDetails(); 
      } else {
        console.warn("fetchUserDetails function not found in UserContext");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

    console.log("Product:", product);
    console.log("Is on sale:", isOnSale);
    console.log("Sale price:", salePrice);

  return (
    <Card
      className="shadow-sm rounded text-center"
      onClick={handleClick}
    >
    <Card.Img
  variant="top"
  src={`http://localhost:4000/uploads/${product.imageFilename}`}
  alt={product.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/images/placeholder.png";
  }}
  style={{ height: '180px', objectFit: 'cover' }}
/>

      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="card-text">
        {showFullDescription ? desc : (
          desc.length > 100 ? desc.substring(0, 100) + "..." : desc
        )}
        {desc.length > 100 && (
          <span
            onClick={toggleDescription}
            style={{ color: 'blue', cursor: 'pointer', marginLeft: 5 }}
          >
            {showFullDescription ? " Show less" : " Read more"}
          </span>
        )}
      </Card.Text>
        {/* <Card.Text className="fw-bold">₱{product.price}</Card.Text> */}

         {/* Show price, considering sale */}
          {isOnSale && salePrice !== null ? (
      <Card.Text>
        <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: 8 }}>
        {formatPrice(product.price)}
        </span>
        <span style={{ color: 'red', fontWeight: 'bold' }}>
        {formatPrice(salePrice)}
        </span>
        </Card.Text>
            ) : (
        <Card.Text className="fw-bold">{formatPrice(product.price)}</Card.Text>
      )}

        {/* Like Button */}
        <Button
          variant="link"
          onClick={handleLike}
          className="p-0 mb-2"
        >
          {liked ? (
            <FaHeart color="red" size={20} />
          ) : (
            <FaRegHeart color="red" size={20} />
          )}
        </Button>

        {/* Add to Cart Button */}
        {!user?.isAdmin && (
        <Button
          variant="dark"
          onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(product);
          }}
        className="mt-auto add-to-cart-btn"
        >
         Add to Cart
       </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;