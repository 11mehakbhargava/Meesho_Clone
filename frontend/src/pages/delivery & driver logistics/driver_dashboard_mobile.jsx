import React, { useState, useEffect } from 'react';
import AppBottomNav from '../../components/AppBottomNav';
import {
  fetchDriverDashboard,
  fetchAvailableTasks,
  acceptDeliveryTask,
  getStoredDriver
} from '../../services/driverService';

export default function DriverDashboardMobile({ onNavigate = () => {}, onBack }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isShiftActive, setIsShiftActive] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [acceptedTasks, setAcceptedTasks] = useState(new Set());

  const [metrics, setMetrics] = useState({
    todayEarnings: 0,
    completedDrops: 0,
    pendingTasksCount: 0,
    activeRun: null
  });
  const [driver, setDriver] = useState(() => {
    const stored = getStoredDriver();
    return {
      name: stored?.name || 'Rider Partner',
      phone: stored?.phone ? `+91 ${stored.phone}` : '',
      vehicle: stored?.vehicle || 'Two-Wheeler Partner',
      rating: 'New Rider'
    };
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const triggerToast = (msg) => {
    // Clean inline notification without intrusive black popup
    console.log('[Dispatch Desk]', msg);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashData, availableData] = await Promise.all([
        fetchDriverDashboard().catch(() => null),
        fetchAvailableTasks().catch(() => [])
      ]);

      if (dashData?.metrics) {
        setMetrics(dashData.metrics);
      }
      if (dashData?.driver) {
        setDriver(dashData.driver);
      }
      if (Array.isArray(availableData)) {
        const mapped = availableData.map((t, idx) => ({
          id: t.orderId.slice(-6).toUpperCase(),
          taskId: t.taskId,
          orderId: t.orderId,
          itemsCount: t.itemsCount || '1 item',
          distance: t.estimatedDistance || `${(1.2 + idx * 0.7).toFixed(1)} km away`,
          payout: Number(t.payout || 55),
          pickup: t.pickupAddress || 'Central Hub, Electronic City',
          drop: t.deliveryAddress,
          type: t.paymentMethod?.includes('COD') ? 'COD Cash' : 'Prepaid Express',
          timeEst: t.timeEst || '15 mins',
          raw: t
        }));
        setTasks(mapped);
      }
    } catch (err) {
      console.warn('Driver dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptTask = async (task) => {
    const id = task.id;
    setAcceptedTasks((prev) => new Set(prev).add(id));
    try {
      if (task.taskId) {
        await acceptDeliveryTask(task.taskId);
      }
      triggerToast(`Accepted Order #${id}! Loading Live Route... 🛵`);
      localStorage.setItem('mshoppy_selected_task_id', task.taskId || task.orderId);
      localStorage.setItem('mshoppy_active_task_id', task.taskId || task.orderId);
      setTimeout(() => {
        onNavigate('active_delivery');
      }, 500);
    } catch (err) {
      triggerToast(err.message || 'Failed to accept task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'All') return true;
    if (activeFilter.includes('COD')) return t.type.includes('COD');
    if (activeFilter.includes('Prepaid')) return t.type.includes('Prepaid');
    return true;
  });

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen font-sans antialiased selection:bg-pink-100 selection:text-pink-600 pb-28">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#b90041] to-[#df2457] text-white flex items-center justify-center font-black text-lg shadow-md shadow-pink-500/20">
              ⚡
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg text-[#1c1b1b] leading-tight flex items-center gap-1.5">
                <span>Rider Dispatch Desk</span>
                <span className="text-[10px] font-bold bg-pink-50 text-[#b90041] px-2 py-0.5 rounded-full uppercase">
                  SwiftFleet Live
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                {driver.name} • {driver.vehicle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('driver_kyc')}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors border border-slate-200"
              title="Rider KYC Verification"
            >
              <span>🛡️</span>
              <span className="hidden sm:inline">KYC Hub</span>
            </button>
            <button
              onClick={() => onNavigate('driver_login')}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors border border-slate-200"
              title="Switch Rider / Mobile Login"
            >
              <span>📱</span>
              <span className="hidden sm:inline">Rider Login</span>
            </button>
            <button
              onClick={() => onNavigate('available_tasks')}
              className="px-3.5 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#b90041] font-black text-xs flex items-center gap-1 cursor-pointer transition-colors border border-pink-200"
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              <span>Available Tasks ({tasks.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Status Bar */}
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
                  triggerToast('Status set to Online');
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
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                ₹{metrics.todayEarnings.toFixed(2)}
              </h2>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-pink-100 font-bold text-xs bg-white/15 px-3 py-1 rounded-full w-max backdrop-blur-sm">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Direct Bank Settlement</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('delivery_history')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-pink-200 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-[#b90041] mb-2">
              <span className="material-symbols-outlined text-xl">package_2</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Completed Drops ➔
              </p>
              <h3 className="text-2xl font-black text-[#1c1b1b]">
                {metrics.completedDrops} Logged
              </h3>
            </div>
          </div>

          <div
            onClick={() => onNavigate('available_tasks')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-pink-200 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-2">
              <span className="material-symbols-outlined text-xl">near_me</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Available Tasks ➔
              </p>
              <h3 className="text-2xl font-black text-[#1c1b1b]">
                {tasks.length} Ready
              </h3>
            </div>
          </div>

          <div
            onClick={() => onNavigate('driver_earnings')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-pink-200 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#008644] mb-2">
              <span className="material-symbols-outlined text-xl">star</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Rider Rating
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[#1c1b1b]">
                {driver.rating}
              </h3>
            </div>
          </div>
        </section>

        {/* Active Run Banner (If any) */}
        {metrics.activeRun && (
          <section
            onClick={() => {
              localStorage.setItem('mshoppy_active_task_id', metrics.activeRun.taskId);
              onNavigate('active_delivery');
            }}
            className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">two_wheeler</span>
              <div>
                <span className="text-xs uppercase font-black tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  Active Delivery In Progress
                </span>
                <h3 className="font-extrabold text-base mt-1">
                  Customer: {metrics.activeRun.customerName} (Order #{metrics.activeRun.orderId.slice(-6).toUpperCase()})
                </h3>
              </div>
            </div>
            <button className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-xs">
              Resume Map ➔
            </button>
          </section>
        )}

        {/* Reverse Pickup Hub CTA */}
        <section
          onClick={() => onNavigate('driver_reverse_pickup')}
          className="bg-gradient-to-r from-rose-600 to-[#b90041] text-white p-4 sm:p-5 rounded-3xl shadow-lg shadow-pink-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0 backdrop-blur-md">
              🔄
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full text-white">
                Customer Return Doorstep QC
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-1">
                Reverse Pickups & Doorstep Quality Check
              </h3>
              <p className="text-xs text-pink-100">Pick up returned packets from customer doorstep • ₹45.00 incentive</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('driver_reverse_pickup');
            }}
            className="px-4 py-2.5 bg-white text-[#b90041] font-black text-xs rounded-xl shadow-sm self-stretch sm:self-auto hover:bg-pink-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            Open Returns Desk ➔
          </button>
        </section>

        {/* Tasks Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#1c1b1b]">
                Available Fulfillment Tasks
              </h2>
              <p className="text-xs text-slate-500">
                Live orders in warehouse perimeter ready for rider dispatch
              </p>
            </div>

            <div className="flex gap-1.5 overflow-x-auto py-1">
              {['All', 'COD Cash', 'Prepaid Express'].map((f) => (
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

          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inventory</span>
              <p className="font-bold text-slate-700">No Pending Tasks Right Now</p>
              <p className="text-xs text-slate-400 mt-1">All orders are currently dispatched or delivered.</p>
              <button
                onClick={loadData}
                className="mt-3 px-4 py-2 bg-pink-50 text-[#b90041] rounded-xl text-xs font-bold cursor-pointer"
              >
                Refresh Tasks
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => {
                const isAccepted = acceptedTasks.has(task.id);
                return (
                  <div
                    key={task.taskId || task.id}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#b90041] flex-shrink-0">
                          <span className="material-symbols-outlined text-2xl">local_shipping</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                              📦 Parcel Delivery
                            </span>
                            <span className="text-[10px] font-bold bg-pink-50 text-[#b90041] px-2 py-0.5 rounded-md">
                              {task.type}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-[#1c1b1b] mt-0.5">
                            Order #{task.id}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {task.distance} • {task.itemsCount}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-[#008644]">₹{task.payout.toFixed(2)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Delivery Payout</p>
                      </div>
                    </div>

                    <div className="py-2.5 px-3 bg-[#fafbfc] rounded-2xl border border-slate-100 text-xs space-y-1.5">
                      <p className="text-slate-600 truncate text-[11px]">
                        <strong className="text-slate-800">🏬 Hub Pickup: </strong>{task.pickup}
                      </p>
                      <p className="font-bold text-slate-900 truncate text-[12px]">
                        <strong className="text-[#b90041]">📍 Deliver to: </strong>{task.drop}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          localStorage.setItem('mshoppy_selected_task_id', task.taskId);
                          onNavigate('order_driver');
                        }}
                        className="flex-1 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
                      >
                        View Order
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
                        {isAccepted ? 'Accepted' : 'Accept & Deliver ➔'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* App Bottom Navigation */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />
    </div>
  );
}
