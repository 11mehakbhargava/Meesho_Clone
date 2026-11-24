import React, { useState, useEffect, useRef } from 'react';
import { sendDriverOtp, verifyDriverOtp, getStoredDriver, clearDriverSession } from '../../services/driverService';
import { requestPhoneOtp } from '../../services/phoneAuthService';

export default function DriverLogin({ onNavigate, onBack }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [existingDriver, setExistingDriver] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [authMode, setAuthMode] = useState('sandbox'); // 'firebase_sms' | 'sandbox'

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Check if a session already exists
  useEffect(() => {
    const existing = getStoredDriver();
    if (existing?.id && existing?.phone) {
      setExistingDriver(existing);
    }
  }, []);

  const handleClearSessionAndLoginFresh = () => {
    clearDriverSession();
    setExistingDriver(null);
    setPhone('');
    setFullName('');
    setOtp(['', '', '', '', '', '']);
    setErrorMsg('');
    setConfirmationResult(null);
    setAuthMode('sandbox');
    setStep('phone');
  };

  useEffect(() => {
    let interval = null;
    if (isTimerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, countdown]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit registered mobile number');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    let fbSent = false;
    // 1. Try real SMS delivery via Firebase Phone Auth
    try {
      const fbRes = await requestPhoneOtp(clean, 'recaptcha-container');
      if (fbRes?.confirmationResult) {
        setConfirmationResult(fbRes.confirmationResult);
        setAuthMode('firebase_sms');
        fbSent = true;
        console.log('[Driver Login] Firebase Phone SMS sent successfully to:', clean);
      }
    } catch (fbErr) {
      console.log('[Driver Login] Dev sandbox active (Production SMS will activate on domain setup):', fbErr?.code || fbErr?.message);
      setAuthMode('sandbox');
    }

    // 2. Also register with backend
    try {
      await sendDriverOtp(clean);
      setStep('otp');
      setCountdown(30);
      setIsTimerActive(true);
      setTimeout(() => inputRefs[0]?.current?.focus(), 250);
    } catch (err) {
      if (!fbSent) {
        setErrorMsg(err.message || 'Failed to send OTP. Please check the number.');
      } else {
        setStep('otp');
        setCountdown(30);
        setIsTimerActive(true);
        setTimeout(() => inputRefs[0]?.current?.focus(), 250);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);

    if (val && idx < 5) {
      inputRefs[idx + 1]?.current?.focus();
    }

    const filledCount = newOtp.filter((d) => d !== '').length;
    if (filledCount === 6 && idx === 5) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = ['', '', '', '', '', ''];
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    if (pasted.length >= 4) {
      handleVerifyOtp(pasted);
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs[idx - 1]?.current?.focus();
    }
  };

  const handleVerifyOtp = async (fullOtpString) => {
    const code = (fullOtpString || otp.filter((d) => d !== '').join('')).trim();
    if (code.length < 4) {
      setErrorMsg('Please enter the OTP verification code');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    let firebaseUid = null;

    try {
      // If Firebase confirmation is active and user entered 6 digits, verify via Firebase
      if (confirmationResult && code.length === 6) {
        try {
          const userCred = await confirmationResult.confirm(code);
          firebaseUid = userCred?.user?.uid;
        } catch (fbConfirmErr) {
          console.warn('Firebase verify notice:', fbConfirmErr.message);
          if (code !== '1234') {
            throw new Error('Invalid SMS OTP. Please check the code received on your phone.');
          }
        }
      }

      const res = await verifyDriverOtp(phone, code, fullName.trim() || undefined, firebaseUid);

      setTimeout(() => {
        if (res.driver?.kycStatus === 'APPROVED' || res.driver?.isApproved) {
          if (onNavigate) onNavigate('driver_dashboard');
          else window.location.href = '/driver-dashboard';
        } else {
          // Redirect to KYC verification if pending
          if (onNavigate) onNavigate('driver_kyc');
          else window.location.href = '/driver-kyc';
        }
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-slate-900 flex flex-col justify-between font-sans antialiased selection:bg-pink-100 selection:text-[#b90041]">
      {/* Invisible container for Firebase Phone Auth reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-md mx-auto w-full">
        <button
          onClick={() => (onBack ? onBack() : window.history.back())}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          ✕
        </button>
        <div className="flex items-center gap-1.5 bg-pink-50 text-[#b90041] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-pink-200">
          <span>SwiftFleet 🛵</span>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-md mx-auto w-full px-5 py-4 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#b90041] to-[#df2457] text-white flex items-center justify-center text-2xl mx-auto shadow-md shadow-pink-500/20">
              ⚡
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rider Partner Login
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Meesho SwiftFleet Last-Mile Delivery Partner Portal
            </p>
          </div>

          {/* Active Session Notice (If already logged in on this browser) */}
          {existingDriver && step === 'phone' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Active Session Detected</span>
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  Logged In
                </span>
              </div>
              <p className="text-slate-600">
                You are currently signed in as <strong>{existingDriver.name}</strong> (+91 {existingDriver.phone}).
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate('driver_dashboard');
                    else window.location.href = '/driver-dashboard';
                  }}
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Go to Dashboard ➔
                </button>
                <button
                  type="button"
                  onClick={handleClearSessionAndLoginFresh}
                  className="px-3 py-2 bg-white text-slate-700 hover:text-rose-600 border border-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Registered Mobile Number *
                </label>
                <div className="flex rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-[#b90041] focus-within:bg-white transition-all">
                  <span className="px-3.5 py-3 text-slate-500 font-bold text-sm bg-slate-100/60 border-r border-slate-200 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-transparent text-sm font-black tracking-wider focus:outline-none"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                  loading || phone.length !== 10
                    ? 'bg-slate-300 shadow-none cursor-not-allowed'
                    : 'bg-[#b90041] hover:bg-[#990035] shadow-pink-500/20 active:scale-[0.98] cursor-pointer'
                }`}
              >
                {loading ? 'Sending SMS OTP...' : 'Get OTP ➔'}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-500">
                  Enter the verification code sent to{' '}
                  <strong className="text-slate-900">+91 {phone}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                    setErrorMsg('');
                    setConfirmationResult(null);
                  }}
                  className="text-[11px] font-bold text-[#b90041] hover:underline cursor-pointer"
                >
                  Change Mobile Number
                </button>
              </div>

              {/* Real Firebase SMS vs Sandbox Indicator */}
              {authMode === 'firebase_sms' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
                  <span className="text-base">📲</span>
                  <span><strong>Live Firebase SMS sent!</strong> Please check your phone for the 6-digit code.</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-950 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚡</span>
                    <span className="font-semibold text-amber-900">Dev Testing OTP:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp(['1', '2', '3', '4', '', '']);
                      handleVerifyOtp('1234');
                    }}
                    className="font-mono font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    1234 (Tap to Fill &amp; Login)
                  </button>
                </div>
              )}

              {/* 6 Digit OTP inputs with Paste support */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-2" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#b90041] focus:bg-white shadow-inner transition-all"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Didn't receive code?</span>
                {isTimerActive ? (
                  <span className="text-slate-400 font-mono">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#b90041] hover:underline cursor-pointer"
                  >
                    Resend SMS Code
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.filter((d) => d !== '').length < 4}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                  loading || otp.filter((d) => d !== '').length < 4
                    ? 'bg-slate-300 shadow-none cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 active:scale-[0.98] cursor-pointer'
                }`}
              >
                {loading ? 'Verifying OTP...' : 'Verify & Continue ➔'}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-4 text-center text-[11px] text-slate-400 font-medium">
        Meesho SwiftFleet Rider Operations • Safe &amp; Direct Settlements
      </footer>
    </div>
  );
}
