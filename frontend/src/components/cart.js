import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); 
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setCartItems(data); 
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

  // Calcular el total
  const total = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  // Manejar la acción de pago
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío. No hay productos para comprar.');
      return;
    }

    const mensaje = `Hola, me gustaría proceder con el pago de mi pedido. El total es $${total}.`;
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=+573507060893&text=${encodeURIComponent(mensaje)}`;
    
    // Redirige a WhatsApp
    window.location.href = urlWhatsApp;
  };

  return (
    <div>
      <h2>Tu Carrito</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                {item.product.name} - Cantidad: {item.quantity} - Precio: ${item.product.price}
              </li>
            ))}
          </ul>
          <h3>Total: ${total}</h3> {/* Muestra el total calculado */}
          <button onClick={handleCheckout} className="checkout-button">
            Pagar
          </button> 
        </>
      )}
    </div>
  );
};

export default Cart;
