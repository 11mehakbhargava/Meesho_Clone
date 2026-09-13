import React, { useState } from 'react';

export default function DriverEarningsMobile({ onNavigate = () => {}, onBack }) {
  const [balance, setBalance] = useState(12450.5);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      triggerToast('Please enter a valid amount');
      return;
    }
    if (amount > balance) {
      triggerToast('Amount exceeds available wallet balance');
      return;
    }

    setBalance((b) => b - amount);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    triggerToast(`Withdrawal of ₹${amount.toLocaleString()} initiated to Bank Account! 🏦`);
  };

  const weeklyData = [
    { day: 'MON', height: '40%', amount: '₹840' },
    { day: 'TUE', height: '65%', amount: '₹1,210' },
    { day: 'WED', height: '55%', amount: '₹980' },
    { day: 'THU', height: '95%', amount: '₹1,850', peak: true },
    { day: 'FRI', height: '75%', amount: '₹1,420' },
    { day: 'SAT', height: '45%', amount: '₹890' },
    { day: 'SUN', height: '30%', amount: '₹620' },
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
              onClick={() => onNavigate('delivery_history')}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              Trip Logs 📋
            </button>
            <button
              onClick={() => triggerToast('Wallet sync updated')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {/* Hero Section: Total Balance */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#b90041] to-[#df2457] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-pink-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-pink-100 font-bold text-xs uppercase tracking-widest mb-1">
                Available Wallet Balance
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1.5 text-pink-100 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit text-xs font-bold">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+12% vs last week</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="bg-white text-[#b90041] hover:bg-pink-50 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">account_balance</span>
                <span>Withdraw to Bank</span>
              </button>
              <button
                onClick={() => onNavigate('available_tasks')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add_task</span>
                <span>Earn More</span>
              </button>
            </div>
          </div>
        </section>

        {/* Weekly Performance Bar Chart */}
        <section className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-[#1c1b1b]">Weekly Breakdown</h3>
              <p className="text-xs text-slate-400">Mon, 12 Oct - Sun, 18 Oct</p>
            </div>
            <span className="text-xs font-bold text-[#b90041] bg-pink-50 px-3 py-1 rounded-full">
              ₹7,810 Total
            </span>
          </div>

          {/* Bar Visualization */}
          <div className="flex items-end justify-between h-40 gap-2 pt-4 px-2">
            {weeklyData.map((bar) => (
              <div
                key={bar.day}
                onClick={() => triggerToast(`${bar.day}: ${bar.amount} earned`)}
                className="flex flex-col items-center flex-1 gap-2 group cursor-pointer"
              >
                <div className="w-full bg-slate-100 rounded-t-xl relative overflow-hidden flex items-end h-28">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 group-hover:opacity-90 ${
                      bar.peak
                        ? 'bg-gradient-to-t from-[#b90041] to-[#df2457] shadow-lg shadow-pink-500/30'
                        : 'bg-slate-300'
                    }`}
                    style={{ height: bar.height }}
                  />
                </div>
                <span
                  className={`text-[10px] font-black ${
                    bar.peak ? 'text-[#b90041]' : 'text-slate-500'
                  }`}
                >
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Bento */}
        <section className="grid grid-cols-3 gap-3">
          <div
            onClick={() => onNavigate('delivery_history')}
            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-[#008644] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">verified</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400">Incentives</p>
              <h4 className="text-base font-black text-[#008644]">₹1,200</h4>
            </div>
          </div>

          <div
            onClick={() => onNavigate('delivery_history')}
            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all"
          >
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">volunteer_activism</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400">Total Tips</p>
              <h4 className="text-base font-black text-purple-700">₹450</h4>
            </div>
          </div>

          <div
            onClick={() => onNavigate('active_delivery')}
            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all"
          >
            <div className="w-9 h-9 rounded-2xl bg-pink-50 text-[#b90041] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-lg">speed</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400">Avg Trip</p>
              <h4 className="text-base font-black text-[#b90041]">24m avg</h4>
            </div>
          </div>
        </section>

        {/* Recent Transactions List */}
        <section className="space-y-3.5">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-[#1c1b1b]">Recent Transactions</h3>
            <button
              onClick={() => onNavigate('delivery_history')}
              className="text-xs font-bold text-[#b90041] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Full History</span>
              <span>➔</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: 'Order Payout: #MS7721',
                time: 'Today, 02:45 PM • Delivered',
                amount: '+₹145.00',
                status: 'Completed',
                isCredit: true,
                icon: 'local_shipping',
                targetRoute: 'order_driver',
              },
              {
                title: 'Daily Goal Incentive',
                time: 'Yesterday • 15/15 Orders Completed',
                amount: '+₹250.00',
                status: 'Bonus',
                isCredit: true,
                icon: 'celebration',
                targetRoute: 'delivery_history',
              },
              {
                title: 'Bank Withdrawal (HDFC Bank)',
                time: '15 Oct, 10:12 AM • Ref ID: 09122',
                amount: '-₹5,000.00',
                status: 'Processed',
                isCredit: false,
                icon: 'account_balance_wallet',
              },
              {
                title: 'Order Payout: #MS7718',
                time: '15 Oct, 09:30 AM • Delivered',
                amount: '+₹112.50',
                status: 'Completed',
                isCredit: true,
                icon: 'local_shipping',
                targetRoute: 'order_driver',
              },
            ].map((tx, idx) => (
              <div
                key={idx}
                onClick={() => (tx.targetRoute ? onNavigate(tx.targetRoute) : triggerToast(tx.title))}
                className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm cursor-pointer hover:border-pink-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#fcf9f8] rounded-xl flex items-center justify-center text-[#b90041] group-hover:bg-pink-50 transition-colors">
                    <span className="material-symbols-outlined text-xl">{tx.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold text-xs md:text-sm text-[#1c1b1b] group-hover:text-[#b90041] transition-colors">
                        {tx.title}
                      </p>
                      {tx.targetRoute && (
                        <span className="text-[10px] text-slate-400 group-hover:text-[#b90041]">➔</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-black text-sm md:text-base ${
                      tx.isCredit ? 'text-[#008644]' : 'text-slate-800'
                    }`}
                  >
                    {tx.amount}
                  </p>
                  <p className="text-[9px] font-bold uppercase text-slate-400">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base text-[#1c1b1b]">Instant Bank Transfer</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">
                  Linked Account: <span className="font-bold text-slate-800">HDFC •••• 8829</span>
                </p>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Withdrawal Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-700 text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={balance}
                    className="w-full bg-[#fcf9f8] border border-slate-200 rounded-2xl py-3 pl-8 pr-4 font-black text-base focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-xs text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#b90041] text-white font-bold text-xs shadow-md shadow-pink-500/25 cursor-pointer hover:bg-[#a00037]"
                >
                  Withdraw Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] flex justify-around items-center px-4 py-2">
        {[
          { label: 'Home', icon: 'dashboard', route: 'driver_dashboard' },
          { label: 'Tasks', icon: 'map', route: 'available_tasks' },
          { label: 'Live GPS', icon: 'navigation', route: 'active_delivery' },
          { label: 'History', icon: 'history', route: 'delivery_history' },
          { label: 'Wallet', icon: 'payments', route: 'driver_earnings' },
        ].map((tab) => {
          const isActive = tab.label === 'Wallet';
          return (
            <button
              key={tab.label}
              onClick={() => onNavigate(tab.route)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-2xl transition-all cursor-pointer ${
                isActive ? 'bg-pink-50 text-[#b90041] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}