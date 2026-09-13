import React, { useState } from 'react';

export default function CheckoutAddressSelection({ onNavigate = () => {}, onBack }) {
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      tag: 'Home',
      phone: '+91 98765 43210',
      addressLine: 'House No. 42, Lotus Apartments, Sector 15, HSR Layout',
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

  const handlePlaceOrder = () => {
    onNavigate('payment');
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return (
    <div className="bg-[#fff4f6] text-[#4a2135] min-h-screen font-sans antialiased selection:bg-pink-100 selection:text-pink-600 pb-36">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-8 h-16 max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('cart'))}
              className="p-1.5 rounded-full hover:bg-pink-50 active:scale-95 text-[#b7004d] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="text-[#b7004d] font-extrabold tracking-tight text-lg">
              Address & Checkout
            </h1>
          </div>
          <div className="text-xs font-black uppercase tracking-wider bg-pink-100 text-[#b7004d] px-3 py-1 rounded-full">
            Step 2 of 3
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {/* Address Selection Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#7d4d62]">
              Select Delivery Address
            </h2>
            <span className="text-xs font-semibold text-[#b7004d]">
              {addresses.length} Saved Addresses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-5 rounded-3xl transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white ring-2 ring-[#b7004d] shadow-lg shadow-pink-500/10'
                      : 'bg-white/80 hover:bg-white border border-pink-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#4a2135] text-sm">{addr.name}</span>
                      <span className="bg-pink-50 text-[#b7004d] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        {addr.tag}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        isSelected ? 'border-[#b7004d] bg-[#b7004d]' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-white text-xs">check</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#7d4d62] leading-relaxed mb-2">
                    {addr.addressLine}
                    <br />
                    {addr.cityState}
                  </p>

                  <p className="text-xs font-bold text-[#4a2135] pt-1">{addr.phone}</p>
                </div>
              );
            })}

            {/* Add New Address Trigger */}
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="bg-white/60 border-2 border-dashed border-pink-300 hover:border-[#b7004d] p-5 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:bg-white transition-all cursor-pointer min-h-[140px]"
            >
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform text-[#b7004d]">
                <span className="material-symbols-outlined text-xl">add</span>
              </div>
              <span className="text-xs font-bold text-[#b7004d]">Add New Address</span>
            </button>
          </div>
        </section>

        {/* Order Summary Section */}
        <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pink-100">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#7d4d62] mb-4">
            Items in Order
          </h2>
          <div className="space-y-4">
            {/* Item 1 */}
            <div className="flex gap-3.5 pb-4 border-b border-pink-50">
              <div className="w-20 h-24 rounded-2xl overflow-hidden bg-pink-50 flex-shrink-0 border border-pink-100">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80"
                  alt="Embroidered Silk Saree"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="font-bold text-xs md:text-sm text-[#4a2135] line-clamp-1 leading-snug">
                    Royal Embroidered Banarasi Silk Saree
                  </h3>
                  <p className="text-[11px] text-[#7d4d62] mt-0.5">Qty: 1 | Size: Free Size</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#4a2135]">₹850</span>
                  <span className="text-[10px] font-bold text-[#006a34] bg-green-50 px-2 py-0.5 rounded-md">
                    Reseller Profit: +₹150
                  </span>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-3.5">
              <div className="w-20 h-24 rounded-2xl overflow-hidden bg-pink-50 flex-shrink-0 border border-pink-100">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80"
                  alt="Pearl Embellished Clutch"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="font-bold text-xs md:text-sm text-[#4a2135] line-clamp-1 leading-snug">
                    Pearl Embellished Rose Gold Clutch
                  </h3>
                  <p className="text-[11px] text-[#7d4d62] mt-0.5">Qty: 1 | Color: Rose Gold</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#4a2135]">₹1,200</span>
                  <span className="text-[10px] font-bold text-[#006a34] bg-green-50 px-2 py-0.5 rounded-md">
                    Reseller Profit: +₹250
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Selection */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#7d4d62]">
            Payment Method
          </h2>
          <div className="space-y-2.5">
            {/* COD */}
            <div
              onClick={() => setSelectedPayment('cod')}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                selectedPayment === 'cod'
                  ? 'bg-white ring-2 ring-[#b7004d] shadow-sm'
                  : 'bg-white/80 border border-pink-100 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-[#b7004d]">
                  <span className="material-symbols-outlined text-lg">payments</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs md:text-sm text-[#4a2135]">
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-pink-100 text-[#b7004d] text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Popular
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7d4d62]">Pay cash when you receive parcel</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'cod' ? 'border-[#b7004d] bg-[#b7004d]' : 'border-slate-300'
                }`}
              >
                {selectedPayment === 'cod' && (
                  <span className="material-symbols-outlined text-white text-xs">check</span>
                )}
              </div>
            </div>

            {/* UPI */}
            <div
              onClick={() => setSelectedPayment('upi')}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                selectedPayment === 'upi'
                  ? 'bg-white ring-2 ring-[#b7004d] shadow-sm'
                  : 'bg-white/80 border border-pink-100 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <span className="material-symbols-outlined text-lg">qr_code_2</span>
                </div>
                <div>
                  <span className="font-bold text-xs md:text-sm text-[#4a2135]">
                    UPI (Google Pay, PhonePe, Paytm)
                  </span>
                  <p className="text-[11px] text-[#7d4d62]">Instant & seamless UPI payment</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'upi' ? 'border-[#b7004d] bg-[#b7004d]' : 'border-slate-300'
                }`}
              >
                {selectedPayment === 'upi' && (
                  <span className="material-symbols-outlined text-white text-xs">check</span>
                )}
              </div>
            </div>

            {/* Cards */}
            <div
              onClick={() => setSelectedPayment('card')}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                selectedPayment === 'card'
                  ? 'bg-white ring-2 ring-[#b7004d] shadow-sm'
                  : 'bg-white/80 border border-pink-100 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <span className="material-symbols-outlined text-lg">credit_card</span>
                </div>
                <div>
                  <span className="font-bold text-xs md:text-sm text-[#4a2135]">
                    Credit / Debit Card
                  </span>
                  <p className="text-[11px] text-[#7d4d62]">Visa, Mastercard, RuPay</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'card' ? 'border-[#b7004d] bg-[#b7004d]' : 'border-slate-300'
                }`}
              >
                {selectedPayment === 'card' && (
                  <span className="material-symbols-outlined text-white text-xs">check</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Price Details Breakdown */}
        <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-pink-100 space-y-3">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#7d4d62]">Price Details</h2>
          <div className="space-y-2.5 text-xs md:text-sm">
            <div className="flex justify-between text-[#7d4d62]">
              <span>Order Total (2 Items)</span>
              <span className="font-bold text-[#4a2135]">₹2,050</span>
            </div>
            <div className="flex justify-between text-[#7d4d62]">
              <span>Delivery Charges</span>
              <span className="font-extrabold text-[#006a34]">FREE</span>
            </div>
            <div className="flex justify-between text-[#7d4d62]">
              <span>Platform Special Discount</span>
              <span className="font-bold text-[#b7004d]">-₹400</span>
            </div>
            <div className="pt-3 border-t border-pink-100 flex justify-between items-center">
              <span className="font-bold text-[#4a2135] text-base">Final Payable</span>
              <span className="font-black text-xl text-[#b7004d]">₹1,650</span>
            </div>
          </div>
        </section>
      </main>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base text-[#4a2135]">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddNewAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#7d4d62] block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full bg-[#fff4f6] border border-pink-200 rounded-xl p-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b7004d]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7d4d62] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full bg-[#fff4f6] border border-pink-200 rounded-xl p-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b7004d]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7d4d62] block mb-1">Address Line</label>
                <input
                  type="text"
                  placeholder="House No, Building, Street / Sector"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  className="w-full bg-[#fff4f6] border border-pink-200 rounded-xl p-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b7004d]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7d4d62] block mb-1">City, State & Pincode</label>
                <input
                  type="text"
                  placeholder="Bengaluru, Karnataka - 560102"
                  value={newAddress.cityState}
                  onChange={(e) => setNewAddress({ ...newAddress, cityState: e.target.value })}
                  className="w-full bg-[#fff4f6] border border-pink-200 rounded-xl p-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b7004d]"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 py-3 rounded-xl border border-pink-200 font-bold text-xs text-[#7d4d62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#b7004d] text-white font-bold text-xs shadow-md shadow-pink-500/25"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {isOrderPlaced && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center shadow-2xl border border-pink-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 text-[#008644] rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="text-xl font-black text-[#4a2135] mb-1">Order Confirmed! 🎉</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Delivering to <span className="font-bold text-[#4a2135]">{selectedAddress.name}</span> with payment method{' '}
              <span className="font-bold text-[#b7004d] uppercase">{selectedPayment}</span>.
            </p>
            <div className="bg-pink-50 rounded-2xl p-2.5 mb-4 text-xs text-[#b7004d] font-bold">
              Total Reseller Margin: +₹400 credited to wallet
            </div>
            <button
              onClick={() => {
                setIsOrderPlaced(false);
                onNavigate('reseller');
              }}
              className="w-full bg-[#b7004d] text-white py-3 rounded-2xl font-bold text-xs shadow-md shadow-pink-500/30 cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-xl border-t border-pink-100 px-4 md:px-8 py-3.5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7d4d62]">
              Total Payable
            </span>
            <span className="text-xl md:text-2xl font-black text-[#4a2135]">₹1,650</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="flex-1 max-w-[240px] h-12 md:h-13 bg-gradient-to-r from-[#b7004d] to-[#ff4d80] text-white font-extrabold text-sm md:text-base rounded-2xl shadow-lg shadow-pink-500/30 active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Place Order</span>
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}