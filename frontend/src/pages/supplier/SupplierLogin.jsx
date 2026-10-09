import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supplierApiService from '../../services/supplierApiService';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CATEGORIES = [
  'Ethnic Wear (Sarees, Kurtis)',
  'Western Wear & Dresses',
  'Men Fashion & Footwear',
  'Jewellery & Accessories',
  'Beauty & Personal Care',
  'Home Decor & Kitchenware',
  'Bags & Luggage',
  'Electronics & Gadgets'
];

export default function SupplierLogin({ onNavigate, onBack, defaultTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect active tab from prop or URL
  const initialTab = defaultTab || (location?.pathname?.includes('register') ? 'register' : 'login');
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync state if defaultTab prop or location changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    } else if (location?.pathname?.includes('register')) {
      setActiveTab('register');
    } else if (location?.pathname?.includes('login')) {
      setActiveTab('login');
    }
  }, [defaultTab, location?.pathname]);

  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      handleNav('/seller-dashboard');
    }
  };

  const handleTabToggle = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      window.history.replaceState(null, '', tab === 'register' ? '/supplier-register' : '/supplier-login');
    } catch {
      // Fallback
    }
  };

  // ==========================================
  // --- LOGIN STATE & LOGIC ---
  // ==========================================
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle Login via Password
  const handlePasswordLogin = async (e) => {
    e?.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your supplier email, phone, or ID');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await supplierApiService.loginWithPassword(identifier.trim(), password);
      setSuccessMessage(`Welcome back, ${res.supplier?.name || 'Supplier'}! Redirecting...`);
      setTimeout(() => {
        handleNav('/seller-dashboard');
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await supplierApiService.sendOtp(cleanPhone);
      setOtpSent(true);
      setResendTimer(30);
      setSuccessMessage(res.message || `OTP sent to +91 ${cleanPhone}`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMessage('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const res = await supplierApiService.verifyOtp(cleanPhone, otp);
      setSuccessMessage(`Welcome back, ${res.supplier?.name || 'Supplier'}! Redirecting...`);
      setTimeout(() => {
        handleNav('/seller-dashboard');
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoLogin = () => {
    setIdentifier('supplier@globalexports.com');
    setPassword('Password@123');
    setErrorMessage('');
  };

  const fillDemoOtp = () => {
    setPhone('9876543210');
    setOtp('123456');
    setOtpSent(true);
    setErrorMessage('');
  };

  // ==========================================
  // --- SINGLE-PAGE REGISTRATION STATE & LOGIC ---
  // ==========================================
  const [regData, setRegData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    storeName: '',
    gstin: '',
    pan: '',
    registeredState: 'Gujarat',
    category: 'Ethnic Wear (Sarees, Kurtis)',
    accountNumber: '',
    ifsc: '',
    upiId: '',
  });

  const [hasNoGstin, setHasNoGstin] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Common Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage('');
  };

  // Unified Single-Page Registration Submission
  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();

    if (!regData.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    const cleanPhone = regData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('A valid 10-digit mobile number is required');
      return;
    }
    if (!regData.password || regData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (!regData.storeName.trim()) {
      setErrorMessage('Store or business name is required');
      return;
    }
    if (!hasNoGstin && regData.gstin.trim() && regData.gstin.trim().length !== 15) {
      setErrorMessage('GSTIN must be exactly 15 characters (or select Enrolment ID / No GST)');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the MShoppy Supplier Terms & Conditions');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        fullName: regData.fullName.trim(),
        name: regData.fullName.trim(),
        phone: cleanPhone,
        email: regData.email.trim() || undefined,
        password: regData.password,
        storeName: regData.storeName.trim() || `${regData.fullName}'s Store`,
        gstin: hasNoGstin ? '' : regData.gstin.trim().toUpperCase(),
        pan: regData.pan.trim().toUpperCase(),
        registeredState: regData.registeredState,
        category: regData.category,
        bankDetails: {
          accountHolder: regData.fullName.trim(),
          bankName: '',
          accountNumber: regData.accountNumber.trim(),
          ifsc: regData.ifsc ? regData.ifsc.toUpperCase().trim() : '',
          upiId: regData.upiId.trim() || '',
        },
      };

      await supplierApiService.registerSupplier(payload);
      setSuccessMessage('🎉 Congratulations! Your supplier account has been registered successfully. Redirecting...');
      setTimeout(() => {
        handleNav('/seller-dashboard');
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoRegister = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setRegData({
      fullName: 'Aurelia Fashions Hub',
      phone: `9811${randomDigits}`,
      email: `aurelia_${randomDigits}@test.com`,
      password: 'Password@123',
      storeName: 'Aurelia Silk & Crafts',
      gstin: '24AAACA1234F1Z5',
      pan: 'AAACA1234F',
      registeredState: 'Gujarat',
      category: 'Ethnic Wear (Sarees, Kurtis)',
      accountNumber: '50100234567891',
      ifsc: 'HDFC0000123',
      upiId: 'aurelia@hdfcbank',
    });
    setErrorMessage('');
  };

  return (
    <div className="bg-[#fff4f6] text-[#4a2135] min-h-screen w-full overflow-x-hidden relative font-sans flex flex-col items-center">
      {/* 1. Top Curved Banner Graphic */}
      <div className="absolute top-0 left-0 w-full h-[353px] overflow-hidden [clip-path:ellipse(110%_100%_at_50%_0%)] bg-[#ff7293]/20 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fff4f6]/90 z-10" />
        <img
          className="w-full h-full object-cover mix-blend-multiply opacity-80"
          alt="MShoppy Supplier Access"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA17Odz0VuEd9507iy5ggYedrO4p3lV7PTifqh_NIFIjMwYs7F7xvv7dJPF3VZ6Z11llVLVw5xtNaMn4qJcaZlijJ5VYBvw4lkhDG0GaD_3mqVC6fp_xGCsC_hT5Kl2Yvq85636Vd8iv-Nfvmw3A5Otx5SstITEeJ4evOSjB2EZqGwhDYhrJHL4AtEO6BSjDVRSWi-AhA3f8HCmXuKT-yo3NUOxOwpD4XR4x4e-hJLySUEWwuFS8o8Obusm8jNEjV35CWqYtkzkNNg"
        />
      </div>

      {/* Top Floating Badge & Back Button */}
      <header className={`relative z-30 pt-8 pb-4 w-full px-6 flex items-center justify-between transition-all ${activeTab === 'register' ? 'max-w-xl' : 'max-w-md'}`}>
        <button
          onClick={handleGoBack}
          className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-xs border border-white/60 flex items-center justify-center text-slate-700 hover:text-[#b7004d] transition cursor-pointer"
          title="Go Back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Brand Pill Badge */}
        <div className="bg-white/90 backdrop-blur-[20px] px-6 py-2 rounded-full border border-white/40 shadow-[0_12px_40px_rgba(74,33,53,0.06)] flex items-center gap-2">
          <span className="text-[#b7004d] font-black tracking-tighter text-lg">
            MSHOPPY <span className="uppercase text-[#ff7293] text-xs font-bold tracking-widest">SUPPLIER</span>
          </span>
        </div>

        <button
          onClick={() => handleNav('/seller-dashboard')}
          className="text-xs font-bold text-[#b7004d] bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-pink-200/60 shadow-xs transition cursor-pointer flex items-center gap-1"
          title="Go to Seller Dashboard"
        >
          Dashboard &rarr;
        </button>
      </header>

      {/* 2. Floating Centered Card */}
      <main className={`relative z-20 w-full px-4 sm:px-6 pt-2 pb-14 flex flex-col items-center transition-all duration-300 ${activeTab === 'register' ? 'max-w-xl' : 'max-w-md'}`}>
        <div className="w-full shadow-2xl border border-white/70 bg-white/95 backdrop-blur-md rounded-[2.2rem] p-6 sm:p-8 space-y-6">

          {/* ============================================================ */}
          {/* TOGGLE BAR (Segmented Switcher: Login | Register) */}
          {/* ============================================================ */}
          <div className="bg-[#ffecf1] p-1.5 rounded-2xl flex items-center gap-1.5 shadow-inner border border-pink-200/60">
            <button
              type="button"
              onClick={() => handleTabToggle('login')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-white text-[#b7004d] shadow-md shadow-pink-900/10 scale-[1.01]'
                  : 'text-[#7d4d62] hover:text-[#b7004d] hover:bg-white/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Supplier Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabToggle('register')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-white text-[#b7004d] shadow-md shadow-pink-900/10 scale-[1.01]'
                  : 'text-[#7d4d62] hover:text-[#b7004d] hover:bg-white/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>New Registration</span>
              <span className="hidden sm:inline-block bg-[#ff7293]/20 text-[#b7004d] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                0% Fee
              </span>
            </button>
          </div>

          {/* Header Title based on Active Tab */}
          <div className="text-center pt-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#4a2135]">
              {activeTab === 'login' ? 'Supplier Login' : 'Register as a Seller'}
            </h1>
            <p className="text-[#7d4d62] font-medium opacity-80 mt-1 text-xs sm:text-sm">
              {activeTab === 'login'
                ? 'Secure portal for registered MShoppy suppliers'
                : 'Single-step registration with 0% Commission • 7-day automated payouts'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB CONTENT A: SUPPLIER LOGIN */}
          {/* ============================================================ */}
          {activeTab === 'login' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Method Switcher: Password vs Mobile OTP */}
              <div className="flex justify-end text-xs">
                {loginMethod === 'password' ? (
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('otp'); setErrorMessage(''); }}
                    className="text-[#b7004d] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>📱 Switch to Mobile OTP Login</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('password'); setErrorMessage(''); }}
                    className="text-[#b7004d] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>🔑 Switch to Password Login</span>
                  </button>
                )}
              </div>

              {/* PASSWORD LOGIN FORM */}
              {loginMethod === 'password' ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4a2135] block">
                      Supplier Email or Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="supplier@mshoppy.com"
                      value={identifier}
                      onChange={(e) => { setIdentifier(e.target.value); setErrorMessage(''); }}
                      className="w-full h-12 px-4 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none transition bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4a2135] block">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                      className="w-full h-12 px-4 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none transition bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#b7004d] hover:bg-[#9e0037] text-white font-bold rounded-xl py-3.5 shadow-md shadow-pink-900/10 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm mt-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Logging in...
                      </>
                    ) : (
                      'Secure Login'
                    )}
                  </button>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={fillDemoLogin}
                      className="text-xs text-slate-500 hover:text-[#b7004d] font-medium transition cursor-pointer underline decoration-dotted"
                    >
                      ⚡ Quick Fill Demo Credentials
                    </button>
                  </div>
                </form>
              ) : (
                /* MOBILE OTP LOGIN FORM */
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4a2135] block">
                      Registered Mobile Number
                    </label>
                    <div className="relative flex rounded-xl border border-slate-200 focus-within:border-[#b7004d] focus-within:ring-2 focus-within:ring-[#ff7293]/20 overflow-hidden bg-white">
                      <div className="bg-slate-50 px-3.5 flex items-center border-r border-slate-200 text-xs font-bold text-slate-700 select-none">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrorMessage(''); }}
                        disabled={otpSent}
                        className="w-full h-12 px-3 text-sm font-semibold tracking-wider outline-none disabled:bg-slate-50 disabled:text-slate-500"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#4a2135]">Enter 6-Digit OTP</label>
                        <button
                          type="button"
                          className="text-[11px] text-[#b7004d] font-semibold hover:underline cursor-pointer"
                          onClick={() => setOtpSent(false)}
                        >
                          Change Number
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full h-12 text-center text-lg font-black tracking-widest rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                        maxLength={6}
                        autoFocus
                      />

                      <div className="flex items-center justify-between text-xs pt-1">
                        {resendTimer > 0 ? (
                          <span className="text-slate-400">Resend in <span className="font-bold text-slate-600">{resendTimer}s</span></span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isLoading}
                            className="font-bold text-[#b7004d] hover:underline cursor-pointer"
                          >
                            Resend OTP
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setOtp('123456')}
                          className="text-[11px] text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md cursor-pointer font-medium"
                        >
                          Fill Demo OTP
                        </button>
                      </div>
                    </div>
                  )}

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading || phone.length !== 10}
                      className="w-full bg-[#b7004d] hover:bg-[#9e0037] text-white font-bold rounded-xl py-3.5 shadow-md shadow-pink-900/10 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm mt-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Sending OTP...
                        </>
                      ) : (
                        'Send OTP & Continue'
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length < 4}
                      className="w-full bg-[#b7004d] hover:bg-[#9e0037] text-white font-bold rounded-xl py-3.5 shadow-md shadow-pink-900/10 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm mt-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Verifying...
                        </>
                      ) : (
                        'Verify & Secure Login'
                      )}
                    </button>
                  )}

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={fillDemoOtp}
                      className="text-xs text-slate-500 hover:text-[#b7004d] font-medium transition cursor-pointer underline decoration-dotted"
                    >
                      ⚡ Quick Fill Demo OTP
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Quick-Switch Link to Register */}
              <div className="pt-4 border-t border-pink-100/80 text-center space-y-2">
                <p className="text-xs text-[#7d4d62] font-medium">New seller on MShoppy?</p>
                <button
                  type="button"
                  onClick={() => handleTabToggle('register')}
                  className="w-full bg-[#ffecf1] hover:bg-[#ffd9e3] text-[#b7004d] font-bold rounded-xl py-3 border border-pink-200 transition cursor-pointer text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2"
                >
                  <span>📝</span> Switch to Registration &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB CONTENT B: SINGLE-PAGE SUPPLIER REGISTRATION FORM */}
          {/* ============================================================ */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in duration-200">
              
              {/* Value Proposition Callout Banner */}
              <div className="p-3 bg-pink-50/70 border border-pink-200/60 rounded-xl flex items-center justify-between text-xs text-[#4a2135]">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚀</span>
                  <span className="font-semibold">0% Commission • 7-Day Bank Payouts • Sell across India</span>
                </div>
                <button
                  type="button"
                  onClick={fillDemoRegister}
                  className="text-[11px] font-bold text-[#b7004d] bg-white border border-pink-200 px-2.5 py-1 rounded-lg hover:bg-pink-50 transition cursor-pointer shrink-0"
                >
                  ⚡ Auto-Fill Demo
                </button>
              </div>

              {/* Section 1: Account & Owner Details */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#b7004d] tracking-wider border-b border-pink-100 pb-1">
                  <span>Account &amp; Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a2135]">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Rahul Sharma"
                      value={regData.fullName}
                      onChange={handleRegChange}
                      className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a2135]">Mobile Number *</label>
                    <div className="relative flex rounded-xl border border-slate-200 focus-within:border-[#b7004d] focus-within:ring-2 focus-within:ring-[#ff7293]/20 overflow-hidden bg-white">
                      <div className="bg-slate-50 px-2.5 flex items-center border-r border-slate-200 text-xs font-bold text-slate-600 select-none">
                        +91
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="10-digit number"
                        value={regData.phone}
                        onChange={handleRegChange}
                        className="w-full h-11 px-2.5 text-sm outline-none"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a2135]">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="seller@brand.com"
                      value={regData.email}
                      onChange={handleRegChange}
                      className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a2135]">Password *</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Min 6 characters"
                      value={regData.password}
                      onChange={handleRegChange}
                      className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Business & GST Details */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#b7004d] tracking-wider border-b border-pink-100 pb-1">
                  <span>Business &amp; Tax Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a2135]">Store / Business Name *</label>
                    <input
                      type="text"
                      name="storeName"
                      placeholder="e.g. Surat Master Sarees"
                      value={regData.storeName}
                      onChange={handleRegChange}
                      className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a2135]">Operating State *</label>
                    <select
                      name="registeredState"
                      value={regData.registeredState}
                      onChange={handleRegChange}
                      className="w-full h-11 px-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white cursor-pointer"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#4a2135]">GSTIN (15-Digit GST Number)</label>
                    <label className="text-[11px] text-[#b7004d] font-semibold flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasNoGstin}
                        onChange={(e) => setHasNoGstin(e.target.checked)}
                        className="rounded text-[#b7004d] focus:ring-[#b7004d]"
                      />
                      <span>Enrolment ID / No GST</span>
                    </label>
                  </div>

                  {!hasNoGstin ? (
                    <input
                      type="text"
                      name="gstin"
                      placeholder="e.g. 24AAAAA0000A1Z5"
                      value={regData.gstin}
                      onChange={handleRegChange}
                      maxLength={15}
                      className="w-full h-11 px-3 text-sm uppercase font-mono tracking-wider rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    />
                  ) : (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                      ℹ️ Compulsory GST exemption applies only to sellers dealing in 100% tax-free goods within a single state.
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4a2135]">Primary Product Category *</label>
                  <select
                    name="category"
                    value={regData.category}
                    onChange={handleRegChange}
                    className="w-full h-11 px-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 3: Bank / Settlement Account (Optional on Registration) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-pink-100 pb-1">
                  <span className="text-xs font-black uppercase text-[#b7004d] tracking-wider">
                    Bank Details for Settlements
                  </span>
                  <span className="text-[10px] text-slate-400">Can also be added later</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a2135]">Bank Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      placeholder="e.g. 5010023456789"
                      value={regData.accountNumber}
                      onChange={handleRegChange}
                      className="w-full h-11 px-3 text-sm font-mono rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a2135]">IFSC Code</label>
                    <input
                      type="text"
                      name="ifsc"
                      placeholder="e.g. HDFC0000123"
                      value={regData.ifsc}
                      onChange={handleRegChange}
                      maxLength={11}
                      className="w-full h-11 px-3 text-sm font-mono uppercase rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4a2135]">UPI ID for Instant Payout (Optional)</label>
                  <input
                    type="text"
                    name="upiId"
                    placeholder="merchant@upi"
                    value={regData.upiId}
                    onChange={handleRegChange}
                    className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-[#4a2135] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#b7004d] focus:ring-[#b7004d] mt-0.5"
                />
                <span>
                  I agree to the <span className="font-bold underline">MShoppy Supplier Agreement</span>, 0% Commission terms, and Return policies.
                </span>
              </label>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#b7004d] hover:bg-[#9e0037] text-white font-bold rounded-xl py-3.5 shadow-md shadow-pink-900/10 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm mt-3"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Supplier Account &rarr;'
                )}
              </button>

              {/* Bottom Quick-Switch Link to Login */}
              <div className="pt-3 border-t border-pink-100/80 text-center space-y-1">
                <p className="text-xs text-[#7d4d62] font-medium">Already have a registered account?</p>
                <button
                  type="button"
                  onClick={() => handleTabToggle('login')}
                  className="text-xs font-bold text-[#b7004d] hover:underline cursor-pointer"
                >
                  Switch to Supplier Login &rarr;
                </button>
              </div>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className="pt-1 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 border-t border-slate-100">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            <span>SSL 256-Bit Encrypted &amp; Certified Supplier Portal</span>
          </div>

        </div>
      </main>
    </div>
  );
}
