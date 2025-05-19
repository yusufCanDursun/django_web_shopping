import React, { useEffect, useState } from 'react';
import SideProfile from '../components/SideProfile/SideProfile';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductsCard/ProductCard';
import { useAuth } from '../context/AuthContext'; 

function SellerPanel() {
  const { user } = useAuth(); 
  console.log("SellerPanel user:", user);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      console.log("Kullanıcı oturumu bulunamadı!");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        console.log("Ürünler yükleniyor...");
        
        const res = await fetch('http://localhost:8000/api/products/seller/products/', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Ürünler alınamadı: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        console.log("Gelen ürün verileri:", data);
        
        setProducts(data);
        setError(null);
      } catch (error) {
        console.error("Ürün yükleme hatası:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]); 

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  if (loading) return <p>Yükleniyor...</p>;

  if (error) return <p>Hata: {error}</p>;

  if (!user) return <p>Giriş yapılmamış. Lütfen önce giriş yapın.</p>;

  return (
    <div className="products-container" style={{ display: 'flex', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SideProfile user={user} />
        <ProductForm user={user} />
      </div>

      <div className="products-list">
        <h2>Satıcı Ürünlerim</h2>
        {products.length === 0 ? (
          <p>Henüz ürün eklenmemiş.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                user={user}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerPanel;