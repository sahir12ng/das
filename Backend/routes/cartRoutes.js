const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); 

// Ruta para añadir un producto al carrito
router.post('/:userId/add', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    console.log(`Adding product ${productId} to cart for user ${userId}`);

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log(`Cart not found, creating new cart for user ${userId}`);
      cart = new Cart({ userId, products: [] });
    }

    console.log('Current cart:', cart);

    const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (existingProductIndex >= 0) {
      console.log(`Product already in cart, increasing quantity for product ${productId}`);
      cart.products[existingProductIndex].quantity += 1;
    } else {
      console.log(`Adding new product ${productId} to cart`);
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'Producto añadido al carrito con éxito' });
  } catch (error) {
    console.error('Error al añadir el producto al carrito:', error);
    res.status(500).json({ message: 'Error al añadir el producto al carrito' });
  }
});

// Ruta para obtener los productos del carrito por userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
    res.status(500).json({ message: 'Error al obtener los productos del carrito' });
  }
});

module.exports = router;
