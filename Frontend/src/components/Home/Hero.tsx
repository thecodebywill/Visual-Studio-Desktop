import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>The ultimate stablecoin settlement solution</h1>
        <p>Leveraging the celo network to enable seamless stablecoin payments and transactions.</p>
        <a href="/invoice" className="cta-button">Launch Beta</a>
      </div>
    </section>
  );
};

export default Hero;
