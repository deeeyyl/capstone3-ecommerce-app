import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Form } from "react-bootstrap";

// Currency formatting helper
const formatCurrency = (amount) => {
   if (typeof amount !== "number" || isNaN(amount)) {
    return "₱0.00";
  }
  return `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];

  // State for shipping info
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    contactNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const total = cartItems.reduce((acc, item) => {
    return acc + Number(item.price) * Number(item.quantity);
  }, 0);

  const handlePlaceOrder = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to log in to place an order.");
      navigate("/login");
      return;
    }

    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.contactNumber) {
      alert("Please fill in all shipping details.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cartItems,
        shippingInfo,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to place order.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Order placed successfully:", data);
        alert("Order successfully placed!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Checkout error:", err);
        alert("There was an error placing your order.");
      });
  };

  return (
    <div className="checkout-container container py-5">
      <h2 className="checkout-title mb-4">Review Your Order</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <Card className="checkout-card mb-3" key={index}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  Quantity: {item.quantity} <br />
                  Price: {formatCurrency(item.price)} <br />
                  Subtotal:{" "}
                  <strong>
                    {formatCurrency(item.quantity * item.price)}
                  </strong>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}

          <h4 className="mt-5 mb-3">Shipping Information</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                placeholder="Enter shipping address"
                rows={2}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                name="contactNumber"
                value={shippingInfo.contactNumber}
                onChange={handleInputChange}
                placeholder="e.g. 09171234567"
                required
              />
            </Form.Group>
          </Form>

          <div className="checkout-total text-end mt-4">
            <h4>Total: {formatCurrency(total)}</h4>
            <Button
              variant="success"
              size="lg"
              className="mt-3"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        </>
      )}
    </div>
  );
}