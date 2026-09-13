import React, { useState } from 'react';

// Data models for easy extensibility & dynamic API binding
const INITIAL_METRICS = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '₹42,850',
    changeText: '+12.5% vs last week',
    changeIcon: 'trending_up',
    colorTheme: 'secondary',
    bgIcon: 'payments',
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: '128',
    changeText: '84 Completed',
    changeIcon: 'check_circle',
    colorTheme: 'primary',
    bgIcon: 'shopping_bag',
  },
  {
    id: 'pending',
    label: 'Pending Dispatch',
    value: '44',
    actionText: 'Ship Now',
    colorTheme: 'neutral',
    bgIcon: 'pending_actions',
  },
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'MS-9921',
    title: 'Premium Chronograph Watch',
    time: '2 mins ago',
    amount: '₹1,299',
    status: 'Paid',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCX4TV0ook4052ewRt4RiJjRnKbu1AZIv5CDjmfXjXILjXA_ZSiSwj6Rf1-F0hdbQbiZwsfNb-2bee78RBluV48f4oNGvFmlbS8rapTYA-UjBsMcbKqY6cyOTyQBL4ljavcWjaKAZkH397mcQW9JN9q4UZzbqm3Bm9gQBLHaS8hWgJvlNkvkAQIBxC8lxFPljKO-N7NSCFoLqy5oqUIuh_c6m5UIlPUciS8ICD0xGp-cpueKxcurpS8Wr8aW85dILS_yogYPzxbG8g',
  },
  {
    id: 'MS-9920',
    title: 'Hyper-Boost Running Shoes',
    time: '15 mins ago',
    amount: '₹2,450',
    status: 'Pending',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLV612YX1qOjp6upuGjyeNCnLwL29r4HMjeZJoJ_UTYA2AhOwT3fpijgYhyAiG3dkzEncZxKK9t_Vzd9w-B6B1KFb6gzeNTf0JeiDklRQWCpyrJaX2PtYeanrP-JTEP1E3WyIawnUzvanijJ4VeIr3epV3Ss6QO8SuybWGZ2AEuPdf5UJs7zmV1ZD2A5Su3F3_V6x5U2837OtTbjbakSPN5BSAZiiLW6cH4lEXsesDhaxEVrpPTTK_FRHh3qWcSrZhncaKJ2v3_KQ',
  },
  {
    id: 'MS-9918',
    title: 'Studio Wireless Headphones',
    time: '1 hour ago',
    amount: '₹3,999',
    status: 'Paid',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAUBOoEfi0oM4-5u6VAS6w-vUKkqzUC2qD-vZ0Kxm--15tdV-2UPOQEep-nOiXEHNd5u0azhf_w2ei6SkfD2FrGKln7f5XS2c0KeaWjV1jyKOufWDYePqgdS8LBGhkUxagznWFQCHiqBhuSgZB9L28S8ZCNfkg_P84EMdjlo_R8xr7EjlCkIS0UjAHoUou8PdHerDzXWfC3XGV-4uYOQnyose4OsLncN-3AUbq0Qq6AkaK7S_cGJyu3KuKUC37FC_XvLHlRPxgKUWs',
  },
];

const NAV_TABS = ['Earnings', 'Orders', 'Inventory'];

const MOBILE_BOTTOM_NAV = [
  { id: 'Home', label: 'Home', icon: 'home' },
  { id: 'Categories', label: 'Categories', icon: 'grid_view' },
  { id: 'Orders', label: 'Orders', icon: 'shopping_bag' },
  { id: 'Earnings', label: 'Earnings', icon: 'payments' },
  { id: 'Profile', label: 'Profile', icon: 'person' },
];

export default function SupplierDashboard({ onNavigate, onShipNow, onClaimCredit }) {
  const [activeTab, setActiveTab] = useState('Earnings');
  const [activeBottomNav, setActiveBottomNav] = useState('Earnings');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions] = useState(INITIAL_TRANSACTIONS);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  const handleBottomNavClick = (id) => {
    setActiveBottomNav(id);
    setActiveTab(id);
    if (onNavigate) onNavigate(id);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body antialiased">
      {/* ===================== TopAppBar ===================== */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 w-full bg-white/70 backdrop-blur-md border-b border-surface-container-high/40">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Toggle search"
            className="p-1 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface cursor-pointer align-middle" data-icon="search">
              search
            </span>
          </button>
          <span className="text-2xl font-black text-[#FF3F6C] font-headline tracking-tight select-none">
            The Digital Curator
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`font-semibold transition-opacity cursor-pointer ${
                    isActive
                      ? 'text-[#FF3F6C]'
                      : 'text-[#191C1E] dark:text-slate-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => alert('Notifications (2 unread)')}
            className="p-1 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface cursor-pointer align-middle" data-icon="notifications">
              notifications
            </span>
          </button>
        </div>
      </header>

      {/* Slide-down Search Bar */}
      {showSearch && (
        <div className="bg-white px-6 py-3 border-b border-surface-container shadow-sm animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, catalog items, or transactions..."
              className="w-full bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="text-xs font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===================== Main Content ===================== */}
      <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
        {/* Dashboard Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-on-surface mb-2 tracking-tight font-headline">
            Supplier Overview
          </h1>
          <p className="text-on-surface-variant font-medium">
            Welcome back, Curator. Here's your business performance for today.
          </p>
        </div>

        {/* Analytical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Revenue Card */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_12px_32px_rgba(25,28,30,0.06)] relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span className="material-symbols-outlined text-secondary text-7xl select-none" data-icon="payments">
                payments
              </span>
            </div>
            <div className="relative z-10">
              <span className="text-secondary font-label text-xs font-bold uppercase tracking-widest mb-2 block">
                Total Revenue
              </span>
              <h2 className="text-5xl font-black text-secondary mb-4 font-headline">₹42,850</h2>
              <div className="flex items-center gap-2 text-tertiary font-semibold text-sm">
                <span className="material-symbols-outlined text-sm" data-icon="trending_up">
                  trending_up
                </span>
                <span>+12.5% vs last week</span>
              </div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_12px_32px_rgba(25,28,30,0.06)] relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span className="material-symbols-outlined text-primary text-7xl select-none" data-icon="shopping_bag">
                shopping_bag
              </span>
            </div>
            <div className="relative z-10">
              <span className="text-primary font-label text-xs font-bold uppercase tracking-widest mb-2 block">
                Total Orders
              </span>
              <h2 className="text-5xl font-black text-primary mb-4 font-headline">128</h2>
              <div className="flex items-center gap-2 text-tertiary font-semibold text-sm">
                <span className="material-symbols-outlined text-sm" data-icon="check_circle">
                  check_circle
                </span>
                <span>84 Completed</span>
              </div>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_12px_32px_rgba(25,28,30,0.06)] relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant text-7xl select-none" data-icon="pending_actions">
                pending_actions
              </span>
            </div>
            <div className="relative z-10">
              <span className="text-on-surface-variant font-label text-xs font-bold uppercase tracking-widest mb-2 block">
                Pending Dispatch
              </span>
              <h2 className="text-5xl font-black text-on-surface mb-4 font-headline">44</h2>
              <button
                type="button"
                onClick={onShipNow || (() => alert('Opening pending shipments dispatch queue...'))}
                className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm hover:shadow"
              >
                Ship Now{' '}
                <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold tracking-tight font-headline">Recent Transactions</h3>
            <button
              type="button"
              onClick={() => alert('Viewing full transaction reports...')}
              className="text-primary font-bold cursor-pointer hover:underline text-sm sm:text-base"
            >
              View All Report
            </button>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-4 md:p-8">
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-surface-container-lowest flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-surface-container-high flex-shrink-0 overflow-hidden">
                      <img
                        alt={tx.title}
                        className="w-full h-full object-cover"
                        src={tx.imageUrl}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-on-surface">{tx.title}</h4>
                      <p className="text-sm text-on-surface-variant">
                        Order #{tx.id} • {tx.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-right">
                      <p className="font-black text-lg text-on-surface">{tx.amount}</p>
                      {tx.status === 'Paid' ? (
                        <p className="text-xs font-bold text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full inline-block">
                          Paid
                        </p>
                      ) : (
                        <p className="text-xs font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full inline-block">
                          Pending
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label="More options"
                      onClick={() => alert(`Options for Order #${tx.id}`)}
                      className="p-1 rounded-full hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer align-middle" data-icon="more_vert">
                        more_vert
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Tips Section (Asymmetric) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-primary to-primary-container p-10 rounded-[2.5rem] text-white shadow-md">
            <h3 className="text-3xl font-black mb-4 font-headline">Boost Your Visibility</h3>
            <p className="mb-8 opacity-90 text-lg leading-relaxed font-body">
              Top suppliers use our "Smart Ads" to reach 5x more resellers. Start your first campaign today with ₹500 credits.
            </p>
            <button
              type="button"
              onClick={onClaimCredit || (() => alert('₹500 Smart Ads credits claimed!'))}
              className="bg-white text-primary px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-transform hover:shadow-lg"
            >
              Claim Credit
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-surface-container p-6 rounded-3xl flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined" data-icon="star">
                  star
                </span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Maintain 4.5+ Rating</h4>
                <p className="text-sm opacity-70 text-on-surface-variant">
                  High rated products are featured in catalogs.
                </p>
              </div>
            </div>

            <div className="bg-surface-container p-6 rounded-3xl flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined" data-icon="speed">
                  speed
                </span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Next-Day Dispatch</h4>
                <p className="text-sm opacity-70 text-on-surface-variant">
                  Faster shipping leads to fewer cancellations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== BottomNavBar (Mobile Only) ===================== */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl md:hidden shadow-[0_-12px_32px_rgba(25,28,30,0.06)] rounded-t-[2rem] border-t border-surface-container-high/40"
      >
        {MOBILE_BOTTOM_NAV.map((item) => {
          const isActive = activeBottomNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleBottomNavClick(item.id)}
              className={`flex flex-col items-center justify-center transition-all active:scale-90 cursor-pointer ${
                isActive
                  ? 'text-[#FF3F6C] bg-[#FF3F6C]/10 rounded-2xl px-4 py-2'
                  : 'text-[#191C1E] dark:text-slate-400 opacity-60 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl'
              }`}
            >
              <span className="material-symbols-outlined" data-icon={item.icon}>
                {item.icon}
              </span>
              <span className="font-label text-[10px] font-semibold uppercase tracking-wider mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}