import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import { useParams, useNavigate } from "react-router-dom";
import BrowseByCategory from "../components/BrowseByCategory";

const CategoryPage = ({ onAddToCart }) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

const displayCategoryName = categoryName
    ? categoryName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryName) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const url = `${process.env.REACT_APP_API_BASE_URL}/products/category/${categoryName}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let productsArray = [];

        if (Array.isArray(data)) {
          productsArray = data;
        } else if (Array.isArray(data.data)) {
          productsArray = data.data;
        } else {
          console.warn("Unexpected API response:", data);
        }

        console.log("Fetched products:", productsArray);
        setProducts(productsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <Container className="mt-4">
      {!categoryName && (
        <>
          <h2 className="mb-4">Browse All Categories</h2>
          <BrowseByCategory layout="horizontal" />
          <hr />
        </>
      )}

      {categoryName && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Category: {displayCategoryName}</h2>
          <Button variant="secondary" onClick={() => navigate("/home")}>
            Back to Home
          </Button>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CategoryPage;