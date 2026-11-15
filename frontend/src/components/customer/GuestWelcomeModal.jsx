import React, { useEffect } from 'react';
import { LogIn, ShoppingBag, ArrowRight, X, Sparkles, Tag, Truck, ShieldCheck } from 'lucide-react';

/**
 * GuestWelcomeModal
 * 
 * Sleek, professional modal prompt asking visitors to choose between
 * logging in or continuing freely as a guest.
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
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-modal-title"
    >
      <div 
        className="relative bg-white dark:bg-slate-900 w-full max-w-[440px] rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle brand glow effects */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-amber-400/15 to-rose-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
          title="Close and continue browsing"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Brand Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF3F6C] via-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 ring-4 ring-rose-50 dark:ring-rose-950/40">
              <ShoppingBag className="w-8 h-8 stroke-[2.2]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
              ✓
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-[#FF3F6C] border border-rose-200/60 dark:border-rose-900/50 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to MShoppy
          </div>

          {/* Main Question */}
          <h2 
            id="guest-modal-title"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight px-2"
          >
            Would you like to Login or Continue as a Guest?
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
            Explore trending collections freely, or sign in to track your orders and save favorites.
          </p>
        </div>

        {/* Compact 3-Pill E-commerce Highlight Badges */}
        <div className="grid grid-cols-3 gap-2 my-5">
          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <Tag className="w-4 h-4 text-rose-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Lowest Prices</span>
            <span className="text-[9px] text-slate-400">Direct factory</span>
          </div>
          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <Truck className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Free Delivery</span>
            <span className="text-[9px] text-slate-400">On all orders</span>
          </div>
          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Easy Returns</span>
            <span className="text-[9px] text-slate-400">7 days refund</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as a Guest</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLoginClick}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF3F6C] to-[#b90041] hover:from-[#e0355d] hover:to-[#9c0037] shadow-lg shadow-pink-500/25 hover:shadow-pink-500/35 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login / Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
