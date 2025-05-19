import React, { useState } from 'react';
import './ProductForm.css';

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    if (formData.image) form.append('image', formData.image);

    try {
      const response = await fetch('http://localhost:8000/api/products/create/', {
        method: 'POST',
        body: form,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert("Ürün başarıyla eklendi!");
        setFormData({ name: '', description: '', price: '', image: null });
      } else {
        const error = await response.json();
        alert("Hata: " + error.error);
      }
    } catch (err) {
      alert("İstek hatası: " + err.message);
    }
  };

  return (
    <div className="product-form">
      <div className="form-header">
        <h3>Yeni Ürün Ekle</h3>
      </div>
      <form onSubmit={handleSubmit} className="form-content">
        <input
          type="text"
          name="name"
          placeholder="Ürün Adı"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Fiyat"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Ekle</button>
      </form>
    </div>
  );
}

export default ProductForm;
