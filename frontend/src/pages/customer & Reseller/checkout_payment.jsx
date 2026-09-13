import React, { useState } from 'react';

export default function CheckoutPayment({ onNavigate = () => {}, onBack }) {
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isReselling, setIsReselling] = useState(true);
  const [marginAmount, setMarginAmount] = useState(150);
  const [basePrice] = useState(1099);
  const [firstOrderDiscount] = useState(100);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const finalAmount = basePrice - firstOrderDiscount;
  const customerInvoiceTotal = isReselling ? finalAmount + Number(marginAmount || 0) : finalAmount;

  const handleConfirmOrder = () => {
    setIsOrderConfirmed(true);
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] font-sans antialiased min-h-screen pb-36 selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-8 h-16 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('address'))}
              className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 text-[#FF3F6C] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-extrabold text-base md:text-lg text-[#191C1E]">
              Payment & Review
            </h1>
          </div>
          <div className="text-xs font-black uppercase tracking-wider bg-pink-50 text-[#FF3F6C] px-3 py-1 rounded-full border border-pink-100">
            Step 3 of 3
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-6 max-w-xl mx-auto px-4 space-y-6">
        {/* Section 1: Delivery Address Summary */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#FF3F6C]">location_on</span>
              Delivery Address
            </h2>
            <button
              onClick={() => onNavigate('address')}
              className="text-[#FF3F6C] font-bold text-xs px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>
          <div className="space-y-0.5 pt-1">
            <p className="font-extrabold text-sm text-[#191c1e]">Arjun Sharma</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              H-42, Silicon Valley Towers, 4th Floor, Whitefield Main Road, Bangalore, Karnataka - 560066
            </p>
            <p className="text-xs font-bold text-slate-700 pt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">call</span>
              +91 98765 43210
            </p>
          </div>
        </section>

        {/* Section 2: Payment Method Selection */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Select Payment Method
          </h2>
          <div className="space-y-2.5">
            {/* Cash on Delivery */}
            <div
              onClick={() => setSelectedPayment('cod')}
              className={`p-4 rounded-3xl shadow-sm flex items-center gap-3.5 relative overflow-hidden cursor-pointer transition-all ${
                selectedPayment === 'cod'
                  ? 'bg-white ring-2 ring-[#FF3F6C]'
                  : 'bg-white/80 border border-slate-100 hover:bg-white'
              }`}
            >
              <div className="absolute top-0 right-0 bg-[#FF3F6C] text-white px-2.5 py-0.5 rounded-bl-xl text-[9px] font-black uppercase tracking-wider">
                Recommended
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'cod' ? 'border-[#FF3F6C] bg-[#FF3F6C]' : 'border-slate-300'
                }`}
              >
                {selectedPayment === 'cod' && (
                  <span className="material-symbols-outlined text-white text-xs">check</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-xs md:text-sm text-[#191c1e]">
                  Cash on Delivery (COD)
                </p>
                <p className="text-[11px] text-slate-400">Pay cash when package arrives</p>
              </div>
              <span className="material-symbols-outlined text-[#FF3F6C] text-xl">payments</span>
            </div>

            {/* UPI */}
            <div
              onClick={() => setSelectedPayment('upi')}
              className={`p-4 rounded-3xl shadow-sm flex items-center gap-3.5 cursor-pointer transition-all ${
                selectedPayment === 'upi'
                  ? 'bg-white ring-2 ring-[#FF3F6C]'
                  : 'bg-white/80 border border-slate-100 hover:bg-white'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'upi' ? 'border-[#FF3F6C] bg-[#FF3F6C]' : 'border-slate-300'
                }`}
              >
                {selectedPayment === 'upi' && (
                  <span className="material-symbols-outlined text-white text-xs">check</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-xs md:text-sm text-[#191c1e]">UPI</p>
                <p className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
              <span className="material-symbols-outlined text-purple-600 text-xl">qr_code_2</span>
            </div>

            {/* Credit / Debit Card */}
            <div
              onClick={() => setSelectedPayment('card')}
              className={`p-4 rounded-3xl shadow-sm flex items-center gap-3.5 cursor-pointer transition-all ${
                selectedPayment === 'card'
                  ? 'bg-white ring-2 ring-[#FF3F6C]'
                  : 'bg-white/80 border border-slate-100 hover:bg-white'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'card' ? 'border-[#FF3F6C] bg-[#FF3F6C]' : 'border-slate-300'
                }`}
              >
                {selectedPayment === 'card' && (
                  <span className="material-symbols-outlined text-white text-xs">check</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-xs md:text-sm text-[#191c1e]">
                  Credit / Debit Card
                </p>
                <p className="text-[11px] text-slate-400">Visa, Mastercard, RuPay, Maestro</p>
              </div>
              <span className="material-symbols-outlined text-blue-600 text-xl">credit_card</span>
            </div>
          </div>
        </section>

        {/* Section 3: Reseller Margin Configuration */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-3xl border border-indigo-100 space-y-3.5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-extrabold text-indigo-900 text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-indigo-600 text-base">
                  trending_up
                </span>
                Selling to a Customer?
              </h2>
              <p className="text-xs text-indigo-700/70 mt-0.5">
                Add your reseller margin to the customer invoice
              </p>
            </div>
            {/* Toggle Switch */}
            <button
              onClick={() => setIsReselling(!isReselling)}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                isReselling ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isReselling ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {isReselling && (
            <div className="space-y-2 pt-1">
              <label className="block text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                Enter Your Margin (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-slate-700 text-base">
                  ₹
                </span>
                <input
                  type="number"
                  value={marginAmount}
                  onChange={(e) => setMarginAmount(Number(e.target.value))}
                  className="w-full bg-white border border-indigo-100 rounded-2xl py-3 pl-8 pr-4 font-black text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100 text-xs text-slate-600 flex justify-between items-center">
                <span>Customer Invoice Price:</span>
                <span className="font-black text-indigo-900 text-sm">
                  ₹{customerInvoiceTotal}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Section 4: Order Price Breakdown */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Order Summary
          </h2>
          <div className="space-y-2.5 text-xs md:text-sm">
            <div className="flex justify-between items-center text-slate-600">
              <span>Total Product Price</span>
              <span className="font-bold text-[#191c1e]">₹{basePrice}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Shipping Fee</span>
              <span className="text-[#008644] font-extrabold bg-green-50 px-2 py-0.5 rounded">
                FREE
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>First Order Discount</span>
              <span className="text-[#FF3F6C] font-bold">-₹{firstOrderDiscount}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="font-black text-sm md:text-base text-[#191c1e]">
                Amount You Pay
              </span>
              <span className="font-black text-xl text-[#FF3F6C]">₹{finalAmount}</span>
            </div>
          </div>
        </section>

        {/* Product Preview Thumbnail Hint */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop&q=80"
              alt="Product Thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-[#191c1e] line-clamp-1">
              Floral Embroidered Georgette Kurti Set
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">Size: M | Qty: 1</p>
          </div>
        </div>
      </main>

      {/* Floating Support Button */}
      <button
        onClick={() => triggerToast('Connecting with 24/7 Support Agent... 🎧')}
        className="fixed bottom-24 right-5 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100 text-slate-700 active:scale-90 hover:scale-105 transition-all z-30 cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl text-pink-600">support_agent</span>
      </button>

      {/* Order Confirmed Modal */}
      {isOrderConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 text-[#008644] rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="text-2xl font-black text-[#191c1e] mb-1">Order Confirmed! 🎉</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Paid via <span className="font-bold uppercase text-[#FF3F6C]">{selectedPayment}</span>.
              Estimated delivery by tomorrow evening!
            </p>
            {isReselling && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-2.5 mb-4 text-xs text-indigo-900 font-extrabold">
                Reseller Margin of ₹{marginAmount} will be transferred to your account!
              </div>
            )}
            <button
              onClick={() => {
                setIsOrderConfirmed(false);
                onNavigate('reseller');
              }}
              className="w-full bg-[#FF3F6C] text-white py-3 rounded-2xl font-bold text-xs shadow-lg shadow-pink-500/30 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Confirmation Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 z-40 px-4 md:px-8 py-3.5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Amount to Pay
            </span>
            <span className="text-xl md:text-2xl font-black text-[#191c1e]">₹{finalAmount}</span>
          </div>
          <button
            onClick={handleConfirmOrder}
            className="bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] text-white px-7 py-3.5 rounded-2xl font-black text-sm md:text-base shadow-lg shadow-pink-500/30 active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
          >
            <span>Confirm Order</span>
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </footer>
    </div>
  );
}