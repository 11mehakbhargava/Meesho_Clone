import React, { useState } from 'react';

export default function AvailableTasks({ onNavigate = () => {}, onBack }) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [acceptedTasks, setAcceptedTasks] = useState(new Set());
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const tasks = [
    {
      id: '88392',
      merchant: 'Gourmet Pizza Hub',
      address: 'Shop 12, Galleria Market, Sector 28',
      distance: '2.4 km',
      units: '3 Units',
      payout: '85.00',
      pinPos: { top: '32%', left: '68%' },
    },
    {
      id: '88401',
      merchant: 'Fresh Grocery Mart',
      address: 'Main Road, HSR Layout Sector 1',
      distance: '4.1 km',
      units: '8 Units',
      payout: '112.00',
      pinPos: { top: '58%', left: '26%' },
    },
    {
      id: '88415',
      merchant: 'Meesho Luxe Apparel Hub',
      address: 'Warehouse 4, Electronic City Phase 1',
      distance: '1.2 km',
      units: '2 Units',
      payout: '95.00',
      pinPos: { top: '40%', left: '42%' },
    },
  ];

  const handleAcceptTask = (id) => {
    setAcceptedTasks((prev) => new Set(prev).add(id));
    triggerToast(`Order #${id} Accepted! Route GPS loaded. 🛵`);
    setTimeout(() => {
      onNavigate('active_delivery');
    }, 400);
  };

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] overflow-hidden h-screen flex flex-col font-sans antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="fixed top-0 w-full z-40 flex items-center justify-between px-4 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onBack ? onBack() : onNavigate('driver_dashboard'))}
            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-[#b90041] cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1
            onClick={() => onNavigate('driver_dashboard')}
            className="font-extrabold text-lg text-[#b90041] tracking-tight cursor-pointer"
          >
            Available Tasks
          </h1>
        </div>

        {/* Online / Offline Toggle */}
        <div className="flex items-center bg-[#f0edec] rounded-full p-1 border border-slate-200/60 shadow-inner">
          <button
            onClick={() => {
              setIsOnline(true);
              triggerToast('You are Online & discovering nearby tasks');
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isOnline ? 'bg-[#006a34] text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => {
              setIsOnline(false);
              triggerToast('You are now Offline');
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !isOnline ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
            }`}
          >
            Offline
          </button>
        </div>
      </header>

      {/* Interactive Map Canvas */}
      <main className="relative flex-1 w-full overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80"
            alt="City Street Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fcf9f8]/80 via-transparent to-[#fcf9f8]/90 pointer-events-none" />
        </div>

        {/* Dynamic Map Pins */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Driver Live Beacon */}
          <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 bg-[#b90041]/25 rounded-full animate-ping" />
              <div className="relative bg-[#b90041] text-white p-2.5 rounded-full shadow-xl border-2 border-white">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  navigation
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Task Pins on Map */}
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              onClick={() => {
                setActiveTaskIndex(idx);
                onNavigate('order_driver');
              }}
              style={{ top: task.pinPos.top, left: task.pinPos.left }}
              className="absolute pointer-events-auto cursor-pointer group"
            >
              <div
                className={`p-2 rounded-2xl shadow-xl border transition-all duration-300 group-hover:scale-110 flex items-center gap-1.5 ${
                  activeTaskIndex === idx
                    ? 'bg-[#b90041] text-white border-white ring-4 ring-pink-500/30'
                    : 'bg-white text-[#b90041] border-pink-100'
                }`}
              >
                <span
                  className="material-symbols-outlined text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_shipping
                </span>
                <span className="text-[10px] font-black">₹{task.payout}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Task Dashboard Reel */}
        <div className="absolute bottom-6 left-0 right-0 z-20 px-4">
          <div className="max-w-md mx-auto space-y-3">
            {/* Earnings Glance */}
            <div
              onClick={() => onNavigate('driver_earnings')}
              className="bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl shadow-lg border border-white/60 flex items-center justify-between cursor-pointer hover:bg-white"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Today's Potential Earnings ➔
                </p>
                <h2 className="text-xl md:text-2xl font-black text-[#1c1b1b]">₹1,240.00</h2>
              </div>
              <div className="h-10 w-10 bg-emerald-100 text-[#006a34] rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">trending_up</span>
              </div>
            </div>

            {/* Horizontal Task Reel */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {tasks.map((task, idx) => {
                const isAccepted = acceptedTasks.has(task.id);
                const isActive = activeTaskIndex === idx;
                return (
                  <div
                    key={task.id}
                    onClick={() => setActiveTaskIndex(idx)}
                    className={`min-w-[280px] sm:min-w-[310px] snap-center bg-white rounded-3xl p-4 shadow-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#b90041] ring-2 ring-pink-500/20'
                        : 'border-slate-100 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div
                      onClick={() => onNavigate('order_driver')}
                      className="flex justify-between items-start mb-3"
                    >
                      <div>
                        <span className="bg-pink-50 text-[#b90041] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Order #{task.id}
                        </span>
                        <h3 className="text-base font-extrabold text-[#1c1b1b] mt-1 line-clamp-1">
                          {task.merchant}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{task.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Payout</p>
                        <p className="text-xl font-black text-[#008644]">₹{task.payout}</p>
                      </div>
                    </div>

                    <div
                      onClick={() => onNavigate('order_driver')}
                      className="grid grid-cols-2 gap-2 mb-3.5"
                    >
                      <div className="bg-[#fcf9f8] rounded-2xl p-2.5 flex items-center gap-2 border border-slate-100">
                        <span className="material-symbols-outlined text-slate-500 text-lg">
                          distance
                        </span>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold">Distance</p>
                          <p className="text-xs font-bold text-[#1c1b1b]">{task.distance}</p>
                        </div>
                      </div>
                      <div className="bg-[#fcf9f8] rounded-2xl p-2.5 flex items-center gap-2 border border-slate-100">
                        <span className="material-symbols-outlined text-slate-500 text-lg">
                          inventory_2
                        </span>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold">Volume</p>
                          <p className="text-xs font-bold text-[#1c1b1b]">{task.units}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptTask(task.id);
                        }}
                        disabled={isAccepted}
                        className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                          isAccepted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gradient-to-r from-[#b90041] to-[#df2457] text-white shadow-pink-500/25 active:scale-95'
                        }`}
                      >
                        {isAccepted ? 'Accepted ✓' : 'Accept Task'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('active_delivery');
                        }}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 font-bold text-xs cursor-pointer"
                      >
                        Directions
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating GPS Recenter Button */}
        <button
          onClick={() => triggerToast('Re-centering map to your live GPS coordinates... 🎯')}
          className="fixed right-4 bottom-72 z-30 h-13 w-13 rounded-full bg-[#b90041] text-white shadow-2xl flex items-center justify-center active:scale-90 hover:scale-105 transition-all cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            my_location
          </span>
        </button>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 py-2">
        <button
          onClick={() => onNavigate('driver_dashboard')}
          className="flex flex-col items-center justify-center px-3 py-1 text-slate-500 hover:text-[#b90041] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">dashboard</span>
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onNavigate('available_tasks')}
          className="flex flex-col items-center justify-center px-4 py-1 rounded-2xl bg-[#b90041] text-white shadow-md shadow-pink-500/25 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            inventory_2
          </span>
          <span className="text-[10px] font-bold mt-0.5">Tasks</span>
        </button>

        <button
          onClick={() => onNavigate('active_delivery')}
          className="flex flex-col items-center justify-center px-3 py-1 text-slate-500 hover:text-[#b90041] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">explore</span>
          <span className="text-[10px] font-bold mt-0.5">Map</span>
        </button>

        <button
          onClick={() => onNavigate('delivery_history')}
          className="flex flex-col items-center justify-center px-3 py-1 text-slate-500 hover:text-[#b90041] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">history</span>
          <span className="text-[10px] font-bold mt-0.5">History</span>
        </button>

        <button
          onClick={() => onNavigate('driver_earnings')}
          className="flex flex-col items-center justify-center px-3 py-1 text-slate-500 hover:text-[#b90041] cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">payments</span>
          <span className="text-[10px] font-bold mt-0.5">Earnings</span>
        </button>
      </nav>
    </div>
  );
}