import React, { useEffect } from 'react';
import { LogIn, Sparkles, ShoppingBag, ArrowRight, X, ShieldCheck } from 'lucide-react';

/**
 * GuestWelcomeModal
 * 
 * Displayed non-intrusively 4-5 seconds after an unauthenticated user arrives at the domain/homepage.
 * Prompts user to choose between logging in or continuing freely as a guest.
 */
export default function GuestWelcomeModal({
  isOpen,
  onClose,
  onContinueAsGuest,
  onLogin,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onContinueAsGuest) onContinueAsGuest();
        else if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onContinueAsGuest]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (onContinueAsGuest) {
      onContinueAsGuest();
    } else if (onClose) {
      onClose();
    }
  };

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-modal-title"
    >
      <div 
        className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative background gradient blob */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-gradient-to-tr from-amber-400/20 to-rose-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
          aria-label="Close and continue as guest"
          title="Continue as Guest"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF3F6C] via-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 mb-4 ring-4 ring-rose-50 dark:ring-rose-950/40">
            <ShoppingBag className="w-8 h-8 stroke-[2.2]" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-[#FF3F6C] border border-rose-200/60 dark:border-rose-900/50 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to MShoppy
          </span>

          {/* Main Question */}
          <h2 
            id="guest-modal-title"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug"
          >
            Would you like to Login or Continue as a Guest?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Browse freely without registration, or sign in to save your wishlist, track orders, and unlock member discounts.
          </p>
        </div>

        {/* Feature perks pill list */}
        <div className="mt-5 space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
              ✓
            </div>
            <span>Browse thousands of trending products at factory prices</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
            <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0">
              ✓
            </div>
            <span>Explore deals and categories without forcing login or sign up</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
            <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center shrink-0">
              ✓
            </div>
            <span>Log in anytime later whenever you wish to checkout</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as a Guest</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLoginClick}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF3F6C] to-[#b90041] hover:from-[#e0355d] hover:to-[#9c0037] shadow-md shadow-pink-500/20 hover:shadow-pink-500/35 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login / Sign In</span>
          </button>
        </div>

        {/* Bottom reassurance note */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>No commitment required. Explore at your own pace.</span>
        </div>
      </div>
    </div>
  );
}
