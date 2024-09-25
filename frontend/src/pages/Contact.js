import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>Contáctanos</h2>
      <p>¡Nos encantaría saber de ti! Síguenos en nuestras redes sociales o envíanos un mensaje a través de WhatsApp:</p>
      <div className="social-icons">
        <a href="https://www.facebook.com/profile.php?id=61566486777505" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="social-icon" />
          Facebook
        </a>
        <a href="https://www.instagram.com/nandosalas48/" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="social-icon" />
          Instagram
        </a>
        <a href="https://wa.me/+573507060893" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="social-icon" />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Contact;
