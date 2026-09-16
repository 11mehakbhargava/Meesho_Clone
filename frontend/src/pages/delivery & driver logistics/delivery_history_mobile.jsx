import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function DeliveryHistoryMobile({ onNavigate = () => {}, onBack }) {
  const [selectedFilter, setSelectedFilter] = useState('Last 7 Days');
  const [searchQuery, setSearchQuery] = useState('');
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
      pickup: 'Electronic City Hub',
      drop: 'Koramangala 5th Block',
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
      pickup: 'Express Hub 4',
      drop: 'Indiranagar 100ft Rd',
      note: 'Door locked / rescheduled',
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
      pickup: 'Noida Hub 2',
      drop: 'Sector 76 Amrapali',
      icon: 'cancel',
    },
    {
      id: 'MS-11029-B',
      date: '23 June, 2024',
      time: '09:20 AM',
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-[#008644] border-emerald-200',
      basePay: '120.00',
      incentive: '35.00 (Rain Peak)',
      total: '155.00',
      pickup: 'Whitefield Mega Warehouse',
      drop: 'Prestige Tech Vista',
      icon: 'local_shipping',
    },
    {
      id: 'MS-55319-C',
      date: '22 June, 2024',
      time: '04:10 PM',
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-[#008644] border-emerald-200',
      basePay: '75.00',
      incentive: '20.00',
      total: '95.00',
      pickup: 'HSR Layout Hub A',
      drop: 'Sarjapur Road Green Glen',
      icon: 'package_2',
    },
  ];

  const filteredLogs = deliveryLogs.filter((log) => {
    const matchesFilter =
      selectedFilter === 'Last 7 Days' ||
      selectedFilter === 'This Month' ||
      (selectedFilter === 'Completed' && log.status === 'Completed') ||
      (selectedFilter === 'Returns' && log.status === 'Returned') ||
      (selectedFilter === 'High Value' && Number(log.total) > 80);

    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.drop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.pickup.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 w-full max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('driver_dashboard'))}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-700 cursor-pointer transition-colors"
              title="Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div
              onClick={() => onNavigate('driver_dashboard')}
              className="cursor-pointer"
            >
              <h1 className="font-extrabold tracking-tight text-base sm:text-lg text-[#b90041] leading-none">
                Delivery Trip History
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Partner ID: MP8829 • All Logs
              </span>
            </div>
          </div>

          {/* Desktop Search Input */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Hub or Drop location..."
                className="w-full bg-[#f2f4f6] text-slate-800 placeholder:text-slate-400 pl-9 pr-4 py-2 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('driver_earnings')}
              className="text-xs font-bold text-[#b90041] bg-pink-50 hover:bg-pink-100 px-3.5 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              Wallet ₹12.4k
            </button>
            <button
              onClick={() => onNavigate('available_tasks')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
              title="Available Tasks"
            >
              <span className="material-symbols-outlined text-2xl">add_task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Filter Chips & Trip Logs (8 cols) */}
          <section className="lg:col-span-8 space-y-4">
            {/* Filter Chips */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {['Last 7 Days', 'This Month', 'Completed', 'Returns', 'High Value'].map(
                  (filter) => {
                    const isActive = selectedFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          triggerToast(`Filtered logs by ${filter}`);
                        }}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#b90041] text-white shadow-md shadow-pink-500/25 scale-[1.02]'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <span>{filter}</span>
                      </button>
                    );
                  }
                )}
              </div>

              <span className="text-xs font-bold text-slate-400 whitespace-nowrap hidden sm:inline">
                {filteredLogs.length} Trips
              </span>
            </div>

            {/* Mobile Search Input */}
            <div className="md:hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips..."
                className="w-full bg-white p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Trip Cards List */}
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
                  <span className="text-3xl block mb-2">📦</span>
                  <p className="font-extrabold text-sm text-slate-800">No delivery logs found</p>
                  <p className="text-xs text-slate-400 mt-1">Try selecting a different filter.</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => onNavigate('order_driver')}
                    className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3 group hover:shadow-md hover:border-pink-200 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#b90041] flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                          <span className="material-symbols-outlined text-2xl">{log.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-sm text-[#1c1b1b]">
                              Order #{log.id}
                            </p>
                            <span className="text-[10px] text-[#b90041] font-bold group-hover:underline">
                              Details ➔
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {log.date} • {log.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-xl border ${log.statusColor}`}
                      >
                        {log.status}
                      </span>
                    </div>

                    {/* Pickup & Drop Points */}
                    <div className="bg-[#fcf9f8] p-3 rounded-2xl text-xs text-slate-600 flex items-center justify-between gap-2 border border-slate-100">
                      <span className="truncate">
                        <strong className="text-slate-800">From:</strong> {log.pickup}
                      </span>
                      <span className="text-slate-300">➔</span>
                      <span className="truncate">
                        <strong className="text-slate-800">To:</strong> {log.drop}
                      </span>
                    </div>

                    {/* Breakdown */}
                    <div className="flex items-end justify-between pt-2 border-t border-slate-100 text-xs">
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
                ))
              )}
            </div>
          </section>

          {/* Right Column: Earnings & Efficiency Hub (4 cols, sticky) */}
          <section className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* Total Settled Earnings Hero */}
            <div
              onClick={() => onNavigate('driver_earnings')}
              className="bg-gradient-to-br from-[#b90041] to-[#df2457] text-white p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-lg shadow-pink-500/20 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all group"
            >
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-xs uppercase tracking-widest font-bold text-pink-100">
                    Settled Earnings
                  </p>
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    Wallet ➔
                  </span>
                </div>
                <h2 className="text-4xl font-black mt-1">₹12,450.50</h2>
              </div>
              <div className="mt-4 flex items-center gap-2 text-pink-100 font-bold text-xs bg-white/20 px-3 py-1 rounded-full w-max">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+12% vs last week</span>
              </div>
            </div>

            {/* Tasks Completion Gauge Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tasks Performance
                </h3>
                <span className="text-xs font-extrabold text-[#008644]">88% Success</span>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-700">Delivered on Time</span>
                  <span className="text-[#008644]">142 Packages</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#008644] h-full rounded-full w-[88%]" />
                </div>
                <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 mt-2">
                  <span>Customer Returns</span>
                  <span className="text-amber-600 font-bold">12 Packages</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('available_tasks')}
                className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 font-bold text-xs text-center shadow-xs cursor-pointer transition-colors"
              >
                📦 Available Tasks
              </button>
              <button
                onClick={() => onNavigate('driver_earnings')}
                className="p-3.5 bg-[#b90041] hover:bg-[#a00037] text-white rounded-2xl font-bold text-xs text-center shadow-md shadow-pink-500/25 cursor-pointer transition-colors"
              >
                💰 Payouts Wallet
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <AppBottomNav activeNav="orders" onNavigate={onNavigate} />
    </div>
  );
}