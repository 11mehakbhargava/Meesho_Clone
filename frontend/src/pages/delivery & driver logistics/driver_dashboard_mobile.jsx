import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function DriverDashboardMobile({ onNavigate = () => {}, onBack }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isShiftActive, setIsShiftActive] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
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
      id: '55291',
      itemsCount: '3 items',
      distance: '2.4 km away',
      payout: 85,
      pickup: 'Central Hub, Sector 62, Noida',
      drop: 'G-42, Amrapali Silicon City, Sector 76',
      type: 'Express',
      timeEst: '15 mins',
    },
    {
      id: '55304',
      itemsCount: '1 item',
      distance: '4.1 km away',
      payout: 112,
      pickup: 'Express Hub 4, Indirapuram',
      drop: 'Tower 8, Gaur City 2, Greater Noida',
      type: 'High Value',
      timeEst: '25 mins',
    },
    {
      id: '55319',
      itemsCount: '2 items',
      distance: '1.8 km away',
      payout: 95,
      pickup: 'Meesho Fulfillment Hub B',
      drop: 'Flat 302, ATS Greens, Sector 50',
      type: 'Standard',
      timeEst: '12 mins',
    },
    {
      id: '55342',
      itemsCount: '4 items',
      distance: '3.2 km away',
      payout: 140,
      pickup: 'Electronic City Warehouse Hub 1',
      drop: 'Villa 14, Prestige Ferns, Koramangala',
      type: 'Express',
      timeEst: '20 mins',
    },
  ];

  const handleAcceptTask = (id) => {
    setAcceptedTasks((prev) => new Set(prev).add(id));
    triggerToast(`Accepted Order #${id}! Loading Live Route... 🛵`);
    setTimeout(() => {
      onNavigate('active_delivery');
    }, 400);
  };

  const handleToggleShift = () => {
    setIsShiftActive(!isShiftActive);
    triggerToast(
      isShiftActive
        ? 'Shift Ended. Great job today!'
        : 'Shift Started! You are now receiving orders.'
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'All') return true;
    return t.type === activeFilter;
  });

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-sans antialiased min-h-screen pb-32 selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 w-full max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigate('driver_earnings')}
              className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 ring-2 ring-[#b90041]/20 cursor-pointer flex-shrink-0"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Delivery Driver Portrait"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold tracking-tight text-base sm:text-lg text-[#b90041] leading-none">
                  Partner ID: MP8829
                </h1>
                <span className="text-[10px] font-black bg-green-50 text-[#008644] px-2 py-0.5 rounded-full border border-green-200">
                  Verified Tier 1
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Welcome back, Rahul 👋</p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('rider_express')}
              className="px-3.5 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[#964300] font-black text-xs flex items-center gap-1 cursor-pointer transition-colors border border-orange-200"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Express Fleet</span>
            </button>
            <button
              onClick={() => onNavigate('meesho_velocity')}
              className="hidden md:flex px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs items-center gap-1 cursor-pointer transition-colors border border-indigo-200"
            >
              <span className="material-symbols-outlined text-sm">speed</span>
              <span>Velocity Grid</span>
            </button>
            <button
              onClick={() => onNavigate('swiftroute')}
              className="hidden lg:flex px-3.5 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#b90041] font-black text-xs items-center gap-1 cursor-pointer transition-colors border border-pink-200"
            >
              <span className="material-symbols-outlined text-sm">route</span>
              <span>SwiftRoute AI</span>
            </button>
            <button
              onClick={() => triggerToast('2 new task notifications waiting')}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b90041] animate-ping" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Status Bar & Quick Duty Controls */}
        <section className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isOnline ? 'bg-[#008644] animate-pulse' : 'bg-slate-400'
              }`}
            />
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">
                Current Duty Status
              </span>
              <span className="font-black text-lg text-[#1c1b1b]">
                {isOnline ? 'Online (Ready to Receive Orders)' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center bg-[#f6f3f2] p-1 rounded-full border border-slate-200/60">
              <button
                onClick={() => {
                  setIsOnline(false);
                  triggerToast('Status set to Offline');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !isOnline
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Offline
              </button>
              <button
                onClick={() => {
                  setIsOnline(true);
                  triggerToast('Status set to Online! Ready for orders');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isOnline
                    ? 'bg-[#008644] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Online
              </button>
            </div>

            <button
              onClick={handleToggleShift}
              className={`px-5 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                isShiftActive
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                  : 'bg-[#b90041] text-white shadow-pink-500/25'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isShiftActive ? 'stop_circle' : 'play_circle'}
              </span>
              <span>{isShiftActive ? 'End Shift' : 'Start Shift'}</span>
            </button>
          </div>
        </section>

        {/* 4-Column Bento Metric Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          <div
            onClick={() => onNavigate('driver_earnings')}
            className="col-span-2 sm:col-span-1 bg-gradient-to-br from-[#b90041] to-[#df2457] text-white p-5 sm:p-6 rounded-3xl flex flex-col justify-between shadow-lg shadow-pink-500/20 cursor-pointer hover:scale-[1.02] transition-transform group"
          >
            <div>
              <p className="text-pink-100 text-xs font-bold uppercase tracking-wider mb-1">
                Today's Earnings ➔
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">₹1,240</h2>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-pink-100 font-bold text-xs bg-white/15 px-3 py-1 rounded-full w-max backdrop-blur-sm">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12% vs yesterday</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('delivery_history')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-pink-200 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-[#b90041] mb-2">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                package_2
              </span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Deliveries ➔
              </p>
              <h3 className="text-2xl font-black text-[#1c1b1b]">14 Logged</h3>
            </div>
          </div>

          <div
            onClick={() => onNavigate('driver_earnings')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-pink-200 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#008644] mb-2">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Partner Rating
              </p>
              <h3 className="text-2xl font-black text-[#1c1b1b]">4.92 ★</h3>
            </div>
          </div>

          <div
            onClick={() => onNavigate('active_delivery')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-pink-200 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 mb-2">
              <span className="material-symbols-outlined text-xl">two_wheeler</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Avg Delivery Time
              </p>
              <h3 className="text-2xl font-black text-indigo-900">22 mins</h3>
            </div>
          </div>
        </section>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tasks Queue (7 cols) */}
          <section className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#1c1b1b]">
                  New Tasks Nearby
                </h2>
                <p className="text-xs text-slate-500">
                  Pickups ready in your assigned perimeter (Sector 62, Noida)
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                {['All', 'Express', 'High Value', 'Standard'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter === f
                        ? 'bg-[#b90041] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3.5">
              {filteredTasks.map((task) => {
                const isAccepted = acceptedTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5 transition-all hover:shadow-md hover:border-pink-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#b90041] flex-shrink-0">
                          <span className="material-symbols-outlined text-2xl">local_shipping</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-[#1c1b1b]">
                              Order #{task.id}
                            </h4>
                            <span className="text-[10px] font-bold bg-pink-50 text-[#b90041] px-2 py-0.5 rounded-md">
                              {task.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {task.distance} • {task.itemsCount} • ETA {task.timeEst}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-[#008644]">₹{task.payout}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          Payout
                        </p>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div
                      onClick={() => onNavigate('order_driver')}
                      className="flex items-center gap-3 py-3 border-y border-slate-100 bg-[#fafbfc] px-3.5 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className="material-symbols-outlined text-[#b90041] text-xs"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          location_on
                        </span>
                        <div className="w-0.5 h-4 bg-slate-300" />
                        <span
                          className="material-symbols-outlined text-[#008644] text-xs"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          home
                        </span>
                      </div>
                      <div className="flex-1 space-y-1 text-xs">
                        <p className="font-bold text-slate-800 truncate">
                          <span className="text-slate-400 font-normal">Pickup:</span> {task.pickup}
                        </p>
                        <p className="font-medium text-slate-600 truncate">
                          <span className="text-slate-400 font-normal">Drop:</span> {task.drop}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => onNavigate('order_driver')}
                        className="flex-1 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                      >
                        View Order Details
                      </button>
                      <button
                        onClick={() => handleAcceptTask(task.id)}
                        disabled={isAccepted}
                        className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                          isAccepted
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gradient-to-r from-[#b90041] to-[#df2457] text-white shadow-pink-500/25 active:scale-95'
                        }`}
                      >
                        {isAccepted ? 'Accepted ✓' : 'Accept Delivery ➔'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right Column: Live GPS & Route Hub (5 cols) */}
          <section className="lg:col-span-5 space-y-5">
            {/* Live Navigation Map Card */}
            <div
              onClick={() => onNavigate('active_delivery')}
              className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80"
                alt="Delivery Coverage Map"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#b90041] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live GPS Active
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b90041] text-xl animate-bounce">
                    near_me
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-[#1c1b1b]">
                      Open Full Live Navigation Map
                    </p>
                    <p className="text-[10px] text-slate-400">Turn-by-turn rider instructions</p>
                  </div>
                </div>
                <span className="text-[#b90041] text-xs font-black">➔</span>
              </div>
            </div>

            {/* Quick Links Hub */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Driver Navigation Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => onNavigate('available_tasks')}
                  className="p-3 bg-slate-50 hover:bg-pink-50 rounded-2xl text-left border border-slate-100 transition-colors cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-lg text-[#b90041]">
                    assignment
                  </span>
                  <p className="text-xs font-extrabold text-slate-800 mt-1 group-hover:text-[#b90041]">
                    All Tasks Map
                  </p>
                  <p className="text-[10px] text-slate-400">Explore pool</p>
                </button>
                <button
                  onClick={() => onNavigate('driver_earnings')}
                  className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl text-left border border-slate-100 transition-colors cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-lg text-[#008644]">
                    account_balance_wallet
                  </span>
                  <p className="text-xs font-extrabold text-slate-800 mt-1 group-hover:text-[#008644]">
                    Driver Wallet
                  </p>
                  <p className="text-[10px] text-slate-400">Withdraw ₹12.4k</p>
                </button>
                <button
                  onClick={() => onNavigate('swiftroute')}
                  className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-2xl text-left border border-slate-100 transition-colors cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-lg text-indigo-600">route</span>
                  <p className="text-xs font-extrabold text-slate-800 mt-1 group-hover:text-indigo-600">
                    SwiftRoute
                  </p>
                  <p className="text-[10px] text-slate-400">AI sequence</p>
                </button>
                <button
                  onClick={() => onNavigate('delivery_history')}
                  className="p-3 bg-slate-50 hover:bg-pink-50 rounded-2xl text-left border border-slate-100 transition-colors cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-lg text-[#b90041]">history</span>
                  <p className="text-xs font-extrabold text-slate-800 mt-1 group-hover:text-[#b90041]">
                    Trip History
                  </p>
                  <p className="text-[10px] text-slate-400">14 completed</p>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />
    </div>
  );
}