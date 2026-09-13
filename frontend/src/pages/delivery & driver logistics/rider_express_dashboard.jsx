import React, { useState } from 'react';

export default function RiderExpressDashboard({ onNavigate = () => {}, onBack }) {
  const [isPickupConfirmed, setIsPickupConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleConfirmPickup = () => {
    setIsPickupConfirmed(true);
    triggerToast('Pickup Confirmed for #MEE-789! GPS route updated to customer drop location.');
    setTimeout(() => {
      onNavigate('active_delivery');
    }, 600);
  };

  return (
    <div className="bg-[#fff4ef] font-sans text-[#492604] min-h-screen pb-32 antialiased selection:bg-orange-100 selection:text-orange-700">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-white/85 backdrop-blur-md shadow-sm rounded-b-3xl flex justify-between items-center px-5 py-3.5 w-full sticky top-0 z-40 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onBack ? onBack() : onNavigate('driver_dashboard'))}
            className="p-1.5 rounded-full hover:bg-orange-100 text-[#964300] cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#964300] text-2xl">speed</span>
            <h1 className="font-extrabold uppercase tracking-tight text-lg text-[#964300]">
              Rider Express
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-orange-100/70 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-[#008644] animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#964300]">
            ONLINE • 12 Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-6 space-y-6 max-w-xl mx-auto">
        {/* Active Assignment Hero Section */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9d6c44]">
                Current Mission
              </p>
              <h2 className="text-2xl font-black tracking-tight text-[#492604]">Active Order</h2>
            </div>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              {isPickupConfirmed ? 'On the Way' : 'In Progress'}
            </span>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-orange-100 p-5 space-y-4">
            <div
              onClick={() => onNavigate('order_driver')}
              className="flex justify-between items-start cursor-pointer hover:opacity-90"
            >
              <div>
                <span className="text-[10px] font-bold text-[#9d6c44] uppercase tracking-wider">
                  Order ID
                </span>
                <span className="block text-2xl font-black text-[#964300]">#MEE-789 ➔</span>
              </div>
              <div className="bg-orange-50 p-2.5 rounded-2xl text-[#964300]">
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_shipping
                </span>
              </div>
            </div>

            {/* Route Stops */}
            <div
              onClick={() => onNavigate('active_delivery')}
              className="space-y-4 relative pl-3 py-1 cursor-pointer"
            >
              <div className="flex gap-3 relative">
                <div className="z-10 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-[#964300] mt-0.5">
                  <span className="material-symbols-outlined text-xs">store</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#9d6c44] uppercase">Pickup Point</p>
                  <p className="text-sm font-extrabold text-[#492604]">
                    Warehouse A (Whitefield Main Hub)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 relative">
                <div className="z-10 w-7 h-7 rounded-full bg-[#fe8534] flex items-center justify-center text-white mt-0.5 shadow-md shadow-orange-500/30">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#9d6c44] uppercase">Drop-Off Location</p>
                  <p className="text-sm font-extrabold text-[#492604]">Apartment 4B, MG Road</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('active_delivery')}
                className="flex items-center justify-center gap-1.5 bg-orange-100 hover:bg-orange-200 text-[#964300] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">map</span>
                <span>Live Map</span>
              </button>
              <button
                onClick={handleConfirmPickup}
                disabled={isPickupConfirmed}
                className={`flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer ${
                  isPickupConfirmed
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-[#964300] to-[#fe8534] text-white shadow-orange-500/25 active:scale-95'
                }`}
              >
                <span>{isPickupConfirmed ? 'Picked Up ✓' : 'Confirm Pickup'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Upcoming Deliveries Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#9d6c44]">
              Upcoming Deliveries
            </h3>
            <span className="text-xs font-bold text-[#964300]">2 TOTAL</span>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'MEE-790', area: 'Indiranagar Sector 3', distance: '2.4 km', time: 'Est. 12m' },
              {
                id: 'MEE-791',
                area: 'Koramangala 5th Block',
                distance: '3.8 km',
                time: 'Est. 18m',
              },
            ].map((order) => (
              <div
                key={order.id}
                onClick={() => onNavigate('order_driver')}
                className="bg-white p-4 rounded-2xl flex items-center justify-between border border-orange-100 shadow-sm group hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#964300]">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#492604]">Order #{order.id}</p>
                    <p className="text-[11px] text-[#9d6c44]">{order.area}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#964300]">{order.distance}</p>
                  <p className="text-[10px] text-[#9d6c44] uppercase font-bold">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Bento Section */}
        <section className="grid grid-cols-2 gap-3 pb-6">
          <div
            onClick={() => onNavigate('driver_earnings')}
            className="bg-white p-4 rounded-3xl border border-orange-100 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="material-symbols-outlined text-[#964300] text-2xl">payments</span>
            <div className="mt-3">
              <p className="text-[9px] font-bold text-[#9d6c44] uppercase tracking-wider">
                Daily Earnings ➔
              </p>
              <p className="text-2xl font-black text-[#492604]">₹1,420</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('driver_earnings')}
            className="bg-white p-4 rounded-3xl border border-orange-100 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
          >
            <span
              className="material-symbols-outlined text-[#fe8534] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <div className="mt-3">
              <p className="text-[9px] font-bold text-[#9d6c44] uppercase tracking-wider">
                Rider Score
              </p>
              <p className="text-2xl font-black text-[#492604]">4.92 ★</p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-white/95 backdrop-blur-xl border-t border-orange-100 shadow-[0_-4px_20px_rgba(73,38,4,0.06)]">
        <button
          onClick={() => onNavigate('driver_dashboard')}
          className="flex flex-col items-center justify-center px-4 py-1 text-[#492604] hover:text-[#964300] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">dashboard</span>
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onNavigate('available_tasks')}
          className="flex flex-col items-center justify-center px-4 py-1 text-[#492604] hover:text-[#964300] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">inventory_2</span>
          <span className="text-[10px] font-bold mt-0.5">Tasks</span>
        </button>

        <button
          onClick={() => onNavigate('active_delivery')}
          className="flex flex-col items-center justify-center px-4 py-1 text-[#492604] hover:text-[#964300] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">explore</span>
          <span className="text-[10px] font-bold mt-0.5">Live Map</span>
        </button>

        <button
          onClick={() => onNavigate('driver_earnings')}
          className="flex flex-col items-center justify-center px-4 py-1 text-[#492604] hover:text-[#964300] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">payments</span>
          <span className="text-[10px] font-bold mt-0.5">Earnings</span>
        </button>
      </nav>
    </div>
  );
}