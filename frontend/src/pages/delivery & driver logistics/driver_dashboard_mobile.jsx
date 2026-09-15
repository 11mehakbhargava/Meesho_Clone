import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function DriverDashboardMobile({ onNavigate = () => {}, onBack }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
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
    },
    {
      id: '55304',
      itemsCount: '1 item',
      distance: '4.1 km away',
      payout: 112,
      pickup: 'Express Hub 4, Indirapuram',
      drop: 'Tower 8, Gaur City 2, Greater Noida',
    },
    {
      id: '55319',
      itemsCount: '2 items',
      distance: '1.8 km away',
      payout: 95,
      pickup: 'Meesho Fulfillment Hub B',
      drop: 'Flat 302, ATS Greens, Sector 50',
    },
  ];

  const handleAcceptTask = (id) => {
    setAcceptedTasks((prev) => new Set(prev).add(id));
    triggerToast(`Accepted Delivery for Order #${id}! Loading Live Route... 🛵`);
    setTimeout(() => {
      onNavigate('active_delivery');
    }, 400);
  };

  const handleToggleShift = () => {
    setIsShiftActive(!isShiftActive);
    triggerToast(isShiftActive ? 'Shift Ended. Great job today!' : 'Shift Started! You are now receiving orders.');
  };

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
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex justify-between items-center px-4 h-16 w-full max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigate('driver_earnings')}
              className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 ring-2 ring-[#b90041]/20 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Delivery Driver Portrait"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight text-base md:text-lg text-[#b90041]">
                Partner ID: MP8829
              </h1>
              <p className="text-xs font-medium text-slate-500">Welcome back, Rahul 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('rider_express')}
              className="px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[#964300] font-black text-xs flex items-center gap-1 cursor-pointer transition-colors border border-orange-200"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Express</span>
            </button>
            <button
              onClick={() => triggerToast('2 new task notifications waiting')}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b90041] animate-ping" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 pt-5 space-y-6">
        {/* Status & Shift Control Toggle */}
        <section className="flex items-center justify-between bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Current Duty Status
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnline ? 'bg-[#008644] animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="font-black text-lg md:text-xl text-[#1c1b1b]">
                {isOnline ? 'Online (Ready)' : 'Offline'}
              </span>
            </div>
          </div>
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
        </section>

        {/* Metric Bento Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div
            onClick={() => onNavigate('driver_earnings')}
            className="col-span-2 md:col-span-1 bg-gradient-to-br from-[#b90041] to-[#df2457] text-white p-5 md:p-6 rounded-3xl flex flex-col justify-between shadow-lg shadow-pink-500/20 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div>
              <p className="text-pink-100 text-xs font-bold uppercase tracking-wider mb-1">
                Today's Earnings ➔
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">₹1,240</h2>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-pink-100 font-bold text-xs bg-white/15 px-3 py-1 rounded-full w-max backdrop-blur-sm">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12% from yesterday</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('delivery_history')}
            className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
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
            className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
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
        </section>

        {/* Tasks Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-black tracking-tight text-[#1c1b1b]">
                New Tasks Nearby
              </h2>
              <p className="text-xs text-slate-500">Pickups ready in your assigned perimeter</p>
            </div>
            <button
              onClick={() => onNavigate('available_tasks')}
              className="text-[#b90041] font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All Map</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isAccepted = acceptedTasks.has(task.id);
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5 transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center text-[#b90041]">
                        <span className="material-symbols-outlined text-2xl">local_shipping</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#1c1b1b]">Order #{task.id}</h4>
                        <p className="text-xs text-slate-500">
                          {task.distance} • {task.itemsCount}
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

                  {/* Pickup / Drop Route */}
                  <div
                    onClick={() => onNavigate('order_driver')}
                    className="flex items-center gap-3 py-3 border-y border-slate-100 bg-[#fafbfc] px-3 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors"
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
                      <p className="font-bold text-slate-800 truncate">{task.pickup}</p>
                      <p className="font-medium text-slate-600 truncate">{task.drop}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      onClick={() => onNavigate('order_driver')}
                      className="flex-1 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleAcceptTask(task.id)}
                      disabled={isAccepted}
                      className={`flex-2 py-3 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                        isAccepted
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gradient-to-r from-[#b90041] to-[#df2457] text-white shadow-pink-500/25 active:scale-95'
                      }`}
                    >
                      {isAccepted ? 'Accepted ✓' : 'Accept Delivery'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Map Mini-View */}
        <section
          onClick={() => onNavigate('active_delivery')}
          className="relative h-44 rounded-3xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer group"
        >
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80"
            alt="Delivery Coverage Map"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <span className="material-symbols-outlined text-[#b90041] text-sm animate-bounce">
              location_on
            </span>
            <span className="text-xs font-bold text-[#1c1b1b]">Open Full Navigation Map ➔</span>
          </div>
        </section>
      </main>

      {/* Floating Shift Controller */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={handleToggleShift}
          className={`h-14 px-6 rounded-full font-black text-xs md:text-sm flex items-center gap-2 shadow-xl active:scale-90 transition-all cursor-pointer ${
            isShiftActive
              ? 'bg-red-600 text-white shadow-red-500/30'
              : 'bg-gradient-to-r from-[#b90041] to-[#df2457] text-white shadow-pink-500/30 hover:scale-105'
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            {isShiftActive ? 'stop_circle' : 'play_circle'}
          </span>
          <span>{isShiftActive ? 'END SHIFT' : 'START SHIFT'}</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />
    </div>
  );
}