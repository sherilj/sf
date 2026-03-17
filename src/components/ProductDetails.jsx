import React, { useState } from "react";
import {
    Star,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    ShieldCheck,
    Leaf,
    Truck,
    Award,
    ArrowRight
} from "lucide-react";
// ALL_PRODUCTS import removed, uses products prop instead


// Helper for check circle icon
const CheckCircle = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const ProductDetails = ({ product, products = [], cart, wishlist, onBack, onViewProduct, onAddToCart, onGoToCart, onToggleWishlist }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");

    if (!product) return null;

    const [isAdded, setIsAdded] = useState(false);
    const [mainImage, setMainImage] = useState(product.img);

    const images = [product.img, product.img, product.img, product.img]; // Placeholder for more images

    const tabs = [
        { id: "description", label: "DESCRIPTION" },
        { id: "features", label: "FEATURES" },
        { id: "benefits", label: "BENEFITS" },
        { id: "uses", label: "USES" },
        { id: "faqs", label: "FAQS" }
    ];

    const getDynamicContent = () => {
        const cat = product.category.toLowerCase();
        if (cat === "honey") {
            return {
                features: [
                    "100% Raw and Unprocessed",
                    "Ethically sourced from deep forests",
                    "No added sugar or preservatives",
                    "Naturally rich in antioxidants and enzymes",
                    "Lab-tested for purity and authenticity"
                ],
                benefits: [
                    "Boosts immune system naturally",
                    "Effective remedy for cough and cold",
                    "Improves digestion and gut health",
                    "Provides an instant natural energy boost",
                    "Helps in weight management and detoxification"
                ],
                uses: [
                    "Mix in warm water with lemon every morning",
                    "Use as a natural sweetener in teas and smoothies",
                    "Drizzle over pancakes, waffles, or breakfast bowls",
                    "Apply topically for natural skin healing",
                    "Use in salad dressings and marinades"
                ],
                faqs: [
                    { q: "Is this honey pasteurized?", a: "No, our honey is raw and unpasteurized to maintain all its natural nutritional value." },
                    { q: "Does honey expire?", a: "Pure honey does not expire if stored correctly. It may crystallize, which is a sign of purity." },
                    { q: "Is it safe for children?", a: "Honey should not be given to infants under 1 year of age." }
                ]
            };
        } else if (cat === "ghee") {
            return {
                features: [
                    "Traditionally Bilona Churned",
                    "Made from A2 Desi Cow Milk",
                    "Golden granular texture and rich aroma",
                    "High smoke point, ideal for cooking",
                    "No additives or artificial flavors"
                ],
                benefits: [
                    "Rich in fat-soluble vitamins (A, D, E, K)",
                    "Aids in better nutrient absorption",
                    "Promotes healthy skin and hair",
                    "Supports joint health and flexibility",
                    "Improves brain function and memory"
                ],
                uses: [
                    "Drizzle over hot rotis, dal, and rice",
                    "Use as a healthy cooking medium for sautéing",
                    "Apply on toast instead of butter",
                    "Mix with milk for a nourishing drink",
                    "Ideal for Ayurvedic medicinal preparations"
                ],
                faqs: [
                    { q: "What is Bilona Ghee?", a: "It's the traditional method where milk is turned into curd, which is then churned to extract butter, and finally boiled to make ghee." },
                    { q: "Is A2 Ghee easy to digest?", a: "Yes, A2 ghee contains only A2 beta-casein protein which is easier for the human body to digest." },
                    { q: "Should I refrigerate it?", a: "No refrigeration is required if stored in a cool, dry place in an airtight container." }
                ]
            };
        } else {
            // Default (Chikki etc)
            return {
                features: [
                    "Made with organic jaggery",
                    "Contains no liquid glucose or white sugar",
                    "Crispy texture with high-quality nuts",
                    "Perfect travel and lunchbox snack",
                    "Handcrafted using traditional recipes"
                ],
                benefits: [
                    "Clean energy source for physical activity",
                    "Rich in essential minerals like Iron and Magnesium",
                    "Healthy alternative to processed candies",
                    "Satiates sweet cravings naturally",
                    "Good for bone health due to calcium in sesame/nuts"
                ],
                uses: [
                    "Enjoy as a quick on-the-go snack",
                    "Pack in school or office lunchboxes",
                    "Serve as a healthy dessert after meals",
                    "A perfect companion for tea or coffee",
                    "Post-workout energy booster"
                ],
                faqs: [
                    { q: "Is it very hard to bite?", a: "Our chikkis have a crisp, brittle crunch and are not overly hard like mass-produced ones." },
                    { q: "What is the shelf life?", a: "The product remains fresh for up to 3-4 months when stored in an airtight container." },
                    { q: "Is it gluten-free?", a: "Yes, all our chikki varieties are naturally gluten-free." }
                ]
            };
        }
    };

    const dynamicContent = getDynamicContent();

    const getVariants = () => {
        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
            return product.variants.map(v => ({
                id: v.id || v.variantId || v.variant_id,
                label: v.variantName || v.name || v.label || v.weight || "Standard",
                price: v.price || product.price,
                mrp: v.mrp || product.mrp || (v.price * 1.2),
                stockQuantity: v.stockQuantity || 0,
                availabilityStatus: v.availabilityStatus || "IN_STOCK",
                variantId: v.id || v.variantId || v.variant_id,
                sku: v.sku || "",
                discount: v.discount || 0
            }));
        }

        const cat = typeof product.category === 'string' ? product.category.toLowerCase() : (product.category?.name?.toLowerCase() || "");
        const basePrice = product.price;

        if (cat === "honey") {
            return [
                { label: "250g", price: basePrice, multiplier: 1 },
                { label: "500g", price: Math.round(basePrice * 1.8), multiplier: 2 },
                { label: "1kg", price: Math.round(basePrice * 3.4), multiplier: 4 }
            ];
        } else if (cat === "ghee") {
            return [
                { label: "500ml", price: basePrice, multiplier: 1 },
                { label: "1L", price: Math.round(basePrice * 1.9), multiplier: 2 },
                { label: "2L", price: Math.round(basePrice * 3.6), multiplier: 4 }
            ];
        } else {
            return [
                { label: "200g", price: basePrice, multiplier: 1 },
                { label: "500g", price: Math.round(basePrice * 2.2), multiplier: 2.5 },
                { label: "1kg", price: Math.round(basePrice * 4.2), multiplier: 5 }
            ];
        }
    };

    const variants = getVariants();
    const [selectedVariant, setSelectedVariant] = useState(variants[0]);

    const getTabContent = () => {
        switch (activeTab) {
            case "features":
                return (
                    <div className="tab-pane">
                        <h3>Product Features</h3>
                        <ul className="pd-list">
                            {dynamicContent.features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                    </div>
                );
            case "benefits":
                return (
                    <div className="tab-pane">
                        <h3>Key Benefits</h3>
                        <ul className="pd-list">
                            {dynamicContent.benefits.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                    </div>
                );
            case "uses":
                return (
                    <div className="tab-pane">
                        <h3>Suggested Uses</h3>
                        <ul className="pd-list">
                            {dynamicContent.uses.map((u, i) => <li key={i}>{u}</li>)}
                        </ul>
                    </div>
                );
            case "faqs":
                return (
                    <div className="tab-pane">
                        <h3>Frequently Asked Questions</h3>
                        {dynamicContent.faqs.map((f, i) => (
                            <div key={i} className="faq-item">
                                <p className="faq-q">{f.q}</p>
                                <p className="faq-a">{f.a}</p>
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div className="tab-pane">
                        <h3>Product Description</h3>
                        <p>
                            {product.desc} Sourced with care to ensure the highest quality and authenticity.
                        </p>
                        <p>
                            Our commitment to purity means you get the best of nature's bounty.
                            We work directly with local farmers and artisans to bring you products that are as good for you as they are for the earth.
                        </p>
                    </div>
                );
        }
    };

    // Related products logic
    const relatedProducts = products
        .filter(p => p.id !== product.id && (p.category === product.category || p.category?.name === product.category?.name))
        .slice(0, 3);

    // Reset isAdded when variant or product changes
    React.useEffect(() => {
        setIsAdded(false);
    }, [selectedVariant, product]);

    return (
        <div className="product-details-container">
            {/* Breadcrumb / Back button */}
            <div className="pd-breadcrumb">
                <button onClick={onBack} className="back-btn">
                    <ChevronLeft size={18} /> Back to {product.category}
                </button>
            </div>

            <div className="pd-main-grid">
                {/* Left: Image Gallery */}
                <div className="pd-gallery">
                    <div className="pd-main-image">
                        {product.badgeLeft && <span className="pd-discount-badge">{product.badgeLeft}</span>}
                        <img src={mainImage} alt={product.name} />
                    </div>
                    <div className="pd-thumbnails">
                        <button className="thumb-nav prev"><ChevronLeft size={16} /></button>
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className={`thumb ${mainImage === img ? 'active' : ''}`}
                                onClick={() => setMainImage(img)}
                            >
                                <img src={img} alt={`Thumb ${i}`} />
                            </div>
                        ))}
                        <button className="thumb-nav next"><ChevronRight size={16} /></button>
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="pd-info">
                    <div className="pd-header">
                        <span className="pd-cat-label">{product.category.toUpperCase()}</span>
                        <div className="pd-actions">
                            <Heart
                                size={20}
                                className={`pd-icon ${wishlist.some(item => item.id === product.id) ? 'active' : ''}`}
                                onClick={() => onToggleWishlist(product)}
                                color={wishlist.some(item => item.id === product.id) ? "#7C3225" : "#4A4A4A"}
                                fill={wishlist.some(item => item.id === product.id) ? "#7C3225" : "none"}
                                style={{ cursor: 'pointer' }}
                            />
                            <Share2 size={20} className="pd-icon" />
                        </div>
                    </div>

                    <h1 className="pd-title">{product.name}</h1>

                    <div className="pd-rating-row">
                        <div className="pd-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < 4 ? "#FFC107" : (i < product.rating ? "#FFC107" : "none")} color="#FFC107" />
                            ))}
                        </div>
                        <span className="pd-review-count">124 Verified Reviews</span>
                    </div>

                    <div className="pd-price-row">
                        <span className="pd-current-price">₹{selectedVariant.price}</span>
                        <span className="pd-old-price">₹{Math.round(selectedVariant.mrp || selectedVariant.price * 1.2)}</span>
                        <span className="pd-save-badge">Save ₹{Math.round((selectedVariant.mrp || selectedVariant.price * 1.2) - selectedVariant.price)}</span>
                    </div>
                    
                    {/* Stock Information */}
                    <div className="pd-stock-info">
                        {selectedVariant.availabilityStatus === 'OUT_OF_STOCK' ? (
                            <span className="pd-out-of-stock">Out of Stock</span>
                        ) : selectedVariant.availabilityStatus === 'LOW_STOCK' ? (
                            <span className="pd-low-stock">Only {selectedVariant.stockQuantity} left!</span>
                        ) : (
                            <span className="pd-in-stock">In Stock ({selectedVariant.stockQuantity} available)</span>
                        )}
                    </div>

                    <div className="pd-variant-selector">
                        <span className="pd-variant-label">Select Variant:</span>
                        <div className="variant-options">
                            {variants.map((v, i) => (
                                <button
                                    key={i}
                                    className={`variant-btn ${selectedVariant.label === v.label ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedVariant(v);
                                    }}
                                    disabled={v.availabilityStatus === 'OUT_OF_STOCK'}
                                >
                                    <div className="variant-name">{v.label}</div>
                                    <div className="variant-price">₹{v.price}</div>
                                    <div className="variant-stock">
                                        {v.availabilityStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 
                                         v.availabilityStatus === 'LOW_STOCK' ? `Only ${v.stockQuantity} left` : 
                                         'In Stock'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="pd-short-desc">
                        {product.desc} Handpicked and processed naturally to preserve essential nutrients and authentic flavor.
                    </p>

                    <div className="pd-buy-block">
                        <div className="pd-quantity-selector">
                            <button
                                onClick={() => {
                                    if (quantity > 1) {
                                        setQuantity(quantity - 1);
                                    }
                                }}
                                className="qty-btn"
                                disabled={quantity <= 1}
                                style={quantity <= 1 ? { opacity: 0.35, cursor: 'not-allowed' } : { }}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="qty-val">{quantity}</span>
                            <button
                                onClick={() => {
                                    setQuantity(quantity + 1);
                                }}
                                className="qty-btn"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <button
                            className={`pd-add-to-cart ${isAdded ? 'added' : ''}`}
                            onClick={() => {
                                if (onAddToCart) {
                                    for (let i = 0; i < quantity; i++) onAddToCart(product, selectedVariant);
                                    setIsAdded(true);
                                }
                            }}
                        >
                            {isAdded ? "ADDED TO CART" : "ADD TO CART"} {isAdded ? <CheckCircle size={18} color="#FFF" /> : <ChevronRight size={18} />}
                        </button>

                    </div>

                    <div className="pd-delivery-status">
                        <span className="status-item"><CheckCircle size={14} color="#1AA60B" /> IN STOCK</span>
                        <span className="status-item"><Truck size={14} /> SHIPS IN 24 HOURS</span>
                        <span className="status-item"><ShieldCheck size={14} /> 100% AUTHENTIC</span>
                    </div>

                    {/* Sidebar / Why Choose Svasthya */}
                    <div className="pd-why-svasthya">
                        <h3>Why Choose Svasthya?</h3>
                        <div className="why-item">
                            <div className="why-icon"><Leaf size={18} /></div>
                            <div className="why-text">
                                <span className="why-label">100% Raw & Pure</span>
                                <span className="why-sub">Sourced directly from certified ethical farms.</span>
                            </div>
                        </div>
                        <div className="why-item">
                            <div className="why-icon"><Award size={18} /></div>
                            <div className="why-text">
                                <span className="why-label">Lab Tested Quality</span>
                                <span className="why-sub">Every batch undergoes 24+ rigorous quality checks.</span>
                            </div>
                        </div>
                        <div className="pd-testimonial">
                            <p>"The purity of their products reminds me of home-made goodness. Truly authentic!"</p>
                            <div className="test-author">
                                <span className="author-avatar">RJ</span>
                                <span className="author-name">Rajesh J.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="pd-tabs-section">
                <div className="pd-tabs-header">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="pd-tabs-content">
                    {getTabContent()}
                </div>
            </div>

            {/* "You May Also Like" Section - Matching Reference Image */}
            <div className="pd-related">
                <div className="related-main-header-center">
                    <h2 className="serif-title">You May Also Like</h2>
                    <button className="view-all-link" onClick={onBack}>VIEW ALL</button>
                </div>

                <div className="you-may-like-grid horizontal-scroll">
                    {products.filter(p => p.id !== product.id).slice(0, 5).map(p => (
                        <div key={p.id} className="premium-mini-card" onClick={() => onViewProduct(p)}>
                            <div className="p-mini-img-wrap">
                                <img src={p.img} alt={p.name} />
                                {p.badgeLeft && <span className="p-mini-discount">{p.badgeLeft}</span>}
                            </div>
                            <div className="p-mini-content">
                                <h4 className="p-mini-name">{p.name}</h4>
                                <span className="p-mini-cat">{p.category.toUpperCase()}</span>
                                <div className="p-mini-bottom">
                                    <span className="p-mini-price">₹{p.price}</span>
                                    <div className="p-mini-arrow">
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
