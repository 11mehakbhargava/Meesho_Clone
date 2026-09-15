import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavDrawer from '../../components/NavDrawer';
import AppBottomNav from '../../components/AppBottomNav';

export default function NotificationCenter() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32 font-sans selection:bg-primary/20">
      {/* Top Navigation Bar - Full Width */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-4 w-full">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-[#191C1E] dark:text-slate-200 active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-xl tracking-tight text-[#FF3F6C]">
              Notifications
            </h1>
          </div>
          <button className="active:scale-95 transition-transform text-[#191C1E] dark:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">more_vert</span>
          </button>
        </div>
      </nav>

      {/* Content Canvas */}
      <main className="pt-20 pb-28 px-4 sm:px-6 md:px-10 lg:px-16 w-full max-w-5xl mx-auto">
        {/* Tab Navigation (Asymmetric Soft Editorial Style) */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {["All", "Orders", "Offers", "Earnings"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Section: Today */}
        {(activeTab === "All" || activeTab === "Offers" || activeTab === "Orders" || activeTab === "Earnings") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Today</h2>
              <button className="text-xs font-bold text-primary cursor-pointer hover:underline">Mark all as read</button>
            </div>

            {/* Notification Card: Unread Offer */}
            {(activeTab === "All" || activeTab === "Offers") && (
              <div className="relative p-4 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] group transition-all hover:scale-[1.01] border border-gray-100">
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      local_fire_department
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-on-surface text-[15px]">Flash Sale: Up to 70% off</h3>
                      <span className="text-[11px] font-medium text-slate-400">2 mins ago</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Grab the hottest trends before they're gone. Sale ends at midnight!
                    </p>
                    <div className="mt-3 overflow-hidden rounded-xl">
                      <img
                        className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                        alt="High fashion clothing rack display"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmmXs4jMuCKmJR9bmfO-ktumJnPwdUyq90Ya8OZJ7OrGax4eYSb83US286PqqT8bGbp6adCGDkvA_IvTZTMufhiVFYfSgU56nsi_b72txeFJUFsH1epOewNKrg5MY0bshmgIt5Ed4tcZUonVgSn8AjO6ATshhNprAGO3PEXJnIJQpxqt1tozzCQSrA_-oPoqYZS2kTDyKZtpXDcWdrWpwHDLm5LXJfBT-SifQRpf018-E5uynOF05NxSHMiLLzqRMIE358K-AElC8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Card: Order Update */}
            {(activeTab === "All" || activeTab === "Orders") && (
              <div className="p-4 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">
                      local_shipping
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-on-surface text-[15px]">Out for Delivery</h3>
                      <span className="text-[11px] font-medium text-slate-400">1 hour ago</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      Your order <span className="font-semibold text-secondary">#ME67890</span> is arriving today. Get ready!
                    </p>
                    <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                      <img
                        className="w-10 h-10 rounded object-cover"
                        alt="Minimalist white wristwatch"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuANv_v_A_-Zf138CghsGoQaXLDNzBte54gkcNWPCbyuyvBYendz-JCVMmFpCU74c7cfRkYwCZVvQnySPyNkSKmX0tuOA3NdnA-O2Zsv6puOhRlBAcjxxRQ76j90PsPvZ6-bmBCG-2aXTU7Qnf1oYhNTOV9O6gIN9ElPwHifIFwGXeNS6UjeB7Is-Riawvm0GbiyThgu6BK6Bg3G37rrgH8H8JBrjG5JEnny92QwWqWwIk--rVTQmcyv4R2erNGZwyJJREQHEwYPuzM"
                      />
                      <div>
                        <p className="text-xs font-bold text-on-surface">Premium Quartz Watch</p>
                        <p className="text-[10px] text-on-surface-variant">Expected by 8:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Card: Margin Credit (Earnings) */}
            {(activeTab === "All" || activeTab === "Earnings") && (
              <div className="p-4 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      payments
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-on-surface text-[15px]">Margin Credited</h3>
                      <span className="text-[11px] font-medium text-slate-400">3 hours ago</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Your margin of <span className="font-bold text-tertiary">₹450</span> for Order #1234 has been credited to your wallet.
                    </p>
                    <button 
                      onClick={() => navigate('/reseller-wallet')}
                      className="mt-2 text-xs font-bold text-secondary flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      Check Balance <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section: Yesterday */}
        {(activeTab === "All" || activeTab === "Orders" || activeTab === "Offers" || activeTab === "Earnings") && (
          <div className="mt-10 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mb-2">
              Yesterday
            </h2>

            {/* Notification Card: Order Delivered */}
            {(activeTab === "All" || activeTab === "Orders") && (
              <div className="p-4 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all opacity-80 border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-500">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-on-surface text-[15px]">Order Delivered</h3>
                      <span className="text-[11px] font-medium text-slate-400">1 day ago</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      Order #ME67554 was successfully delivered. Don't forget to rate your experience!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Card: New Arrivals */}
            {(activeTab === "All" || activeTab === "Offers") && (
              <div className="p-4 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all opacity-80 border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">apparel</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-on-surface text-[15px]">New Arrivals in Ethnic Wear</h3>
                      <span className="text-[11px] font-medium text-slate-400">1 day ago</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Explore the latest collection of handpicked Saree &amp; Kurtas from top suppliers.
                    </p>
                    <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                      <img
                        className="w-20 h-20 rounded-lg object-cover"
                        alt="Silk saree collection showcase"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuABd1htYsHGNxFucJVs9dAu4YznR8Uvtair6HJV6Q-kFyQMcve_0tAIn_KKZxZbtE95r__YbdXbDWmlWgewal3w7UHP9O-Czhyi3a8Q9qYSi9X0beQS6PeL18bUHol-bjty_jUuOcMXrSwraTEs_lIfb8ac0Y03WC96HqM-JzM-Nik0-3KWJok6CbM_irN7iMZDMJoRHBHfOQtZDUTWj2ZGUOen6gw63HKSyimM8xbDt8lzVhvnWO1UtRZrlAkBL0tg4XstL2bL27Y"
                      />
                      <img
                        className="w-20 h-20 rounded-lg object-cover"
                        alt="Traditional kurta design"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl4j43ajoO731gr85RwqO_QSzoIE3SR97tHARYhkp7sOKcGp6DL30Qpd0LQNMGcLEfh8StSwtQw6ee41BnibU2_mZGn4OXnLEQKf6ihOvj2Sy1QmOuwwJuIUW2pH4YQg6mRrA5cjjbobGN6VOaEJX1FkHBOs4OxB1naYdNs583pWM7Kw-dTj29m57zawhaPYhXfBRVKteEbtYeRKHeQhIydXtFpLrjYYNwUf-sLtyq98UC_GeU6K4sjjylc5CuAOV08baPChuOBQw"
                      />
                      <div className="w-20 h-20 rounded-lg bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant text-center px-2">
                        +15 More
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Card: Payout */}
            {(activeTab === "All" || activeTab === "Earnings") && (
              <div className="p-4 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all opacity-80 border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-tertiary">account_balance</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-on-surface text-[15px]">New payout processed</h3>
                      <span className="text-[11px] font-medium text-slate-400">1 day ago</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Your weekly payout of <span className="font-bold">₹2,840</span> has been transferred to your linked bank account.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" />

      {/* Navigation Drawer */}
      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
