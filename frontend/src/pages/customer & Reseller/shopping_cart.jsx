import React, { useState } from 'react';

export default function ShoppingCart({ onNavigate = () => {}, onBack }) {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Elegant Embroidered Rayon Kurta Set',
      size: 'M',
      price: 459,
      originalPrice: 899,
      discount: '48% OFF',
      quantity: 1,
      resellMargin: 45,
      returnDays: '7 days easy returns',
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Pro-Flex Lightweight Running Sneakers',
      size: '9 UK',
      price: 799,
      originalPrice: 1499,
      discount: '46% OFF',
      quantity: 1,
      resellMargin: 62,
      deliveryTime: 'Delivery by Tomorrow',
      image:
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80',
    },
  ]);

  const [address, setAddress] = useState({
    name: 'Rahul Sharma',
    pincode: '560103',
    details: 'HSR Layout, Sector 7, 24th Main, near Star Market, Bengaluru',
  });

  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    triggerToast('Item removed from Cart');
  };

  const moveToWishlist = (item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    triggerToast(`Moved "${item.title}" to Wishlist ❤️`);
  };

  const totalMRP = items.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = totalMRP - totalAmount;
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      triggerToast('Cart is empty! Add items first.');
      return;
    }
    onNavigate('address');
  };

  const saveAddress = (e) => {
    e.preventDefault();
    setAddress(tempAddress);
    setIsChangingAddress(false);
    triggerToast('Delivery address updated! 📍');
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] font-sans antialiased min-h-screen pb-36 selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 md:px-8 h-16 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('reseller'))}
              className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 text-[#191C1E] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-extrabold text-lg tracking-tight text-[#191C1E]">
              Shopping Cart & Checkout
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>100% Secure</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 px-4 max-w-3xl mx-auto space-y-5">
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
                <p className="font-extrabold text-sm text-[#191c1e]">
                  Deliver to: {address.name}, {address.pincode}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{address.details}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('address')}
              className="text-[#FF3F6C] text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-pink-50 hover:bg-pink-100 rounded-xl cursor-pointer transition-colors"
            >
              Change
            </button>
          </div>
        </section>

        {/* Change Address Modal */}
        {isChangingAddress && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-lg text-[#191c1e]">Edit Delivery Address</h3>
                <button
                  onClick={() => setIsChangingAddress(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
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
                    Street Address & Landmark
                  </label>
                  <textarea
                    rows={3}
                    value={tempAddress.details}
                    onChange={(e) => setTempAddress({ ...tempAddress, details: e.target.value })}
                    className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
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

        {/* Product Items List */}
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col"
              >
                <div className="p-4 flex gap-4">
                  {/* Thumbnail & Resell Margin */}
                  <div
                    onClick={() => onNavigate('product')}
                    className="relative w-24 h-32 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 cursor-pointer group"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#008644] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-[10px]">payments</span>
                      Earn ₹{item.resellMargin}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h3
                        onClick={() => onNavigate('product')}
                        className="font-extrabold text-sm text-[#191c1e] line-clamp-1 leading-snug cursor-pointer hover:text-[#FF3F6C]"
                      >
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Size: <span className="text-slate-700 font-bold">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-2 mt-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base md:text-lg font-extrabold text-[#191c1e]">
                            ₹{item.price * item.quantity}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{item.originalPrice * item.quantity}
                          </span>
                          <span className="text-[10px] font-bold text-[#008644] bg-green-50 px-1 py-0.5 rounded">
                            {item.discount}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-xs text-slate-500">
                            verified
                          </span>
                          {item.returnDays || item.deliveryTime}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#f2f4f6] rounded-xl p-1 gap-1 border border-slate-200/60">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
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
                    onClick={() => removeItem(item.id)}
                    className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:text-red-600 flex items-center justify-center gap-1.5 hover:bg-red-50/50 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    <span>Remove</span>
                  </button>
                  <button
                    onClick={() => moveToWishlist(item)}
                    className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:text-[#FF3F6C] flex items-center justify-center gap-1.5 hover:bg-pink-50/50 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">favorite</span>
                    <span>Wishlist</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 text-[#FF3F6C] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">shopping_cart</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#191c1e] mb-1">Your Cart is Empty</h3>
            <p className="text-xs text-slate-500 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={() => onNavigate('explorer')}
              className="bg-[#FF3F6C] text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition-transform cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Real-time Price Details Breakdown */}
        {items.length > 0 && (
          <section className="bg-white rounded-3xl p-5 md:p-6 space-y-4 shadow-sm border border-slate-100">
            <h2 className="font-extrabold text-sm md:text-base text-[#191c1e] border-b border-slate-100 pb-3 uppercase tracking-wider">
              Price Details ({totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'})
            </h2>
            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>Total MRP</span>
                <span className="font-bold text-[#191c1e]">₹{totalMRP}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Discount on MRP</span>
                <span className="text-[#008644] font-extrabold">-₹{totalDiscount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Shipping Charges</span>
                <span className="text-[#008644] font-extrabold bg-green-50 px-2 py-0.5 rounded">
                  FREE
                </span>
              </div>
              <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                <span className="font-black text-[#191c1e] text-base">Total Amount</span>
                <span className="font-black text-xl text-[#FF3F6C]">₹{totalAmount}</span>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2.5 text-[#006a34]">
              <span className="material-symbols-outlined text-xl">savings</span>
              <p className="text-xs font-bold leading-tight">
                Yay! You are saving ₹{totalDiscount} on this order.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Order Placed Success Modal */}
      {isOrderPlaced && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-green-100 text-[#008644] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-2xl font-black text-[#191c1e] mb-1">Order Placed! 🎉</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Your order has been confirmed and will be delivered to{' '}
              <span className="font-bold text-slate-800">{address.name}</span> by tomorrow evening!
            </p>
            <div className="bg-pink-50 rounded-2xl p-3 mb-5 text-xs text-[#FF3F6C] font-extrabold">
              Reseller Margin of ₹{items.reduce((a, b) => a + b.resellMargin * b.quantity, 0)} will be credited upon delivery!
            </div>
            <button
              onClick={() => {
                setIsOrderPlaced(false);
                setItems([]);
                onNavigate('reseller');
              }}
              className="w-full bg-[#FF3F6C] text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-pink-500/30 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl shadow-[0_-12px_32px_rgba(0,0,0,0.08)] p-4 border-t border-slate-100 z-40">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Total Payable
              </span>
              <span className="font-black text-xl md:text-2xl text-[#191c1e]">₹{totalAmount}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="flex-1 bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] text-white h-13 md:h-14 rounded-2xl font-black text-sm md:text-base shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>Place Order</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}