import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DropshipperLogin() {
  const navigate = useNavigate();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  // Login Tab: 'mobile' | 'id_password'
  const [loginMethod, setLoginMethod] = useState('mobile');

  // Form states
  const [mobileNumber, setMobileNumber] = useState('');
  const [dropshipperId, setDropshipperId] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register form fields
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [city, setCity] = useState('');

  // Handle Mobile input (only 10 digits)
  const handleMobileChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (digits.length <= 10) {
      setMobileNumber(digits);
      if (error) setError('');
    }
  };

  // Send / Verify OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtp(['8', '9', '4', '2']); // Auto-fill demo OTP
    }, 600);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Complete Login and Redirect to Supplier Product Catalog
  const handleCompleteLogin = (userLabel = 'DS-89420') => {
    setIsLoading(true);
    setError('');

    // Save session in localStorage
    localStorage.setItem(
      'meesho_dropshipper_session',
      JSON.stringify({
        isLoggedIn: true,
        dropshipperId: userLabel,
        name: businessName || 'Aura Trends Luxe',
        brandName: businessName || 'Aura Trends Luxe',
        storeUrl: 'https://auratrends.shop',
        platform: 'Shopify',
        capacity: '50 - 200 orders/month',
        pan: 'ABCDE1234F',
        aadhaar: '4829 1920 3810',
        gstin: '29ABCDE1234F1Z5',
        tier: 'Tier 1 Verified',
        loginTime: new Date().toISOString(),
      })
    );

    setTimeout(() => {
      setIsLoading(false);
      navigate('/supplier-products');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col justify-between font-sans selection:bg-[#b90041]/30 w-full overflow-x-hidden">
      {/* Top Brand Bar */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer min-w-0" onClick={() => navigate('/')}>
            <span className="text-lg sm:text-2xl font-black text-[#FF3F6C] font-['Plus_Jakarta_Sans'] tracking-tight whitespace-nowrap">
              Meesho Direct
            </span>
            <span className="bg-[#b90041]/20 text-[#FF6B8B] text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-[#b90041]/40 uppercase tracking-wide whitespace-nowrap">
              B2B <span className="hidden sm:inline">Dropshipper </span>Portal
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/login')}
              className="text-[11px] sm:text-xs text-gray-400 hover:text-white transition cursor-pointer whitespace-nowrap"
            >
              <span className="hidden xs:inline">Reseller </span>Login →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Authentication Card */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Header inside Card */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                  {authMode === 'login' ? 'Dropshipper Login' : 'Register Dropshipper'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {authMode === 'login'
                    ? 'Access supplier catalog, SKUs, and margin tools'
                    : 'Create your B2B account with zero deposit'}
                </p>
              </div>

              {/* Mode Switcher Pills */}
              <div className="bg-gray-950 p-1 rounded-xl border border-gray-800 flex items-center text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                    setOtpSent(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    authMode === 'login' ? 'bg-[#b90041] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setError('');
                    setOtpSent(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    authMode === 'register' ? 'bg-[#b90041] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

              {/* Login Method Tabs (Only in Login Mode) */}
              {authMode === 'login' && !otpSent && (
                <div className="flex border-b border-gray-800 mb-6 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('mobile')}
                    className={`pb-2.5 px-4 cursor-pointer transition border-b-2 flex items-center gap-1.5 ${
                      loginMethod === 'mobile'
                        ? 'border-[#FF3F6C] text-[#FF3F6C] font-bold'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">smartphone</span>
                    <span>Mobile OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('id_password')}
                    className={`pb-2.5 px-4 cursor-pointer transition border-b-2 flex items-center gap-1.5 ${
                      loginMethod === 'id_password'
                        ? 'border-[#FF3F6C] text-[#FF3F6C] font-bold'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">badge</span>
                    <span>Dropshipper ID / Email</span>
                  </button>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-rose-400">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* FORM: Mobile OTP Login */}
              {authMode === 'login' && loginMethod === 'mobile' && !otpSent && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1.5">
                      Registered Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1 text-sm font-bold text-gray-400 border-r border-gray-700 pr-2.5">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        placeholder="Enter 10-digit number (e.g. 9876543210)"
                        className="w-full pl-24 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#b90041] focus:border-transparent transition"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      An OTP will be sent to verify your dropshipper account.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#b90041] hover:bg-[#a00037] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-pink-900/30 transition cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    ) : (
                      <>
                        <span>Get Verification OTP</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* FORM: OTP Verification Screen */}
              {authMode === 'login' && loginMethod === 'mobile' && otpSent && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-400 block text-[11px]">OTP sent to</span>
                      <strong className="text-white font-mono text-sm">+91 {mobileNumber}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#FF3F6C] hover:underline font-bold text-xs cursor-pointer"
                    >
                      Edit Number
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-2 text-center">
                      Enter 4-Digit Security Code
                    </label>
                    <div className="flex items-center justify-center gap-3">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-12 h-14 text-center bg-gray-950 border border-gray-700 rounded-xl text-xl font-bold font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#b90041] transition"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3 px-1">
                      <span>Enter code sent via SMS</span>
                      <button
                        type="button"
                        onClick={() => {
                          setOtp(['', '', '', '']);
                        }}
                        className="text-[#FF3F6C] hover:underline font-semibold cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCompleteLogin(`DS-${mobileNumber.slice(-5) || '89420'}`)}
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#b90041] hover:bg-[#a00037] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-pink-900/30 transition cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">login</span>
                        <span>Verify</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* FORM: Dropshipper ID & Password Login */}
              {authMode === 'login' && loginMethod === 'id_password' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!dropshipperId) {
                      setError('Please enter your Dropshipper ID or Business Email');
                      return;
                    }
                    handleCompleteLogin(dropshipperId);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Dropshipper ID / Business Email
                    </label>
                    <input
                      type="text"
                      value={dropshipperId}
                      onChange={(e) => setDropshipperId(e.target.value)}
                      placeholder="e.g. DS-89420 or partner@store.com"
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b90041]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-300">Password</label>
                      <a href="#forgot" className="text-[11px] text-[#FF3F6C] hover:underline">
                        Forgot Password?
                      </a>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b90041]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#b90041] hover:bg-[#a00037] text-white font-extrabold text-sm rounded-xl shadow-lg transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">login</span>
                        <span>Sign In to Supplier Portal</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* FORM: New Dropshipper Registration */}
              {authMode === 'register' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!businessName || !mobileNumber) {
                      setError('Please enter your Business/Store Name and Mobile Number');
                      return;
                    }
                    handleCompleteLogin('DS-NEW-' + Math.floor(1000 + Math.random() * 9000));
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Business / Store Name *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Royal Fashion Boutique"
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b90041]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        placeholder="10 Digits"
                        className="w-full px-3 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b90041]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Jaipur"
                        className="w-full px-3 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b90041]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      GSTIN (Optional — for tax credits)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 08AAAAA0000A1Z5"
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white uppercase focus:outline-none focus:ring-2 focus:ring-[#b90041]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition cursor-pointer active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">how_to_reg</span>
                        <span>Register</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Legal & Terms notice */}
              <div className="mt-6 pt-5 border-t border-gray-800 text-center">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  By continuing, you agree to the Meesho Dropshipper Agreement &amp; B2B Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </main>

      {/* Footer */}
      <footer className="border-t border-gray-850 py-4 px-6 text-center text-xs text-gray-500">
        <p>© 2026 Meesho B2B Network • Direct Supplier-to-Customer Fulfillment Engine</p>
      </footer>
    </div>
  );
}
