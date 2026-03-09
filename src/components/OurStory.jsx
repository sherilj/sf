import React, { useState } from "react";
import { Check } from "lucide-react";

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

const OurStory = () => {
  return (
    <div className="our-story-page">
      {/* Hero Section with Palm Leaves */}
      <section className="story-hero-section">
        <div className="palm-decoration left"></div>
        <div className="palm-decoration right"></div>
        <div className="story-hero-content">
          <h1 className="story-hero-title">Our Story</h1>
          <p className="story-hero-subtitle">Fresh By Nature, Bringing you pure</p>
          <div className="hero-book-illustration">
            <ImageWithLoader src="/story-book-hero.png" alt="Ayurvedic herbs and book illustration" />
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="promise-section-story">
        <div className="promise-story-container">
          <div className="promise-story-image">
            <ImageWithLoader src="/wild_honey.png" alt="Honey jar with honey dipper" />
          </div>
          <div className="promise-story-content">
            <h4 className="subtitle-promise">OUR PROMISE</h4>
            <h2 className="promise-story-title">
              Why Choose Svasthya<br />Fresh?
            </h2>
            <p className="promise-story-text">
              We go beyond just selling products. We are committed to bringing you the purest form of nature, ensuring every drop of honey and every bite of chikki is a step towards a healthier lifestyle.
            </p>
            <div className="promise-features-grid">
              <div className="promise-feature-item">
                <span className="check-icon"><Check size={16} /></span>
                <span>Direct from Farmers</span>
              </div>
              <div className="promise-feature-item">
                <span className="check-icon"><Check size={16} /></span>
                <span>100% Traceable</span>
              </div>
              <div className="promise-feature-item">
                <span className="check-icon"><Check size={16} /></span>
                <span>No Middlemen</span>
              </div>
              <div className="promise-feature-item">
                <span className="check-icon"><Check size={16} /></span>
                <span>Chemical Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Cards Section */}
      <section className="values-cards-section">
        <div className="values-cards-container">
          <div className="value-card-story">
            <h3>Authenticity</h3>
            <div className="card-divider"></div>
            <p>We don't cut corners. If it's not authentic, it doesn't make it to our shelves.</p>
          </div>
          <div className="value-card-story">
            <h3>Sustainability</h3>
            <div className="card-divider"></div>
            <p>We ensure our packaging and sourcing methods give back to the planet.</p>
          </div>
          <div className="value-card-story">
            <h3>Community</h3>
            <div className="card-divider"></div>
            <p>Empowering local farmers and artisans by providing them fair value.</p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <blockquote className="story-quote">
          "We believe in purity, authenticity and health"
        </blockquote>
      </section>
    </div>
  );
};

export default OurStory;
