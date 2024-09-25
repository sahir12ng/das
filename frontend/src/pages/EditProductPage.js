import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/editProductPage.css'; 

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product...');
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        console.log(`Fetch response status: ${response.status}`);
        if (!response.ok) {
          throw new Error('Error al obtener el producto');
        }
        const data = await response.json();
        setProduct(data);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setCategory(data.category);
        setImage(data.image);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      console.error('No se proporcionó un ID de producto');
    }
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    if (image instanceof File) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }

      alert('Producto actualizado con éxito');
      navigate('/shop');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleCancel = () => {
    navigate('/shop');
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (!product) {
    return <p>No se encontró el producto.</p>;
  }

  return (
    <div className="edit-product-container">
      <h1>Editar Producto</h1>
      <form className="edit-product-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          required
          className="input-field"
        />
        <input
          type='text'        
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del producto"
          required
          className="input-field"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Precio"
          required
          className="input-field"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Categoría"
          required
          className="input-field"
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="input-file"
        />
        <div className="button-group">
          <button type="button" onClick={handleSaveChanges} className="save-button">
            Guardar Cambios
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
