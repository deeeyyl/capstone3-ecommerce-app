import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AddProduct() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]); 
  const [brands, setBrands] = useState([]); 
  const [category, setCategory] = useState(''); 
  const [brand, setBrand] = useState(''); 

  
  // Fetch categories & brands on mount
     useEffect(() => {
     fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data || []));

     fetch(`${process.env.REACT_APP_API_BASE_URL}/brands`)
      .then(res => res.json())
      .then(data => setBrands(data || []));
  }, []);

    if (!user.isAdmin) {   // Redirect non-admin users
         return <Navigate to="/products" />;
        }


  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category); 
    formData.append('brand', brand); 
    if (image) {
      formData.append('image', image);
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Product added!',
            text: data.message
          });

          setName('');
          setDescription('');
          setPrice('');
          setImage(null);
          setCategory('');
          setBrand('');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to add product',
            text: data.message || 'Please try again.'
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Network error',
          text: err.message
        });
      });
  };

  return (
    <div className="container mt-5">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="mt-4">

        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            type="text"
            className="form-control"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
           </div>

        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
}