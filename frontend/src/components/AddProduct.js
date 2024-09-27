import React, { useState } from 'react';

const AddProductForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newProduct = await response.json(); 
        onAdd(newProduct); 
        alert('Producto agregado con éxito');
      } else {
        alert('Error al agregar el producto');
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert('Error al agregar producto');
    }
  };

  return (
    <div className="add-product-form">
      <h2>Agregar Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción del Producto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Selecciona una categoría</option>
          <option value="Perros">Perros</option>
          <option value="Gatos">Gatos</option>
          <option value="Pájaros">Pájaros</option>
          <option value="Peces">Peces</option>
        </select>
        <input type="file" onChange={handleImageChange} required />
        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default AddProductForm;
