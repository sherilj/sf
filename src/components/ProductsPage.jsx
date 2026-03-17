import React, { useState } from "react";
import { Search, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import HeroSection from "./HeroSection";

// Products are now fetched from API and passed via props.


const ProductsPage = ({ activeCategory, setActiveCategory, onViewProduct, searchQuery, setSearchQuery, wishlist, onToggleWishlist, products = [], categories = ["All"], onAddToCart }) => {

  const groupedProducts = categories.filter(c => c !== "All").reduce((acc, cat) => {
    const filtered = products.filter(p => (p.category === cat || (p.category?.name === cat)) && p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filtered.length > 0) acc[cat] = filtered;
    return acc;
  }, {});

  const handleShopNow = () => {
    // Scroll to products section or stay on page
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const CategorySection = ({ title, products, onViewProduct, onToggleWishlist, wishlist, onAddToCart }) => {
    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
        scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
    };

    return (
      <div className="category-section">
        <h2 className="category-section-title">{title}</h2>
        <div className="products-slider-container">
          <button className="slider-arrow left" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
          <div className="products-page-grid" ref={scrollRef}>
            {products.map((product) => (
              <div className="p-card-vertical" key={product.id}>
                <div className="p-card-image">
                  <img src={product.img} alt={product.name} />
                  {product.badgeLeft && (
                    <span className="p-badge left-badge">{product.badgeLeft}</span>
                  )}
                  {product.badgeRight && (
                    <span
                      className={`p-badge right-badge ${product.badgeRight === "PREMIUM" ? "premium" : ""}`}
                    >
                      {product.badgeRight}
                    </span>
                  )}
                  <button
                    className={`p-wishlist-btn ${wishlist?.some(item => item.id === product.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
                  >
                    <Heart
                      size={18}
                      fill={wishlist?.some(item => item.id === product.id) ? "#7C3225" : "none"}
                      color={wishlist?.some(item => item.id === product.id) ? "#7C3225" : "#4A4A4A"}
                    />
                  </button>
                </div>
                <div className="p-card-info">
                  <div className="p-card-meta">
                    <span className="p-cat">{product.category.toUpperCase()}</span>
                    <span className="p-rating">
                      <Star size={12} fill="#FFC107" color="#FFC107" />{" "}
                      {product.rating}
                    </span>
                  </div>
                  <h3 className="p-title">{product.name}</h3>
                  <p className="p-desc">{product.desc}</p>
                  
                  <div className="p-card-footer">
                    <div className="p-price-block">
                      <div className="p-price-row">
                        <span className="p-mrp">₹{Math.round(product.mrp || product.price * 1.2)}</span>
                        <span className="p-price">₹{product.price}</span>
                      </div>
                      {product.selectedVariant?.stockQuantity <= 10 && (
                        <div className="p-stock-warning">
                          <small>Only {product.selectedVariant.stockQuantity} left!</small>
                        </div>
                      )}
                    </div>
                    <div className="p-card-buttons">
                      <button className="p-view-btn" onClick={() => onViewProduct(product)}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-arrow right" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="products-page">
      {/* Hero Section */}
      <HeroSection onShopNow={handleShopNow} />
      
      {/* Header Area */}
      <div className="products-page-header">
        <h1 className="products-page-title">Our Products</h1>
        <div className="title-divider">
          <span className="diamond"></span>
        </div>
        <p className="products-page-subtitle">
          Browse our collection of premium, naturally sourced products.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="products-filter-bar">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Products */}
      <div className="products-sections-wrapper">
        {activeCategory === "All" ? (
          Object.entries(groupedProducts).map(([cat, products]) => (
            <CategorySection
              key={cat}
              title={`${cat} Collection`}
              products={products}
              onViewProduct={onViewProduct}
              onToggleWishlist={onToggleWishlist}
              wishlist={wishlist}
              onAddToCart={onAddToCart}
            />
          ))
        ) : (
          <CategorySection
            title={`${activeCategory} Selection`}
            products={products.filter(p => (p.category === activeCategory || p.category?.name === activeCategory) && p.name?.toLowerCase().includes(searchQuery.toLowerCase()))}
            onViewProduct={onViewProduct}
            onToggleWishlist={onToggleWishlist}
            wishlist={wishlist}
            onAddToCart={onAddToCart}
          />
        )}
      </div>

      {/* Coming Soon Section */}
      <section className="coming-soon-section text-center">
        <h2 className="coming-soon-title">Coming Soon</h2>
        <div className="title-divider-white" style={{ marginBottom: '15px' }}>
          <span className="diamond-white"></span>
        </div>
        <p className="coming-soon-subtitle-new">Exciting New Products Launching Soon</p>

        <div className="coming-soon-grid-new">
          <div className="coming-card-new">
            <img src="/4a.jpg" alt="Healthy Bowls" className="coming-img-new" />
            <div className="coming-card-content">
              <h3 className="coming-title-new">Healthy Bowls</h3>
              <div className="card-divider-new"></div>
              <p className="coming-desc-new">Pure &amp; Unprocessed</p>
            </div>
            <button className="btn-product coming-btn" style={{ backgroundColor: '#2e6b27' }}>View Product &gt;</button>
          </div>
          <div className="coming-card-new">
            <img src="/4b.jpg" alt="Cold Pressed Juice" className="coming-img-new" />
            <div className="coming-card-content">
              <h3 className="coming-title-new">Cold Pressed Juice</h3>
              <div className="card-divider-new"></div>
              <p className="coming-desc-new">Crunchy &amp; Nutritious</p>
            </div>
            <button className="btn-product coming-btn" style={{ backgroundColor: '#b5580a' }}>View Product &gt;</button>
          </div>
        </div>
      </section>

      {/* Heritage Banner */}
      <section className="heritage-banner-section">
        <h2 className="heritage-banner-text">"Purity is not just a claim, it's our heritage."</h2>
      </section>
    </div>
  );
};

export default ProductsPage;
