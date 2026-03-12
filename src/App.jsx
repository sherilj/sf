import React, { useState, useEffect } from "react";
import "./styles.css";
import "./products.css";
import "./cart.css";
import "./checkout.css";
import {
  Search,
  ShoppingCart,
  User,
  Key,
  Plus,
  Trash2,
  Edit3,
  Edit,
  MapPin,
  Home,
  Briefcase,
  ChevronDown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  Heart,
  Menu,
} from "lucide-react";
import LandingPage from "./components/LandingPage";
import ProductsPage, { ALL_PRODUCTS } from "./components/ProductsPage";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import CartPage from "./components/CartPage";
import OurStory from "./components/OurStory";
import Contact from "./components/Contact";
import Checkout from "./components/Checkout";
import ProfileModal from "./components/ProfileModal";
import ProfileDetails from "./components/ProfileDetails";
import Delivery from "./components/Delivery";
import Payment from "./components/Payment";
import OrderConfirmation from "./components/OrderConfirmation";
import WishlistPage from "./components/WishlistPage";
import AuthPage from "./components/AuthPage";
import MyOrders from "./components/MyOrders";
import SupportCenter from "./components/SupportCenter";
import OrderTracking from "./components/OrderTracking";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentPage, setCurrentPage] = useState("auth");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    altPhone: "",
  });
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem("svasthya_addresses");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingAddressStandalone, setIsAddingAddressStandalone] = useState(false);
  const [editingAddressStandalone, setEditingAddressStandalone] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [lastOrderId, setLastOrderId] = useState("#SV-431423");

  // Profile state persisted separately (saved to localStorage)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("svasthya_profile");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  // API token persisted in localStorage (easy, insecure) but kept in state for runtime
  const [apiToken, setApiTokenState] = useState(() => {
    try {
      return localStorage.getItem("svasthya_token") || null;
    } catch (e) {
      return null;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return !!localStorage.getItem("svasthya_user"); } catch { return false; }
  });
  const [user, setUser] = useState(() => {
    try { const saved = localStorage.getItem("svasthya_user"); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("svasthya_orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [supportInitialOrder, setSupportInitialOrder] = useState(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem("svasthya_orders", JSON.stringify(orders));
  }, [orders]);

  // Sync addresses to localStorage
  useEffect(() => {
    localStorage.setItem("svasthya_addresses", JSON.stringify(addresses));
  }, [addresses]);

  // Fetch addresses from API
  useEffect(() => {
    if (!apiToken) return;
    fetch("http://65.1.85.74:8082/api/v1/addresses", {
      headers: { "Authorization": `Bearer ${apiToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch addresses");
        return res.json();
      })
      .then(data => {
        let arrayData = [];
        if (Array.isArray(data)) arrayData = data;
        else if (data && Array.isArray(data.addresses)) arrayData = data.addresses;
        else if (data && Array.isArray(data.data)) arrayData = data.data;
        
        const formatted = arrayData.map(addr => ({
          ...addr,
          id: addr.id || addr._id,
          type: addr.addressType || addr.type || "Home",
          building_no: addr.buildingNo || addr.building_no || "",
          building_name: addr.buildingName || addr.building_name || "",
          street_no: addr.streetNo || addr.street_no || "",
          area_name: addr.areaName || addr.area_name || "",
          city: addr.city || "",
          state: addr.state || "",
          other_type: addr.otherType || addr.other_type || "",
          pincode: addr.pinCode || addr.pincode || "",
          is_default: addr.isDefault !== undefined ? addr.isDefault : addr.is_default
        }));
        setAddresses(formatted);
      })
      .catch(err => console.error("Error fetching addresses:", err));
  }, [apiToken]);

  // Restore session from localStorage on mount (kept intentionally simple)
  useEffect(() => {
    // Simulate a small delay for smooth entry
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Persist profile helper - syncs with remote API and localStorage
  const saveProfile = async (newProfile) => {
    // show transient saving message
    setSaveSuccessMessage("Saving profile...");

    // require an auth token set in-memory (via header button)
    const token = apiToken;
    if (!token) {
      // No remote token — persist locally so profile isn't lost
      const mergedLocal = { ...(profile || {}), ...newProfile };
      setProfile(mergedLocal);
      try { localStorage.setItem("svasthya_profile", JSON.stringify(mergedLocal)); } catch (e) {}
      setUser(prev => {
        const updated = { ...(prev || {}), name: mergedLocal.name, email: mergedLocal.email };
        try { localStorage.setItem("svasthya_user", JSON.stringify(updated)); } catch (e) {}
        return updated;
      });
      setShowProfileModal(false);
      setSaveSuccessMessage("Profile saved locally");
      setCurrentPage("profile");
      setTimeout(() => setSaveSuccessMessage(""), 2500);
      return;
    }

    try {
      const res = await fetch("http://65.1.85.74:8082/api/v1/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newProfile),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      // prefer server response when available
      let serverData = {};
      try { serverData = await res.json(); } catch (e) { serverData = newProfile; }

      const merged = { ...(profile || {}), ...serverData };
      setProfile(merged);
      try { localStorage.setItem("svasthya_profile", JSON.stringify(merged)); } catch (e) {}
      setUser(prev => {
        const updated = { ...(prev || {}), name: merged.name, email: merged.email };
        localStorage.setItem("svasthya_user", JSON.stringify(updated));
        return updated;
      });
      setShowProfileModal(false);

      setSaveSuccessMessage("Profile changes saved");
      setCurrentPage("profile");
      setTimeout(() => setSaveSuccessMessage(""), 2500);
    } catch (err) {
      setSaveSuccessMessage("");
      // show a simple error toast; keep modal open so user can retry
      alert("Failed to update profile: " + (err.message || err));
      throw err; // rethrow so callers can handle
    }
  };

  const setApiToken = () => {
    const existing = apiToken || "";
    const token = window.prompt("Enter API Bearer token:", existing);
    if (token === null) return; // cancelled
    const trimmed = token.trim();
    if (trimmed === "") {
      setApiTokenState(null);
      try { localStorage.removeItem("svasthya_token"); } catch (e) { }
      setSaveSuccessMessage("API token removed");
      setTimeout(() => setSaveSuccessMessage(""), 2000);
      return;
    }
    setApiTokenState(trimmed);
    try { localStorage.setItem("svasthya_token", trimmed); } catch (e) { }
    setSaveSuccessMessage("API token saved");
    setTimeout(() => setSaveSuccessMessage(""), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("svasthya_user");
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage("auth");
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const formData = new FormData(e.target);
    const name = formData.get("fullname") || "Guest User";
    const email = formData.get("email") || "user@example.com";

    const mockUser = {
      name: isSignIn ? "Valued Member" : name,
      email: email
    };

    // detect whether a saved profile already exists — if not, treat as new user
    let hadSavedProfile = false;
    try { hadSavedProfile = !!localStorage.getItem("svasthya_profile"); } catch (e) { hadSavedProfile = false; }

    localStorage.setItem("svasthya_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsLoggingIn(false);
    window.scrollTo(0, 0);
    setCurrentPage("landing");

    // Merge into profile storage if missing
    const merged = { ...(profile || {}), ...mockUser };
    setProfile(merged);
    try { localStorage.setItem("svasthya_profile", JSON.stringify(merged)); } catch (e) {}
    
    // Show modal for new users. Existing users won't see the popup.
    if (!isSignIn) {
      setShowProfileModal(true);
    } else {
      setShowProfileModal(false);
    }
  };

  const handleOTPVerified = async (phone, fullName, token, isSignInAction, responseData) => {
    if (token) {
      setApiTokenState(token);
      localStorage.setItem("svasthya_token", token);
    }
    
    let mockUser = {
      name: fullName || "Valued Member",
      phone: phone
    };

    let userProfile = null;
    if (isSignInAction && token) {
      try {
        const res = await fetch("http://65.1.85.74:8082/api/v1/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
           const data = await res.json();
           userProfile = data.user || data.data || data;
           if (userProfile) {
             mockUser.name = userProfile.name || mockUser.name;
             mockUser.email = userProfile.email || mockUser.email;
             mockUser.phone = userProfile.mobileNumber || userProfile.phone || mockUser.phone;
           }
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    }

    localStorage.setItem("svasthya_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    setCurrentPage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!isSignInAction) {
      // New user signup - show population popup
      const merged = { ...(profile || {}), name: mockUser.name };
      setProfile(merged);
      try { localStorage.setItem("svasthya_profile", JSON.stringify(merged)); } catch (e) {}
      setShowProfileModal(true);
    } else {
      // Existing user sign in - fetch profile silently, go to home
      if (userProfile) {
        const merged = { ...(profile || {}), ...userProfile, name: mockUser.name };
        setProfile(merged);
        try { localStorage.setItem("svasthya_profile", JSON.stringify(merged)); } catch (e) {}
      } else {
        const merged = { ...(profile || {}), name: mockUser.name };
        setProfile(merged);
        try { localStorage.setItem("svasthya_profile", JSON.stringify(merged)); } catch (e) {}
      }
      setShowProfileModal(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavigateToProducts = (category = "All") => {
    setActiveCategory(category);
    setCurrentPage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, selectedVariant) => {
    setCart(prevCart => {
      const variantLabel = selectedVariant?.label || 'Standard';
      const cartItemId = `${product.id}-${variantLabel}`;

      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          ...product,
          cartItemId,
          selectedVariant: variantLabel,
          price: selectedVariant?.price || product.price,
          quantity: 1
        }];
      }
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleDetailsChange = (field, value) => {
    setCheckoutDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = async (address) => {
    try {
      let finalAddress = { ...address };
      if (apiToken) {
        setSaveSuccessMessage("Saving address...");
        
        const payload = {
          // If user selected 'Other' and provided a custom name, send that as addressType
          addressType: address.type === 'Other' && address.other_type ? address.other_type : address.type,
          type: address.type,
          buildingNo: address.building_no,
          building_no: address.building_no,
          buildingName: address.building_name,
          building_name: address.building_name,
          streetNo: address.street_no,
          street_no: address.street_no,
          areaName: address.area_name,
          area_name: address.area_name,
          city: address.city,
          state: address.state,
          otherType: address.other_type,
          other_type: address.other_type,
          pinCode: address.pincode ? Number(address.pincode) : null,
          pincode: address.pincode ? Number(address.pincode) : null,
          isDefault: address.is_default ? 1 : 0,
          is_default: address.is_default ? 1 : 0
        };

        const res = await fetch("http://65.1.85.74:8082/api/v1/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiToken}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to add address");
        }
        const data = await res.json();
        const apiAddress = data.address || data.data || data;
        finalAddress = {
          ...apiAddress,
          id: apiAddress.id || apiAddress._id,
          type: apiAddress.addressType || apiAddress.type || address.type || "Home",
          building_no: apiAddress.buildingNo || apiAddress.building_no || address.building_no || "",
          building_name: apiAddress.buildingName || apiAddress.building_name || address.building_name || "",
          street_no: apiAddress.streetNo || apiAddress.street_no || address.street_no || "",
          area_name: apiAddress.areaName || apiAddress.area_name || address.area_name || "",
          city: apiAddress.city || address.city || "",
          state: apiAddress.state || address.state || "",
          other_type: apiAddress.otherType || apiAddress.other_type || address.other_type || "",
          pincode: apiAddress.pinCode || apiAddress.pincode || address.pincode || "",
          is_default: apiAddress.isDefault === 1 || apiAddress.isDefault === true || apiAddress.is_default === true
        };
        
        setSaveSuccessMessage("Address saved successfully!");
        setTimeout(() => setSaveSuccessMessage(""), 2000);
      } else {
        finalAddress.id = Date.now();
      }

      setAddresses(prev => {
        const newAddresses = finalAddress.is_default
          ? prev.map(a => ({ ...a, is_default: false })).concat(finalAddress)
          : [...prev, finalAddress];

        return newAddresses;
      });
      setSelectedAddressId(finalAddress.id);
    } catch (err) {
      console.error(err);
      alert("Failed to add address: " + err.message);
    }
  };

  const handleUpdateAddress = async (updatedAddress) => {
    try {
      let finalAddress = { ...updatedAddress };
      if (apiToken) {
        setSaveSuccessMessage("Updating address...");
        // Handle MongoDB _id if present in updatedAddress.id
        const addressId = updatedAddress._id || updatedAddress.id;
        
        const payload = {
          // If user selected 'Other' and provided a custom name, send that as addressType
          addressType: updatedAddress.type === 'Other' && updatedAddress.other_type ? updatedAddress.other_type : updatedAddress.type,
          type: updatedAddress.type,
          buildingNo: updatedAddress.building_no,
          building_no: updatedAddress.building_no,
          buildingName: updatedAddress.building_name,
          building_name: updatedAddress.building_name,
          streetNo: updatedAddress.street_no,
          street_no: updatedAddress.street_no,
          areaName: updatedAddress.area_name,
          area_name: updatedAddress.area_name,
          city: updatedAddress.city,
          state: updatedAddress.state,
          otherType: updatedAddress.other_type,
          other_type: updatedAddress.other_type,
          pinCode: updatedAddress.pincode ? Number(updatedAddress.pincode) : null,
          pincode: updatedAddress.pincode ? Number(updatedAddress.pincode) : null,
          isDefault: updatedAddress.is_default ? 1 : 0,
          is_default: updatedAddress.is_default ? 1 : 0
        };

        const res = await fetch(`http://65.1.85.74:8082/api/v1/addresses/${addressId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiToken}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to update address");
        }
        const data = await res.json();
        const apiAddress = data.address || data.data || data;
        finalAddress = {
          ...apiAddress,
          id: apiAddress.id || apiAddress._id,
          type: apiAddress.addressType || apiAddress.type || updatedAddress.type || "Home",
          building_no: apiAddress.buildingNo || apiAddress.building_no || updatedAddress.building_no || "",
          building_name: apiAddress.buildingName || apiAddress.building_name || updatedAddress.building_name || "",
          street_no: apiAddress.streetNo || apiAddress.street_no || updatedAddress.street_no || "",
          area_name: apiAddress.areaName || apiAddress.area_name || updatedAddress.area_name || "",
          city: apiAddress.city || updatedAddress.city || "",
          state: apiAddress.state || updatedAddress.state || "",
          other_type: apiAddress.otherType || apiAddress.other_type || updatedAddress.other_type || "",
          pincode: apiAddress.pinCode || apiAddress.pincode || updatedAddress.pincode || "",
          is_default: apiAddress.isDefault === 1 || apiAddress.isDefault === true || apiAddress.is_default === true
        };
        setSaveSuccessMessage("Address updated successfully!");
        setTimeout(() => setSaveSuccessMessage(""), 2000);
      } else {
        finalAddress.id = updatedAddress.id;
      }

      setAddresses(prev => prev.map(a => {
        if (finalAddress.is_default && a.id !== finalAddress.id) {
          return { ...a, is_default: false };
        }
        return a.id === finalAddress.id ? finalAddress : a;
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update address: " + err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      if (apiToken) {
        setSaveSuccessMessage("Deleting address...");
        const res = await fetch(`http://65.1.85.74:8082/api/v1/addresses/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${apiToken}` }
        });
        if (!res.ok) throw new Error("Failed to delete address");
        setSaveSuccessMessage("Address deleted successfully!");
        setTimeout(() => setSaveSuccessMessage(""), 2000);
      }

      setAddresses(prev => prev.filter(a => a.id !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete address: " + err.message);
    }
  };

  const goToCheckout = () => {
    setCurrentPage("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToDelivery = () => {
    setCurrentPage("delivery");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeliveryContinue = (method) => {
    setDeliveryMethod(method);
    setCurrentPage("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    if (currentPage !== "landing") {
      setCurrentPage("landing");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (isInitialLoading) {
    return (
      <div className="initial-loader">
        <div className="loader-content">
          <img src="/logo.png" alt="Svasthya Fresh" className="loader-logo" />
          <div className="loader-spinner"></div>
          <p>Nourishing your body...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {saveSuccessMessage && (
        <div className="fixed top-6 right-6 z-60 bg-emerald-600 text-white px-4 py-2 rounded-md shadow">{saveSuccessMessage}</div>
      )}
      <header className="header">
        <div className="header-inner">
          <a
            href="#"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("landing");
              closeMobileMenu();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img src="/logo.png" alt="Svasthya Fresh Logo" />
          </a>

          {/* Desktop Nav */}
          <nav className="nav-menu">
            <a
              href="#"
              className={`nav-link ${currentPage === "landing" ? "active" : ""}`}
              aria-current={currentPage === "landing" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage("landing");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </a>

            <div className="nav-dropdown">
              <a
                href="#"
                className={`nav-link ${["products", "details"].includes(currentPage) ? "active" : ""}`}
                aria-current={["products", "details"].includes(currentPage) ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage("products");
                  setActiveCategory("All");
                }}
              >
                Products <ChevronDown size={14} />
              </a>
              <div className="dropdown-content">
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToProducts("All"); }}>All Products</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToProducts("Honey"); }}>Honey</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToProducts("Chikki"); }}>Chikki</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToProducts("Ghee"); }}>Ghee</a>
              </div>
            </div>

            <a
              href="#"
              className={`nav-link ${currentPage === "ourStory" ? "active" : ""}`}
              aria-current={currentPage === "ourStory" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage("ourStory");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Our Story
            </a>

            <a
              href="#"
              className={`nav-link ${currentPage === "contact" ? "active" : ""}`}
              aria-current={currentPage === "contact" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage("contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Contact
            </a>
          </nav>

          <div className="header-actions">
            <div className={`global-search-container ${isSearchOpen ? 'open' : ''}`}>
              {isSearchOpen && (
                <>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="global-search-input"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (currentPage !== "products" && currentPage !== "details") {
                        setCurrentPage("products");
                      }
                    }}
                    autoFocus
                  />
                  {searchQuery.length > 0 && (
                    <div className="search-suggestions">
                      {ALL_PRODUCTS.filter(p =>
                        p.name.toLowerCase().includes(searchQuery.toLowerCase())
                      ).slice(0, 5).map(product => (
                        <div
                          key={product.id}
                          className="suggestion-item"
                          onClick={() => {
                            handleViewProduct(product);
                            setSearchQuery("");
                            setIsSearchOpen(false);
                          }}
                        >
                          <img src={product.img} alt={product.name} className="suggestion-img" />
                          <div className="suggestion-info">
                            <span className="suggestion-name">{product.name}</span>
                            <span className="suggestion-price">₹{product.price}</span>
                          </div>
                        </div>
                      ))}
                      {ALL_PRODUCTS.filter(p =>
                        p.name.toLowerCase().includes(searchQuery.toLowerCase())
                      ).length === 0 && (
                          <div className="no-suggestions">No products found</div>
                        )}
                    </div>
                  )}
                </>
              )}
              <button className="icon-btn search-trigger" onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) setSearchQuery("");
              }}>
                <Search size={22} color="#4A4A4A" />
              </button>
            </div>

            {/* Wishlist Icon */}
            <button className="icon-btn" onClick={() => { setCurrentPage("wishlist"); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <Heart size={22} color={wishlist.length > 0 ? "#7C3225" : "#4A4A4A"} fill={wishlist.length > 0 ? "#7C3225" : "none"} />
              {wishlist.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
            </button>

            <button className="icon-btn cart-btn" onClick={() => { setCurrentPage("cartPage"); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <ShoppingCart size={22} color="#4A4A4A" />
              <span className="cart-badge">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
            </button>
            {isAuthenticated ? (
              <div className="nav-dropdown user-dropdown">
                <button className="icon-btn">
                  <User size={22} color="#7C3225" />
                </button>
                <div className="dropdown-content user-dropdown-content">
                  <div className="user-info-header">
                    <button
                      className="user-name-label text-left w-full"
                      onClick={(e) => { e.preventDefault(); setCurrentPage("profile"); }}
                    >
                      {user?.name || "Member"}
                    </button>
                    <span className="user-email-label">{user?.email}</span>
                  </div>
                  <div className="mobile-nav-divider" style={{ margin: '8px 0' }} />
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("addresses"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    My Addresses
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("myOrders"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    My Orders
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("support"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    Help & Support
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    Sign Out
                  </a>
                </div>
              </div>
            ) : (
              <button
                className="icon-btn"
                onClick={() => setCurrentPage("auth")}
                title="Sign In"
              >
                <User size={22} color="#4A4A4A" />
              </button>
            )}
            {/* Hamburger button - mobile only */}
            <button
              className="hamburger-btn"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} color="#7C3225" /> : <Menu size={24} color="#4A4A4A" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeMobileMenu(); }}>
          <nav className="mobile-nav-menu">
            <div className="mobile-nav-header">
              <img src="/logo.png" alt="Svasthya Fresh" className="mobile-nav-logo" />
              <button className="icon-btn" onClick={closeMobileMenu} aria-label="Close menu">
                <X size={24} color="#7C3225" />
              </button>
            </div>
            <div className="mobile-nav-links">
              <a href="#" className={`mobile-nav-link ${currentPage === "landing" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); setCurrentPage("landing"); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Home
              </a>
              <div className="mobile-nav-divider" />
              <span className="mobile-nav-section-label">Products</span>
              <a href="#" className="mobile-nav-link mobile-nav-sub"
                onClick={(e) => { e.preventDefault(); handleNavigateToProducts("All"); closeMobileMenu(); }}>
                All Products
              </a>
              <a href="#" className="mobile-nav-link mobile-nav-sub"
                onClick={(e) => { e.preventDefault(); handleNavigateToProducts("Honey"); closeMobileMenu(); }}>
                🍯 Honey
              </a>
              <a href="#" className="mobile-nav-link mobile-nav-sub"
                onClick={(e) => { e.preventDefault(); handleNavigateToProducts("Chikki"); closeMobileMenu(); }}>
                🌾 Chikki
              </a>
              <a href="#" className="mobile-nav-link mobile-nav-sub"
                onClick={(e) => { e.preventDefault(); handleNavigateToProducts("Ghee"); closeMobileMenu(); }}>
                🧈 Ghee
              </a>
              <div className="mobile-nav-divider" />
              <a href="#" className={`mobile-nav-link ${currentPage === "ourStory" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); setCurrentPage("ourStory"); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Our Story
              </a>
              <a href="#" className={`mobile-nav-link ${currentPage === "contact" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); setCurrentPage("contact"); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Contact
              </a>
              {isAuthenticated && (
                <>
                  <div className="mobile-nav-divider" />
                  <a href="#" className={`mobile-nav-link ${currentPage === "addresses" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setCurrentPage("addresses"); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    My Addresses
                  </a>
                  <a href="#" className={`mobile-nav-link ${currentPage === "myOrders" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setCurrentPage("myOrders"); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    My Orders
                  </a>
                  <a href="#" className={`mobile-nav-link ${currentPage === "support" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setCurrentPage("support"); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    Help & Support
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      <main
        className={`main-content ${["landing", "ourStory", "contact", "auth", "addresses"].includes(currentPage) ? "has-landing" : ""} ${["checkout", "delivery", "payment"].includes(currentPage) ? "checkout-mode" : ""} ${currentPage === "orderConfirmation" ? "order-conf-mode" : ""} ${["cartPage", "details", "orderConfirmation"].includes(currentPage) ? "cart-details-mode" : ""} ${currentPage === "products" ? "products-mode" : ""} ${currentPage === "contact" ? "contact-mode" : ""}`}
      >
        <div className="page-transition-wrapper">

          {currentPage === "landing" && (
            <LandingPage
              onNavigateToProducts={handleNavigateToProducts}
              scrollToSection={scrollToSection}
              onNavigateToOurStory={() => { setCurrentPage("ourStory"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          )}
          {currentPage === "products" && (
            <ProductsPage
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onViewProduct={handleViewProduct}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          )}
          {currentPage === "details" && selectedProduct && (
            <ProductDetails
              key={selectedProduct.id}
              product={selectedProduct}
              cart={cart}
              wishlist={wishlist}
              onViewProduct={handleViewProduct}
              onBack={() => setCurrentPage("products")}
              onAddToCart={addToCart}
              onGoToCart={() => { setCurrentPage("cartPage"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onToggleWishlist={toggleWishlist}
            />
          )}
          {currentPage === "wishlist" && (
            <WishlistPage
              wishlist={wishlist}
              onAddToCart={addToCart}
              onRemove={toggleWishlist}
              onViewProduct={handleViewProduct}
              onContinueShopping={() => { setCurrentPage("products"); setActiveCategory("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          )}
          {currentPage === "myOrders" && (
            <MyOrders
              orders={orders}
              onContinueShopping={() => { setCurrentPage("products"); setActiveCategory("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onViewProduct={handleViewProduct}
              onTrackOrder={(order) => {
                setSelectedOrderForTracking(order);
                setCurrentPage("orderTracking");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onContactSupport={(order) => {
                setSupportInitialOrder(order);
                setCurrentPage("support");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
          {currentPage === "orderTracking" && (
            <OrderTracking
              order={selectedOrderForTracking}
              onBack={() => {
                setCurrentPage("myOrders");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onContactSupport={() => {
                setSupportInitialOrder(selectedOrderForTracking);
                setCurrentPage("support");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
          {currentPage === "support" && (
            <SupportCenter
              orders={orders}
              ALL_PRODUCTS={ALL_PRODUCTS}
              initialOrder={supportInitialOrder}
              onContinueShopping={() => { setCurrentPage("products"); setActiveCategory("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          )}
          {currentPage === "cartPage" && (
            <CartPage
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onContinueShopping={() => { setCurrentPage("products"); setActiveCategory("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onProceedToCheckout={goToCheckout}
            />
          )}
          {currentPage === "ourStory" && <OurStory />}
          {currentPage === "contact" && <Contact />}
          {currentPage === "checkout" && (
            <Checkout
              cart={cart}
              details={checkoutDetails}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onAddAddress={handleAddAddress}
              onUpdateAddress={handleUpdateAddress}
              onDeleteAddress={handleDeleteAddress}
              onDetailsChange={handleDetailsChange}
              onBackToCart={() => {
                setCurrentPage("cartPage");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onContinue={goToDelivery}
            />
          )}
          {currentPage === "delivery" && (
            <Delivery
              cart={cart}
              details={checkoutDetails}
              address={addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.is_default) || addresses[0]}
              selectedMethod={deliveryMethod}
              onSelectMethod={setDeliveryMethod}
              onBack={() => {
                setCurrentPage("checkout");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onContinue={handleDeliveryContinue}
            />
          )}
          {currentPage === "payment" && (
            <Payment
              cart={cart}
              details={checkoutDetails}
              address={addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.is_default) || addresses[0]}
              selectedMethod={deliveryMethod}
              onBack={() => {
                setCurrentPage("delivery");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onPlaceOrder={(method) => {
                const newOrderId = `#SV-${Math.floor(100000 + Math.random() * 900000)}`;
                let methodLabel = "Card Payment";
                if (method === "cod" || method === "Cash on Delivery") methodLabel = "Cash on Delivery";
                else if (method === "upi" || method === "UPI / Netbanking") methodLabel = "UPI / Netbanking";

                const newOrder = {
                  id: newOrderId,
                  date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                  items: [...cart],
                  total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + (deliveryMethod === 'express' ? 150 : 0),
                  status: 'Processing',
                  deliveryMethod,
                  paymentMethod: methodLabel,
                  customerName: user?.name
                };
                setOrders(prev => [newOrder, ...prev]);
                setLastOrderId(newOrderId);
                setCart([]);
                setCurrentPage("orderConfirmation");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
          {currentPage === "orderConfirmation" && (
            <OrderConfirmation
              orderId={lastOrderId}
              onContinueShopping={() => {
                setCurrentPage("products");
                setActiveCategory("All");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onReturnHome={() => {
                setCurrentPage("landing");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
          {currentPage === "auth" && (
            <AuthPage
              isSignIn={isSignIn}
              setIsSignIn={setIsSignIn}
              handleAuth={handleAuth}
              isLoggingIn={isLoggingIn}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onOTPVerified={handleOTPVerified}
            />
          )}
          {currentPage === "profile" && (
            <ProfileDetails profile={profile} onSave={saveProfile} />
          )}
          {currentPage === "addresses" && (
            <div className="max-w-4xl mx-auto p-6 address-page-standalone">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#7C3225]">My Addresses</h2>
                  <p className="text-gray-500">Manage your saved delivery locations</p>
                </div>
                <button
                  className="flex items-center gap-2 px-6 py-3 bg-[#7C3225] text-white rounded-full font-semibold shadow-lg hover:bg-[#5a241b] transition-all"
                  onClick={() => {
                    setSelectedAddressId(null);
                    // We need a local state for the form visibility here too, or handle it in App.jsx
                    // For simplicity, I'll use a hacky way since App.jsx is already huge.
                    // Actually, I'll just add a simple modal state to App.jsx for global address management
                    setIsAddingAddressStandalone(true);
                  }}
                >
                  <Plus size={20} /> Add New Address
                </button>
              </div>

              <div className="address-grid">
                {addresses.map((addr) => (
                  <div key={addr.id} className="address-card-item standalone">
                    <div className="address-card-header">
                      <div className="address-type-badge">
                        {addr.type === 'Home' && <Home size={16} />}
                        {addr.type === 'Office' && <Briefcase size={16} />}
                        {addr.type === 'Other' && <MapPin size={16} />}
                        {addr.type}
                        {addr.is_default && <span className="address-default-tag">DEFAULT</span>}
                      </div>
                      <div className="address-actions">
                        <button className="address-action-btn" onClick={() => { setEditingAddressStandalone(addr); setIsAddingAddressStandalone(true); }}>
                          <Edit3 size={16} />
                        </button>
                        <button className="address-action-btn" onClick={() => handleDeleteAddress(addr.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="address-content py-4">
                      <p className="font-semibold text-gray-800">{addr.building_no}, {addr.building_name}</p>
                      <p className="text-gray-600">{addr.street_no}, {addr.area_name}</p>
                      <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                    {!addr.is_default && (
                      <button
                        className="mt-2 text-sm font-semibold text-[#1AA60B] hover:underline"
                        onClick={() => handleUpdateAddress({ ...addr, is_default: true })}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                ))}
                {addresses.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400">No addresses saved yet</h3>
                    <p className="text-gray-400">Add an address to speed up your checkout process</p>
                  </div>
                )}
              </div>

              {isAddingAddressStandalone && (
                <AddressForm
                  initialAddress={editingAddressStandalone || {}}
                  onSave={(addr) => {
                    if (editingAddressStandalone) handleUpdateAddress(addr);
                    else handleAddAddress(addr);
                    setIsAddingAddressStandalone(false);
                    setEditingAddressStandalone(null);
                  }}
                  onCancel={() => {
                    setIsAddingAddressStandalone(false);
                    setEditingAddressStandalone(null);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <footer id="contact" className="footer">
        <div className="footer-bg-wrapper">
          <img
            src="/footer_market.png"
            alt="Market Illustration"
            className="footer-illustration"
          />
        </div>
        <div className="footer-content">
          <div className="footer-left">
            <h2 className="footer-title">Svasthya Fresh</h2>
            <p className="footer-text">
              Bringing nature's finest to your doorstep. We believe in purity,
              authenticity, and health.
            </p>
            <div className="social-links">
              <span className="social-bubble">IG</span>
              <span className="social-bubble">WA</span>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("landing"); window.scrollTo(0, 0); }}>Home</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("products"); setActiveCategory("All"); }}>Shop</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("ourStory"); window.scrollTo(0, 0); }}>Our Story</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage("contact"); window.scrollTo(0, 0); }}>Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Shipping Policy</a>
                </li>
                <li>
                  <a href="#">Returns</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="separator">|</span>
          <p>&copy; 2026 Svasthya Fresh. All rights reserved.</p>
        </div>
      </footer>

      {/* Profile completion modal (non-dismissible until saved) */}
      {showProfileModal && (
        <ProfileModal initialProfile={profile} onSave={saveProfile} />
      )}
    </div >
  );
}

export default App;
