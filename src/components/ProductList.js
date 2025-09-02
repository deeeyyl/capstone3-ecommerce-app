import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center">
      {products && products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductList;