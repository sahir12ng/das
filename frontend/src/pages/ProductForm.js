import React, { useState } from 'react';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, image, price, category }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Producto agregado exitosamente');
        setName('');
        setDescription('');
        setImage('');
        setPrice('');
        setCategory('');
      } else {
        alert(data.message || 'Error al agregar producto');
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  return (
    <form onSubmit={handleAddProduct}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
