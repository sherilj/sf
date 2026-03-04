import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const AuthPage = ({ isSignIn, setIsSignIn, handleAuth, isLoggingIn, showPassword, setShowPassword }) => {
    return (
        <div className="auth-fullscreen">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="card-left">
                        <img
                            src={isSignIn ? "/vegetables.png" : "/waterfall.png"}
                            alt={isSignIn ? "Fresh Vegetables" : "Nature Waterfall"}
                            className="hero-img"
                        />
                    </div>
                    <div className="card-right">
                        <div className="form-wrapper">
                            <h1 className="auth-title">
                                {isSignIn ? "Sign In" : "Create Account"}
                            </h1>
                            <p className="auth-subtitle">
                                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsSignIn(!isSignIn);
                                    }}
                                >
                                    {isSignIn ? "Sign up" : "Sign in"}
                                </a>
                            </p>

                            <form className="auth-form" onSubmit={handleAuth}>
                                {!isSignIn && (
                                    <div className="auth-input-group">
                                        <label>Full Name</label>
                                        <div className="auth-input">
                                            <User size={20} color="#868889" />
                                            <input
                                                name="fullname"
                                                type="text"
                                                placeholder="Your Name"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="auth-input-group">
                                    <label>Email Address</label>
                                    <div className="auth-input">
                                        <Mail size={20} color="#868889" />
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="auth-input-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label>Password</label>
                                        {isSignIn && (
                                            <a href="#" style={{ fontSize: '0.75rem', color: '#7C3225', textDecoration: 'none', fontWeight: '700' }}>
                                                Forgot Password?
                                            </a>
                                        )}
                                    </div>
                                    <div className="auth-input">
                                        <Lock size={20} color="#868889" />
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="auth-toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} color="#868889" />
                                            ) : (
                                                <Eye size={20} color="#868889" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {!isSignIn && (
                                    <div className="auth-input-group">
                                        <label>Confirm Password</label>
                                        <div className="auth-input">
                                            <Lock size={20} color="#868889" />
                                            <input
                                                name="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="auth-submit" disabled={isLoggingIn}>
                                    {isLoggingIn ? (
                                        <>
                                            <div className="spinner-small" />
                                            {isSignIn ? "Signing In..." : "Creating Account..."}
                                        </>
                                    ) : (
                                        <>
                                            {isSignIn ? "Sign In" : "Create Account"} <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <div className="auth-divider">
                                    <span>{isSignIn ? "Or continue with" : "Or join with"}</span>
                                </div>

                                <div className="auth-social">
                                    <button type="button" className="auth-social-btn google">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                            alt="Google"
                                        />
                                        Google
                                    </button>
                                    <button type="button" className="auth-social-btn facebook">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
                                            alt="Facebook"
                                        />
                                        Facebook
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
