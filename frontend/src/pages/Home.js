import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import '../styles/carousel.css'; 

const Home = () => {
  
  const offerImages = [
    './offers/promo1.png',
     './offers/actu2.png'
  ];

  return (
    <div>
      <h2>ANUNCIOS</h2>
      <Carousel
  className="carousel-container"
  showThumbs={false}
  infiniteLoop={true}
  autoPlay={true}
  interval={45000}
  showStatus={false}
  dynamicHeight={false}
  stopOnHover={false}
>
  {offerImages.map((image, index) => (
    <div key={index} className="carousel-item">
      <img src={image} alt={`Promotion ${index + 1}`} />
    </div>
  ))}
</Carousel>

    </div>
  );
};

export default Home;
