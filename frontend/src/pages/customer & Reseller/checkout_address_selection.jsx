import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function CheckoutAddressSelection({ onNavigate = () => {}, onBack }) {
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      tag: 'Home',
      phone: '+91 98765 43210',
      addressLine: 'Flat 402, Lotus Apartments, 24th Main, Sector 15, HSR Layout',
      cityState: 'Bengaluru, Karnataka - 560102',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Rahul Varma',
      tag: 'Work',
      phone: '+91 91234 56789',
      addressLine: 'Tech Park Tower B, 4th Floor, Outer Ring Road, Marathahalli',
      cityState: 'Bengaluru, Karnataka - 560037',
      isDefault: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    tag: 'Home',
    addressLine: '',
    cityState: '',
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine) {
      triggerToast('Please fill in all address fields');
      return;
    }

    const created = {
      id: Date.now(),
      ...newAddress,
      isDefault: false,
    };

    setAddresses([...addresses, created]);
    setSelectedAddressId(created.id);
    setShowAddAddressModal(false);
    setNewAddress({ name: '', phone: '', tag: 'Home', addressLine: '', cityState: '' });
    triggerToast('New delivery address saved & selected! 📍');
  };

  const handleProceedToPayment = () => {
    onNavigate('payment');
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen font-sans antialiased selection:bg-pink-100 selection:text-pink-600 pb-36">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('cart'))}
              className="p-2 rounded-full hover:bg-slate-100 active:scale-95 text-[#FF3F6C] cursor-pointer transition-colors"
              title="Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div>
              <h1 className="text-[#191C1E] font-extrabold tracking-tight text-base sm:text-lg leading-none">
                Select Delivery Address
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Step 2 of 3 • Fast Dispatch
              </span>
            </div>
          </div>

          {/* Stepper (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
            <span
              onClick={() => onNavigate('cart')}
              className="text-[#008644] font-extrabold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span className="w-5 h-5 rounded-full bg-[#008644] text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
              Cart
            </span>
            <span>─────</span>
            <span className="text-[#FF3F6C] font-extrabold flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#FF3F6C] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              Address
            </span>
            <span>─────</span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                3
              </span>
              Payment
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>100% Safe</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Saved Addresses & Instructions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Address Selection Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400">
                  Select Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="text-xs font-bold text-[#FF3F6C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        triggerToast(`Selected address for ${addr.name}`);
                      }}
                      className={`p-5 rounded-3xl transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white ring-2 ring-[#FF3F6C] shadow-lg shadow-pink-500/10'
                          : 'bg-white hover:bg-slate-50 border border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#191c1e] text-sm md:text-base">
                              {addr.name}
                            </span>
                            <span className="bg-pink-50 text-[#FF3F6C] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                              {addr.tag}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              isSelected
                                ? 'border-[#FF3F6C] bg-[#FF3F6C]'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && (
                              <span className="material-symbols-outlined text-white text-xs">
                                check
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          {addr.addressLine}
                          <br />
                          <strong className="text-slate-700">{addr.cityState}</strong>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-slate-400">
                            call
                          </span>
                          {addr.phone}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-green-50 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add New Address Trigger Card */}
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="bg-white/80 border-2 border-dashed border-pink-300 hover:border-[#FF3F6C] p-5 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:bg-pink-50/40 transition-all cursor-pointer min-h-[160px]"
                >
                  <div className="w-11 h-11 rounded-2xl bg-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform text-[#FF3F6C]">
                    <span className="material-symbols-outlined text-2xl">add</span>
                  </div>
                  <span className="text-xs font-bold text-[#FF3F6C]">+ Add Another Address</span>
                </button>
              </div>
            </section>

            {/* Delivery Trust Badges */}
            <section className="grid grid-cols-3 gap-3 bg-white p-4 rounded-3xl border border-slate-100 text-center">
              <div className="p-2 space-y-1">
                <span className="material-symbols-outlined text-2xl text-[#FF3F6C]">
                  local_shipping
                </span>
                <p className="text-xs font-bold text-slate-800">Express Delivery</p>
                <p className="text-[10px] text-slate-400">By Tomorrow Evening</p>
              </div>
              <div className="p-2 space-y-1">
                <span className="material-symbols-outlined text-2xl text-emerald-600">
                  assignment_return
                </span>
                <p className="text-xs font-bold text-slate-800">7-Day Easy Returns</p>
                <p className="text-[10px] text-slate-400">Instant doorstep pickup</p>
              </div>
              <div className="p-2 space-y-1">
                <span className="material-symbols-outlined text-2xl text-indigo-600">
                  verified
                </span>
                <p className="text-xs font-bold text-slate-800">100% Quality Checked</p>
                <p className="text-[10px] text-slate-400">Verified factory seller</p>
              </div>
            </section>
          </div>

          {/* Right Column: Order Items & Price Details (5 cols, sticky) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            {/* Order Items Preview */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-[#191c1e] uppercase tracking-wider">
                  Order Summary (2 Items)
                </h3>
                <span
                  onClick={() => onNavigate('cart')}
                  className="text-xs font-bold text-[#FF3F6C] hover:underline cursor-pointer"
                >
                  Edit Cart ➔
                </span>
              </div>

              <div className="space-y-3">
                {/* Item 1 */}
                <div className="flex gap-3.5 pb-3 border-b border-slate-100">
                  <div className="w-16 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80"
                      alt="Embroidered Silk Saree"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                        Royal Embroidered Banarasi Silk Saree
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Qty: 1 | Size: Free Size</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900">₹850</span>
                      <span className="text-[10px] font-extrabold text-[#008644] bg-green-50 px-2 py-0.5 rounded">
                        Resell Profit: +₹150
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-3.5">
                  <div className="w-16 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80"
                      alt="Clutch"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                        Pearl Embellished Rose Gold Clutch
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Qty: 1 | Color: Rose Gold</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900">₹1,200</span>
                      <span className="text-[10px] font-extrabold text-[#008644] bg-green-50 px-2 py-0.5 rounded">
                        Resell Profit: +₹250
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Price Details Breakdown Card */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-3.5">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Price Breakdown
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Total Product Price</span>
                  <span className="font-bold text-slate-900">₹2,050</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges</span>
                  <span className="font-extrabold text-[#008644] bg-green-50 px-2 py-0.5 rounded">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Special Discount</span>
                  <span className="font-bold text-[#FF3F6C]">-₹400</span>
                </div>
                <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                  <span className="font-black text-slate-900 text-base">Total Payable</span>
                  <span className="font-black text-2xl text-[#FF3F6C]">₹1,650</span>
                </div>
              </div>

              {/* Reseller Profit Callout */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex items-center justify-between text-xs text-indigo-900 font-extrabold">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-indigo-600">
                    account_balance_wallet
                  </span>
                  Your Reseller Profit
                </span>
                <span className="text-sm text-[#008644] font-black">+₹400</span>
              </div>

              {/* Proceed CTA */}
              <button
                onClick={handleProceedToPayment}
                className="w-full py-4 bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-pink-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Proceed to Payment</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg text-slate-900">Add Delivery Address</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddNewAddress} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  House / Flat No, Building &amp; Street
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flat 402, Lotus Orchid, 24th Main"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City, State &amp; Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka - 560102"
                  value={newAddress.cityState}
                  onChange={(e) => setNewAddress({ ...newAddress, cityState: e.target.value })}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
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

      {/* Bottom Navigation */}
      <AppBottomNav activeNav="cart" onNavigate={onNavigate} />
    </div>
  );
}