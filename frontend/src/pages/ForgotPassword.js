import React, { useState } from 'react';
import '../styles/contra.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
      } else {
        setMessage(data.message || 'Error al enviar el enlace de recuperación.');
      }
    } catch (error) {
      console.error('Error al enviar el enlace de recuperación:', error);
      setMessage('Error al enviar el enlace de recuperación.');
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleForgotPassword} className="forgot-password-form">
        <input
          type="email"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="email-input"
        />
        <button type="submit" className="recovery-button">Enviar Enlace de Recuperación</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
