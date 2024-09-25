import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../components/AddProduct'; 

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);

          const uniqueCategories = [...new Set(data.map(product => product.category))];
          setCategories(uniqueCategories);
        } else {
          console.error('La respuesta no es un array:', data);
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();

    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleAddProductClick = () => {
    setShowAddProduct(true); 
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]); 
    setShowAddProduct(false); 
  };

  const handleEditClick = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
          alert('Producto eliminado con éxito');
        } else {
          throw new Error('Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

    const handleAddToCart = async (productId) => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Por favor, inicia sesión para agregar productos al carrito.');
        return;
      }
    
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${userId}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }), // Aquí se pasa el productId al backend
        });
    
        if (response.ok) {
          alert('Producto añadido al carrito con éxito');
        } else {
          throw new Error('Error al añadir el producto al carrito');
        }
      } catch (error) {
        console.error('Error al añadir el producto al carrito:', error);
        alert('Error al añadir el producto al carrito');
      }
    };

  const handleViewCart = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      alert('Por favor, inicia sesión para ver tu carrito.');
    } else {
      navigate('/cart');
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = selectedCategory === 'Todas' 
    ? products 
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="shop-page">
      <h1>Catálogo de Productos</h1>
      
      {userRole !== 'owner' && (
        <button onClick={handleViewCart} className="cart-button">
          Ver Carrito
        </button>
      )}

      {userRole === 'owner' && !showAddProduct && (
        <button onClick={handleAddProductClick} className="add-product-button">
          Agregar Producto
        </button>
      )}

      {showAddProduct && <AddProduct onAdd={handleProductAdded} />}

      <div className="category-filter">
        <label htmlFor="category">Filtrar por categoría:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="Todas">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            {product.image && (
              <img
                src={`http://localhost:3000/${product.image}`}
                alt={product.name}
                className="product-image"
              />
            )}
            {userRole === 'owner' ? (
              <div className="product-buttons">
                <button onClick={() => handleEditClick(product._id)} className="edit-button">
                  Editar
                </button>
                <button onClick={() => handleDeleteClick(product._id)} className="delete-button">
                  Eliminar
                </button>
              </div>
            ) : (
              <button onClick={() => handleAddToCart(product._id)} className="add-to-cart-button">
                Agregar al Carrito
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
