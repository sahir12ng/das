import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ isAuthenticated, onLogout }) => {
  const [userRole, setUserRole] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const handleStorageChange = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const role = localStorage.getItem('userRole');
      setUserRole(role);

      if (authStatus === 'true') {
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/'); 
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/shop" className="nav-link">Shop</Link>
      <Link to="/about" className="nav-link">About Us</Link>
      <Link to="/contact" className="nav-link">Contact</Link>
      {!isAuthenticated ? (
        <Link to="/login" className="nav-link">Iniciar Sesión</Link>
      ) : (
        <button onClick={handleLogoutClick} className="nav-link">Cerrar Sesión</button>
      )}
    </nav>
  );
};

export default NavBar;
