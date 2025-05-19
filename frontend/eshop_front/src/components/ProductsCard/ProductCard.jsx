import React from 'react';

// CSRF Token'ı çerezden çeken yardımcı fonksiyon
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

function ProductCard({ product, user, onDelete }) {
  console.log('ProductCard user:', user);

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
        onDelete(product.id);  // Üst komponenti silindiği bilgisini ver
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

  return (
    <div className="product-card">
      {product.image ? (
        <img
          src={product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`}
          alt={product.name}
          className="product-image"
          style={{ width: '100%', maxWidth: '280px', height: 'auto', borderRadius: '8px', marginBottom: '10px' }}
        />
      ) : (
        <div className="no-image">Resim yok</div>
      )}
      <h3 className="product-name">{product.name}</h3>
      <p className="description">{product.description}</p>
      <p className="price">Fiyat: {product.price}₺</p>

      {/* Kullanıcı satıcı tipindeyse ve bu ürün ona aitse, silme butonunu göster */}
      {user?.user_type === 'seller' && (
        <button className="delete-btn" onClick={handleDelete}>Sil</button>
      )}
    </div>
  );
}

export default ProductCard;
