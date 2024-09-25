import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
        const data = await response.json();

        if (data && data.products && Array.isArray(data.products)) {
          setCartItems(data.products);
        } else {
          console.error('Error: la respuesta no contiene un array de productos:', data);
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        setCartItems([]);
      }
    };

    if (userId) {
      fetchCartItems();
    } else {
      console.error('No se encontró userId en el localStorage');
    }
  }, [userId]);

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío. No hay productos para comprar.');
      return;
    }

    alert(`Procesando pago de $${total}.`);
  };

  return (
    <div>
      <h2>Tu Carrito</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={`${item.product._id}-${index}`}>
                {item.product.name} - Cantidad: {item.quantity} - Precio: ${item.product.price}
              </li>
            ))}
          </ul>
          <h3>Total: ${total}</h3>
          <button onClick={handleCheckout} className="checkout-button">
            Pagar
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
