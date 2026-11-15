import React, { useEffect } from 'react';
import { LogIn, ShoppingBag, ArrowRight, X } from 'lucide-react';

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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF3F6C] via-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 mb-4 ring-4 ring-rose-50 dark:ring-rose-950/40">
            <ShoppingBag className="w-7 h-7 stroke-[2.2]" />
          </div>

          {/* Main Question */}
          <h2 
            id="guest-modal-title"
            className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug"
          >
            Would you like to Login or Continue as a Guest?
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Explore products freely, or sign in to manage your orders and wishlist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as a Guest</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLoginClick}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF3F6C] to-[#b90041] hover:from-[#e0355d] hover:to-[#9c0037] shadow-md shadow-pink-500/20 hover:shadow-pink-500/35 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login / Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
