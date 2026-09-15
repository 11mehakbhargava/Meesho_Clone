import { useState } from 'react';
import AppBottomNav from '../components/AppBottomNav';

const RECENT_ORDERS = [
  {
    id: 'ORD-9921',
    customer: 'Rahul Varma',
    initials: 'RV',
    amount: 1200,
    status: 'New Order',
    statusColor: 'text-[#005ea5] bg-[#005ea5]/10',
    dotColor: 'bg-[#005ea5]',
    time: '12 mins ago',
    items: '2x Floral Silk Saree',
  },
  {
    id: 'ORD-9918',
    customer: 'Priya Sharma',
    initials: 'PS',
    amount: 850,
    status: 'Processing',
    statusColor: 'text-[#436085] bg-[#436085]/10',
    dotColor: 'bg-[#436085]',
    time: '45 mins ago',
    items: '1x Cotton Anarkali Kurti',
  },
  {
    id: 'ORD-9915',
    customer: 'Amit Patel',
    initials: 'AP',
    amount: 2450,
    status: 'Dispatched',
    statusColor: 'text-emerald-700 bg-emerald-50',
    dotColor: 'bg-emerald-600',
    time: '2 hours ago',
    items: '3x Men Vintage Denim Jackets',
  },
  {
    id: 'ORD-9910',
    customer: 'Sneha Reddy',
    initials: 'SR',
    amount: 690,
    status: 'Delivered',
    statusColor: 'text-slate-600 bg-slate-100',
    dotColor: 'bg-slate-500',
    time: 'Yesterday',
    items: '1x Choker Jewellery Set',
  },
];

export default function StructureFlow({
  onNavigate,
  onAddNewProduct,
  onViewInventory,
  onViewOrders,
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [totalSales, setTotalSales] = useState(42850.5);
  const [pendingCount, setPendingCount] = useState(8);
  const [activeProductsCount] = useState(124);
  const [toastMsg, setToastMsg] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('Today');
  const [orders, setOrders] = useState(RECENT_ORDERS);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const handleProcessOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: o.status === 'New Order' ? 'Processing' : 'Dispatched',
              statusColor:
                o.status === 'New Order'
                  ? 'text-[#436085] bg-[#436085]/10'
                  : 'text-emerald-700 bg-emerald-50',
              dotColor: o.status === 'New Order' ? 'bg-[#436085]' : 'bg-emerald-600',
            }
          : o
      )
    );
    setPendingCount((c) => Math.max(0, c - 1));
    setTotalSales((s) => s + 50);
    showToast(`Order #${orderId} marked as progressed!`);
  };

  return (
    <div className="bg-[#f4fafd] text-[#161d1f] min-h-screen pb-32 font-['Plus_Jakarta_Sans'] selection:bg-[#005ea5]/20 selection:text-[#005ea5] antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-[#161d1f]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce border border-white/10">
          <span className="material-symbols-outlined text-sm text-[#0077ce]">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TopAppBar (The Efficient Enterprise Header) */}
      <header className="bg-white/80 backdrop-blur-xl flex justify-between items-center w-full px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-[0px_12px_32px_rgba(22,29,31,0.06)] border-b border-[#e2e9ec]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#005ea5] to-[#0077ce] flex items-center justify-center text-white shadow-md shadow-[#005ea5]/30">
            <span className="material-symbols-outlined text-xl">hub</span>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-[#005ea5] tracking-tight leading-none block">
              Supplier Hub
            </span>
            <span className="text-[10px] font-bold text-[#404752] uppercase tracking-wider">
              Structure Flow • The Curated Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Period Filter Dropdown / Pill */}
          <div className="hidden sm:flex items-center bg-[#eef5f7] rounded-xl p-1 text-xs font-bold text-[#404752]">
            {['Today', 'This Week', 'This Month'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setFilterPeriod(p);
                  showToast(`Switched performance window to ${p}`);
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterPeriod === p ? 'bg-white text-[#005ea5] shadow-sm' : 'hover:text-[#161d1f]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => showToast('3 unread supplier alerts available')}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-blue-50 text-[#005ea5] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0077ce]"></span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#161d1f] tracking-tight mb-1">
              Hello, Supplier!
            </h1>
            <p className="text-[#404752] text-sm sm:text-base font-medium">
              Manage your catalog, orders, and logistics performance with zero friction.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="bg-[#eef5f7] border border-[#c0c7d4]/30 text-[#005ea5] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Hub Live Synced</span>
            </span>
          </div>
        </section>

        {/* Bento Grid Layout for Stats and Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Quick Stats: Total Sales (Glassmorphism) */}
          <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-7 rounded-3xl border border-[#c0c7d4]/20 shadow-[0_12px_32px_rgba(22,29,31,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#404752] font-bold tracking-wider text-xs uppercase">
                  Total Sales ({filterPeriod})
                </span>
                <div className="flex items-center gap-1 text-[#005ea5] bg-[#005ea5]/10 px-2.5 py-1 rounded-full text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#161d1f] tracking-tight">
                ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-bold text-[#404752] mb-1.5">
                <span>Monthly Target (₹50,000)</span>
                <span>85.7%</span>
              </div>
              <div className="h-2 bg-[#e2e9ec] rounded-full overflow-hidden">
                <div className="h-full w-[85.7%] bg-gradient-to-r from-[#005ea5] to-[#0077ce] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick Stats: Pending Orders (Glassmorphism) */}
          <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-7 rounded-3xl border border-[#c0c7d4]/20 shadow-[0_12px_32px_rgba(22,29,31,0.04)] flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#ffdbc7] flex items-center justify-center text-[#934700] shrink-0 shadow-sm">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                receipt_long
              </span>
            </div>
            <div>
              <span className="text-[#404752] font-bold tracking-wider text-xs uppercase">
                Pending Orders
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#161d1f]">
                  {pendingCount}
                </span>
                {pendingCount > 0 ? (
                  <span className="bg-[#ba1a1a] text-white text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">
                    Urgent
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    All Clear
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#404752] mt-1">Ready for packaging & dispatch</p>
            </div>
          </div>

          {/* Quick Stats: Active Products (Glassmorphism) */}
          <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-7 rounded-3xl border border-[#c0c7d4]/20 shadow-[0_12px_32px_rgba(22,29,31,0.04)] flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#d3e4ff] flex items-center justify-center text-[#005ea5] shrink-0 shadow-sm">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                inventory_2
              </span>
            </div>
            <div>
              <span className="text-[#404752] font-bold tracking-wider text-xs uppercase">
                Active Products
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#161d1f] mt-1">
                {activeProductsCount}
              </div>
              <p className="text-[11px] text-[#404752] mt-1">100% in-stock across 8 categories</p>
            </div>
          </div>
        </section>

        {/* 2-Column Asymmetric Enterprise Layout (2/3 + 1/3) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Section (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#161d1f]">
                  Recent Orders
                </h2>
                <p className="text-xs text-[#404752]">Real-time buyer purchases across India</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onViewOrders) onViewOrders();
                  else showToast('Displaying full order catalog...');
                }}
                className="text-[#005ea5] hover:text-[#0077ce] font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                View All Orders →
              </button>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => handleProcessOrder(ord.id)}
                  className="bg-white p-5 rounded-2xl flex items-center justify-between border border-[#c0c7d4]/20 hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#eef5f7] flex items-center justify-center text-[#005ea5] font-black text-sm shrink-0 group-hover:bg-[#005ea5] group-hover:text-white transition-colors">
                      {ord.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#161d1f] text-sm sm:text-base">
                        {ord.customer}
                      </h4>
                      <p className="text-xs text-[#404752]">
                        Order #{ord.id} • <span className="font-medium">{ord.items}</span>
                      </p>
                      <span className="text-[10px] text-slate-400">{ord.time}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-[#161d1f] text-base mb-1">
                      ₹{ord.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`w-2 h-2 rounded-full ${ord.dotColor}`}></span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${ord.statusColor}`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Performance Tip (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#161d1f] mb-1">
                Quick Actions
              </h2>
              <p className="text-xs text-[#404752] mb-4">Immediate catalog operations</p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  if (onAddNewProduct) onAddNewProduct();
                  else showToast('Opening Add New Product flow...');
                }}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#005ea5] to-[#0077ce] hover:brightness-105 text-white rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-[#005ea5]/25 cursor-pointer text-sm"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>Add New Product</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onViewInventory) onViewInventory();
                  else showToast('Opening Supplier Inventory...');
                }}
                className="w-full py-4 px-6 bg-[#eef5f7] hover:bg-[#e2e9ec] text-[#005ea5] rounded-2xl font-bold border border-[#c0c7d4]/30 flex items-center justify-center gap-3 transition-colors active:scale-95 cursor-pointer text-sm"
              >
                <span className="material-symbols-outlined text-lg">grid_view</span>
                <span>View Inventory</span>
              </button>
            </div>

            {/* Performance Tip Card */}
            <div className="p-6 rounded-3xl bg-[#001c38] text-white overflow-hidden relative group shadow-md">
              <div className="relative z-10 space-y-2">
                <span className="bg-[#005ea5] text-[#d3e4ff] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block">
                  Performance Tip
                </span>
                <h4 className="text-white font-bold text-sm sm:text-base leading-snug">
                  Optimize your catalog photos for 3x higher buyer conversion.
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Listings with 4+ multi-angle high-resolution photos receive 68% more reseller
                  shares.
                </p>
                <button
                  type="button"
                  onClick={() => showToast('Opening photo optimization guide...')}
                  className="text-[#a2c9ff] hover:text-white font-bold text-xs flex items-center gap-1 pt-1"
                >
                  <span>Learn Photo Best Practices</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <span className="material-symbols-outlined text-[100px]">lightbulb</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="orders" onNavigate={onNavigate} />
    </div>
  );
}
