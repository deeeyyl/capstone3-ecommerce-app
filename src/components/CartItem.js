import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";

export default function CartItem({ item, refreshCart }) {
  const [quantity, setQuantity] = useState(item.quantity);

  const formatCurrency = (amount) => {
     if (typeof amount !== "number" || isNaN(amount)) {
    return "₱0.00";
  }
    return `₱${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleUpdate = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productId: item.productId, newQuantity: quantity }),
    })
      .then((res) => res.json())
      .then(async() => {
        await refreshCart();
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Quantity has been updated.",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((err) => console.error("Error updating cart:", err));
  };

  const handleRemove = () => {
    Swal.fire({
      title: "Remove item?",
      text: `Are you sure you want to remove ${item.name} from the cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/remove-from-cart/${item.productId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then(() => {
            refreshCart();
            Swal.fire({
              icon: "success",
              title: "Removed!",
              text: `${item.name} has been removed from your cart.`,
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch((err) => console.error("Error removing item:", err));
      }
    });
  };

  return (
    <Card className="h-auto border-primary d-flex flex-column justify-content-between mb-3">
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {formatCurrency(item.price)}
        </Card.Subtitle>

        <div className="d-flex align-items-center mb-3">
          <label className="me-2">Qty:</label>
          <div className="d-flex align-items-center">
            <Button variant="outline-secondary" size="sm" onClick={decreaseQuantity}>−</Button>
            <span className="mx-2">{quantity}</span>
            <Button variant="outline-secondary" size="sm" onClick={increaseQuantity}>+</Button>
          </div>
          <Button variant="primary" size="sm" onClick={handleUpdate} className="ms-3">
            Update
          </Button>
        </div>

        <p className="fw-semibold">
          Subtotal: {formatCurrency(item.price * quantity)}
        </p>

        <div className="d-flex justify-content-start mt-3">
          <Button variant="danger" size="sm" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
