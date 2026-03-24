import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

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

const Contact = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (onShowToast) {
      onShowToast("Thank you for your message! We will get back to you soon.");
    } else {
      alert("Thank you for your message! We will get back to you soon.");
    }
    setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero-section">
        {/* Palm Leaves Decorations */}
        <div className="palm-decoration palm-left">
          <ImageWithLoader src="/corner-palm-leaves.png" alt="Palm leaf decoration" />
        </div>
        <div className="palm-decoration palm-right">
          <ImageWithLoader src="/corner-palm-leaves.png" alt="Palm leaf decoration" />
        </div>

        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get in Touch</h1>
          
          <div className="hero-divider">
            <span className="diamond-divider"></span>
          </div>

          <p className="hero-highlight">We'd love to hear from you.</p>
          <p className="contact-hero-subtitle">
            Whether you have a question about our products, orders, or just want to say hello.
          </p>
          
          <div className="contact-hero-illustration">
            <ImageWithLoader src="/contact-scroll-illustration.png" alt="Contact scroll illustration" />
          </div>
        </div>
      </section>

      {/* Main Content: Info and Form */}
      <section className="contact-main-section">
        <div className="contact-container">
          {/* Left: Contact Info Card */}
          <div className="contact-info-brown-card">
            <h2>Contact Information</h2>
            
            <div className="info-item">
              <div className="info-icon-circle">
                <Phone size={24} />
              </div>
              <div className="info-text">
                <h4>Phone & WhatsApp</h4>
                <p>Mon-Sat from 9am to 6pm</p>
                <strong>+91 98765 43210</strong>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-circle">
                <Mail size={24} />
              </div>
              <div className="info-text">
                <h4>Email</h4>
                <p>We'll get back to you within 24 hours</p>
                <strong>hello@svasthyafresh.com</strong>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-circle">
                <MapPin size={24} />
              </div>
              <div className="info-text">
                <h4>Our Office</h4>
                <p>123 Nature's Way, Green Valley, Bangalore, Karnataka, India - 560001</p>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="contact-form-white-card">
            <h2>Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="contact-form-refined">
              <div className="form-row-refined">
                <div className="form-group-refined">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Dinesh"
                    required
                  />
                </div>
                <div className="form-group-refined">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="S"
                    required
                  />
                </div>
              </div>

              <div className="form-group-refined">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Dinesh@gmail.com"
                  required
                />
              </div>

              <div className="form-group-refined">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="hello example...good ...."
                  required
                />
              </div>

              <div className="form-group-refined">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows="4"
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-refined">
                <Send size={18} className="send-icon" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
