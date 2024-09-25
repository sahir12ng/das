import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);

      if (response.ok && data.user && data.user._id) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('userRole', data.user.role);
        setIsAuthenticated(true);
        setUserRole(data.user.role);
        alert('Inicio de sesión exitoso');
        navigate('/');
        window.dispatchEvent(new Event('storage')); 
      } else {
        alert(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="login-page">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="register-prompt">
        ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
      </p>
      <p className="forgot-password">
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
      </p>
    </div>
  );
};

export default Login;
