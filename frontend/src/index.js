import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';  // Asegúrate de que esta ruta sea correcta
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
