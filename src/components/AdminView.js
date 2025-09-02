import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Table, Spinner, Form } from 'react-bootstrap';

const formatPrice = (price) => {
  if (price == null) return "₱0.00";
  return `₱${Number(price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function AdminView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchAllProducts = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching all products:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const updateProduct = (product) => {
    Swal.fire({
      title: 'Update Product',
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Name" value="${product.name}" />
        <input id="swal-input-description" class="swal2-input" placeholder="Description" value="${product.description}" />
        <input id="swal-input-price" class="swal2-input" type="number" placeholder="Price" value="${product.price}" />
        <input id="swal-input-category" class="swal2-input" placeholder="Category" value="${product.category || ''}" />
        <input id="swal-input-brand" class="swal2-input" placeholder="Brand" value="${product.brand || ''}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value;
        const description = document.getElementById('swal-input-description').value;
        const price = parseFloat(document.getElementById('swal-input-price').value);
        const category = document.getElementById('swal-input-category').value;
        const brand = document.getElementById('swal-input-brand').value;

        if (!name || !description || isNaN(price) || !category || !brand) {
          Swal.showValidationMessage('All fields are required and price must be a number.');
          return;
        }

        return { name, description, price, category, brand };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${product._id}/update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(result.value)
        })
          .then(res => res.json())
          .then(data => {
            if (data && !data.message) {
              Swal.fire('Success!', 'Product updated.', 'success');
              fetchAllProducts();
            } else {
              Swal.fire('Error', data.message || 'Failed to update.');
            }
          })
          .catch(() => {
            Swal.fire('Error', 'Server error occurred.', 'error');
          });
      }
    });
  };

  const archiveProduct = async (productId) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: 'Archive product?',
      text: "You can reactivate it later.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, archive it',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            Swal.fire("Archived!", "Product has been archived.", "success");
            fetchAllProducts();
          } else {
            Swal.fire("Error", data.message || "Failed to archive product", "error");
          }
        } catch (error) {
          console.error("Error archiving product:", error);
          Swal.fire("Error", "Something went wrong while archiving.", "error");
        }
      }
    });
  };

  const activateProduct = (id) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: 'Activate product?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, activate'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}/activate`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(() => {
            Swal.fire('Activated!', 'The product is now active.', 'success');
            fetchAllProducts();
          });
      }
    });
  };

  const deleteProduct = (id) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: 'Delete permanently?',
      text: 'This action cannot be undone!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
          .then(async res => {
            if (!res.ok) {
              const text = await res.text();
              throw new Error(text);
            }
            return res.json();
          })
          .then(() => {
            Swal.fire('Deleted!', 'Product removed permanently.', 'success');
            fetchAllProducts();
          })
          .catch((error) => {
            console.error("Delete error:", error);
            Swal.fire("Error", "Something went wrong deleting the product.", "error");
          });
      }
    });
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const filteredAndSortedProducts = [...products]
    .filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = sortField === 'price' ? Number(a[sortField]) : a[sortField];
      const valB = sortField === 'price' ? Number(b[sortField]) : b[sortField];
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center text-black">Admin Dashboard</h1>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search products by name or description..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="rounded-3 overflow-hidden border">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-dark text-center align-middle">
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Description</th>
                <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                  Price (₱) {sortField === 'price' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Status</th>
                <th>Category</th>
                <th>Brand</th>
                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                  Date Added {sortField === 'createdAt' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No products found</td>
                </tr>
              ) : (
                filteredAndSortedProducts.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td className="text-center">{formatPrice(product.price)}</td>
                    <td className="text-center">{product.isActive ? 'Active' : 'Archived'}</td>
                    <td className="text-center">{product.category}</td>
                    <td className="text-center">{product.brand}</td>
                    <td className="text-center">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="d-flex gap-2 flex-wrap justify-content-center">
                      <Button variant="primary" size="sm" onClick={() => updateProduct(product)}>Edit</Button>
                      {product.isActive ? (
                        <Button variant="warning" size="sm" onClick={() => archiveProduct(product._id)}>Archive</Button>
                      ) : (
                        <Button variant="success" size="sm" onClick={() => activateProduct(product._id)}>Activate</Button>
                      )}
                      <Button variant="danger" size="sm" onClick={() => deleteProduct(product._id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}