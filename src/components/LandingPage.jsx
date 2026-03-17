import React, { useState } from "react";
import { Leaf, ShieldCheck, Zap, CheckCircle } from "lucide-react";
import HeroSection from "./HeroSection";

const ImageWithLoader = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className={`image-placeholder ${className}`} />}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
      />
    </>
  );
};

const LandingPage = ({ onNavigateToProducts, scrollToSection, onNavigateToOurStory }) => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <HeroSection onShopNow={() => onNavigateToProducts("All")} />

      {/* Essentials Section */}
      <section id="essentials" className="essentials-section">
        <div className="essentials-content">
          <h4 className="subtitle-green">PURE. LOCAL. HONEST.</h4>
          <h2 className="section-title-large">
            Natural & organic
            <br />
            essentials for a healthier,
            <br />
            happier you.
          </h2>
          <p className="essentials-text">
            Small-batch honey and traditional treats crafted
            <br />
            with transparency, traceability and zero shortcuts
          </p>
          <div className="essentials-buttons">
            <button className="btn-secondary" onClick={() => onNavigateToProducts("All")}>Shop bestsellers &gt;</button>
            <button className="btn-secondary" onClick={() => {
              if (typeof scrollToSection === 'function') {
                scrollToSection('why-svasthya');
              } else {
                const element = document.getElementById("why-svasthya");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }
            }}>Why Svasthya Fresh &gt;</button>
          </div>
          <ul className="essentials-features">
            <li>Harvested from trusted beekeepers</li>
            <li>Lab-tested for purity</li>
            <li>Delivered fresh to your door</li>
          </ul>
        </div>
        <div className="essentials-image">
          <img src="/2nd.jpg" alt="Tea Set" className="arch-image" />
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section brown-bg text-center">
        <h2 className="section-title-white">Our Products</h2>
        <div className="title-divider-white">
          <span className="diamond-white"></span>
        </div>
        <p className="products-subtitle">
          Discover our range of pure, natural, and honest products
          <br />
          crafted with care for your healthy lifestyle.
        </p>

        <div
          className="products-grid products-grid-3"
          style={{ marginTop: "20px" }}
        >
          {/* Natural Honey Card */}
          <div className="product-card">
            <div className="product-image-wrap">
              <img src="/wild_honey.png" alt="Natural Honey" />
            </div>
            <div className="product-info">
              <h3>Natural Honey</h3>
              <p>Pure & Unprocessed</p>
              <button
                className="btn-product btn-product-brown"
                onClick={() => onNavigateToProducts("Honey")}
              >
                View Product &gt;
              </button>
            </div>
          </div>

          {/* Traditional Chikki Card */}
          <div className="product-card">
            <div className="product-image-wrap">
              <img src="/chikki_pic.png" alt="Traditional Chikki" />
            </div>
            <div className="product-info">
              <h3>Traditional Chikki</h3>
              <p>Crunchy & Nutritious</p>
              <button
                className="btn-product btn-product-brown"
                onClick={() => onNavigateToProducts("Chikki")}
              >
                View Product &gt;
              </button>
            </div>
          </div>

          {/* Pure Desi Ghee Card */}
          <div className="product-card">
            <div className="product-image-wrap">
              <img src="/ghee_pic.png" alt="Pure Desi Ghee" />
            </div>
            <div className="product-info">
              <h3>Pure Desi Ghee</h3>
              <p>Pure & Wholesome</p>
              <button
                className="btn-product btn-product-brown"
                onClick={() => onNavigateToProducts("Ghee")}
              >
                View Product &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Teaser */}
      <section className="landing-soon-section text-center" style={{ borderBottom: '1px solid #D2C4BB' }}>
        <h2 className="landing-soon-title">Coming Soon</h2>
        <div className="landing-title-divider">
          <span className="diamond"></span>
        </div>
        <p className="landing-soon-subtitle">Stay Tuned for...</p>

        <div className="landing-soon-grid">
          <div className="landing-soon-col">
            <h3 className="landing-soon-col-title">Healthy Bowls</h3>
            <p className="landing-soon-col-sub">Millet Bowls • Protein Bowls • Diabetic Friendly</p>
            <img src="/4a.jpg" alt="Healthy Bowls" className="landing-soon-img" />
          </div>
          <div className="landing-soon-col">
            <h3 className="landing-soon-col-title">Cold Pressed Juices</h3>
            <p className="landing-soon-col-sub">Fresh &amp; Natural • No Preservations</p>
            <img src="/4b.jpg" alt="Cold Pressed Juices" className="landing-soon-img" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section text-center">
        <h2 className="section-title-brown">Natural Benefits</h2>
        <div className="landing-title-divider">
          <span className="diamond"></span>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">
              <Leaf size={24} color="#FFF" />
            </div>
            <p>100% Natural</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <ShieldCheck size={24} color="#FFF" />
            </div>
            <p>No Chemicals</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <Zap size={24} color="#FFF" />
            </div>
            <p>Traditional</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <CheckCircle size={24} color="#FFF" />
            </div>
            <p>Quality Tested</p>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section id="why-svasthya" className="promise-section brown-bg">
        <div className="promise-content">
          <h4 className="subtitle-white">OUR PROMISE</h4>
          <h2 className="section-title-large-white">
            Why Choose Svasthya
            <br />
            Fresh?
          </h2>
          <p className="promise-text">
            We go beyond just selling products. We are
            <br />
            committed to bringing you the purest form of
            <br />
            nature, ensuring every drop of honey and every
            <br />
            bite of chikki is a step towards a healthier
            <br />
            lifestyle.
          </p>
          <button className="btn-light" onClick={() => {
            if (onNavigateToOurStory) onNavigateToOurStory();
          }}>Read Our Story &gt;</button>
        </div>
        <div className="promise-image">
          <img src="/5th.png" alt="Vegetables" className="rounded-img" />
        </div>
      </section>

      {/* Story Section */}
      <section id="our-story" className="story-section text-center">
        <img
          src="/6a.png"
          alt="Traditional Village Scene"
          className="story-side-image story-side-image--left"
        />
        <div className="story-center">
          <h2 className="section-title-brown">Rooted in Tradition</h2>
          <div className="story-divider" aria-hidden="true">
            <span className="story-divider-diamond"></span>
          </div>
          <p>
            Bringing you the goodness of traditional, healthy foods sourced directly
            from local farmers. Pure. Simple. Svasthya.
          </p>
          <div className="story-divider" aria-hidden="true">
            <span className="story-divider-diamond"></span>
          </div>
        </div>
        <img
          src="/6b.png"
          alt="Grains and Honey"
          className="story-side-image story-side-image--right"
        />
      </section>
    </div>
  );
};

export default LandingPage;
