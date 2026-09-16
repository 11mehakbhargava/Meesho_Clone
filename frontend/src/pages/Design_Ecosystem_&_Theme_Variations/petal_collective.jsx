import { useState } from 'react';

export default function PetalCollective({ onNavigate, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('phone'); // 'phone' | 'email' | 'otp' | 'success'
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countryCode, setCountryCode] = useState('+91');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [boutiqueName, setBoutiqueName] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const handleSendOtp = (e) => {
    e?.preventDefault();
    if (mobileNumber.trim().length < 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('otp');
      showToast('OTP sent to ' + countryCode + ' ' + mobileNumber);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4 && enteredOtp !== '1234') {
      showToast('Please enter the 6-digit OTP (e.g. 123456)');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('success');
      showToast('Authentication verified successfully! Welcome to The Atelier.');
    }, 600);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleFinishOnboarding = () => {
    showToast('Boutique initialized! Redirecting to showcase...');
    if (onLoginSuccess) {
      onLoginSuccess();
    } else if (onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <div className="bg-[#fff4f6] text-[#4a2135] min-h-screen flex flex-col items-center overflow-x-hidden font-['Plus_Jakarta_Sans'] selection:bg-[#ff7293]/20 selection:text-[#b7004d] pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] bg-[#4a2135]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce border border-white/10">
          <span className="material-symbols-outlined text-sm text-[#ff7293]">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Section (Atelier Hero with Curved Oval Clip) */}
      <div className="relative w-full h-[330px] sm:h-[360px] overflow-hidden [clip-path:ellipse(110%_100%_at_50%_0%)] bg-[#ff7293]/20 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fff4f6]/30 to-[#fff4f6]/95 z-10"></div>
        <img
          className="w-full h-full object-cover mix-blend-multiply opacity-80"
          alt="Diverse young resellers walking in a modern floral plaza"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA17Odz0VuEd9507iy5ggYedrO4p3lV7PTifqh_NIFIjMwYs7F7xvv7dJPF3VZ6Z11llVLVw5xtNaMn4qJcaZlijJ5VYBvw4lkhDG0GaD_3mqVC6fp_xGCsC_hT5Kl2Yvq85636Vd8iv-Nfvmw3A5Otx5SstITEeJ4evOSjB2EZqGwhDYhrJHL4AtEO6BSjDVRSWi-AhA3f8HCmXuKT-yo3NUOxOwpD4XR4x4e-hJLySUEWwuFS8o8Obusm8jNEjV35CWqYtkzkNNg"
        />

        {/* Floating Brand Chip */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
          <div className="bg-white/80 backdrop-blur-xl px-5 sm:px-7 py-2 rounded-full border border-white/50 shadow-[0_12px_40px_rgba(74,33,53,0.08)] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b7004d] animate-pulse"></span>
            <span className="text-[#b7004d] font-black tracking-tight text-sm sm:text-base uppercase">
              THE ATELIER
            </span>
            <span className="text-[10px] font-bold text-[#7d4d62] uppercase tracking-widest pl-1 border-l border-slate-200">
              Petal Collective
            </span>
          </div>
        </div>
      </div>

      {/* Content Canvas */}
      <main className="w-full max-w-md px-4 sm:px-6 -mt-16 sm:-mt-20 z-30 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-6 w-full">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4a2135] mb-1.5">
            {authMode === 'otp'
              ? 'Enter Verification Code'
              : authMode === 'success'
              ? 'Welcome to The Collective'
              : 'Login or Signup'}
          </h1>
          <p className="text-[#7d4d62] font-medium text-xs sm:text-sm opacity-80">
            {authMode === 'otp'
              ? `We have sent a 6-digit code to ${countryCode} ${mobileNumber}`
              : authMode === 'success'
              ? 'Your high-end reseller atelier is ready.'
              : 'Join our curated community of high-fashion resellers'}
          </p>
        </div>

        {/* Form Card (Tonal Layering Level 2: surface-container-lowest with diffused ambient shadow) */}
        <div className="w-full bg-white p-6 sm:p-8 rounded-3xl shadow-[0_12px_40px_rgba(74,33,53,0.08)] border border-[#ffecf1] space-y-5 transition-all">
          {/* STEP 1: Phone Login */}
          {authMode === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Mobile Number Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#7d4d62] px-1">
                  Mobile Number
                </label>
                <div className="relative flex items-center bg-[#ffecf1] rounded-2xl group transition-all duration-300 focus-within:ring-2 focus-within:ring-[#b7004d]/30 focus-within:bg-white border border-transparent focus-within:border-[#ffd8e6]">
                  {/* Country Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryPicker(!showCountryPicker)}
                      className="flex items-center px-3.5 py-3.5 border-r border-[#ffd0e2] text-[#4a2135] font-bold text-sm cursor-pointer hover:bg-white/50 rounded-l-2xl transition-colors"
                    >
                      <span>{countryCode}</span>
                      <span className="material-symbols-outlined text-[#7d4d62] ml-1 text-sm">
                        expand_more
                      </span>
                    </button>
                    {showCountryPicker && (
                      <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 text-xs w-28">
                        {['+91', '+1', '+44', '+971'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setCountryCode(c);
                              setShowCountryPicker(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold ${
                              countryCode === c
                                ? 'bg-[#ffecf1] text-[#b7004d]'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-transparent border-none focus:ring-0 px-3.5 py-3.5 font-semibold text-[#4a2135] placeholder:text-[#9c687e]/60 outline-none text-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* Primary Action Button with Gradient */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#b7004d] via-[#d61962] to-[#ff7293] text-white font-bold py-4 rounded-2xl shadow-[0_10px_25px_rgba(183,0,77,0.3)] active:scale-95 hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Continue</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Separator */}
              <div className="flex items-center justify-center space-x-3 opacity-40 py-1">
                <div className="h-[1px] flex-grow bg-[#9c687e]"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4a2135]">
                  OR
                </span>
                <div className="h-[1px] flex-grow bg-[#9c687e]"></div>
              </div>

              {/* Secondary Actions */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => showToast('Google authentication initialized')}
                  className="w-full flex items-center justify-center space-x-3 bg-[#ffecf1] hover:bg-[#ffd8e6] transition-colors py-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-[#4a2135] active:scale-98 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('email')}
                  className="w-full py-2 text-[#b7004d] font-bold text-xs hover:underline underline-offset-4 transition-all cursor-pointer"
                >
                  Login with Email instead
                </button>
              </div>
            </form>
          )}

          {/* STEP 1b: Email Login */}
          {authMode === 'email' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes('@')) {
                  showToast('Please enter a valid email address');
                  return;
                }
                setAuthMode('otp');
                showToast('Magic login code dispatched to your inbox');
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#7d4d62] px-1">
                  Email Address
                </label>
                <div className="relative flex items-center bg-[#ffecf1] rounded-2xl group transition-all duration-300 focus-within:ring-2 focus-within:ring-[#b7004d]/30 focus-within:bg-white border border-transparent focus-within:border-[#ffd8e6] px-3.5 py-3">
                  <span className="material-symbols-outlined text-[#7d4d62] text-lg mr-2">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reseller@atelier.meesho.com"
                    className="w-full bg-transparent border-none focus:ring-0 font-semibold text-[#4a2135] placeholder:text-[#9c687e]/60 outline-none text-sm"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#b7004d] to-[#ff7293] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm cursor-pointer"
              >
                Send Magic Code
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('phone')}
                className="w-full py-2 text-[#7d4d62] hover:text-[#b7004d] font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Mobile Login</span>
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {authMode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#7d4d62]">
                    6-Digit Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('New code sent via SMS');
                    }}
                    className="text-[10px] font-bold text-[#b7004d] hover:underline"
                  >
                    Resend Code
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-full aspect-square text-center font-black text-lg text-[#4a2135] bg-[#ffecf1] focus:bg-white rounded-xl border border-transparent focus:border-[#b7004d] focus:ring-2 focus:ring-[#b7004d]/20 outline-none transition-all"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-[#ffecf1]/70 p-3 rounded-xl flex items-center gap-2 text-xs text-[#7d4d62]">
                <span className="material-symbols-outlined text-[#b7004d] text-base">info</span>
                <span>Tip: You can enter any 6 digits to preview demo access.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#b7004d] via-[#d61962] to-[#ff7293] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('phone')}
                className="w-full py-1 text-[#7d4d62] hover:text-[#b7004d] font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Change Mobile Number</span>
              </button>
            </form>
          )}

          {/* STEP 3: Boutique Setup Success / Onboarding */}
          {authMode === 'success' && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#b7004d] to-[#ff7293] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#b7004d]/30 animate-pulse">
                <span className="material-symbols-outlined text-3xl">storefront</span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#4a2135]">
                  Name Your Digital Boutique
                </h3>
                <p className="text-xs text-[#7d4d62] mt-0.5">
                  This brand name appears on all customer catalogs and invoice margin slips.
                </p>
              </div>

              <div className="text-left space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-[#7d4d62] px-1">
                  Boutique / Store Name
                </label>
                <div className="bg-[#ffecf1] rounded-2xl px-3.5 py-3 border border-transparent focus-within:border-[#b7004d] focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={boutiqueName}
                    onChange={(e) => setBoutiqueName(e.target.value)}
                    placeholder="e.g. Zara Elegance Collection"
                    className="w-full bg-transparent border-none outline-none font-semibold text-[#4a2135] text-sm"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full bg-gradient-to-r from-[#b7004d] to-[#ff7293] text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter The Atelier</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}
        </div>

        {/* Social Proof Footer */}
        <div className="mt-8 mb-6 text-center px-4">
          <p className="text-xs text-[#7d4d62] leading-relaxed opacity-75">
            By continuing, you agree to our{' '}
            <button
              type="button"
              onClick={() => showToast('Terms & Conditions: Standard Reseller Policy')}
              className="text-[#4a2135] font-bold border-b border-[#ffd0e2] hover:text-[#b7004d] transition-colors"
            >
              Terms & Conditions
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => showToast('Privacy Policy: Data is SSL Encrypted')}
              className="text-[#4a2135] font-bold border-b border-[#ffd0e2] hover:text-[#b7004d] transition-colors"
            >
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Community Badge (Pill-shaped chip using tertiary-container #b5a4ff) */}
        <div className="flex items-center space-x-2 bg-[#b5a4ff]/25 px-4 py-2 rounded-full mb-6 border border-[#b5a4ff]/30 shadow-sm">
          <span
            className="material-symbols-outlined text-[#5f4ab3] text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#331786]">
            Trusted by 10M+ Resellers Across India
          </span>
        </div>

        {/* Quick Switch to other theme views */}
        <div className="flex items-center gap-3 text-xs text-[#7d4d62]">
          <span>Theme Ecosystem:</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('digitalCurator')}
            className="font-bold text-[#b7004d] hover:underline"
          >
            Switch to Digital Curator →
          </button>
        </div>
      </main>
    </div>
  );
}
