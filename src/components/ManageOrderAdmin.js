import React, { useEffect, useState } from "react";
import { Card, Spinner, Form, Badge } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_OPTIONS = ["pending", "processing", "for delivery", "delivered", "cancelled"];

const formatCurrency = (amount) =>
  `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "processing":
      return "primary";
    case "for delivery":
      return "warning";
    case "delivered":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "dark";
  }
};

export default function ManageOrdersAdmin() {
    console.log("Admin View Rendering...");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders((data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setUpdatingId(orderId);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/update-status/${orderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched orders from server:", data);  
        toast.success(data.message || "Status updated");
        fetchOrders();
      })
      .catch((err) => {
        console.error("Error updating order:", err);
        toast.error("Failed to update order");
      })
      .finally(() => {
        setUpdatingId(null);
      });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading all orders...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <ToastContainer />
      <h2 className="mb-4">Manage Orders (Admin)</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="mb-4 shadow-sm">
            <Card.Header>
              <strong>Order ID:</strong> {order._id}
              <br />
              <strong>Date:</strong> {formatDate(order.createdAt)}
              <br />
              <strong>User:</strong>{" "}
              {order.userId?.email || "Unknown"}
              <br />
              <strong>Status:</strong>{" "}
              <Badge bg={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </Card.Header>
            <Card.Body>
              {order.items.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <strong>{item.productId?.name || "Product Deleted"}</strong>
                  <br />
                  Quantity: {item.quantity}
                  <br />
                  Price: {formatCurrency(item.productId?.price || 0)}
                  <br />
                  Subtotal:{" "}
                  {formatCurrency((item.productId?.price || 0) * item.quantity)}
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <strong>
                  Total:{" "}
                  {formatCurrency(
                    order.items.reduce((acc, item) => {
                      return (
                        acc + (item.productId?.price || 0) * item.quantity
                      );
                    }, 0)
                  )}
                </strong>

                <Form.Select
                  style={{ maxWidth: "200px" }}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={updatingId === order._id}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}