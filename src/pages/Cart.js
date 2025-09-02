import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const formatPeso = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const fetchCart = async () => {
      setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCartItems(data?.carts?.cartItems || []);
      setTotalPrice(data?.carts?.totalPrice || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
    setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = () => {
  navigate("/checkout", { state: { cartItems } });
};

  const handleClearCart = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove all items from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, clear it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res.ok) {
              fetchCart(); // Refresh cart view
              Swal.fire("Cleared!", "Your cart has been emptied.", "success");
            } else {
              throw new Error("Failed to clear cart");
            }
          })
          .catch((err) => {
            console.error("Error clearing cart:", err);
            Swal.fire("Error", "Failed to clear the cart.", "error");
          });
      }
    });
};

  return (
  <Container className="mt-4">
    <h2>Your Cart</h2>

    {loading ? (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <div>Loading cart...</div>
      </div>
    ) : cartItems.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <>
        <Row>
          <Col md={8}>
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                refreshCart={fetchCart}
              />
            ))}
          </Col>
          <Col md={4}>
            <Card className="p-3">
              <h4>Summary</h4>
              <hr />
              <p>
                <strong>Total:</strong> {formatPeso(totalPrice)}
              </p>
              <Button variant="primary" onClick={handleCheckout} className="mb-2" disabled={loading}>
                Proceed to Checkout
              </Button>
              <Button variant="danger" onClick={handleClearCart} disabled={loading}>
                Remove All Items
              </Button>
            </Card>
          </Col>
        </Row>
      </>
    )}
  </Container>
);
}