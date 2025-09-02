import React, { useEffect, useState, useContext } from 'react';
import FeaturedProducts from '../components/FeaturedProduct';
import UserContext from '../context/UserContext';
import HeaderBanner from '../components/HeaderBanner';
import SaleProducts from "../components/SaleProducts";
import { Notyf } from 'notyf';
import { Spinner, Button } from 'react-bootstrap';
import DoubleBanner from '../components/DoubleBanner';
import BrowseByCategory from '../components/BrowseByCategory';

const HomePage = ({ onAddToCart }) => {
  const { user } = useContext(UserContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setLoading(true);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        setLoading(false);
      });
  };

  const handleBackHome = () => {
    setSelectedCategory(null);
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const addToCart = (product) => {
    console.log("Adding to cart:", product.name);
    const handleAddToCart = async (product) => {
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
  };

  return (
    <>
      <HeaderBanner />
      <DoubleBanner />
           {/* Show Back to Home button only when a category is selected */}
            {selectedCategory && (
              <Button
                variant="dark"
                className="mb-4"
                onClick={handleBackHome}
              >
                Back to Home
              </Button>
            )}

            {/* Show BrowseByCategory only if no category is selected */}
            {!selectedCategory && (
              <BrowseByCategory
                onSelectCategory={handleCategorySelect}
                layout="horizontal"
              />
            )}
      <div className="container home-bg">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <div>Loading products...</div>
          </div>
        ) : (
          <>
            <FeaturedProducts products={products} onAddToCart={addToCart} />
          </>
        )}
      </div>

 

            
            <SaleProducts onAddToCart={addToCart} /> 
    </>
  );
};

export default HomePage;

