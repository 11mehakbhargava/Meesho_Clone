import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function SupplierRegister({ onNavigate, onBack }) {
  const navigate = useNavigate();

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
      handleNav('/supplier-login');
    }
  };

  // Stepper: 1: Account Info, 2: Business & GST, 3: Bank & Payout
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    gstin: '',
    pan: '',
    registeredState: 'Gujarat',
    category: 'Ethnic Wear (Sarees, Kurtis)',
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
  });

  const [hasNoGstin, setHasNoGstin] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage('');
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name';
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) return 'A valid 10-digit mobile number is required';
    if (!formData.password || formData.password.length < 6) return 'Password must be at least 6 characters long';
    if (formData.password !== formData.confirmPassword) return 'Password and Confirm Password do not match';
    return null;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.storeName.trim()) return 'Store or business name is required';
    if (!hasNoGstin && formData.gstin.trim() && formData.gstin.trim().length !== 15) {
      return 'GSTIN must be exactly 15 characters (or select the exemption checkbox)';
    }
    return null;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setErrorMessage('');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setErrorMessage('');
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setErrorMessage('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit Registration
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!agreeTerms) {
      setErrorMessage('Please accept the MShoppy Supplier Terms & Conditions');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        name: formData.fullName.trim(),
        phone: formData.phone.replace(/\D/g, '').trim(),
        email: formData.email.trim() || undefined,
        password: formData.password,
        storeName: formData.storeName.trim() || `${formData.fullName}'s Store`,
        gstin: hasNoGstin ? '' : formData.gstin.trim().toUpperCase(),
        pan: formData.pan.trim().toUpperCase(),
        registeredState: formData.registeredState,
        category: formData.category,
        bankDetails: {
          accountHolder: formData.accountHolder || formData.fullName,
          bankName: formData.bankName || '',
          accountNumber: formData.accountNumber || '',
          ifsc: formData.ifsc ? formData.ifsc.toUpperCase() : '',
          upiId: formData.upiId || '',
        },
      };

      const res = await supplierApiService.registerSupplier(payload);
      setSuccessMessage('Congratulations! Your supplier account has been created. Redirecting...');
      setTimeout(() => {
        handleNav('/seller-dashboard');
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Demo Auto Fill
  const fillDemoData = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setFormData({
      fullName: 'Aurelia Fashions Hub',
      phone: `9811${randomDigits}`,
      email: `aurelia_${randomDigits}@test.com`,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      storeName: 'Aurelia Silk & Crafts',
      gstin: '24AAACA1234F1Z5',
      pan: 'AAACA1234F',
      registeredState: 'Gujarat',
      category: 'Ethnic Wear (Sarees, Kurtis)',
      accountHolder: 'Aurelia Fashions Hub',
      bankName: 'HDFC Bank',
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
          alt="MShoppy Supplier Onboarding"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA17Odz0VuEd9507iy5ggYedrO4p3lV7PTifqh_NIFIjMwYs7F7xvv7dJPF3VZ6Z11llVLVw5xtNaMn4qJcaZlijJ5VYBvw4lkhDG0GaD_3mqVC6fp_xGCsC_hT5Kl2Yvq85636Vd8iv-Nfvmw3A5Otx5SstITEeJ4evOSjB2EZqGwhDYhrJHL4AtEO6BSjDVRSWi-AhA3f8HCmXuKT-yo3NUOxOwpD4XR4x4e-hJLySUEWwuFS8o8Obusm8jNEjV35CWqYtkzkNNg"
        />
      </div>

      {/* Top Floating Badge & Header */}
      <header className="relative z-30 pt-8 pb-4 w-full max-w-2xl px-6 flex items-center justify-between">
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
          onClick={() => handleNav('/supplier-login')}
          className="text-xs font-bold text-[#b7004d] bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-full border border-pink-200/60 shadow-xs transition cursor-pointer flex items-center gap-1"
        >
          Login &rarr;
        </button>
      </header>

      {/* 2. Main Centered Card Container */}
      <main className="relative z-20 w-full max-w-2xl px-6 pt-4 pb-12 flex flex-col items-center">
        <div className="w-full shadow-2xl border border-white/60 bg-white/95 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 space-y-6">
          {/* Card Title */}
          <div className="text-center pt-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#4a2135]">
              Supplier Registration
            </h1>
            <p className="text-[#7d4d62] font-medium opacity-80 mt-1 text-sm">
              Setup your account, GSTIN &amp; bank account for 7-day automated payouts
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-between max-w-md mx-auto relative pt-2">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0"></div>
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-[#b7004d] transition-all duration-300 z-0"
              style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
            ></div>

            {/* Step 1 Pill */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => setCurrentStep(1)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                currentStep >= 1 ? 'bg-[#b7004d] text-white shadow-md' : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className={`text-[11px] font-bold ${currentStep === 1 ? 'text-[#b7004d]' : 'text-slate-500'}`}>
                Account
              </span>
            </div>

            {/* Step 2 Pill */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => { if (currentStep > 2 || !validateStep1()) setCurrentStep(2); }}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                currentStep >= 2 ? 'bg-[#b7004d] text-white shadow-md' : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className={`text-[11px] font-bold ${currentStep === 2 ? 'text-[#b7004d]' : 'text-slate-500'}`}>
                Business &amp; GST
              </span>
            </div>

            {/* Step 3 Pill */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                currentStep === 3 ? 'bg-[#b7004d] text-white shadow-md' : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </div>
              <span className={`text-[11px] font-bold ${currentStep === 3 ? 'text-[#b7004d]' : 'text-slate-500'}`}>
                Bank Details
              </span>
            </div>
          </div>

          {/* Quick Demo Fill Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#ffecf1]/70 border border-pink-200/60 text-xs">
            <span className="text-[#4a2135] font-medium">⚡ Testing mode: Auto-fill form with 1 click</span>
            <button
              type="button"
              onClick={fillDemoData}
              className="px-3 py-1 rounded-lg bg-[#b7004d] text-white font-bold hover:bg-[#9e0037] transition cursor-pointer"
            >
              Fill Demo Data
            </button>
          </div>

          {/* Error & Success Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================= STEP 1: ACCOUNT DETAILS ================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-pink-100 pb-2">
                <h3 className="font-extrabold text-sm text-[#4a2135]">Step 1: Contact &amp; Login Information</h3>
                <p className="text-xs text-[#7d4d62]">Enter your name, mobile, and secure password</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex rounded-xl border border-slate-200 focus-within:border-[#b7004d] focus-within:ring-2 focus-within:ring-[#ff7293]/20 overflow-hidden bg-white">
                    <div className="bg-slate-50 px-3 flex items-center border-r border-slate-200 text-xs font-bold text-slate-700">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="10-digit mobile"
                      className="w-full h-11 px-3 text-sm font-semibold tracking-wider outline-none"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. supplier@mshoppy.com"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleNav('/supplier-login')}
                  className="text-xs text-[#b7004d] font-bold hover:underline cursor-pointer"
                >
                  &larr; Back to Login
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#b7004d] hover:bg-[#9e0037] text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  Next: Business &amp; GST &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: BUSINESS & GST DETAILS ================= */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-pink-100 pb-2">
                <h3 className="font-extrabold text-sm text-[#4a2135]">Step 2: Store &amp; GSTIN Details</h3>
                <p className="text-xs text-[#7d4d62]">Provide your store name and tax registration number</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Store / Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="e.g. Surat Sarees Hub"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Primary Selling Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GSTIN & Exemption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#4a2135]">
                    GSTIN (15 Digits)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasNoGstin}
                      onChange={(e) => setHasNoGstin(e.target.checked)}
                      className="rounded text-[#b7004d] focus:ring-pink-400"
                    />
                    <span>Exempt from GST (Enrollment ID)</span>
                  </label>
                </div>

                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={(e) => {
                    const g = e.target.value.toUpperCase();
                    setFormData(p => ({
                      ...p,
                      gstin: g,
                      pan: g.length >= 12 ? g.slice(2, 12) : p.pan
                    }));
                  }}
                  disabled={hasNoGstin}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  className="w-full h-11 px-3.5 text-sm uppercase rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none disabled:bg-slate-100 disabled:text-slate-400 bg-white"
                  maxLength={15}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    PAN Card Number
                  </label>
                  <input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={(e) => setFormData(p => ({ ...p, pan: e.target.value.toUpperCase() }))}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full h-11 px-3.5 text-sm uppercase rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Registered State
                  </label>
                  <select
                    name="registeredState"
                    value={formData.registeredState}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#b7004d] hover:bg-[#9e0037] text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  Next: Bank Details &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: BANK DETAILS & SUBMIT ================= */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-pink-100 pb-2">
                <h3 className="font-extrabold text-sm text-[#4a2135]">Step 3: Bank Details for 7-Day Automated Payouts</h3>
                <p className="text-xs text-[#7d4d62]">All sales revenue will be settled into this bank account</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={formData.accountHolder || formData.fullName}
                    onChange={handleChange}
                    placeholder="As printed on bank records"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. HDFC Bank, SBI, ICICI"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Bank Account Number
                  </label>
                  <input
                    type="password"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={(e) => setFormData(p => ({ ...p, ifsc: e.target.value.toUpperCase() }))}
                    placeholder="e.g. HDFC0001234"
                    className="w-full h-11 px-3.5 text-sm uppercase rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                    maxLength={11}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a2135] mb-1.5">
                  UPI ID <span className="text-slate-400 font-normal">(Optional for instant verification)</span>
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g. storename@okhdfcbank"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 focus:border-[#b7004d] focus:ring-2 focus:ring-[#ff7293]/20 outline-none bg-white"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#b7004d] focus:ring-pink-400"
                  />
                  <span>
                    I agree to the MShoppy Supplier Terms of Service, 0% Commission Policy, and Return Policy.
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3.5 rounded-xl bg-[#b7004d] hover:bg-[#9e0037] text-white font-bold text-sm shadow-md shadow-pink-900/10 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Registering Supplier...
                    </>
                  ) : (
                    '🚀 Complete Supplier Registration'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Footer Security Badge */}
          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            <span>SSL Encrypted &amp; Certified Supplier Registration Portal</span>
          </div>
        </div>
      </main>
    </div>
  );
}
