import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const categoryImages = {
  gaming: "/images/gaming.png",
  headphones: "/images/headphones.png",
  phones: "/images/phones.png",
  computers: "/images/computers.png",
  smartwatches: "/images/smartwatches.png",
  camera: "/images/camera.png"
};

const getImageKey = (cat) => cat.toLowerCase().replace(/\s+/g, "");

const BrowseByCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/categories`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          const uniqueCategories = [...new Set(res.data.map(cat => cat.toLowerCase()))];
          setCategories(uniqueCategories);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleClick = (cat) => {
    navigate(`/categories/${cat}`);
  };

  return (
    <div className="browse-categories">
      <h3 className="mb-5 text-dark">Browse by Category</h3>
      <div className="category-grid-horizontal" 
      style={{ 
        display: "flex", 
        gap: "2.5rem", 
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center"}}>
          {categories.map((cat, index) => (
    <div
      key={index}
      className="category-card text-center"
      style={{ cursor: "pointer", width: "175px" }}
      onClick={() => handleClick(cat)}
    >
      <img
        src={categoryImages[getImageKey(cat)] || "/images/phones.png"}
        alt={cat}
        style={{ width: "100%", borderRadius: "8px" }}
      />
    </div>
  ))}
      </div>
    </div>
  );
};

export default BrowseByCategory;
