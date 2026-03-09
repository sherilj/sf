import React, { useEffect, useState, useRef } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const OTP_ATTEMPTS_KEY = "otp_attempts"; // will store object { [phone]: [timestamps] }

const AuthPage = ({ isSignIn, setIsSignIn, handleAuth, isLoggingIn, showPassword, setShowPassword, onOTPVerified }) => {
    const [stage, setStage] = useState("phone"); // 'phone' or 'otp'
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [error, setError] = useState("");
    const [attemptsExceeded, setAttemptsExceeded] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (stage === "otp") startTimer();
        return () => clearInterval(timerRef.current);
    }, [stage]);

    useEffect(() => {
        if (timer <= 0) {
            setResendDisabled(false);
            clearInterval(timerRef.current);
        }
    }, [timer]);

    const startTimer = () => {
        setTimer(60);
        setResendDisabled(true);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const loadAttempts = () => {
        try {
            const raw = localStorage.getItem(OTP_ATTEMPTS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    };

    const saveAttempts = (data) => {
        localStorage.setItem(OTP_ATTEMPTS_KEY, JSON.stringify(data));
    };

    const pruneAttempts = (arr) => arr.filter(ts => (Date.now() - ts) < 3600 * 1000);

    const canAttempt = (phoneNumber) => {
        const data = loadAttempts();
        const arr = pruneAttempts(data[phoneNumber] || []);
        return arr.length < 3;
    };

    const recordAttempt = (phoneNumber) => {
        const data = loadAttempts();
        const arr = pruneAttempts(data[phoneNumber] || []);
        arr.push(Date.now());
        data[phoneNumber] = arr;
        saveAttempts(data);
    };

    const handleSendOtp = (e) => {
        e && e.preventDefault();
        setError("");
        const normalized = phone.replace(/\D/g, "");
        if (normalized.length !== 10) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }
        if (!isSignIn) {
            if (!name.trim()) {
                setError("Please enter your full name.");
                return;
            }
        }
        const phoneKey = `+91${normalized}`;
        if (!canAttempt(phoneKey)) {
            setAttemptsExceeded(true);
            setError("Maximum attempts reached. Please try again in 1 hour.");
            return;
        }
        // Mock sending OTP
        recordAttempt(phoneKey);
        setStage("otp");
        setOtp("");
        startTimer();
    };

    const handleResend = (e) => {
        e && e.preventDefault();
        if (resendDisabled) return;
        const normalized = phone.replace(/\D/g, "");
        const phoneKey = `+91${normalized}`;
        if (!canAttempt(phoneKey)) {
            setAttemptsExceeded(true);
            setError("Maximum attempts reached. Please try again in 1 hour.");
            return;
        }
        recordAttempt(phoneKey);
        setError("");
        startTimer();
    };

    const handleVerifyOtp = (e) => {
        e && e.preventDefault();
        // Mock verification success if otp length 4+ or 6; accept any input for now
        const normalizedOtp = otp.replace(/\D/g, "");
        if (normalizedOtp.length < 4) {
            setError("Please enter the OTP.");
            return;
        }
        // On success, notify parent to navigate to Home and pass name when registering
        const phoneKey = `+91${phone.replace(/\D/g, "")}`;
        onOTPVerified && onOTPVerified(phoneKey, isSignIn ? undefined : name.trim());
    };

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
                                {isSignIn ? "Sign In" : "Create\u00A0Account"}
                            </h1>
                            <p className="auth-subtitle">
                                <span className="no-wrap-inline">
                                    {isSignIn ? "Don't have an account?" : "Already have an account?"}
                                    {' '}
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsSignIn(!isSignIn);
                                        }}
                                    >
                                        {isSignIn ? "Sign\u00A0up" : "Sign\u00A0in"}
                                    </a>
                                </span>
                            </p>

                            <form className="auth-form" onSubmit={stage === "phone" ? handleSendOtp : handleVerifyOtp}>
                                {/* Full Name for registration (above phone) */}
                                {!isSignIn && (
                                    <div className="auth-input-group">
                                        <label>Full Name</label>
                                        <div className="auth-input">
                                            <input
                                                name="fullname"
                                                type="text"
                                                placeholder="Your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Phone input with +91 prefix */}
                                <div className="auth-input-group">
                                    <label>Phone Number</label>
                                    <div className="auth-input" style={{ alignItems: 'center', gap: 8 }}>
                                        <span style={{ background: '#F6F3F1', padding: '8px 10px', borderRadius: 8, color: '#7C3225', fontWeight: 700 }}>+91</span>
                                        <input
                                            name="phone"
                                            type="tel"
                                            placeholder="10-digit number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            maxLength={12}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>

                                {stage === "otp" && (
                                    <div className="auth-input-group">
                                        <label>Enter OTP</label>
                                        <div className="auth-input">
                                            <input
                                                name="otp"
                                                type="text"
                                                placeholder="6-digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                maxLength={6}
                                            />
                                        </div>

                                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <button className="auth-link" onClick={handleResend} disabled={resendDisabled} style={{ background: 'none', border: 'none', color: resendDisabled ? '#C8A79C' : '#7C3225', cursor: resendDisabled ? 'default' : 'pointer', padding: 0 }}>
                                                Resend OTP
                                            </button>
                                            <span style={{ color: '#868889', fontSize: 13 }}>{timer > 0 ? `00:${String(timer).padStart(2, '0')}` : ''}</span>
                                        </div>
                                    </div>
                                )}

                                {error && <div style={{ color: '#B02A2A', marginBottom: 10 }}>{error}</div>}

                                {stage === 'phone' && (
                                    <button type="submit" className="auth-submit">
                                        SEND OTP <ArrowRight size={18} />
                                    </button>
                                )}

                                {stage === 'otp' && (
                                    <button type="submit" className="auth-submit">
                                        {isSignIn ? "VERIFY OTP" : "VERIFY & REGISTER"} <ArrowRight size={18} />
                                    </button>
                                )}

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
