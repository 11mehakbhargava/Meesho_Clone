import React, { useState } from 'react';

export default function ProductDetail({ onNavigate = () => {}, onBack }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [basePrice] = useState(1249);
  const [sellingPrice, setSellingPrice] = useState(1549);
  const [cartCount, setCartCount] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const profit = Math.max(0, sellingPrice - basePrice);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      alt: 'Model wearing premium pink floral embroidered ethnic dress',
    },
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      alt: 'Close up detail of floral fabric embroidery',
    },
    {
      url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      alt: 'Back view of the ethnic pink dress',
    },
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
    triggerToast(`Added Size ${selectedSize} to Cart! 🛒`);
  };

  const handleResell = () => {
    triggerToast(`Reseller link generated with ₹${profit} profit! Ready to share.`);
  };

  const handleBuyNow = () => {
    onNavigate('address');
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen font-sans antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-3.5 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onBack ? onBack() : onNavigate('search'))}
            className="p-1.5 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-[#191C1E] cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <span
            onClick={() => onNavigate('reseller')}
            className="font-extrabold text-lg md:text-xl tracking-tight text-[#FF3F6C] cursor-pointer"
          >
            Meesho Luxe
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('explorer')}
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#191C1E] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
          <button
            onClick={() => onNavigate('wishlist')}
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#191C1E] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">favorite</span>
          </button>
          <button
            onClick={() => onNavigate('cart')}
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#191C1E] active:scale-95 transition-all cursor-pointer relative"
          >
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#FF3F6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pb-36 max-w-4xl mx-auto px-4 pt-4 md:pt-6">
        {/* Editorial Image Gallery Carousel */}
        <section className="relative overflow-hidden bg-slate-100 rounded-3xl shadow-sm border border-slate-200/60">
          <div className="aspect-[4/5] md:aspect-[16/10] w-full overflow-hidden relative">
            <img
              src={images[selectedImageIndex].url}
              alt={images[selectedImageIndex].alt}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Image Selector Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    selectedImageIndex === idx ? 'w-6 bg-[#FF3F6C]' : 'w-2 bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Share Floating Action */}
            <button
              onClick={() => triggerToast('Product link copied! Share on WhatsApp')}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer hover:bg-white text-[#FF3F6C]"
            >
              <span className="material-symbols-outlined text-2xl">share</span>
            </button>
          </div>
        </section>

        {/* Thumbnail Preview Bar */}
        <div className="flex gap-3 mt-3 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                selectedImageIndex === idx
                  ? 'border-[#FF3F6C] shadow-md scale-102'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Product Hero Info */}
        <section className="pt-6 pb-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#006a34] font-bold text-xs tracking-wider uppercase bg-green-50 px-3 py-1 rounded-full">
              Best Seller
            </span>
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
              <span
                className="material-symbols-outlined text-amber-500 text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-xs font-extrabold text-[#191C1E]">4.2</span>
              <span className="text-[10px] text-slate-400 font-medium">(482 Reviews)</span>
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mb-2 text-[#191c1e] leading-snug">
            Royal Orchid Embroidered Banarasi Silk Kurta Set
          </h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl md:text-3xl font-extrabold text-[#191c1e]">
              ₹{basePrice}
            </span>
            <span className="text-base text-slate-400 line-through">₹2,499</span>
            <span className="text-[#FF3F6C] font-extrabold text-sm md:text-base">50% OFF</span>
          </div>

          {/* Interactive Reseller Margin Feature */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border-2 border-dashed border-indigo-200 rounded-3xl p-5 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-700 text-2xl">
                  payments
                </span>
                <h3 className="font-bold text-indigo-950 text-sm md:text-base">
                  Reseller Profit Margin Calculator
                </h3>
              </div>
              <span className="text-[11px] text-indigo-700 font-bold bg-indigo-100/80 px-2.5 py-1 rounded-lg">
                Reseller Dashboard
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Enter the final price you will quote to your customer. Your profit is calculated automatically!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="bg-white rounded-2xl p-3 border border-indigo-100 shadow-sm">
                <label className="text-[10px] text-indigo-900/60 uppercase font-bold block mb-1">
                  Your Selling Price (₹)
                </label>
                <div className="relative flex items-center">
                  <span className="text-indigo-900 font-bold text-lg mr-1">₹</span>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    min={basePrice}
                    className="w-full font-extrabold text-lg text-indigo-900 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-indigo-100 shadow-sm text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Base Meesho Cost
                </span>
                <span className="text-lg font-bold text-slate-600">₹{basePrice}</span>
              </div>

              <div className="bg-indigo-600 text-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-[10px] uppercase font-bold text-indigo-100 tracking-wider">
                  Your Net Profit
                </span>
                <span className="text-2xl font-black">₹{profit}</span>
              </div>
            </div>
          </div>

          {/* Select Size Bento */}
          <div className="mb-6 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm md:text-base text-[#191c1e]">Select Size</h3>
              <button
                onClick={() => triggerToast('Size Chart: Standard Indian Fit (S:36, M:38, L:40, XL:42)')}
                className="text-[#FF3F6C] text-xs font-bold hover:underline cursor-pointer"
              >
                Size Chart 📏
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF3F6C] text-white shadow-md shadow-pink-500/25 scale-102'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm mb-6">
            <h3 className="font-extrabold text-base text-[#191c1e] mb-4">Product Specifications</h3>
            <div className="grid grid-cols-2 gap-y-3.5 text-xs md:text-sm">
              <div className="text-slate-400 font-medium">Fabric</div>
              <div className="font-bold text-[#191c1e]">Pure Banarasi Art Silk</div>
              <div className="text-slate-400 font-medium">Pattern</div>
              <div className="font-bold text-[#191c1e]">Floral Embroidered Zari</div>
              <div className="text-slate-400 font-medium">Sleeve Length</div>
              <div className="font-bold text-[#191c1e]">Three-Quarter Sleeves</div>
              <div className="text-slate-400 font-medium">Neck Design</div>
              <div className="font-bold text-[#191c1e]">Mandarin Collar with Placket</div>
            </div>
            <p className="mt-5 pt-4 border-t border-slate-100 text-xs md:text-sm leading-relaxed text-slate-600">
              Elevate your ethnic wardrobe with this exquisitely crafted Royal Orchid Kurta Set. Perfect for festive occasions and wedding celebrations, this piece features intricate zari work and a luxurious silk blend fabric that ensures both comfort and elegance.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-slate-100 mb-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#006a34]">
                <span className="material-symbols-outlined text-xl">replay</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700">
                7 Days Return
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#006a34]">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700">
                Free Delivery
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#006a34]">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700">
                Quality Check
              </span>
            </div>
          </div>

          {/* Reviews Preview */}
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#191c1e]">User Reviews (482)</h3>
                <p className="text-xs text-slate-400">92% of customers recommend this product</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('write_review')}
                  className="text-xs font-bold text-white bg-[#b90041] hover:bg-[#df2457] px-3 py-1.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  Rate Product ⭐
                </button>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="text-[#FF3F6C] text-xs font-bold hover:underline cursor-pointer"
                >
                  See All ➔
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-pink-100 text-[#FF3F6C] font-bold flex items-center justify-center text-xs">
                  PS
                </div>
                <div>
                  <span className="text-xs font-bold text-[#191c1e]">Priya Sharma</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-emerald-600 font-bold">Verified Buyer</span>
                    <span className="text-[10px] text-slate-400">• 2 days ago</span>
                  </div>
                </div>
                <div className="ml-auto flex text-amber-400 text-xs">
                  ★★★★★
                </div>
              </div>
              <p className="text-xs text-slate-600 italic">
                "Fabric quality is beyond expectations! The color is exactly as shown in photos. My boutique customers loved it."
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-3 border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex items-center gap-2 md:gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 border-2 border-slate-300 hover:border-[#FF3F6C] text-slate-800 hover:text-[#FF3F6C] rounded-2xl py-3 font-extrabold text-xs md:text-sm active:scale-95 transition-all cursor-pointer bg-white"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleResell}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 rounded-2xl py-3 font-extrabold text-xs md:text-sm shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">share</span>
            <span>Resell (₹{profit})</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1.2 bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] text-white flex items-center justify-center gap-1.5 rounded-2xl py-3 font-extrabold text-xs md:text-sm shadow-lg shadow-pink-500/30 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-lg">bolt</span>
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}