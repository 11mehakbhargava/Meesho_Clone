import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavDrawer from '../../components/NavDrawer';

export default function WithdrawEarnings() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dynamic States
  const withdrawableBalance = 8450.50;
  const [amount, setAmount] = useState('8450.50');
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [error, setError] = useState('');

  // Amount input handler
  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(val);

    if (error) {
      setError('');
    }
  };

  // Quick Amount Selectors
  const setQuickAmount = (val) => {
    setAmount(val.toString());
    if (error) {
      setError('');
    }
  };

  // Proceed Withdraw
  const handleProceedWithdraw = () => {
    const numAmount = parseFloat(amount) || 0;

    if (numAmount < 100) {
      setError('Minimum withdrawal amount is ₹100.00');
      return;
    }

    if (numAmount > withdrawableBalance) {
      setError(
        `Amount cannot exceed available balance of ₹${withdrawableBalance.toLocaleString()}`
      );
      return;
    }

    // Redirect to payout confirmation receipt screen
    navigate('/payout-confirmation');
  };

  const numericAmount = parseFloat(amount) || 0;

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-sans min-h-screen selection:bg-[#b90041]/20">
      {/* Top App Bar - Full Width */}
      <header className="flex items-center w-full px-4 sm:px-6 md:px-10 lg:px-16 h-16 sticky top-0 z-50 bg-[#fcf9f8] dark:bg-[#1c1b1b] border-b border-[#f0edec] dark:border-slate-800">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="p-1.5 rounded-full active:scale-95 transition-transform text-[#b90041] hover:bg-[#b90041]/10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg sm:text-xl text-[#1c1b1b] dark:text-white">
              Withdraw Earnings
            </h1>
          </div>
          <button 
            type="button"
            onClick={() => alert("Payouts are processed to verified accounts within 24 hours.")}
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#1c1b1b] cursor-pointer"
            aria-label="Help"
          >
            <span className="material-symbols-outlined text-2xl">help_outline</span>
          </button>
        </div>
      </header>

      {/* Main Content - Strictly Vertical Stream */}
      <main className="max-w-xl md:max-w-2xl mx-auto px-4 pb-44 pt-6 space-y-8">
        {/* Balance Header */}
        <section className="text-center relative overflow-hidden p-8 rounded-3xl bg-[#f6f3f2] dark:bg-slate-800/60">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#b90041]/5 rounded-full blur-3xl pointer-events-none"></div>
          <p className="text-[#5b4042] dark:text-slate-400 font-medium text-xs sm:text-sm uppercase tracking-widest mb-2 font-['Plus_Jakarta_Sans',sans-serif]">
            Withdrawable Balance
          </p>
          <h2 className="text-[3rem] sm:text-[3.5rem] font-extrabold leading-none tracking-tighter text-[#1c1b1b] dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">
            <span className="text-[#b90041] text-[2.2rem] sm:text-[2.5rem]">₹</span>
            {withdrawableBalance.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </h2>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007432]/10 text-[#007432] dark:text-emerald-400">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-xs font-bold uppercase tracking-wide">Available for Payout</span>
          </div>
        </section>

        {/* Payout Method Selection */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base sm:text-lg text-[#1c1b1b] dark:text-white">
              Payout Method
            </h3>
            <button
              onClick={() => navigate('/payout-settings')}
              className="text-xs font-bold text-[#b90041] hover:underline cursor-pointer"
            >
              + Add New
            </button>
          </div>

          {/* Bank Option */}
          <div
            onClick={() => setPayoutMethod('bank')}
            className={`p-5 rounded-2xl cursor-pointer transition-all ${
              payoutMethod === 'bank'
                ? 'bg-white dark:bg-slate-800 shadow-md border-2 border-[#b90041] ring-4 ring-[#b90041]/5'
                : 'bg-[#f6f3f2] dark:bg-slate-800/40 border border-transparent hover:bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ede9e8] dark:bg-slate-700 flex items-center justify-center text-[#1c1b1b] dark:text-white">
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base text-[#1c1b1b] dark:text-white">HDFC Bank</p>
                  <p className="text-xs sm:text-sm text-slate-500">Ending in •••• 4321</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payoutMethod === 'bank' ? 'border-[#b90041]' : 'border-slate-300'}`}>
                {payoutMethod === 'bank' && <div className="w-3 h-3 rounded-full bg-[#b90041]"></div>}
              </div>
            </div>
          </div>

          {/* UPI Option */}
          <div
            onClick={() => setPayoutMethod('upi')}
            className={`p-5 rounded-2xl cursor-pointer transition-all ${
              payoutMethod === 'upi'
                ? 'bg-white dark:bg-slate-800 shadow-md border-2 border-[#b90041] ring-4 ring-[#b90041]/5'
                : 'bg-[#f6f3f2] dark:bg-slate-800/40 border border-transparent hover:bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ede9e8] dark:bg-slate-700 flex items-center justify-center text-[#1c1b1b] dark:text-white">
                  <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base text-[#1c1b1b] dark:text-white">UPI ID</p>
                  <p className="text-xs sm:text-sm text-slate-500">partner@upi</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payoutMethod === 'upi' ? 'border-[#b90041]' : 'border-slate-300'}`}>
                {payoutMethod === 'upi' && <div className="w-3 h-3 rounded-full bg-[#b90041]"></div>}
              </div>
            </div>
          </div>
        </section>

        {/* Withdrawal Input Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-end">
            <h3 className="font-bold text-base sm:text-lg text-[#1c1b1b] dark:text-white">
              Amount to Withdraw
            </h3>
            <span className="text-xs text-slate-500 font-medium">Min: ₹100.00</span>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-2xl">₹</div>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full h-20 pl-12 pr-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#b90041] font-extrabold text-3xl text-[#1c1b1b] dark:text-white outline-none shadow-xs"
              placeholder="0.00"
            />
          </div>

          {error && <p className="text-rose-600 text-xs font-bold pl-2">{error}</p>}

          {/* Quick Preset Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setQuickAmount(1000)}
              className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-rose-100 hover:text-[#b90041] transition-colors cursor-pointer"
            >
              ₹1,000
            </button>
            <button
              type="button"
              onClick={() => setQuickAmount(5000)}
              className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-rose-100 hover:text-[#b90041] transition-colors cursor-pointer"
            >
              ₹5,000
            </button>
            <button
              type="button"
              onClick={() => setQuickAmount(withdrawableBalance)}
              className="px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-900/30 text-[#b90041] text-xs sm:text-sm font-bold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Withdraw All
            </button>
          </div>
        </section>

        {/* Transaction Summary (Card) */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Processing Fee</span>
            <span className="text-emerald-700 font-bold">₹0.00 (Free)</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Estimated Arrival</span>
            <span className="text-[#1c1b1b] dark:text-white font-bold">Within 24 Hours</span>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <span className="text-[#1c1b1b] dark:text-white font-bold text-sm sm:text-base">Net Payout</span>
            <span className="text-[#b90041] font-extrabold text-xl sm:text-2xl">
              ₹{numericAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <div className="max-w-xl md:max-w-2xl mx-auto">
          <button
            type="button"
            onClick={handleProceedWithdraw}
            className="w-full h-14 sm:h-16 bg-gradient-to-r from-[#b90041] to-[#df2457] text-white font-extrabold text-base sm:text-lg rounded-2xl active:scale-95 shadow-[0_8px_32px_rgba(185,0,65,0.25)] flex items-center justify-center gap-3 transition-transform cursor-pointer"
          >
            Withdraw to {payoutMethod === 'bank' ? 'Bank Account' : 'UPI ID'}
            <span className="material-symbols-outlined text-xl">trending_flat</span>
          </button>
          <p className="text-center text-[10px] text-slate-400 font-medium mt-3 uppercase tracking-widest px-4">
            By proceeding, you agree to our partner payout terms and conditions.
          </p>
        </div>
      </div>

      {/* Navigation Drawer */}
      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}