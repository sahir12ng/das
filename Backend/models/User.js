const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'user'], default: 'user' }
});

// Creación del modelo de usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
