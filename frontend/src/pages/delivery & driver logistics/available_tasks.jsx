import React, { useState, useEffect } from 'react';
import AppBottomNav from '../../components/AppBottomNav';
import { fetchAvailableTasks, acceptDeliveryTask } from '../../services/driverService';

export default function AvailableTasks({ onNavigate = () => {}, onBack }) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [acceptedTasks, setAcceptedTasks] = useState(new Set());
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchAvailableTasks();
      const mapped = data.map((t, idx) => ({
        id: t.orderId.slice(-6).toUpperCase(),
        taskId: t.taskId,
        orderId: t.orderId,
        merchant: t.merchant || 'Mshoppy Fulfillment Hub',
        address: t.deliveryAddress,
        distance: t.estimatedDistance || `${(1.5 + idx * 0.8).toFixed(1)} km`,
        units: t.itemsCount,
        payout: Number(t.payout || 55).toFixed(2),
        pinPos: {
          top: `${30 + (idx * 15) % 45}%`,
          left: `${25 + (idx * 22) % 60}%`
        },
        raw: t
      }));
      setTasks(mapped);
    } catch (err) {
      console.warn('Could not fetch available tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAcceptTask = async (task) => {
    const id = task.id;
    setAcceptedTasks((prev) => new Set(prev).add(id));
    try {
      if (task.taskId) {
        await acceptDeliveryTask(task.taskId);
      }
      triggerToast(`Order #${id} Accepted! Route GPS loaded. 🛵`);
      localStorage.setItem('mshoppy_selected_task_id', task.taskId || task.orderId);
      setTimeout(() => {
        onNavigate('active_delivery');
      }, 500);
    } catch (err) {
      triggerToast(err.message || 'Failed to accept task');
    }
  };

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] overflow-hidden h-screen flex flex-col font-sans antialiased selection:bg-pink-100 selection:text-pink-600">
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
            Available Tasks ({tasks.length})
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
        <div className="absolute inset-0 z-0 bg-[#e8ecef]">
          <iframe
            title="City Delivery Zone Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=75.82,22.69,75.92,22.76&layer=mapnik&marker=22.7196,75.8577"
            className="w-full h-full border-0 pointer-events-none filter contrast-105"
            loading="lazy"
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
              key={task.taskId || task.id}
              onClick={() => {
                setActiveTaskIndex(idx);
                localStorage.setItem('mshoppy_selected_task_id', task.taskId);
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
                  Tasks Available ➔
                </p>
                <h2 className="text-xl md:text-2xl font-black text-[#1c1b1b]">
                  {loading ? 'Refreshing...' : `${tasks.length} Live Runs`}
                </h2>
              </div>
              <div className="h-10 w-10 bg-emerald-100 text-[#006a34] rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">trending_up</span>
              </div>
            </div>

            {/* Horizontal Task Reel */}
            {tasks.length === 0 && !loading ? (
              <div className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-xl">
                <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">task_alt</span>
                <p className="text-sm font-bold text-slate-700">No Pending Delivery Tasks Right Now</p>
                <p className="text-xs text-slate-400 mt-1">All orders are currently dispatched or delivered!</p>
                <button
                  onClick={loadTasks}
                  className="mt-3 px-4 py-2 bg-pink-50 text-[#b90041] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Refresh Feed
                </button>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {tasks.map((task, idx) => {
                  const isAccepted = acceptedTasks.has(task.id);
                  const isActive = activeTaskIndex === idx;
                  return (
                    <div
                      key={task.taskId || task.id}
                      onClick={() => setActiveTaskIndex(idx)}
                      className={`min-w-[280px] sm:min-w-[310px] snap-center bg-white rounded-3xl p-4 shadow-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#b90041] ring-2 ring-pink-500/20'
                          : 'border-slate-100 opacity-90 hover:opacity-100'
                      }`}
                    >
                      <div
                        onClick={() => {
                          localStorage.setItem('mshoppy_selected_task_id', task.taskId);
                          onNavigate('order_driver');
                        }}
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
                        onClick={() => {
                          localStorage.setItem('mshoppy_selected_task_id', task.taskId);
                          onNavigate('order_driver');
                        }}
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
                            <p className="text-[9px] text-slate-400 font-bold">Package</p>
                            <p className="text-xs font-bold text-[#1c1b1b]">{task.units}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            localStorage.setItem('mshoppy_selected_task_id', task.taskId);
                            onNavigate('order_driver');
                          }}
                          className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleAcceptTask(task)}
                          disabled={isAccepted}
                          className={`flex-1 py-3 rounded-2xl font-black text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5 ${
                            isAccepted
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-[#b90041] hover:bg-[#a00037] text-white active:scale-95'
                          }`}
                        >
                          {isAccepted ? (
                            <>
                              <span className="material-symbols-outlined text-base">check</span>
                              <span>Accepted</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-base">touch_app</span>
                              <span>Accept Task</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* App Bottom Navigation */}
      <AppBottomNav active="tasks" onNavigate={onNavigate} />
    </div>
  );
}
