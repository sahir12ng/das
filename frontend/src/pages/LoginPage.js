import React from 'react';
import Login from '../components/Login';

const LoginPage = ({ setIsAuthenticated, setUserRole }) => {
  return (
    <div className="login-page">
      <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
    </div>
  );
};

export default LoginPage;
