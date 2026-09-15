import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function DeliveryHistoryMobile({ onNavigate = () => {}, onBack }) {
  const [selectedFilter, setSelectedFilter] = useState('Last 7 Days');
  const [activeNav, setActiveNav] = useState('History');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const deliveryLogs = [
    {
      id: 'MS-99210-A',
      date: '24 June, 2024',
      time: '02:15 PM',
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-[#008644] border-emerald-200',
      basePay: '45.00',
      incentive: '15.00',
      total: '60.00',
      icon: 'package_2',
    },
    {
      id: 'MS-88321-K',
      date: '24 June, 2024',
      time: '11:45 AM',
      status: 'Returned',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      basePay: '20.00',
      incentive: '0.00',
      total: '20.00',
      note: 'Deduction applied',
      icon: 'assignment_return',
    },
    {
      id: 'MS-44102-X',
      date: '23 June, 2024',
      time: 'Cancelled by Customer',
      status: 'Cancelled',
      statusColor: 'bg-red-50 text-red-700 border-red-200',
      basePay: '0.00',
      incentive: '0.00',
      total: '0.00',
      icon: 'cancel',
    },
    {
      id: 'MS-11029-B',
      date: '23 June, 2024',
      time: '09:20 AM',
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-[#008644] border-emerald-200',
      basePay: '120.00',
      incentive: '35.00 (Rain)',
      total: '155.00',
      icon: 'local_shipping',
    },
  ];

  return (
    <div className="bg-[#fcf9f8] font-sans text-[#1c1b1b] min-h-screen pb-32 antialiased selection:bg-pink-100 selection:text-pink-600">
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
            <button
              onClick={() => (onBack ? onBack() : onNavigate('driver_dashboard'))}
              className="p-1.5 -ml-1 hover:bg-slate-100 rounded-full text-slate-700 cursor-pointer"
              title="Back to Dashboard"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div
              onClick={() => onNavigate('driver_dashboard')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-[#b90041] text-2xl">
                account_circle
              </span>
              <h1 className="font-extrabold tracking-tight text-base md:text-lg text-[#b90041]">
                Partner ID: MP8829
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('driver_earnings')}
              className="text-xs font-bold text-[#b90041] bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              Wallet ₹12.4k
            </button>
            <button
              onClick={() => triggerToast('No unread history notifications')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-6 px-4 max-w-3xl mx-auto space-y-6">
        {/* Dashboard Summary Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div
            onClick={() => onNavigate('driver_earnings')}
            className="md:col-span-2 bg-gradient-to-br from-[#b90041] to-[#df2457] text-white p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-lg shadow-pink-500/20 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all group"
          >
            <div>
              <div className="flex justify-between items-center">
                <p className="text-xs uppercase tracking-widest font-bold text-pink-100">
                  Total Settled Earnings
                </p>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  View Wallet ➔
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mt-1">₹12,450.50</h2>
            </div>
            <div className="mt-4 flex items-center gap-2 text-pink-100 font-bold text-xs bg-white/20 px-3 py-1 rounded-full w-max">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12% vs last week</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('available_tasks')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all"
          >
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tasks Completed
              </p>
              <span className="text-[10px] font-bold text-[#b90041]">Find More ➔</span>
            </div>
            <div className="my-2">
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-slate-700">Delivered</span>
                <span className="text-[#008644]">142</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#008644] h-full rounded-full w-[88%]" />
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 mt-2">
                <span>Returns</span>
                <span className="text-red-500 font-bold">12</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Chips */}
        <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {['Last 7 Days', 'This Month', 'Completed', 'Returns', 'High Value'].map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  triggerToast(`Filtered logs by ${filter}`);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#b90041] text-white shadow-md shadow-pink-500/25'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>{filter}</span>
              </button>
            );
          })}
        </section>

        {/* Task Logs List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1c1b1b]">Recent Delivery Trips</h3>
            <span className="text-xs font-bold text-slate-400">Click trip for details</span>
          </div>

          <div className="space-y-3">
            {deliveryLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => onNavigate('order_driver')}
                className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3 group hover:shadow-md hover:border-pink-200 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[#b90041] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-2xl">{log.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-sm text-[#1c1b1b]">Order #{log.id}</p>
                        <span className="text-[10px] text-[#b90041] font-bold group-hover:underline">
                          View ➔
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{log.time}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-xl border ${log.statusColor}`}
                  >
                    {log.status}
                  </span>
                </div>

                <div className="flex items-end justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Base Pay
                      </span>
                      <span className="font-bold text-slate-700">₹{log.basePay}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Incentive
                      </span>
                      <span className="font-bold text-[#008644]">₹{log.incentive}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                      Total Earned
                    </span>
                    <span className="text-lg font-black text-[#1c1b1b]">₹{log.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Button: Jump to Live Map */}
        <div className="text-center pt-2 pb-6 flex justify-center gap-3">
          <button
            onClick={() => onNavigate('available_tasks')}
            className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-50 cursor-pointer shadow-sm"
          >
            Available Tasks 📦
          </button>
          <button
            onClick={() => onNavigate('driver_earnings')}
            className="px-5 py-3 rounded-2xl bg-[#b90041] text-white font-bold text-xs shadow-md shadow-pink-500/25 cursor-pointer hover:bg-[#a00037]"
          >
            Go to Earnings 💰
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <AppBottomNav activeNav="orders" onNavigate={onNavigate} />
    </div>
  );
}