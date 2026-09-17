import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function DriverEarningsMobile({ onNavigate = () => {}, onBack }) {
  const [balance, setBalance] = useState(12450.5);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const weeklyData = [
    { day: 'MON', height: '45%', amount: '₹840' },
    { day: 'TUE', height: '65%', amount: '₹1,210' },
    { day: 'WED', height: '55%', amount: '₹980' },
    { day: 'THU', height: '95%', amount: '₹1,850', peak: true },
    { day: 'FRI', height: '75%', amount: '₹1,420' },
    { day: 'SAT', height: '50%', amount: '₹890' },
    { day: 'SUN', height: '35%', amount: '₹620' },
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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 w-full max-w-7xl mx-auto">
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
                Driver Earnings &amp; Wallet
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Partner ID: MP8829 • Payouts Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('delivery_history')}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              Trip Logs 📋
            </button>
            <button
              onClick={() => triggerToast('Wallet synchronized with bank')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Wallet Hero, Weekly Chart, Transactions (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Section: Total Balance */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#b90041] to-[#df2457] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-pink-500/20">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <p className="text-pink-100 font-bold text-xs uppercase tracking-widest mb-1">
                    Available Wallet Balance
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
                    ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </h2>
                  <div className="flex items-center gap-1.5 text-pink-100 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+12% vs last week</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => onNavigate('withdraw-earnings')}
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
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-extrabold text-[#1c1b1b]">
                    Weekly Earnings Breakdown
                  </h3>
                  <p className="text-xs text-slate-400">Mon, 12 Oct - Sun, 18 Oct</p>
                </div>
                <span className="text-xs font-bold text-[#b90041] bg-pink-50 px-3 py-1 rounded-full">
                  ₹7,810 Total Week
                </span>
              </div>

              {/* Bar Visualization */}
              <div className="flex items-end justify-between h-44 gap-2 sm:gap-4 pt-4 px-2">
                {weeklyData.map((bar) => (
                  <div
                    key={bar.day}
                    onClick={() => triggerToast(`${bar.day}: ${bar.amount} earned`)}
                    className="flex flex-col items-center flex-1 gap-2 group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#b90041] transition-colors">
                      {bar.amount}
                    </span>
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

            {/* Recent Transactions List */}
            <section className="space-y-3.5">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-[#1c1b1b]">Recent Transactions</h3>
                <button
                  onClick={() => onNavigate('delivery_history')}
                  className="text-xs font-bold text-[#b90041] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View All Logs</span>
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
                    onClick={() =>
                      tx.targetRoute ? onNavigate(tx.targetRoute) : triggerToast(tx.title)
                    }
                    className="bg-white p-4 sm:p-5 rounded-2xl flex items-center justify-between border border-slate-100 shadow-xs cursor-pointer hover:border-pink-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#fcf9f8] rounded-2xl flex items-center justify-center text-[#b90041] group-hover:bg-pink-50 transition-colors flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">{tx.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-extrabold text-xs sm:text-sm text-[#1c1b1b] group-hover:text-[#b90041] transition-colors">
                            {tx.title}
                          </p>
                          {tx.targetRoute && (
                            <span className="text-[10px] text-slate-400 group-hover:text-[#b90041]">
                              ➔
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-black text-sm sm:text-base ${
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
          </div>

          {/* Right Column: Bank Account & Earnings Breakdown Bento (4 cols, sticky) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* Bank Card Info */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Linked Payout Account
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                <span className="material-symbols-outlined text-2xl text-slate-700">
                  account_balance
                </span>
                <div>
                  <p className="font-extrabold text-xs text-slate-900">HDFC Bank Limited</p>
                  <p className="text-[11px] text-slate-400">A/C •••• 8829 | IFSC: HDFC0001928</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('withdraw-earnings')}
                className="w-full py-3 bg-[#b90041] hover:bg-[#a00037] text-white font-extrabold text-xs rounded-2xl shadow-md shadow-pink-500/25 cursor-pointer transition-colors"
              >
                Instant Transfer to Bank ➔
              </button>
            </div>

            {/* Performance Stats Bento */}
            <div className="grid grid-cols-3 gap-2.5">
              <div
                onClick={() => onNavigate('delivery_history')}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all text-center"
              >
                <span className="material-symbols-outlined text-lg text-[#008644] mx-auto mb-1">
                  verified
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Incentives</p>
                  <h4 className="text-sm font-black text-[#008644]">₹1,200</h4>
                </div>
              </div>

              <div
                onClick={() => onNavigate('delivery_history')}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all text-center"
              >
                <span className="material-symbols-outlined text-lg text-purple-700 mx-auto mb-1">
                  volunteer_activism
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Tips</p>
                  <h4 className="text-sm font-black text-purple-700">₹450</h4>
                </div>
              </div>

              <div
                onClick={() => onNavigate('active_delivery')}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all text-center"
              >
                <span className="material-symbols-outlined text-lg text-[#b90041] mx-auto mb-1">
                  speed
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Avg Trip</p>
                  <h4 className="text-sm font-black text-[#b90041]">24 mins</h4>
                </div>
              </div>
            </div>

            {/* Safe Settlement Guarantee */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-3xl text-xs space-y-1">
              <div className="flex items-center gap-1 text-emerald-900 font-extrabold">
                <span className="material-symbols-outlined text-base text-emerald-700">
                  security
                </span>
                <span>Direct Bank Payout Guarantee</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                All daily trip earnings and incentives are automatically settled to your verified
                bank account with zero processing fees.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <AppBottomNav activeNav="earnings" onNavigate={onNavigate} />
    </div>
  );
}