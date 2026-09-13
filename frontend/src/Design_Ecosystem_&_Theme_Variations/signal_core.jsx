import { useState } from 'react';

const INITIAL_UPCOMING = [
  {
    id: 'MEE-790',
    location: 'Indiranagar Sector 3',
    distance: '2.4 km',
    eta: 'Est. 12m',
    payout: '₹85',
    items: '2 Parcels',
  },
  {
    id: 'MEE-791',
    location: 'Koramangala 5th Block',
    distance: '3.8 km',
    eta: 'Est. 18m',
    payout: '₹120',
    items: '1 Large Box',
  },
  {
    id: 'MEE-792',
    location: 'HSR Layout Sector 2',
    distance: '5.1 km',
    eta: 'Est. 24m',
    payout: '₹145',
    items: '3 Parcels',
  },
];

export default function SignalCore({ onNavigate }) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [orderStep, setOrderStep] = useState(0); // 0: Assigned, 1: Picked Up, 2: Delivered
  const [activeOrderId, setActiveOrderId] = useState('MEE-789');
  const [toastMsg, setToastMsg] = useState(null);
  const [upcomingList, setUpcomingList] = useState(INITIAL_UPCOMING);
  const [dailyEarnings, setDailyEarnings] = useState(1420);
  const [completedCount, setCompletedCount] = useState(12);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleToggleOnline = () => {
    setIsOnline((prev) => {
      const next = !prev;
      showToast(next ? 'Status: ONLINE (Receiving Orders)' : 'Status: OFFLINE (Shift Paused)');
      return next;
    });
  };

  const handleNextStep = () => {
    if (orderStep === 0) {
      setOrderStep(1);
      showToast('Pickup Confirmed from Warehouse A! Heading to Drop-off.');
    } else if (orderStep === 1) {
      setOrderStep(2);
      setDailyEarnings((prev) => prev + 95);
      setCompletedCount((prev) => prev + 1);
      showToast('Order Delivered! ₹95 credited to your Rider Wallet 🎉');
    } else {
      // Pick next order from upcoming list
      if (upcomingList.length > 0) {
        const nextOrder = upcomingList[0];
        setActiveOrderId(nextOrder.id);
        setUpcomingList(upcomingList.slice(1));
        setOrderStep(0);
        showToast(`New Mission Assigned: #${nextOrder.id}`);
      } else {
        setOrderStep(0);
        showToast('All active missions completed! Waiting for dispatch.');
      }
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const stepLabels = [
    { text: 'Confirm Pickup', badge: 'Pickup Ready' },
    { text: 'Confirm Delivery', badge: 'Out for Delivery' },
    { text: 'Start Next Order', badge: 'Delivered' },
  ];

  return (
    <div className="bg-[#fff4ef] font-['Plus_Jakarta_Sans'] text-[#492604] min-h-screen pb-32 selection:bg-[#fe8534]/30 antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-[#492604]/95 backdrop-blur-md text-[#ffd5b5] px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce border border-[#fe8534]/30">
          <span className="material-symbols-outlined text-sm text-[#fe8534]">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TopAppBar (Tactile Velocity Header) */}
      <header className="bg-[#fff4ef] shadow-[0_20px_40px_rgba(73,38,4,0.06)] rounded-b-[24px] flex justify-between items-center px-4 sm:px-6 py-4 w-full sticky top-0 z-40 border-b border-[#ffdcc2]/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#964300] to-[#fe8534] flex items-center justify-center text-white shadow-md shadow-[#fe8534]/30">
            <span className="material-symbols-outlined text-xl">speed</span>
          </div>
          <div>
            <h1 className="font-extrabold uppercase tracking-tight text-lg sm:text-xl text-[#964300] leading-none">
              Rider Express
            </h1>
            <span className="text-[10px] font-bold text-[#7d522b] uppercase tracking-widest">
              Signal Core • Velocity Brutalism
            </span>
          </div>
        </div>

        {/* Online Shift Status Toggle */}
        <button
          type="button"
          onClick={handleToggleOnline}
          className={`flex items-center rounded-full p-1 pr-3 gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
            isOnline ? 'bg-[#ffd5b5] text-[#542200]' : 'bg-slate-200 text-slate-600'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isOnline
                ? 'bg-gradient-to-br from-[#964300] to-[#fe8534]'
                : 'bg-slate-400'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                isOnline ? 'bg-white animate-ping' : 'bg-slate-200'
              }`}
            ></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isOnline ? `ONLINE • ${completedCount}` : 'OFFLINE'}
          </span>
        </button>
      </header>

      <main className="px-4 sm:px-6 pt-6 space-y-7 max-w-2xl mx-auto">
        {/* Active Assignment Hero Section */}
        <section className="relative">
          <div className="flex items-end justify-between mb-3.5">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9d6c44]">
                Current Mission
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#492604]">
                Active Order
              </h2>
            </div>
            <span
              className={`px-3.5 py-1.5 rounded-[18px] text-xs font-black uppercase tracking-wider shadow-sm ${
                orderStep === 2
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#febf2a] text-[#573e00]'
              }`}
            >
              {stepLabels[orderStep].badge}
            </span>
          </div>

          <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_24px_48px_rgba(73,38,4,0.06)] border border-[#ffede2] relative">
            {/* Map Grid Background Watermark */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCF_VwpM198WCubi_VF5GZ1dbsqKj8EL86tnvBz-t3A42-KjHxaZKs9uMD7FRwOqxJ6MP0pHsgA5UAOa1gQPkZJriwUXknO7GcidCxkXovn19-8WxvxQz-Kg-UHZZ03K8qzsfTgCRf2rrm4gri-F3Jy-zYglqA_n6E_3eYgnyNzatyFQnkooI2QL4QjpJH3UnnCvk9kHgLfbeTXWQchKhurSA9XAf-0NelKlfT5qoXtxs6Fp7bemkTwCVQiVy1-Nt5EEVNkwQQniJI')",
                backgroundSize: 'cover',
              }}
            ></div>

            <div className="relative p-5 sm:p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#9d6c44] uppercase tracking-widest">
                    Order ID
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#964300]">
                    #{activeOrderId}
                  </span>
                  <span className="text-xs text-[#7d522b] mt-0.5 font-semibold">
                    Customer COD: <strong className="text-[#492604]">₹849 (Collect Cash)</strong>
                  </span>
                </div>
                <div className="bg-[#fe8534]/15 p-3 rounded-[20px] text-[#964300]">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_shipping
                  </span>
                </div>
              </div>

              {/* Waypoints & Route */}
              <div className="space-y-5 relative">
                {/* Dashed line */}
                <div className="absolute left-3.5 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-[#d9a275]"></div>

                {/* Pickup point */}
                <div className="flex gap-3.5 relative">
                  <div className="z-10 w-8 h-8 rounded-full bg-[#ffd5b5] flex items-center justify-center border-4 border-white shadow-sm">
                    <span
                      className="material-symbols-outlined text-sm text-[#964300]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      store
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#9d6c44] uppercase tracking-widest">
                      Pickup Station
                    </p>
                    <p className="text-base sm:text-lg font-bold text-[#492604] leading-tight">
                      Warehouse A (Whitefield Sector 4)
                    </p>
                    <p className="text-xs text-[#7d522b]">Dispatch Bay 14 • Ready for Handover</p>
                  </div>
                </div>

                {/* Dropoff point */}
                <div className="flex gap-3.5 relative">
                  <div className="z-10 w-8 h-8 rounded-full bg-[#fe8534] flex items-center justify-center border-4 border-white shadow-md shadow-[#fe8534]/30">
                    <span
                      className="material-symbols-outlined text-sm text-white"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#9d6c44] uppercase tracking-widest">
                      Customer Drop-off
                    </p>
                    <p className="text-base sm:text-lg font-bold text-[#492604] leading-tight">
                      Apartment 4B, Emerald Heights, MG Road
                    </p>
                    <p className="text-xs text-[#7d522b]">
                      Contact: +91 98765 43210 (Rohan Sharma)
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => showToast('GPS Turn-by-turn Navigation Opened via Google Maps')}
                  className="flex items-center justify-center gap-2 bg-[#ffc69a] hover:bg-[#ffd5b5] text-[#6e3a00] py-3.5 rounded-[20px] font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">map</span>
                  <span>Navigate</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#964300] to-[#fe8534] hover:brightness-105 text-white py-3.5 rounded-[20px] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#fe8534]/30 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{stepLabels[orderStep].text}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Deliveries Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#9d6c44]">
              Upcoming Deliveries
            </h3>
            <span className="text-xs font-bold text-[#964300]">
              {upcomingList.length} QUEUED
            </span>
          </div>

          {upcomingList.length === 0 ? (
            <div className="bg-[#ffede2] rounded-[20px] p-6 text-center">
              <span className="material-symbols-outlined text-3xl text-[#9d6c44] mb-1">
                done_all
              </span>
              <p className="text-xs font-bold text-[#492604]">All queued deliveries cleared!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveOrderId(item.id);
                    setOrderStep(0);
                    showToast(`Switched active focus to Order #${item.id}`);
                  }}
                  className="group bg-[#ffede2] hover:bg-[#ffd5b5] p-4 rounded-[20px] flex items-center justify-between transition-all cursor-pointer active:scale-[0.98] border border-[#ffdcc2]/40"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-white rounded-[16px] flex items-center justify-center shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[#964300] text-2xl">
                        schedule
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#492604]">Order #{item.id}</p>
                      <p className="text-[10px] font-bold text-[#9d6c44] uppercase tracking-wider">
                        {item.location} • {item.items}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-[#964300]">{item.distance}</p>
                    <p className="text-[10px] font-bold text-[#7d522b] uppercase tracking-wider">
                      {item.eta} • <strong className="text-emerald-700">{item.payout}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stats Bento Section (Extra UI polish from Signal Core) */}
        <section className="grid grid-cols-2 gap-3.5 pb-4">
          <div className="bg-[#ffede2] p-5 rounded-[22px] flex flex-col justify-between aspect-square border border-[#ffdcc2]/40 shadow-sm">
            <span className="material-symbols-outlined text-[#964300] text-3xl">payments</span>
            <div>
              <p className="text-[10px] font-bold text-[#9d6c44] uppercase tracking-widest">
                Daily Earnings
              </p>
              <p className="text-2xl sm:text-3xl font-black text-[#492604]">
                ₹{dailyEarnings.toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-emerald-700">+₹95 last trip</span>
            </div>
          </div>

          <div className="bg-[#ffede2] p-5 rounded-[22px] flex flex-col justify-between aspect-square relative overflow-hidden border border-[#ffdcc2]/40 shadow-sm">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#fe8534]/15 rounded-full blur-xl pointer-events-none"></div>
            <span
              className="material-symbols-outlined text-[#febf2a] text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <div>
              <p className="text-[10px] font-bold text-[#9d6c44] uppercase tracking-widest">
                Rider Rating
              </p>
              <p className="text-2xl sm:text-3xl font-black text-[#492604]">4.92 ★</p>
              <span className="text-[10px] font-bold text-[#7d522b]">
                Top 5% Partner in Zone
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2.5 bg-[#fff4ef]/90 backdrop-blur-xl rounded-t-[24px] border-t border-[#ffdcc2] shadow-[0_-10px_30px_rgba(73,38,4,0.06)] max-w-lg left-1/2 -translate-x-1/2">
        {/* Orders Active */}
        <button
          type="button"
          onClick={() => handleTabClick('orders')}
          className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all active:scale-90 ${
            activeTab === 'orders'
              ? 'bg-gradient-to-br from-[#964300] to-[#fe8534] text-white shadow-md shadow-[#fe8534]/30'
              : 'text-[#492604] hover:bg-[#ffede2]'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: activeTab === 'orders' ? "'FILL' 1" : "'FILL' 0" }}
          >
            local_shipping
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Orders</span>
        </button>

        {/* Earnings */}
        <button
          type="button"
          onClick={() => handleTabClick('earnings')}
          className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all active:scale-90 ${
            activeTab === 'earnings'
              ? 'bg-gradient-to-br from-[#964300] to-[#fe8534] text-white shadow-md shadow-[#fe8534]/30'
              : 'text-[#492604] hover:bg-[#ffede2]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">payments</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Earnings</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-all active:scale-90 ${
            activeTab === 'profile'
              ? 'bg-gradient-to-br from-[#964300] to-[#fe8534] text-white shadow-md shadow-[#fe8534]/30'
              : 'text-[#492604] hover:bg-[#ffede2]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">account_circle</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Profile</span>
        </button>
      </nav>
    </div>
  );
}
