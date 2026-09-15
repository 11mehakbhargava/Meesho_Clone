import React, { useState } from 'react';
import AppBottomNav from '../components/AppBottomNav';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Flash Sale: Up to 70% off',
    message: "Grab the hottest trends before they're gone. Sale ends at midnight!",
    category: 'Offers',
    time: '2 mins ago',
    section: 'Today',
    isUnread: true,
    icon: 'local_fire_department',
    iconBg: 'bg-rose-50 text-[#b90041]',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBmmXs4jMuCKmJR9bmfO-ktumJnPwdUyq90Ya8OZJ7OrGax4eYSb83US286PqqT8bGbp6adCGDkvA_IvTZTMufhiVFYfSgU56nsi_b72txeFJUFsH1epOewNKrg5MY0bshmgIt5Ed4tcZUonVgSn8AjO6ATshhNprAGO3PEXJnIJQpxqt1tozzCQSrA_-oPoqYZS2kTDyKZtpXDcWdrWpwHDLm5LXJfBT-SifQRpf018-E5uynOF05NxSHMiLLzqRMIE358K-AElC8',
  },
  {
    id: 'notif-2',
    title: 'Out for Delivery',
    message: 'Your order #ME67890 is arriving today. Get ready!',
    category: 'Orders',
    time: '1 hour ago',
    section: 'Today',
    isUnread: true,
    icon: 'local_shipping',
    iconBg: 'bg-indigo-50 text-[#4d41df]',
    productPreview: {
      name: 'Premium Quartz Watch',
      eta: 'Expected by 8:00 PM',
      thumb:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuANv_v_A_-Zf138CghsGoQaXLDNzBte54gkcNWPCbyuyvBYendz-JCVMmFpCU74c7cfRkYwCZVvQnySPyNkSKmX0tuOA3NdnA-O2Zsv6puOhRlBAcjxxRQ76j90PsPvZ6-bmBCG-2aXTU7Qnf1oYhNTOV9O6gIN9ElPwHifIFwGXeNS6UjeB7Is-Riawvm0GbiyThgu6BK6Bg3G37rrgH8H8JBrjG5JEnny92QwWqWwIk--rVTQmcyv4R2erNGZwyJJREQHEwYPuzM',
    },
  },
  {
    id: 'notif-3',
    title: 'Margin Credited',
    message: 'Your margin of ₹450 for Order #1234 has been credited to your wallet.',
    category: 'Earnings',
    time: '3 hours ago',
    section: 'Today',
    isUnread: false,
    icon: 'payments',
    iconBg: 'bg-emerald-50 text-[#008644]',
    hasAction: 'Check Balance',
  },
  {
    id: 'notif-4',
    title: 'Order Delivered',
    message: "Order #ME67554 was successfully delivered. Don't forget to rate your experience!",
    category: 'Orders',
    time: '1 day ago',
    section: 'Yesterday',
    isUnread: false,
    icon: 'check_circle',
    iconBg: 'bg-slate-100 text-slate-500',
  },
  {
    id: 'notif-5',
    title: 'New Arrivals in Ethnic Wear',
    message: 'Explore the latest collection of handpicked Saree & Kurtas from top suppliers.',
    category: 'Offers',
    time: '1 day ago',
    section: 'Yesterday',
    isUnread: false,
    icon: 'apparel',
    iconBg: 'bg-pink-50 text-[#b90041]',
    imageGallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABd1htYsHGNxFucJVs9dAu4YznR8Uvtair6HJV6Q-kFyQMcve_0tAIn_KKZxZbtE95r__YbdXbDWmlWgewal3w7UHP9O-Czhyi3a8Q9qYSi9X0beQS6PeL18bUHol-bjty_jUuOcMXrSwraTEs_lIfb8ac0Y03WC96HqM-JzM-Nik0-3KWJok6CbM_irN7iMZDMJoRHBHfOQtZDUTWj2ZGUOen6gw63HKSyimM8xbDt8lzVhvnWO1UtRZrlAkBL0tg4XstL2bL27Y',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl4j43ajoO731gr85RwqO_QSzoIE3SR97tHARYhkp7sOKcGp6DL30Qpd0LQNMGcLEfh8StSwtQw6ee41BnibU2_mZGn4OXnLEQKf6ihOvj2Sy1QmOuwwJuIUW2pH4YQg6mRrA5cjjbobGN6VOaEJX1FkHBOs4OxB1naYdNs583pWM7Kw-dTj29m57zawhaPYhXfBRVKteEbtYeRKHeQhIydXtFpLrjYYNwUf-sLtyq98UC_GeU6K4sjjylc5CuAOV08baPChuOBQw',
    ],
  },
  {
    id: 'notif-6',
    title: 'New payout processed',
    message: 'Your weekly payout of ₹2,840 has been transferred to your linked bank account.',
    category: 'Earnings',
    time: '1 day ago',
    section: 'Yesterday',
    isUnread: false,
    icon: 'account_balance',
    iconBg: 'bg-emerald-50 text-[#008644]',
  },
];

export function NotificationCenter({ onNavigate, onBack }) {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'balance' | 'tracking' | 'sale'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    showToast('All notifications marked as read.');
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: !n.isUnread } : n))
    );
  };

  const handleActionClick = (notif) => {
    if (notif.category === 'Earnings') {
      setActiveModal('balance');
    } else if (notif.category === 'Orders') {
      setActiveModal('tracking');
    } else if (notif.category === 'Offers') {
      setActiveModal('sale');
    } else {
      showToast(`Viewing details for ${notif.title}`);
    }
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    return n.category === activeTab;
  });

  const todayNotifications = filteredNotifications.filter((n) => n.section === 'Today');
  const yesterdayNotifications = filteredNotifications.filter((n) => n.section === 'Yesterday');

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen pb-32 font-['Inter',sans-serif] antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#b90041] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce text-xs font-semibold">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TopAppBar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 shadow-xs font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (onBack ? onBack() : onNavigate && onNavigate('home'))}
              className="hover:bg-slate-100 transition-colors p-1.5 rounded-full active:scale-95 duration-200 cursor-pointer text-slate-800"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xl tracking-tight text-[#FF3F6C]">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-[#b90041] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                  {unreadCount} New
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold text-[#b90041] hover:underline cursor-pointer px-2 py-1"
              title="Mark all notifications as read"
            >
              Read all
            </button>
            <button
              type="button"
              onClick={() => showToast('Notification settings')}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-6 px-4 max-w-2xl mx-auto w-full">
        {/* Tab Navigation (Soft Asymmetric Pill Style) */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['All', 'Orders', 'Offers', 'Earnings'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#b90041] text-white shadow-md shadow-pink-500/20 scale-105'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Section: Today */}
        {todayNotifications.length > 0 && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Today
              </h2>
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-bold text-[#b90041] hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            </div>

            {todayNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleToggleRead(notif.id)}
                className={`relative p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  notif.isUnread
                    ? 'border-pink-200 bg-pink-50/20'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Unread Pink Dot */}
                {notif.isUnread && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#b90041] rounded-full ring-4 ring-pink-100"></div>
                )}

                <div className="flex gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg}`}
                  >
                    <span className="material-symbols-outlined text-xl">{notif.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm">{notif.title}</h3>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">
                        {notif.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                    {/* Image Banner */}
                    {notif.imageUrl && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModal('sale');
                        }}
                        className="mt-3 overflow-hidden rounded-xl h-36 bg-slate-100 border border-slate-100 group"
                      >
                        <img
                          src={notif.imageUrl}
                          alt="Flash sale banner"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    {/* Product Preview Card */}
                    {notif.productPreview && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModal('tracking');
                        }}
                        className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                      >
                        <img
                          src={notif.productPreview.thumb}
                          alt={notif.productPreview.name}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {notif.productPreview.name}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold">
                            {notif.productPreview.eta}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-xs text-slate-400">
                          chevron_right
                        </span>
                      </div>
                    )}

                    {/* Action Button (e.g. Check Balance) */}
                    {notif.hasAction && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(notif);
                        }}
                        className="mt-2.5 text-xs font-bold text-[#4d41df] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{notif.hasAction}</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section: Yesterday */}
        {yesterdayNotifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1 mb-2">
              Yesterday
            </h2>

            {yesterdayNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleToggleRead(notif.id)}
                className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg}`}
                  >
                    <span className="material-symbols-outlined text-xl">{notif.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm">{notif.title}</h3>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">
                        {notif.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                    {/* Image Gallery */}
                    {notif.imageGallery && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {notif.imageGallery.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Gallery preview"
                            className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                          />
                        ))}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('Opening 15+ newly added saree catalogs!');
                          }}
                          className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 text-center px-2 hover:bg-slate-200"
                        >
                          +15 More
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">
              notifications_off
            </span>
            <h3 className="font-bold text-base text-slate-800">No notifications here</h3>
            <p className="text-xs text-slate-400 mt-1">
              You are all caught up for {activeTab} category!
            </p>
          </div>
        )}
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />

      {/* Wallet Balance Modal */}
      {activeModal === 'balance' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Reseller Wallet Balance</h3>
              <p className="text-3xl font-black text-slate-900 mt-2">₹4,290.00</p>
              <p className="text-xs text-emerald-600 font-bold mt-1">+₹450 credited today from Order #1234</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  showToast('Instant transfer initiated to your verified bank account!');
                }}
                className="flex-1 py-2.5 bg-[#b90041] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Withdraw Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {activeModal === 'tracking' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Live Delivery Status</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-3 bg-indigo-50 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-[#4d41df] text-2xl">local_shipping</span>
              <div>
                <h4 className="font-bold text-xs text-slate-800">Order #ME67890</h4>
                <p className="text-[11px] text-[#4d41df] font-semibold">Out for Delivery with BlueDart</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Hero:</span>
                <span className="font-bold text-slate-800">Suresh Verma (+91 98765 43210)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Arrival:</span>
                <span className="font-bold text-emerald-600">Today before 8:00 PM</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                showToast('Calling delivery executive Suresh...');
              }}
              className="w-full py-2.5 bg-[#4d41df] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Call Delivery Executive
            </button>
          </div>
        </div>
      )}

      {/* Flash Sale Modal */}
      {activeModal === 'sale' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-14 h-14 bg-pink-100 text-[#b90041] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">local_fire_department</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Midnight Flash Festival</h3>
              <p className="text-xs text-slate-500 mt-1">Extra 70% margins on top 5,000 sarees & jewelry picks.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                showToast('Opening Flash Sale catalog with highest margins!');
              }}
              className="w-full py-3 bg-[#b90041] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Explore Flash Deals Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
