import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE from '../../config/apiConfig';

const API_BASE_URL = API_BASE;

export default function InviteLanding() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [referralInfo, setReferralInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const cleanCode = (code || '').trim().toUpperCase();

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/referrals/info/${cleanCode}`)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          setReferralInfo(json.data);
        }
      })
      .catch((err) => {
        console.warn('Failed to load referral details:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cleanCode]);

  // Handle Claim Offer & Start Shopping
  const handleClaimOffer = () => {
    try {
      // 1. Store referral code for attribution
      localStorage.setItem('mshoppy_referral_code', cleanCode);
      localStorage.setItem('mshoppy_referral_timestamp', Date.now().toString());

      // 2. Pre-apply the 40% welcome coupon (up to ₹100)
      const couponObj = {
        code: cleanCode,
        discountPercent: 40,
        maxDiscount: 100,
        description: '40% OFF Referral Welcome Bonus (Up to ₹100)'
      };
      localStorage.setItem('mshoppy_applied_coupon', JSON.stringify(couponObj));
      localStorage.setItem('mshoppy_referral_banner_seen', 'false');

      // 3. Try to call backend apply if customer is already logged in
      const customerRaw = localStorage.getItem('mshoppy_customer_user');
      if (customerRaw) {
        try {
          const user = JSON.parse(customerRaw);
          if (user?.id) {
            fetch(`${API_BASE_URL}/referrals/apply`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: cleanCode, userId: user.id })
            }).catch(() => {});
          }
        } catch (_) {}
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }

    // Navigate to customer shopping home
    navigate('/user-home');
  };

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const referrerName = referralInfo?.referrerName || 'A friend';

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-slate-50 to-white flex flex-col items-center justify-start p-4 sm:p-6 text-slate-800">
      {/* Top Brand Bar */}
      <div className="w-full max-w-md flex items-center justify-between py-3 mb-2">
        <div className="flex items-center gap-2">
          <img src="/mshoppy-logo.png" alt="MShoppy" className="h-8 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="text-xl font-black text-[#9f0038] tracking-tight">MShoppy</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Verified Invite</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#9f0038] via-[#b7004d] to-[#d61c68] text-white p-6 sm:p-7 relative overflow-hidden text-center">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-rose-400/20 rounded-full blur-lg pointer-events-none" />

          {/* Inviter Avatar Badge */}
          <div className="w-16 h-16 rounded-full bg-white text-[#9f0038] font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-white/80 ring-4 ring-white/20">
            {referrerName.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
            {referrerName} invited you!
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm font-medium mt-1">
            Shop wholesale fashion, home & beauty essentials at lowest prices
          </p>
        </div>

        {/* Offer Details Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Flat 40% Voucher Box */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                🎁
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-tight">
                  Flat 40% OFF on 1st Order
                </p>
                <p className="text-xs text-amber-900 font-medium mt-0.5">
                  Up to ₹100 instant discount at checkout
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-black text-[10px] rounded-md tracking-wider uppercase shrink-0">
              Active
            </span>
          </div>

          {/* Referral Code Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Exclusive Referral Code
              </span>
              <span className="text-base font-black text-[#9f0038] font-mono tracking-wider">
                {cleanCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-xs">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleClaimOffer}
              className="w-full bg-[#9f0038] hover:bg-[#840032] text-white py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-900/15 cursor-pointer active:scale-98 transition-all"
            >
              <span>Claim 40% OFF & Start Shopping</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInstallGuide(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-sm">install_mobile</span>
              <span>Install MShoppy App on Phone</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <span className="text-base">🏷️</span>
              <span className="text-[10px] font-bold text-slate-800 mt-1 leading-tight">Wholesale Prices</span>
              <span className="text-[9px] text-slate-400">Direct Factory</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">💵</span>
              <span className="text-[10px] font-bold text-slate-800 mt-1 leading-tight">Cash on Delivery</span>
              <span className="text-[9px] text-slate-400">Pay at Doorstep</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">🔄</span>
              <span className="text-[10px] font-bold text-slate-800 mt-1 leading-tight">7-Day Returns</span>
              <span className="text-[9px] text-slate-400">Easy Refunds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Install App Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span className="text-lg">📱</span>
                <span>Install MShoppy App</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To install MShoppy on your phone like a native app:
            </p>

            <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-slate-800">For Android (Chrome):</p>
              <p className="text-[11px] text-slate-600">1. Tap the <strong>three dots (⋮)</strong> at the top right of Chrome.</p>
              <p className="text-[11px] text-slate-600">2. Tap <strong>'Add to Home screen'</strong> or <strong>'Install app'</strong>.</p>

              <div className="border-t border-slate-200/60 pt-2 mt-2">
                <p className="font-semibold text-slate-800">For iPhone (Safari):</p>
                <p className="text-[11px] text-slate-600">1. Tap the <strong>Share (⎋)</strong> button at the bottom.</p>
                <p className="text-[11px] text-slate-600">2. Select <strong>'Add to Home Screen' (+)</strong>.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowInstallGuide(false);
                handleClaimOffer();
              }}
              className="w-full bg-[#9f0038] hover:bg-[#840032] text-white py-3 rounded-xl font-bold text-xs cursor-pointer"
            >
              Got It, Continue to Shop
            </button>
          </div>
        </div>
      )}

      {/* Footer info */}
      <p className="text-[11px] text-slate-400 mt-6 text-center">
        © 2026 MShoppy India. India's Favourite Wholesale Shopping Marketplace.
      </p>
    </div>
  );
}
