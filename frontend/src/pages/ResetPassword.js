import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams(); // Obtener los parámetros de la URL
  const userId = searchParams.get('userId'); // Obtener el userId desde los parámetros de la URL

  useEffect(() => {
    console.log('UserID desde la URL:', userId); // Asegurarse de que el userId esté bien obtenido
  }, [userId]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');  // Asegúrate de que este valor está en la URL
  
    try {
      const response = await fetch('http://localhost:3000/api/users/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword: password }), // userId y newPassword deben estar presentes
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage('Contraseña actualizada con éxito');
      } else {
        setMessage(data.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      setMessage('Error al actualizar la contraseña');
    }
  };
  
  return (
    <div className="reset-password-page">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Restablecer Contraseña</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
