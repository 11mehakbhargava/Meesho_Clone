import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

const DUMMY_ORDERS = [
  {
    id: 'ORD-998241',
    orderDate: '15 Sep 2026',
    deliveryDate: '17 Sep 2026',
    productName: 'Kanjivaram Soft Silk Woven Saree with Blouse Piece',
    category: 'Ethnic Wear',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    color: 'Magenta & Gold Zari',
    size: 'Free Size',
    qty: 1,
    price: 849,
    originalPrice: 2499,
    status: 'delivered',
    statusLabel: 'Delivered on 17 Sep',
    returnEligible: true,
    returnExpiryDate: '24 Sep 2026',
    returnDaysLeft: 6,
    courierName: 'Delhivery Express',
    trackingNumber: 'DEL-992817264',
    paymentMethod: 'Cash on Delivery (COD)',
    deliveryAddress: 'Priya Sharma, Flat 402, Royal Palms, MG Road, Bengaluru - 560001',
    sellerName: 'Varanasi Silks Pvt Ltd',
  },
  {
    id: 'ORD-997102',
    orderDate: '17 Sep 2026',
    deliveryDate: 'Expected Today by 7:00 PM',
    productName: 'Pure Cotton Floral Printed Straight Kurti with Pant',
    category: 'Women Western',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    color: 'Pastel Peach',
    size: 'M',
    qty: 1,
    price: 499,
    originalPrice: 1299,
    status: 'in_transit',
    statusLabel: 'Out for Delivery Today',
    returnEligible: false,
    courierName: 'Shadowfax Logistics',
    trackingNumber: 'SFX-88219034',
    paymentMethod: 'UPI (PhonePe)',
    deliveryAddress: 'Priya Sharma, Flat 402, Royal Palms, MG Road, Bengaluru - 560001',
    sellerName: 'Jaipur Cotton Crafts',
    transitSteps: [
      { label: 'Order Placed', time: '17 Sep, 10:30 AM', done: true },
      { label: 'Packed & Shipped', time: '17 Sep, 04:15 PM', done: true },
      { label: 'Arrived at Hub (Bangalore East)', time: '18 Sep, 06:40 AM', done: true },
      { label: 'Out for Delivery with Rider Sunil', time: '18 Sep, 11:15 AM', done: true, current: true },
      { label: 'Delivered', time: 'Expected by 7:00 PM', done: false },
    ],
  },
  {
    id: 'ORD-986510',
    orderDate: '08 Sep 2026',
    deliveryDate: '10 Sep 2026',
    productName: 'Embroidered Rayon Anarkali Kurta Set with Dupatta',
    category: 'Ethnic Wear',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    color: 'Emerald Green',
    size: 'L',
    qty: 1,
    price: 699,
    originalPrice: 1899,
    status: 'returned',
    statusLabel: 'Return Picked Up & Refunded',
    returnId: 'RET-77410',
    returnReason: 'Size issue (Too loose on shoulders)',
    refundAmount: 699,
    refundDate: '13 Sep 2026',
    refundDestination: 'UPI (ananya@okhdfcbank)',
    returnEligible: false,
    courierName: 'Xpressbees Reverse Logistics',
    trackingNumber: 'XB-RET-33109',
    paymentMethod: 'Google Pay UPI',
    deliveryAddress: 'Priya Sharma, Flat 402, Royal Palms, MG Road, Bengaluru - 560001',
    sellerName: 'Surat Textiles Hub',
    reverseSteps: [
      { label: 'Return Requested', time: '11 Sep, 02:20 PM', done: true },
      { label: 'Doorstep Pickup Completed', time: '12 Sep, 11:45 AM', done: true },
      { label: 'Item Quality Verified at Hub', time: '13 Sep, 09:10 AM', done: true },
      { label: '₹699 Refund Credited to Bank', time: '13 Sep, 10:05 AM', done: true, current: true },
    ],
  },
  {
    id: 'ORD-974218',
    orderDate: '02 Sep 2026',
    deliveryDate: '04 Sep 2026',
    productName: "Men's Casual Lightweight Knit Walking Shoes",
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    color: 'Crimson Red',
    size: 'UK 8',
    qty: 1,
    price: 599,
    originalPrice: 1599,
    status: 'delivered',
    statusLabel: 'Delivered on 04 Sep',
    returnEligible: false,
    returnClosedReason: '7-day return window expired on 11 Sep 2026',
    courierName: 'Ecom Express',
    trackingNumber: 'ECOM-11092834',
    paymentMethod: 'Cash on Delivery (COD)',
    deliveryAddress: 'Priya Sharma, Flat 402, Royal Palms, MG Road, Bengaluru - 560001',
    sellerName: 'Apex Footwear Delhi',
  },
];

export default function CustomerOrders({ onNavigate, onBack }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadInvoice = (orderId) => {
    showToast(`Downloading Tax Invoice for #${orderId}... 📄`);
  };

  const filteredOrders = DUMMY_ORDERS.filter((order) => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.returnId && order.returnId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'in_transit') return order.status === 'in_transit';
    if (activeTab === 'delivered') return order.status === 'delivered';
    if (activeTab === 'returned') return order.status === 'returned';
    return true;
  });

  return (
    <div className="bg-[#f8f9fb] min-h-screen text-[#191c1e] font-['Inter',sans-serif] pb-28 antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate ? onNavigate('home') : window.history.back())}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>My Orders</span>
                <span className="text-xs font-bold bg-pink-100 text-[#9f0038] px-2 py-0.5 rounded-full">
                  {DUMMY_ORDERS.length} Orders
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Track parcels, manage returns &amp; download tax invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('cart')}
              className="w-9 h-9 rounded-full bg-pink-50 text-[#9f0038] flex items-center justify-center cursor-pointer hover:bg-pink-100 transition-colors relative"
              title="Shopping Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#9f0038] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                1
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by product name, Order ID (e.g. ORD-998), or Return ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#9f0038] focus:bg-white transition-all shadow-inner"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-1.5 overflow-x-auto pb-2.5 no-scrollbar">
          {[
            { id: 'all', label: 'All Orders', count: DUMMY_ORDERS.length },
            { id: 'in_transit', label: 'In Transit 🚚', count: DUMMY_ORDERS.filter((o) => o.status === 'in_transit').length },
            { id: 'delivered', label: 'Delivered ✅', count: DUMMY_ORDERS.filter((o) => o.status === 'delivered').length },
            { id: 'returned', label: 'Returns & Refunds 🔄', count: DUMMY_ORDERS.filter((o) => o.status === 'returned').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#9f0038] to-[#e11d48] text-white shadow-md shadow-pink-500/20 scale-[1.02]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100 space-y-3">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-[#9f0038] flex items-center justify-center mx-auto text-2xl">
              📦
            </div>
            <h3 className="text-base font-black text-slate-800">No orders found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any orders matching your search or active filter. Try clearing the filter or search term.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <article
                key={order.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Top Strip */}
                <div className="bg-slate-50/70 px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 tracking-wide">#{order.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Ordered on {order.orderDate}</span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {order.status === 'delivered' && (
                      <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {order.statusLabel}
                      </span>
                    )}
                    {order.status === 'in_transit' && (
                      <span className="inline-flex items-center gap-1 font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {order.statusLabel}
                      </span>
                    )}
                    {order.status === 'returned' && (
                      <span className="inline-flex items-center gap-1 font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        {order.statusLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info Section */}
                <div className="p-4 sm:p-6">
                  <div className="flex gap-3 sm:gap-5 items-start">
                    {/* Product Image */}
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
                      <img
                        src={order.image}
                        alt={order.productName}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                        Qty: {order.qty}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">
                          {order.productName}
                        </h2>
                      </div>

                      <p className="text-xs text-slate-500 font-semibold flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>Color: <strong className="text-slate-700">{order.color}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-slate-700">{order.size}</strong></span>
                        <span>•</span>
                        <span>Seller: <strong className="text-slate-700">{order.sellerName}</strong></span>
                      </p>

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          ₹{order.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{order.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                          {Math.round(((order.originalPrice - order.price) / order.originalPrice) * 100)}% Off
                        </span>
                      </div>

                      {/* Return Eligibility Banner */}
                      {order.status === 'delivered' && order.returnEligible && (
                        <div className="mt-2.5 bg-gradient-to-r from-rose-50 to-pink-50/60 border border-rose-200/60 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-[#9f0038] text-white flex items-center justify-center text-xs shrink-0">
                              🔄
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] sm:text-xs font-black text-[#9f0038] truncate">
                                7-Day Easy Return / Exchange Available
                              </p>
                              <p className="text-[10px] font-semibold text-rose-700/80">
                                Closes on {order.returnExpiryDate} ({order.returnDaysLeft} days remaining)
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              onNavigate &&
                              onNavigate(`/return-request?orderId=${order.id}&item=${encodeURIComponent(order.productName)}`)
                            }
                            className="w-full sm:w-auto bg-[#9f0038] hover:bg-[#85002f] active:scale-95 text-white font-black text-xs px-4 py-2 rounded-xl shadow-sm shadow-pink-500/30 cursor-pointer transition-all whitespace-nowrap text-center"
                          >
                            Return / Exchange ➔
                          </button>
                        </div>
                      )}

                      {/* Return Window Expired Notice */}
                      {order.status === 'delivered' && !order.returnEligible && order.returnClosedReason && (
                        <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <span>ℹ️</span>
                          <span>{order.returnClosedReason}</span>
                        </div>
                      )}

                      {/* Refund Credited Summary */}
                      {order.status === 'returned' && (
                        <div className="mt-2 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                              <span>✅ Refund Credited: ₹{order.refundAmount}</span>
                              <span className="text-[10px] font-bold bg-indigo-200/70 text-indigo-800 px-2 py-0.2 rounded-full">
                                #{order.returnId}
                              </span>
                            </p>
                            <p className="text-[11px] font-medium text-indigo-700">
                              Credited to {order.refundDestination} on {order.refundDate}
                            </p>
                          </div>
                          <button
                            onClick={() => setTrackingModalOrder(order)}
                            className="text-xs font-extrabold text-indigo-800 underline hover:text-indigo-950 cursor-pointer"
                          >
                            View Return Journey
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Tracking Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Order Details'}</span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Invoice</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'in_transit' && (
                        <button
                          onClick={() => setTrackingModalOrder(order)}
                          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs px-4 py-1.5 rounded-xl shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                        >
                          <span>Track Delivery Live</span>
                          <span className="animate-ping w-1.5 h-1.5 rounded-full bg-white"></span>
                        </button>
                      )}

                      {order.status === 'delivered' && (
                        <button
                          onClick={() => onNavigate && onNavigate('write_review')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
                        >
                          ⭐ Rate &amp; Review
                        </button>
                      )}

                      <button
                        onClick={() => onNavigate && onNavigate('product')}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>

                  {/* Expandable Order Details Panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200 text-xs space-y-3 bg-slate-50/60 p-4 rounded-2xl animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">
                            📍 Delivery Address
                          </p>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{order.deliveryAddress}</p>
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">
                            💳 Payment &amp; Courier Info
                          </p>
                          <p className="text-slate-600 mt-0.5">
                            Payment: <strong>{order.paymentMethod}</strong>
                          </p>
                          <p className="text-slate-600">
                            Courier: <strong>{order.courierName}</strong> (AWB: {order.trackingNumber})
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Need assistance with this order?</span>
                        <button
                          onClick={() => onNavigate && onNavigate('supportCenter')}
                          className="text-[#9f0038] font-bold hover:underline cursor-pointer"
                        >
                          Customer Support &amp; Help ➔
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>

      {/* Live Tracking / Return Journey Modal */}
      {trackingModalOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setTrackingModalOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  {trackingModalOrder.status === 'returned' ? 'Return Journey Tracker' : 'Live Shipment Tracking'}
                </h3>
                <p className="text-xs text-slate-500">
                  Order #{trackingModalOrder.id} • {trackingModalOrder.courierName}
                </p>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Stepper Steps */}
            <div className="space-y-4 pt-2">
              {(trackingModalOrder.transitSteps || trackingModalOrder.reverseSteps || []).map((step, idx, arr) => (
                <div key={idx} className="flex gap-3 relative">
                  {/* Vertical connecting line */}
                  {idx !== arr.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-6 bottom-0 w-0.5 ${
                        step.done ? 'bg-[#9f0038]' : 'bg-slate-200'
                      }`}
                    ></div>
                  )}

                  {/* Icon circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      step.current
                        ? 'bg-[#9f0038] text-white ring-4 ring-pink-100 animate-pulse'
                        : step.done
                        ? 'bg-[#9f0038] text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>

                  {/* Step text */}
                  <div className="flex-1 pb-4">
                    <p className="font-extrabold text-xs text-slate-900 leading-snug">{step.label}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                AWB: <strong>{trackingModalOrder.trackingNumber}</strong>
              </span>
              <button
                onClick={() => {
                  showToast('Tracking link copied to clipboard! 📋');
                }}
                className="text-[#9f0038] font-black cursor-pointer hover:underline"
              >
                Share Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <AppBottomNav activeNav="orders" onNavigate={onNavigate} />
    </div>
  );
}
