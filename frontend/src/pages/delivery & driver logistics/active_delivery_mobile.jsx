import React, { useState } from 'react';

export default function ActiveDeliveryMobile({ onNavigate = () => {}, onBack }) {
  const [isDelivered, setIsDelivered] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleMarkDelivered = () => {
    setIsDelivered(true);
    triggerToast('Delivery Confirmed! ₹45.00 credited to wallet 🎉');
    setTimeout(() => {
      onNavigate('driver_earnings');
    }, 1200);
  };

  return (
    <div className="bg-[#fcf9f8] font-sans text-[#1c1b1b] overflow-hidden h-screen flex flex-col relative antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex justify-between items-center px-4 h-16 w-full max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('driver_dashboard'))}
              className="p-2 hover:bg-slate-100 rounded-full text-[#b90041] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1
              onClick={() => onNavigate('driver_dashboard')}
              className="font-extrabold tracking-tight text-base md:text-lg text-[#b90041] cursor-pointer"
            >
              Partner ID: MP8829
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('order_driver')}
              className="px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#b90041] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              <span>Manifest</span>
            </button>
            <button
              onClick={() => onNavigate('available_tasks')}
              className="p-2 hover:bg-slate-100 rounded-full text-[#b90041] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">list_alt</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Map Canvas */}
      <main className="relative flex-1 w-full h-full pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80"
            alt="Live Navigation Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Route Markers Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Pickup Hub Marker */}
            <div className="absolute top-[28%] left-[30%] flex flex-col items-center">
              <div className="bg-[#b90041] text-white p-2.5 rounded-full shadow-2xl scale-105 border-2 border-white">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  inventory_2
                </span>
              </div>
              <div className="bg-white/95 px-2.5 py-0.5 mt-1 rounded-md shadow-md border border-slate-200">
                <span className="text-[10px] font-black uppercase text-[#b90041]">
                  Pickup Hub
                </span>
              </div>
            </div>

            {/* Drop Location Marker */}
            <div className="absolute bottom-[35%] right-[28%] flex flex-col items-center">
              <div className="bg-[#008644] text-white p-3 rounded-full shadow-2xl scale-120 border-4 border-white animate-bounce">
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
              </div>
              <div className="bg-white/95 px-2.5 py-0.5 mt-1 rounded-md shadow-md border border-slate-200">
                <span className="text-[10px] font-black uppercase text-[#008644]">
                  Drop: Skyview Apt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Navigation Info Card */}
        <div className="absolute top-20 left-4 right-4 z-20 max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#b90041]">
                <span className="material-symbols-outlined text-2xl">directions_bike</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Estimated Arrival
                </p>
                <p className="text-base md:text-lg font-black text-[#1c1b1b]">
                  12 Mins <span className="text-xs font-medium text-slate-500">(2.4 km)</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => triggerToast('Re-centering route view to your bike GPS...')}
              className="bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-1.5 font-bold text-xs active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#b90041]">explore</span>
              <span>RE-CENTER</span>
            </button>
          </div>
        </div>

        {/* Bottom Delivery Card Drawer */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-4 max-w-lg mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 pt-3 border border-slate-100 space-y-4">
            {/* Pull Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />

            {/* Primary Order Info */}
            <div
              onClick={() => onNavigate('order_driver')}
              className="flex justify-between items-start cursor-pointer hover:opacity-90"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-50 text-[#008644] rounded-md uppercase">
                    PREPAID
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Order #MSH-99281 ➔</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-[#1c1b1b]">Ananya Sharma</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm text-[#b90041]">home</span>
                  <span>4th Floor, Skyview Apt, Koramangala</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-[#008644]">₹45.00</span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase">Payout</span>
              </div>
            </div>

            {/* Items & Instructions Bento */}
            <div
              onClick={() => onNavigate('order_driver')}
              className="grid grid-cols-2 gap-2.5 cursor-pointer"
            >
              <div className="bg-[#fcf9f8] p-3 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Items</p>
                <p className="font-extrabold text-xs text-[#1c1b1b]">2x Silk Saree, 1x Box</p>
              </div>
              <div className="bg-[#fcf9f8] p-3 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Instructions</p>
                <p className="font-extrabold text-xs text-[#b90041]">Leave at security gate</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2.5">
              <button
                onClick={() => triggerToast('Calling customer Ananya (+91 98765 43210)... 📞')}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#b90041]">call</span>
                <span>Call Customer</span>
              </button>
              <button
                onClick={() => onNavigate('order_driver')}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#b90041] to-[#df2457] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span>View Order</span>
              </button>
            </div>

            {/* Complete Delivery Action */}
            <button
              onClick={handleMarkDelivered}
              disabled={isDelivered}
              className={`w-full py-4 rounded-2xl font-black text-xs md:text-sm tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                isDelivered
                  ? 'bg-[#008644] text-white'
                  : 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-green-600/30 active:scale-98'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isDelivered ? 'verified' : 'task_alt'}
              </span>
              <span>{isDelivered ? 'DELIVERY COMPLETE (CREDITING...)' : 'TAP TO MARK DELIVERED'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}