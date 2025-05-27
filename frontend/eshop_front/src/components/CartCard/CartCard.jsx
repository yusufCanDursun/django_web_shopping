import { useEffect, useState } from 'react';
import './CartCard.css';

function CartCard() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cart/', {
        credentials: 'include',
      });
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Sepet verisi alınamadı:', error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await fetch(`http://localhost:8000/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      // UI'dan kaldır
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
    }
  };

  return (
    <div className="cart-card">
      <div className="cart-header">
        <h3>Sepetiniz</h3>
      </div>
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty">Sepetiniz boş.</div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <p>{item['product__name']} <span>({item.quantity})</span></p>
              <button onClick={() => handleRemove(item.id)}>Sil</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CartCard;
