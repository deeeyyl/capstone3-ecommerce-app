import React, { useEffect, useState } from "react";

const AdminSaleManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isOnSale, setIsOnSale] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://rt9tp7q0kb.execute-api.us-west-2.amazonaws.com/production/api"; // fallback with /api prefix

  // Fetch all products on load
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/products/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setError("Failed to load products.");
        setLoading(false);
      });
  }, [token, API_BASE_URL]);

  // Populate sale fields when product changes
  useEffect(() => {
    if (!selectedProductId) {
      setIsOnSale(false);
      setDiscountPercentage(0);
      return;
    }

    const product = products.find((p) => p._id === selectedProductId);
    if (product && product.sale) {
      setIsOnSale(product.sale.isOnSale || false);
      setDiscountPercentage(product.sale.discountPercentage || 0);
    } else {
      setIsOnSale(false);
      setDiscountPercentage(0);
    }
  }, [selectedProductId, products]);

  const handleSave = async () => {
    setError("");
    if (!selectedProductId) return alert("Please select a product.");

    const url = `${API_BASE_URL}/products/${selectedProductId}/sale`;
    const payload = { isOnSale, discountPercentage };

    console.log("PATCH URL:", url);
    console.log("Payload:", payload);

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update sale, please try again"
        );
      }

      alert("Sale updated successfully");
    } catch (err) {
      console.error("Error updating sale:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Manage Product Sales</h2>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Select Product:
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          disabled={loading || products.length === 0}
        >
          <option value="">-- Select --</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      {selectedProductId && (
        <>
          <div style={{ marginTop: 20 }}>
            <label>
              <input
                type="checkbox"
                checked={isOnSale}
                onChange={() => setIsOnSale(!isOnSale)}
              />{" "}
              Is On Sale
            </label>
          </div>

          <div style={{ marginTop: 10 }}>
            <label>
              Discount Percentage (%):
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) =>
                  setDiscountPercentage(Number(e.target.value) || 0)
                }
                disabled={!isOnSale}
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={loading || !selectedProductId}
            style={{ marginTop: 20, width: "100%", padding: "10px" }}
          >
            Save Sale
          </button>
        </>
      )}
    </div>
  );
};

export default AdminSaleManager;