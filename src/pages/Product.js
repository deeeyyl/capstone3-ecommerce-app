import React, { useEffect, useState, useContext } from 'react';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';
import { Row, Col, Form, Button } from 'react-bootstrap';


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories
useEffect(() => {
  setLoading(true);
  fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
    .then(res => res.json())
    .then(data => {
      setProducts(data);

      
      const uniqueCategories = [...new Set(data.map(p => p.category))];
      setCategories(uniqueCategories);

      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching products:", err);
      setLoading(false);
    });
}, []);


// 🔹 Fetch brands separately from backend
useEffect(() => {
  fetch(`${process.env.REACT_APP_API_BASE_URL}/products/brands`)
    .then(res => res.json())
    .then(data => {
      console.log("Brands API response:", data);
      if (Array.isArray(data)) {
        setBrands(data);
      } else if (data.success && Array.isArray(data.data)) {
        setBrands(data.data);
      }
    })
    .catch(err => console.error("Error fetching brands:", err));
}, []);


  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  const filteredProducts = products.filter(p => {
    const categoryMatch = selectedCategories.length ? selectedCategories.includes(p.category) : true;
    const brandMatch = selectedBrands.length ? selectedBrands.includes(p.brand) : true;
    return categoryMatch && brandMatch;
  });

  const renderView = () => {
  if (user && user.isAdmin) return <AdminView products={products} />; 
  return <UserView products={filteredProducts}/>;
};

  return (
    <div className="container mt-4 text-dark">
      <Row>
        {!user?.isAdmin && (
          <Col xs={12} md={3} className="mb-4">
            <h4>Filter Products</h4>
            <Button variant="secondary" size="sm" className="mb-3" onClick={clearFilters}>
              Clear Filters
            </Button>

            {/* Categories */}
            <div className="mb-3">
              <h5>Category</h5>
              {categories.map((category, idx) => (
                <Form.Check
                  key={idx}
                  type="checkbox"
                  id={`category-${idx}`}
                  label={category}
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="text-dark"
                />
              ))}
            </div>

            {/* Brands */}
            <div>
              <h5>Brand</h5>
              {brands.map((brand, idx) => (
                <Form.Check
                  key={idx}
                  type="checkbox"
                  id={`brand-${idx}`}
                  label={brand}
                  value={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="text-dark"
                />
              ))}
            </div>
          </Col>
        )}

        {/* Products */}
        <Col xs={12} md={!user?.isAdmin ? 9 : 12}>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-dark" />
            </div>
          ) : (
            renderView()
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
