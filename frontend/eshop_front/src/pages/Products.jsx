import React, { useEffect, useState } from 'react';
import SideProfile from '../components/SideProfile/SideProfile';
import ProductCard from '../components/ProductsCard/ProductCard';

function Products() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetch('http://localhost:8000/api/products/')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error('Ürünleri alırken hata oluştu:', err);
      });
  }, []);

  return (
    <div className="products-container" style={{ display: 'flex' }}>
      <SideProfile />
      <div className="products-list" style={{ padding: '20px', width: '100%' }}>
        <h2>Ürünler</h2>
        <div className="product-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
