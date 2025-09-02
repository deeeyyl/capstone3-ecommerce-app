import React, { useEffect, useState } from "react";
import { Card, Spinner, Button, Collapse, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatCurrency = (amount) => {
   if (typeof amount !== "number" || isNaN(amount)) {
    return "₱0.00";
  }
  return `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const statusColorMap = {
  pending: "secondary",
  processing: "info",
  "for delivery": "warning",
  delivered: "success",
  cancelled: "danger",
};

export default function CheckOrderUser() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please log in to view your orders.");
    return;
  }

  fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched orders raw response:", data);

      if (data && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
        toast.warning(data.message || "No orders found.");
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      toast.error("There was an error retrieving your orders.");
      setLoading(false);
    });
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkAsReceived = (orderId) => {
    const token = localStorage.getItem("token");
    setUpdatingOrderId(orderId);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/mark-received/${orderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Order marked as received") {
          toast.success("Order marked as received.");
          fetchOrders();
        } else {
          toast.error(data.message || "Failed to update order.");
        }
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setUpdatingOrderId(null);
      });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          const statusColor = statusColorMap[order.status?.toLowerCase()] || "dark";

          return (
            <Card key={order._id} className="mb-3 shadow-sm">
              <Card.Header
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
              >
                <div>
                  <strong>Order ID:</strong> {order._id} <br />
                  <strong>Date:</strong> {formatDate(order.createdAt)}
                </div>
                <Badge bg={statusColor} className="text-capitalize">
                  {order.status}
                </Badge>
              </Card.Header>

              <Collapse in={isExpanded}>
                <div>
                  <Card.Body>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="mb-3 border-bottom pb-2">
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
                          order.items.reduce(
                            (acc, item) =>
                              acc + (item.productId?.price || 0) * item.quantity,
                            0
                          )
                        )}
                      </strong>

                      {order.status === "for delivery" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleMarkAsReceived(order._id)}
                          disabled={updatingOrderId === order._id}
                        >
                          {updatingOrderId === order._id
                            ? "Marking..."
                            : "Mark as Received"}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
          );
        })
      )}
    </div>
  );
}