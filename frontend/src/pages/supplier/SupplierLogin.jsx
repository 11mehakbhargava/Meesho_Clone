import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supplierApiService from '../../services/supplierApiService';

export default function SupplierLogin({ onNavigate, onBack }) {
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
      handleNav('/seller-dashboard');
    }
  };

  // Sub-mode for Login: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState('password');

  // --- LOGIN FORM STATE ---
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Timer countdown for OTP resend
  React.useEffect(() => {
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
      setSuccessMessage('OTP verified successfully! Redirecting...');
      setTimeout(() => {
        handleNav('/seller-dashboard');
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Auto-Fill Helpers
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
      <header className="relative z-30 pt-8 pb-4 w-full max-w-md px-6 flex items-center justify-between">
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
          onClick={() => handleNav('/supplier-register')}
          className="text-xs font-bold text-[#b7004d] bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-pink-200/60 shadow-xs transition cursor-pointer flex items-center gap-1"
        >
          Register &rarr;
        </button>
      </header>

      {/* 2. Floating Centered Card */}
      <main className="relative z-20 w-full max-w-md px-6 pt-4 pb-12 flex flex-col items-center">
        <div className="w-full shadow-2xl border border-white/60 bg-white/95 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 space-y-6">
          {/* Card Title */}
          <div className="text-center pt-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#4a2135]">
              Supplier Login
            </h1>
            <p className="text-[#7d4d62] font-medium opacity-80 mt-1.5 text-sm">
              Secure portal for registered suppliers
            </p>
          </div>

          {/* Alert Feedback Messages */}
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

          {/* ======================= LOGIN FORM ======================= */}
          <div className="space-y-4">
            {/* Sub-toggle: Password vs Mobile OTP */}
            <div className="flex justify-end text-xs">
              {loginMethod === 'password' ? (
                <button
                  type="button"
                  onClick={() => { setLoginMethod('otp'); setErrorMessage(''); }}
                  className="text-[#b7004d] font-bold hover:underline cursor-pointer"
                >
                  📱 Switch to Mobile OTP
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setErrorMessage(''); }}
                  className="text-[#b7004d] font-bold hover:underline cursor-pointer"
                >
                  🔑 Switch to Password Login
                </button>
              )}
            </div>

            {/* METHOD A: PASSWORD LOGIN */}
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
              /* METHOD B: MOBILE OTP LOGIN */
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

            {/* DEDICATED REGISTER BUTTON WITH GST & BANK DETAILS */}
            <div className="pt-4 border-t border-pink-100/80 text-center space-y-2.5">
              <p className="text-xs text-[#7d4d62] font-medium">New seller on MShoppy?</p>
              <button
                type="button"
                onClick={() => handleNav('/supplier-register')}
                className="w-full bg-[#ffecf1] hover:bg-[#ffd9e3] text-[#b7004d] font-bold rounded-xl py-3.5 border border-pink-200 transition cursor-pointer text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <span>📝</span> Register with GST &amp; Bank Details &rarr;
              </button>
              <p className="text-[11px] text-slate-400">0% Commission • Automated 7-Day Direct Bank Settlements</p>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            <span>SSL Encrypted &amp; Certified Supplier Portal</span>
          </div>
        </div>
      </main>
    </div>
  );
}
