import React, { useEffect, useState } from "react";
import ProductCard from './ProductCard';
import { Container, Row, Col } from "react-bootstrap";
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';


const UserView = ({ products, onSelect, onAddToCart, user }) => {
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleSelect = (product) => {
    setSelectedProductId(product._id);
  };

  const handleAddToCart = async (product) => {

     if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'You must be logged in to add products to your cart.',
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
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

      const data = await response.json();
      const notyf = new Notyf();

      if (response.ok) {
        notyf.success(`${product.name} added to cart!`);
      } else {
        notyf.error(data.message || "Failed to add to cart.");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <Row className="g-3">
      {products.map((product) => (
        <Col key={product._id} xs={12} md={4} className="mb-4 d-flex">
          <ProductCard
            product={product}
            isSelected={selectedProductId === product._id}
            onSelect={handleSelect}
            onAddToCart={handleAddToCart}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserView;
