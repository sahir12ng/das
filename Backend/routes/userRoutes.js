const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Ruta de registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'El nombre de usuario o correo electrónico ya existe' });
  }
  const contrasenaencriptada = await bcrypt.hash(password, 10);
  const data = new User({
    username,
    password: contrasenaencriptada,
    email,
   role: role || 'user'
  });
  const result = await data.save();
  res.status(200).json({message:"Registro exítoso"});
} catch (error) {
  console.error('Error al registrar usuario:', error);
  res.status(500).json({ message: 'Error interno del servidor' });
}
});




router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Contraseña ingresada:', password); // Mostrar la contraseña ingresada
    console.log('Contraseña almacenada:', user.password); // Mostrar la contraseña encriptada almacenada en la base de datos
    console.log('¿Coinciden las contraseñas?:', isMatch); // Mostrar si coinciden

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No existe un usuario con ese correo electrónico' });
    }

    const resetLink = `http://localhost:3001/reset-password?userId=${user._id}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nandogcolombia9@gmail.com',
        pass: 'yekq vedo siax caay', 
      },
    });
    
    const mailOptions = {
      from: 'nandogcolombia9@gmail.com',
      to: user.email,
      subject: 'Recuperación de contraseña',
      text: `Hola ${user.username}, aquí está el enlace para recuperar tu contraseña: ${resetLink}`,
      html: `<p>Hola ${user.username},</p><p>Haz clic en este <a href="${resetLink}">enlace</a> para recuperar tu contraseña.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Enlace de recuperación enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);  // Esto mostrará el error exacto en la consola
    res.status(500).json({ message: 'Error al enviar el enlace de recuperación' });
  }
});



// Ruta para restablecer contraseña
router.put('/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
});

module.exports = router;
