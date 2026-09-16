import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function ShoppingCart({ onNavigate = () => {}, onBack }) {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Aurelia Royal Silk Banarasi Embroidered Kurta Set',
      size: 'M',
      color: 'Emerald Green',
      price: 499,
      originalPrice: 1499,
      discount: '66% OFF',
      quantity: 1,
      resellMargin: 150,
      returnDays: '7 days easy return & exchange',
      deliveryTime: 'Delivery by Tomorrow, 5 PM',
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Pro-Flex Ultra Lightweight Air Cushion Sneakers',
      size: '9 UK',
      color: 'Crimson Black',
      price: 799,
      originalPrice: 2199,
      discount: '63% OFF',
      quantity: 1,
      resellMargin: 220,
      returnDays: '7 days replacement guarantee',
      deliveryTime: 'Free Express Delivery',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Handcrafted Vegan Leather Crossbody Sling',
      size: 'Free Size',
      color: 'Vintage Tan',
      price: 450,
      originalPrice: 1299,
      discount: '65% OFF',
      quantity: 1,
      resellMargin: 130,
      returnDays: '7 days easy return',
      deliveryTime: 'Delivery by Thursday',
      image:
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80',
    },
  ]);

  const [address, setAddress] = useState({
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    pincode: '560103',
    details: 'Flat 402, Lotus Orchid, 24th Main, HSR Layout Sector 2, Bengaluru, Karnataka',
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('FIRST100');
  const [couponDiscount, setCouponDiscount] = useState(100);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    triggerToast('Item removed from cart');
  };

  const moveToWishlist = (item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    triggerToast(`Moved "${item.title}" to Wishlist ❤️`);
  };

  const handleApplyCoupon = (code) => {
    const codeToApply = code || couponCode;
    if (!codeToApply) {
      triggerToast('Please enter a valid coupon code');
      return;
    }
    if (codeToApply.toUpperCase() === 'FIRST100' || codeToApply.toUpperCase() === 'MEESHO50') {
      setAppliedCoupon(codeToApply.toUpperCase());
      setCouponDiscount(codeToApply.toUpperCase() === 'FIRST100' ? 100 : 50);
      setCouponCode('');
      triggerToast(`Coupon "${codeToApply.toUpperCase()}" Applied! 🎉`);
    } else {
      triggerToast('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    triggerToast('Coupon removed');
  };

  // WhatsApp Order Confirmation for Resellers
  const shareCartBillOnWhatsApp = () => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalEarnings = items.reduce((acc, item) => acc + item.resellMargin * item.quantity, 0);
    const totalResellerPrice = items.reduce(
      (acc, item) => acc + (item.price + item.resellMargin) * item.quantity,
      0
    );

    const itemsSummary = items
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.title}* (Qty: ${i.quantity}, Size: ${i.size}) - ₹${
            (i.price + i.resellMargin) * i.quantity
          }`
      )
      .join('\n');

    const text = `🛍️ *YOUR MEESHO SHOPPING ORDER BILL* 🛍️\n\n${itemsSummary}\n\n📦 *Total Items:* ${totalItems}\n💰 *Final Payable Amount:* ₹${totalResellerPrice}\n🚚 *Delivery:* FREE Cash on Delivery (COD)\n📍 *Delivery To:* ${address.name}, ${address.pincode}\n\nReply *CONFIRM* to place this order now! 🚀`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    triggerToast('Opening WhatsApp with order summary 📱');
  };

  const totalMRP = items.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const rawProductTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = Math.max(0, rawProductTotal - couponDiscount);
  const totalDiscount = totalMRP - rawProductTotal + couponDiscount;
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalResellerEarnings = items.reduce(
    (acc, item) => acc + item.resellMargin * item.quantity,
    0
  );

  const saveAddress = (e) => {
    e.preventDefault();
    setAddress(tempAddress);
    setIsChangingAddress(false);
    triggerToast('Delivery address updated! 📍');
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] font-sans antialiased min-h-screen pb-32 selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md shadow-xs border-b border-gray-100">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('reseller'))}
              className="p-2 rounded-full hover:bg-slate-100 active:scale-95 text-[#191C1E] cursor-pointer transition-colors"
              title="Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-[#191C1E]">
                Shopping Cart
              </h1>
              {items.length > 0 && (
                <span className="bg-pink-50 text-[#FF3F6C] font-black text-xs px-2.5 py-0.5 rounded-full">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>

          {/* Stepper (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="text-[#FF3F6C] font-extrabold flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#FF3F6C] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              Cart
            </span>
            <span>─────</span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                2
              </span>
              Address
            </span>
            <span>─────</span>
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                3
              </span>
              Payment
            </span>
          </div>

          {/* 100% Secure Badge */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>100% Safe</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-4 my-8">
            <div className="w-20 h-20 bg-pink-50 text-[#FF3F6C] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-4xl">shopping_cart</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#191c1e]">Your Shopping Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Discover trending ethnic wear, sarees, shoes, and flash deals with high reseller
                margins!
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate('explorer')}
                className="bg-[#FF3F6C] hover:bg-[#e02659] text-white px-6 py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition-transform cursor-pointer"
              >
                Browse Categories ➔
              </button>
              <button
                onClick={() => onNavigate('wishlist')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-black text-xs transition-colors cursor-pointer"
              >
                View Saved Wishlist ❤️
              </button>
            </div>
          </div>
        ) : (
          /* 2-Column Responsive Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Delivery Address & Cart Items */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              {/* Delivery Address Preview Card */}
              <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="bg-pink-50 text-[#FF3F6C] p-2.5 rounded-2xl h-max flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        location_on
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-sm text-[#191c1e]">
                          Deliver to: {address.name}
                        </p>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-md">
                          {address.pincode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {address.details}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChangingAddress(true)}
                    className="text-[#FF3F6C] text-xs font-bold uppercase tracking-wider px-3.5 py-2 bg-pink-50 hover:bg-pink-100 rounded-xl cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Change
                  </button>
                </div>
              </section>

              {/* Items List Header */}
              <div className="flex items-center justify-between px-1">
                <h2 className="font-black text-base text-slate-800 tracking-tight">
                  Cart Items ({totalItemsCount})
                </h2>
                <button
                  onClick={() => onNavigate('explorer')}
                  className="text-xs font-bold text-[#FF3F6C] hover:underline cursor-pointer"
                >
                  + Add More Items
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:border-pink-200 transition-all group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                      {/* Product Thumbnail */}
                      <div
                        onClick={() => onNavigate('product')}
                        className="relative w-full sm:w-28 sm:h-36 h-48 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-[#008644] text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                          <span className="material-symbols-outlined text-[10px]">payments</span>
                          Margin ₹{item.resellMargin}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between space-y-2 sm:space-y-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3
                              onClick={() => onNavigate('product')}
                              className="font-extrabold text-sm sm:text-base text-[#191c1e] line-clamp-2 leading-snug cursor-pointer hover:text-[#FF3F6C] transition-colors"
                            >
                              {item.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                              Size: <strong className="text-slate-800">{item.size}</strong>
                            </span>
                            {item.color && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                                Color: <strong className="text-slate-800">{item.color}</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex flex-wrap items-end justify-between gap-3 pt-2">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg sm:text-xl font-black text-slate-900">
                                ₹{item.price * item.quantity}
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                ₹{item.originalPrice * item.quantity}
                              </span>
                              <span className="text-[11px] font-extrabold text-[#008644] bg-green-50 px-1.5 py-0.5 rounded">
                                {item.discount}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                              <span className="material-symbols-outlined text-xs text-emerald-600">
                                check_circle
                              </span>
                              {item.returnDays}
                            </p>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center bg-[#f2f4f6] rounded-xl p-1 gap-1 border border-slate-200/70">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="w-7 text-center text-xs font-black text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Increase quantity"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sub Action Buttons */}
                    <div className="border-t border-slate-100 flex divide-x divide-slate-100 bg-[#fafbfc]">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex-1 py-3 text-xs font-bold text-slate-600 hover:text-red-600 flex items-center justify-center gap-1.5 hover:bg-red-50/50 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                        <span>Remove</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveToWishlist(item)}
                        className="flex-1 py-3 text-xs font-bold text-slate-600 hover:text-[#FF3F6C] flex items-center justify-center gap-1.5 hover:bg-pink-50/50 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">favorite</span>
                        <span>Move to Wishlist</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-slate-100 text-center">
                <div className="p-2 space-y-1">
                  <span className="material-symbols-outlined text-2xl text-[#FF3F6C]">
                    local_shipping
                  </span>
                  <p className="text-xs font-bold text-slate-800">Free Delivery</p>
                  <p className="text-[10px] text-slate-400">On all prepaid &amp; COD</p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="material-symbols-outlined text-2xl text-emerald-600">
                    assignment_return
                  </span>
                  <p className="text-xs font-bold text-slate-800">7-Day Returns</p>
                  <p className="text-[10px] text-slate-400">Hassle-free pickups</p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="material-symbols-outlined text-2xl text-indigo-600">
                    payments
                  </span>
                  <p className="text-xs font-bold text-slate-800">Cash On Delivery</p>
                  <p className="text-[10px] text-slate-400">Pay at doorstep</p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="material-symbols-outlined text-2xl text-amber-500">
                    verified_user
                  </span>
                  <p className="text-xs font-bold text-slate-800">Lowest Price</p>
                  <p className="text-[10px] text-slate-400">Direct factory rates</p>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Price Details & Reseller Hub */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-20">
              {/* Coupon Code Box */}
              <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#FF3F6C]">
                      local_offer
                    </span>
                    Coupons &amp; Offers
                  </span>
                  {appliedCoupon && (
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Applied
                    </span>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-lg">
                        check_circle
                      </span>
                      <div>
                        <p className="text-xs font-black text-emerald-900">
                          {appliedCoupon} Applied!
                        </p>
                        <p className="text-[10px] text-emerald-700">₹{couponDiscount} Saved on this order</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter Coupon (e.g. FIRST100)"
                      className="flex-1 bg-[#f8f9fb] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="bg-[#FF3F6C] hover:bg-[#e02659] text-white px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-xs cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </section>

              {/* Price Details Card */}
              <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-extrabold text-sm sm:text-base text-[#191c1e] border-b border-slate-100 pb-3 uppercase tracking-wider">
                  Price Details ({totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'})
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Total Product MRP</span>
                    <span className="font-bold text-[#191c1e]">₹{totalMRP}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Discount on MRP</span>
                    <span className="text-[#008644] font-extrabold">
                      -₹{totalMRP - rawProductTotal}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Coupon Discount</span>
                      <span className="text-[#008644] font-extrabold">-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-600">
                    <span>Shipping Charges</span>
                    <span className="text-[#008644] font-extrabold bg-green-50 px-2 py-0.5 rounded">
                      FREE
                    </span>
                  </div>

                  <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                    <span className="font-black text-[#191c1e] text-base">Total Payable</span>
                    <span className="font-black text-2xl text-[#FF3F6C]">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Savings Pill */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2.5 text-[#006a34]">
                  <span className="material-symbols-outlined text-xl">savings</span>
                  <p className="text-xs font-bold leading-tight">
                    You are saving ₹{totalDiscount} on this order!
                  </p>
                </div>

                {/* Reseller Margin Hub */}
                <div className="bg-gradient-to-br from-indigo-50 to-pink-50 p-4 rounded-2xl border border-indigo-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-indigo-600">
                        account_balance_wallet
                      </span>
                      Your Reseller Profit
                    </span>
                    <span className="text-sm font-black text-emerald-600">
                      ₹{totalResellerEarnings}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Margin automatically transferred to your bank account after delivery.
                  </p>
                  <button
                    type="button"
                    onClick={shareCartBillOnWhatsApp}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>💬</span>
                    <span>Send Bill to Customer on WhatsApp</span>
                  </button>
                </div>

                {/* Desktop Checkout CTA */}
                <button
                  type="button"
                  onClick={() => onNavigate('address')}
                  className="w-full py-4 bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] text-white font-black text-base rounded-2xl shadow-xl shadow-pink-500/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span>Proceed to Checkout</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Edit Address Modal */}
      {isChangingAddress && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg text-[#191c1e]">Edit Delivery Address</h3>
              <button
                onClick={() => setIsChangingAddress(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={saveAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={tempAddress.name}
                  onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={tempAddress.phone}
                  onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Pincode</label>
                <input
                  type="text"
                  value={tempAddress.pincode}
                  onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value })}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Street Address &amp; House Details
                </label>
                <textarea
                  rows={3}
                  value={tempAddress.details}
                  onChange={(e) => setTempAddress({ ...tempAddress, details: e.target.value })}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingAddress(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#FF3F6C] hover:bg-[#e02659] text-white font-bold text-xs shadow-md shadow-pink-500/25 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Checkout Bar (Only on Small Screens) */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl shadow-[0_-12px_32px_rgba(0,0,0,0.08)] p-4 border-t border-slate-100 z-40">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Total Payable
              </span>
              <span className="font-black text-xl text-[#191c1e]">₹{totalAmount}</span>
            </div>
            <button
              onClick={() => onNavigate('address')}
              className="flex-1 bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] text-white h-12 rounded-2xl font-black text-sm shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>Place Order</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="cart" onNavigate={onNavigate} />
    </div>
  );
}