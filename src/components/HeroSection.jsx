import React from "react";

const HeroSection = ({ title = "Nourish your Body, Naturally", onShopNow, backgroundImage = "/1st.png" }) => {
  return (
    <section className="hero-section text-center">
      <div className="hero-image-container">
        <img src={backgroundImage} alt="Ayurvedic Herbs" className="hero-img-main" />
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <div className="title-divider"></div>
          <div className="landing-title-divider" style={{ marginBottom: '18px' }}>
            <span className="diamond"></span>
          </div>
          <button className="btn-secondary" onClick={onShopNow}>Shop Now</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
