import React, { useState } from 'react';

export default function UserWebDashboard({ onNavigate = () => {}, onBack }) {
  const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(12840);
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
      triggerToast('Please enter a valid withdrawal amount');
      return;
    }
    if (amount > walletBalance) {
      triggerToast('Amount exceeds available wallet balance');
      return;
    }

    setWalletBalance((prev) => prev - amount);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    triggerToast(`Withdrawal of ₹${amount.toLocaleString()} initiated to bank! 🏦`);
  };

  const handleShareProduct = (productName, profit) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out ${productName} on Meesho! Earn ₹${profit} profit!`);
    }
    triggerToast(`Shared ${productName}! Earn ₹${profit} per resale 🚀`);
  };

  const weeklyEarnings = [
    { day: 'Mon', amount: 480, height: '40%' },
    { day: 'Tue', amount: 650, height: '55%' },
    { day: 'Wed', amount: 320, height: '30%' },
    { day: 'Thu', amount: 890, height: '75%' },
    { day: 'Fri', amount: 560, height: '50%' },
    { day: 'Sat', amount: 720, height: '65%' },
    { day: 'Sun', amount: 1100, height: '95%', peak: true },
  ];

  const orderHistory = [
    {
      id: '#ML-89210',
      product: 'Emerald Silk Embroidered Kurta',
      status: 'Delivered',
      statusColor: 'bg-emerald-50 text-[#008644] border-emerald-200',
      earnings: '₹420',
      target: 'product',
    },
    {
      id: '#ML-89215',
      product: 'Handcrafted Leather Crossbody Bag',
      status: 'In Transit',
      statusColor: 'bg-indigo-50 text-[#4d41df] border-indigo-200',
      earnings: '₹280',
      target: 'product',
    },
    {
      id: '#ML-89218',
      product: 'Wireless Studio Pro Earbuds',
      status: 'Processing',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      earnings: '₹550',
      target: 'product',
    },
    {
      id: '#ML-89222',
      product: 'Organic Cotton Summer Co-ord Set',
      status: 'Returned',
      statusColor: 'bg-red-50 text-red-700 border-red-200',
      earnings: '₹0',
      target: 'product',
    },
  ];

  const resaleProducts = [
    {
      id: 1,
      title: 'Golden Oversized Luxe Streetwear Hoodie',
      tag: 'Streetwear Luxe',
      price: '₹899',
      profit: '150',
      badge: 'High Margin',
      img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Minimalist Ceramic Dial Timepiece',
      tag: 'Timepieces',
      price: '₹1,249',
      profit: '220',
      badge: 'Hot Seller',
      img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Azure Velvet Evening Designer Pumps',
      tag: 'Footwear',
      price: '₹1,899',
      profit: '300',
      badge: 'Trending',
      img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Retro Gold-Rimmed Aviator Frames',
      tag: 'Accessories',
      price: '₹549',
      profit: '120',
      badge: 'High Margin',
      img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="bg-[#f8f9fb] font-sans text-[#191c1e] min-h-screen flex antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#b90041] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Side Navigation Bar for Web/Tablet */}
      <aside className="hidden lg:flex flex-col h-screen w-64 bg-white border-r border-slate-100 fixed left-0 top-0 z-40 py-6 px-3 space-y-2">
        <div
          onClick={() => onNavigate('reseller')}
          className="px-4 mb-6 cursor-pointer flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#b90041] to-[#df2457] flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <span className="material-symbols-outlined text-xl">storefront</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#b90041] group-hover:underline">
              Curator Luxe
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Digital Reseller Hub
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { id: 'Dashboard', icon: 'dashboard', action: () => setActiveSidebarTab('Dashboard') },
            { id: 'Products', icon: 'inventory_2', action: () => onNavigate('explorer') },
            { id: 'Orders', icon: 'shopping_cart', action: () => onNavigate('cart') },
            { id: 'Wishlist', icon: 'favorite', action: () => onNavigate('wishlist') },
            { id: 'Sarees Store', icon: 'styler', action: () => onNavigate('sarees') },
            { id: 'Flash Drops', icon: 'bolt', action: () => onNavigate('flash') },
            { id: 'Curator Spotlight', icon: 'auto_awesome', action: () => onNavigate('spotlight') },
          ].map((item) => {
            const isActive = activeSidebarTab === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full text-left rounded-2xl px-4 py-3 flex items-center space-x-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-pink-50 text-[#b90041] font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-xs font-bold">{item.id}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Shortcuts */}
        <div className="pt-4 border-t border-slate-100 space-y-1">
          <button
            onClick={() => onNavigate('reseller')}
            className="w-full text-left rounded-2xl px-4 py-2.5 flex items-center space-x-3 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-bold"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            <span>Back to Shopping</span>
          </button>
          <button
            onClick={() => triggerToast('Logged out of Curator Hub')}
            className="w-full text-left rounded-2xl px-4 py-2.5 flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-xs font-bold"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 min-h-screen max-w-7xl mx-auto space-y-8 pb-32">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => (onBack ? onBack() : onNavigate('reseller'))}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-full text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#191c1e]">
                Hello, Sarah James! 👋
              </h1>
            </div>
            <p className="text-[#b90041] font-bold text-xs md:text-sm mt-1">
              You have earned <span className="underline">₹4,250</span> in reseller margins this month.
            </p>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('explorer')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-pink-50 text-[#b90041] font-bold text-xs hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
              <span>Find Products</span>
            </button>
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Wishlist"
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
            </button>
            <button
              onClick={() => triggerToast('3 new order inquiries today!')}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500"></span>
            </button>
            <div
              onClick={() => triggerToast('Viewing Sarah James Curator Profile')}
              className="h-10 w-10 rounded-2xl bg-[#4d41df] text-white flex items-center justify-center font-black text-sm shadow-md cursor-pointer hover:opacity-90"
            >
              SJ
            </div>
          </div>
        </header>

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('cart')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-pink-50 rounded-2xl text-[#b90041] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">shopping_bag</span>
              </span>
              <span className="text-[10px] font-black text-[#008644] bg-emerald-50 px-2 py-0.5 rounded-full">
                +12% MoM
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Total Customer Orders</p>
              <h3 className="text-2xl md:text-3xl font-black mt-1 text-[#191c1e]">142</h3>
            </div>
          </div>

          <div
            onClick={() => onNavigate('cart')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:border-indigo-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-indigo-50 rounded-2xl text-[#4d41df] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500">4 arriving today</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Pending Deliveries</p>
              <h3 className="text-2xl md:text-3xl font-black mt-1 text-[#191c1e]">8</h3>
            </div>
          </div>

          <div
            onClick={() => onNavigate('wishlist')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:border-pink-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-pink-50 rounded-2xl text-rose-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </span>
              <span className="text-[10px] font-bold text-[#b90041]">View All ➔</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Saved Wishlist Items</p>
              <h3 className="text-2xl md:text-3xl font-black mt-1 text-[#191c1e]">24</h3>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#b90041] to-[#df2457] text-white p-5 rounded-3xl shadow-lg shadow-pink-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-white/20 rounded-2xl">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              </span>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="text-[10px] font-black uppercase tracking-wider bg-white text-[#b90041] px-3 py-1 rounded-full shadow-sm hover:bg-pink-50 cursor-pointer"
              >
                Withdraw
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-pink-100">Wallet Balance</p>
              <h3 className="text-2xl md:text-3xl font-black mt-1">
                ₹{walletBalance.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </section>

        {/* Charts and Order History Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings Breakdown */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-extrabold text-[#191c1e]">Reseller Earnings</h2>
                <p className="text-xs text-slate-400">Last 7 Days Performance</p>
              </div>
              <span className="text-[10px] font-black bg-pink-50 text-[#b90041] px-2.5 py-1 rounded-full">
                ₹4,250 Total
              </span>
            </div>

            {/* Bars */}
            <div className="flex items-end justify-between gap-2 h-44 pb-2">
              {weeklyEarnings.map((bar) => (
                <div
                  key={bar.day}
                  onClick={() => triggerToast(`${bar.day}: ₹${bar.amount} profit earned`)}
                  className="flex flex-col items-center flex-1 gap-2 cursor-pointer group"
                >
                  <div className="w-full bg-slate-100 rounded-t-xl relative overflow-hidden flex items-end h-32">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 group-hover:opacity-80 ${
                        bar.peak ? 'bg-[#b90041] shadow-md shadow-pink-500/30' : 'bg-slate-300'
                      }`}
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${bar.peak ? 'text-[#b90041]' : 'text-slate-500'}`}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Weekly Profit
                </p>
                <p className="text-lg font-black text-[#191c1e]">₹4,250</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Average Margin
                </p>
                <p className="text-lg font-black text-[#008644]">18.4%</p>
              </div>
            </div>
          </div>

          {/* Order History Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-extrabold text-[#191c1e]">Recent Reseller Orders</h2>
              <button
                onClick={() => onNavigate('cart')}
                className="text-xs font-bold text-[#4d41df] hover:underline cursor-pointer"
              >
                View Full Cart / Orders ➔
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Margin</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {orderHistory.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3.5 font-bold text-[#191c1e]">{row.product}</td>
                      <td className="py-3.5 text-slate-400 font-mono">{row.id}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-black text-[#008644]">{row.earnings}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => onNavigate(row.target)}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-base">open_in_new</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Recommended for Resale Catalog */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#191c1e]">Recommended for Resale</h2>
              <p className="text-xs text-slate-400">Trending styles with highest profit margins</p>
            </div>
            <button
              onClick={() => onNavigate('explorer')}
              className="text-xs font-bold text-[#b90041] hover:underline cursor-pointer"
            >
              Explore Full Catalog ➔
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resaleProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black text-[#b90041] uppercase tracking-wider">
                    {p.badge}
                  </div>
                  <button
                    onClick={() => handleShareProduct(p.title, p.profit)}
                    className="absolute bottom-3 right-3 h-9 w-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#b90041] shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Share to earn"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {p.tag}
                    </p>
                    <h4
                      onClick={() => onNavigate('product')}
                      className="font-extrabold text-sm text-[#191c1e] line-clamp-1 hover:text-[#b90041] cursor-pointer"
                    >
                      {p.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">
                        Reseller Price
                      </span>
                      <span className="text-base font-black text-[#b90041]">{p.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">
                        Share & Earn
                      </span>
                      <span className="text-xs font-black text-[#008644]">₹{p.profit} profit</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Route Shortcuts Footer Bento */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black">Ready to scale your social store?</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Browse millions of wholesale sarees, western wear, and accessories with zero investment.
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => onNavigate('sarees')}
              className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Sarees Catalog 🥻
            </button>
            <button
              onClick={() => onNavigate('flash')}
              className="px-4 py-2.5 rounded-2xl bg-[#b90041] text-white font-bold text-xs shadow-md shadow-pink-500/30 hover:bg-[#a00037] cursor-pointer"
            >
              Flash Drops ⚡
            </button>
          </div>
        </section>
      </main>

      {/* Instant Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base text-[#191c1e]">Withdraw Reseller Earnings</h3>
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
                  Linked Bank: <span className="font-bold text-slate-800">ICICI Bank •••• 4210</span>
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
                    max={walletBalance}
                    className="w-full bg-[#f8f9fb] border border-slate-200 rounded-2xl py-3 pl-8 pr-4 font-black text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => onNavigate('explorer')}
        className="fixed bottom-8 right-8 h-14 w-14 bg-gradient-to-r from-[#b90041] to-[#df2457] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 cursor-pointer shadow-pink-500/40"
        title="Explore Catalogue"
      >
        <span className="material-symbols-outlined text-2xl">search</span>
      </button>
    </div>
  );
}