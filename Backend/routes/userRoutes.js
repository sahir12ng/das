const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importa el modelo de usuario
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); // Si decides usar nodemailer para la recuperación de contraseña

// Ruta de registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Verifica si el usuario ya existe por correo electrónico o nombre de usuario
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario o correo electrónico ya existe' });
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword, role: role || 'user' });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Ruta de inicio de sesión de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Enviar respuesta con los datos del usuario
    const response = {
      message: 'Inicio de sesión exitoso',
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Ruta para recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No existe un usuario con ese correo electrónico' });
    }

    // Aquí podrías agregar lógica para generar un token de recuperación y enviar un correo
    // Ejemplo básico de envío de correo con nodemailer:

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tuCorreo@gmail.com', // Reemplaza con tu correo
        pass: 'tuContraseña', // Reemplaza con tu contraseña o usa un App Password si es necesario
      },
    });

    const mailOptions = {
      from: 'tuCorreo@gmail.com',
      to: user.email,
      subject: 'Recuperación de contraseña',
      text: `Hola ${user.username}, aquí está el enlace para recuperar tu contraseña...`,
      html: `<p>Hola ${user.username},</p><p>Haz clic en este <a href="http://localhost:3000/reset-password">enlace</a> para recuperar tu contraseña.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Enlace de recuperación enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el enlace de recuperación:', error);
    res.status(500).json({ message: 'Error al enviar el enlace de recuperación' });
  }
});

module.exports = router;
