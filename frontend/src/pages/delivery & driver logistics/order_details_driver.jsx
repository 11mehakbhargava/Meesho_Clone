import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function OrderDetailsDriver({ onNavigate = () => {}, onBack }) {
  const [isDelivered, setIsDelivered] = useState(false);
  const [currentStep, setCurrentStep] = useState(2); // 0: Picked up, 1: Arrived, 2: Out for Delivery, 3: Delivered
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleCompleteDelivery = () => {
    setIsDelivered(true);
    setCurrentStep(3);
    triggerToast('Delivery Completed! ₹60.00 added to your wallet 🎉');
    setTimeout(() => {
      onNavigate('driver_earnings');
    }, 1200);
  };

  const timelineSteps = [
    { title: 'Picked up from Hub', time: '10:24 AM • Electronic City Hub' },
    { title: 'Arrived at Local Facility', time: '11:45 AM • Koramangala DC' },
    { title: 'Out for Delivery', time: 'Current • Heading to Customer' },
    { title: 'Delivered', time: 'Estimated by 12:30 PM' },
  ];

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen font-sans antialiased selection:bg-pink-100 selection:text-pink-600 pb-32">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-8 h-16 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('available_tasks'))}
              className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 text-[#b90041] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-extrabold text-lg text-[#1c1b1b]">Order Details</h1>
          </div>
          <button
            onClick={() => onNavigate('active_delivery')}
            className="px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#b90041] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">explore</span>
            <span>Live GPS</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Status & Estimated Earnings Banner */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-7 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Status
              </span>
              <h2 className="text-2xl font-black text-[#b90041] mt-0.5">
                {isDelivered ? 'Delivered' : 'In Transit'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Order #MS-99210-A</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="bg-emerald-50 text-[#008644] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">speed</span>
                <span>On Time</span>
              </div>
              <div
                onClick={() => onNavigate('active_delivery')}
                className="bg-pink-50 text-[#b90041] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-pink-100"
              >
                <span className="material-symbols-outlined text-sm">route</span>
                <span>2.4 km ➔</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigate('driver_earnings')}
            className="md:col-span-5 bg-gradient-to-br from-[#b90041] to-[#df2457] text-white rounded-3xl p-5 shadow-lg shadow-pink-500/20 flex flex-col justify-center items-end text-right cursor-pointer hover:scale-102 transition-transform"
          >
            <p className="text-xs uppercase font-bold text-pink-100 tracking-wider">
              Estimated Earnings ➔
            </p>
            <h3 className="text-4xl font-black leading-none mt-1">₹60.00</h3>
            <div className="mt-2 text-[11px] font-medium text-pink-100 bg-white/20 px-2.5 py-0.5 rounded-full">
              Base ₹45.00 + Incentive ₹15.00
            </div>
          </div>
        </section>

        {/* Customer Details Card */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
                  alt="Customer Avatar"
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-pink-100"
                />
                <div>
                  <h4 className="font-extrabold text-base text-[#1c1b1b]">Priya Sharma</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="text-amber-500 font-bold">★ 4.9 Rating</span>
                    <span>• Regular Customer</span>
                  </p>
                </div>
              </div>

              {/* Call & Chat Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => triggerToast('Dialing customer +91 98765 43210... 📞')}
                  className="w-11 h-11 rounded-2xl bg-pink-50 text-[#b90041] hover:bg-pink-100 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">call</span>
                </button>
                <button
                  onClick={() => triggerToast('Opening live chat with customer... 💬')}
                  className="w-11 h-11 rounded-2xl bg-pink-50 text-[#b90041] hover:bg-pink-100 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">chat_bubble</span>
                </button>
              </div>
            </div>

            {/* Delivery Address Box */}
            <div
              onClick={() => onNavigate('active_delivery')}
              className="bg-[#fcf9f8] p-3.5 rounded-2xl flex items-start gap-2.5 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors"
            >
              <span className="material-symbols-outlined text-[#b90041] text-xl mt-0.5">
                location_on
              </span>
              <div>
                <p className="text-xs md:text-sm font-extrabold text-[#1c1b1b]">
                  4th Floor, Skyview Apt
                </p>
                <p className="text-xs text-slate-500">
                  Koramangala, 5th Block, Bangalore - 560034 (Tap for Live GPS Map)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Package Items & Timeline Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Items Section */}
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Package Items (3)
              </h5>
              <span className="text-[10px] font-extrabold text-[#b90041] bg-pink-50 px-2 py-0.5 rounded-full">
                Fragile
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="bg-[#fcf9f8] p-3 rounded-2xl flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#b90041] shadow-sm">
                  <span className="material-symbols-outlined text-lg">headphones</span>
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-extrabold text-[#1c1b1b] truncate">
                    Elite Wireless Headphones Gen 2
                  </p>
                  <p className="text-slate-400">Qty: 1 • Electronics</p>
                </div>
              </div>

              <div className="bg-[#fcf9f8] p-3 rounded-2xl flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#b90041] shadow-sm">
                  <span className="material-symbols-outlined text-lg">watch</span>
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-extrabold text-[#1c1b1b] truncate">Minimalist Chrono Watch</p>
                  <p className="text-slate-400">Qty: 2 • Accessories</p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivery Progress
            </h5>
            <div className="space-y-4 relative pl-3">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={idx} className="flex gap-3 relative">
                    <div
                      className={`w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0 ${
                        isCurrent
                          ? 'bg-[#b90041] ring-4 ring-pink-500/20'
                          : isPassed
                          ? 'bg-[#008644]'
                          : 'bg-slate-200'
                      }`}
                    />
                    <div className="text-xs">
                      <p
                        className={`font-bold ${
                          isCurrent
                            ? 'text-[#b90041]'
                            : isPassed
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-400">{step.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Complete Delivery Action Button */}
        <div className="pt-2">
          <button
            onClick={handleCompleteDelivery}
            disabled={isDelivered}
            className={`w-full h-14 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isDelivered
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-[#b90041] to-[#df2457] text-white shadow-pink-500/30 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {isDelivered ? 'verified' : 'task_alt'}
            </span>
            <span>{isDelivered ? 'DELIVERY COMPLETED (CREDITING...)' : 'COMPLETE DELIVERY'}</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />
    </div>
  );
}