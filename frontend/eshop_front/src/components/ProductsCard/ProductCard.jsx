import React from 'react';
import './ProductCard.css';

function ProductCard({ product, user, onDelete }) {
  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cart/add/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        alert(`${product.name} sepete eklendi.`);
      } else {
        alert(`Hata: ${data.message || 'Ürün sepete eklenemedi.'}`);
      }
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      alert('Bir hata oluştu: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/products/${product.id}/delete/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });

      if (response.ok) {
        onDelete(product.id);
        alert('Ürün başarıyla silindi.');
      } else {
        const errorText = await response.text();
        console.error('Silme hatası:', errorText);
        alert('Silme işlemi başarısız: ' + errorText);
      }
    } catch (err) {
      alert('İstek hatası: ' + err.message);
    }
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(trimmedCookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <div className="product-card">
      {product.image ? (
        <img src={product.image} alt={product.name} className="product-image" />
      ) : (
        <div className="no-image">Resim yok</div>
      )}
      <h3 className="product-name">{product.name}</h3>
      <p className="description">{product.description}</p>
      <p className="price">Fiyat: {product.price}₺</p>

      {user?.user_type === 'seller' && (
        <button className="delete-btn" onClick={handleDelete}>Sil</button>
      )}

      {(!user || user.user_type === 'buyer') && (
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Sepete Ekle</button>
      )}
    </div>
  );
}

export default ProductCard;
