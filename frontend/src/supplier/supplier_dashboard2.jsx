import React, { useState } from 'react';

// Default mock data that matches the design specification
const DEFAULT_STATS = {
  totalSales: {
    amount: '₹42,850.50',
    growth: '+12.5%',
    progressPercentage: 75,
  },
  pendingOrders: {
    count: 8,
    isUrgent: true,
  },
  activeProducts: {
    count: 124,
  },
};

const DEFAULT_ORDERS = [
  {
    id: 'ORD-9921',
    customerName: 'Rahul Varma',
    avatarInitials: 'RV',
    amount: '₹1,200',
    status: 'New Order',
    statusType: 'primary',
  },
  {
    id: 'ORD-9918',
    customerName: 'Priya Sharma',
    avatarInitials: 'PS',
    amount: '₹850',
    status: 'Processing',
    statusType: 'secondary',
  },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', filled: true },
  { id: 'inventory', label: 'Inventory', icon: 'inventory_2', filled: false },
  { id: 'orders', label: 'Orders', icon: 'receipt_long', filled: false },
  { id: 'profile', label: 'Profile', icon: 'person', filled: false },
];

export function SupplierDashboard2({
  stats = DEFAULT_STATS,
  orders = DEFAULT_ORDERS,
  supplierName = 'Supplier',
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUNR5X6GirXmJ44WL38cwZ6hm9YHIoNSCHE1mZA4Lm8Xnkk9u16VujYhGnC_KiXu5g1TQYdrSRSIXI4BV_modHkkWcBmYSjidtYk1SnERyFhQQYcncOBtvKmKMEdem_48Tq89mUlSP2QZhGzMdn3m7V1zEe8A_vSgZFABtTo-Zk--VnsdqRbdQrHSMTFLyEGUq6ZPo5Sld6sfvisTpkcxgJs5IvswsH5ctINnFTwytASEz2__XLUo9TjInaB1eq-ds--qxgMUz4-A',
  onAddNewProduct,
  onViewInventory,
  onViewAllOrders,
  onNotificationClick,
  onNavChange,
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [orderList, setOrderList] = useState(orders);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onNavChange) {
      onNavChange(tabId);
    }
  };

  const handleNotification = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 3000);
      setNotificationsCount(0);
    }
  };

  const handleAddProduct = () => {
    if (onAddNewProduct) {
      onAddNewProduct();
    } else {
      alert('Add New Product clicked! Opening product creation flow...');
    }
  };

  const handleInventory = () => {
    if (onViewInventory) {
      onViewInventory();
    } else {
      alert('Navigating to Supplier Inventory Management...');
    }
  };

  const handleAllOrders = () => {
    if (onViewAllOrders) {
      onViewAllOrders();
    } else {
      alert('Navigating to All Orders List...');
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32 font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      {/* Toast Notification */}
      {showNotificationToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#005ea5] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-xl">notifications_active</span>
          <span className="text-sm font-semibold">You have 3 new order updates today!</span>
        </div>
      )}

      {/* ===================== TopAppBar ===================== */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40 shadow-[0px_12px_32px_rgba(22,29,31,0.06)] border-b border-surface-container-high/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={profileImage}
              loading="lazy"
            />
          </div>
          <span className="text-lg font-extrabold text-blue-900 dark:text-blue-50 tracking-tighter">
            Supplier Hub
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleNotification}
            aria-label="View notifications"
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-2xl">
              notifications
            </span>
            {notificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </header>

      {/* ===================== Main Content ===================== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-1">
            Hello, {supplierName}!
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">
            Manage your shop business today
          </p>
        </section>

        {/* Bento Grid Layout for Stats and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Stats: Total Sales (Glassmorphism) */}
          <div className="glass-card p-8 rounded-[16px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-on-surface-variant font-semibold tracking-wide text-sm uppercase">
                  Total Sales
                </span>
                <div className="flex items-center gap-1 text-primary bg-primary/10 px-2.5 py-1 rounded-full text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  {stats.totalSales.growth}
                </div>
              </div>
              <div className="text-4xl font-extrabold text-on-surface tracking-tight">
                {stats.totalSales.amount}
              </div>
            </div>
            <div className="mt-8 h-1 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
                style={{ width: `${stats.totalSales.progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Stats: Pending Orders (Glassmorphism) */}
          <div className="glass-card p-8 rounded-[16px] flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary flex-shrink-0">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                receipt_long
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant font-semibold text-sm uppercase">
                Pending Orders
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-4xl font-extrabold text-on-surface">
                  {stats.pendingOrders.count}
                </span>
                {stats.pendingOrders.isUrgent && (
                  <span className="bg-error text-on-error text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    Urgent
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats: Active Products (Glassmorphism) */}
          <div className="glass-card p-8 rounded-[16px] flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary flex-shrink-0">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                inventory_2
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant font-semibold text-sm uppercase">
                Active Products
              </span>
              <div className="text-4xl font-extrabold text-on-surface mt-1">
                {stats.activeProducts.count}
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Recent Orders + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Orders Section (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                Recent Orders
              </h2>
              <button
                type="button"
                onClick={handleAllOrders}
                className="text-primary font-semibold text-sm hover:underline cursor-pointer"
              >
                View All Orders
              </button>
            </div>

            <div className="space-y-4">
              {orderList.map((order) => {
                const isPrimary = order.statusType === 'primary';
                return (
                  <div
                    key={order.id}
                    className="bg-surface-container-lowest p-6 rounded-[16px] flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-bold shadow-inner">
                        {order.avatarInitials}
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{order.customerName}</h4>
                        <p className="text-on-surface-variant text-sm">Order #{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-on-surface mb-1">{order.amount}</div>
                      <div className="flex items-center gap-2 justify-end">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isPrimary ? 'bg-primary' : 'bg-secondary'
                          }`}
                        ></span>
                        <span
                          className={`text-xs font-bold uppercase ${
                            isPrimary ? 'text-primary' : 'text-secondary tracking-tighter'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions (1/3 width on large screens) */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-8">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleAddProduct}
                className="w-full py-5 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer hover:brightness-105"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Add New Product
              </button>

              <button
                type="button"
                onClick={handleInventory}
                className="w-full py-5 px-6 bg-surface-container-low text-on-secondary-container rounded-xl font-bold border border-outline-variant/30 flex items-center justify-center gap-3 hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined">grid_view</span>
                View Inventory
              </button>

              {/* Decorative Visual Card */}
              <div className="mt-6 p-6 rounded-xl bg-on-secondary-fixed text-on-primary-container overflow-hidden relative group shadow-sm">
                <div className="relative z-10">
                  <p className="text-secondary-fixed text-xs font-bold uppercase tracking-widest mb-1">
                    Performance Tip
                  </p>
                  <h4 className="text-white font-bold leading-tight">
                    Optimize your catalog photos for better reach.
                  </h4>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none">
                  <span className="material-symbols-outlined text-[100px]">lightbulb</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===================== BottomNavBar ===================== */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white dark:bg-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] rounded-t-[16px] border-t border-slate-100 dark:border-slate-800"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center px-5 py-2 font-['Plus_Jakarta_Sans'] text-[11px] font-medium transition-all active:scale-90 duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100 rounded-2xl shadow-sm'
                  : 'text-slate-400 dark:text-slate-500 hover:text-blue-600'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: isActive || item.filled ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default SupplierDashboard2;
