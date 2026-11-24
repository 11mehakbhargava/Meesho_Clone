import React, { useState, useEffect } from 'react';
import AppBottomNav from '../../components/AppBottomNav';
import { fetchDeliveryHistory, fetchDriverEarnings } from '../../services/driverService';

export default function DeliveryHistoryMobile({ onNavigate = () => {}, onBack }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const [historyData, earningsData] = await Promise.all([
        fetchDeliveryHistory().catch(() => []),
        fetchDriverEarnings().catch(() => null)
      ]);

      if (Array.isArray(historyData)) {
        setDeliveries(historyData);
      }
      if (earningsData?.totalEarnings) {
        setTotalEarned(earningsData.totalEarnings);
      }
    } catch (err) {
      console.warn('Could not load delivery history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredLogs = deliveries.filter((log) => {
    const matchesSearch =
      !searchQuery ||
      log.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.address?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="bg-[#fcf9f8] font-sans text-[#1c1b1b] min-h-screen w-full max-w-full overflow-x-hidden pb-32 antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs w-full max-w-full overflow-hidden">
        <div className="flex justify-between items-center px-3 sm:px-6 lg:px-8 h-14 sm:h-16 w-full max-w-7xl mx-auto gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('driver_dashboard'))}
              className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full text-slate-700 cursor-pointer transition-colors shrink-0"
              title="Back"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">arrow_back</span>
            </button>
            <div
              onClick={() => onNavigate('driver_dashboard')}
              className="cursor-pointer min-w-0"
            >
              <h1 className="font-extrabold tracking-tight text-sm sm:text-lg text-[#b90041] leading-tight whitespace-nowrap">
                Delivery Trip History
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap block">
                {deliveries.length} Completed Drops
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => onNavigate('driver_earnings')}
              className="text-[11px] sm:text-xs font-bold text-[#b90041] bg-pink-50 hover:bg-pink-100 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap"
            >
              Wallet ₹{totalEarned.toFixed(2)}
            </button>
            <button
              onClick={() => onNavigate('available_tasks')}
              className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer shrink-0"
              title="Available Tasks"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">add_task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Search Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deliveries by customer name, address or order ID..."
            className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 pl-10 pr-4 py-3 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#b90041] shadow-xs"
          />
        </div>

        {/* Deliveries List */}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm font-bold">
            Loading delivery archive from database...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-300">history_toggle_off</span>
            <p className="font-bold text-slate-700">No Deliveries Completed Yet</p>
            <p className="text-xs text-slate-400">Accept a task from Available Tasks and complete delivery with customer OTP.</p>
            <button
              onClick={() => onNavigate('available_tasks')}
              className="mt-3 px-4 py-2 bg-pink-50 text-[#b90041] rounded-xl text-xs font-bold"
            >
              Find Pickup Tasks ➔
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#008644] flex items-center justify-center text-2xl shrink-0">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Order #{log.orderId ? log.orderId.slice(-8).toUpperCase() : log.id}
                      </h4>
                      <span className="bg-emerald-50 text-[#008644] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Delivered
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customer: {log.customer} • {log.date} at {log.time}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{log.address}</p>
                  </div>
                </div>

                <div className="text-right self-end sm:self-auto shrink-0">
                  <p className="text-xl font-black text-[#008644]">+₹{log.amount.toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Wallet Credited</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* App Bottom Navigation */}
      <AppBottomNav activeNav="history" onNavigate={onNavigate} />
    </div>
  );
}
