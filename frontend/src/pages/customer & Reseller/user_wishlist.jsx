import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function UserWishlist({ onNavigate = () => {}, onBack }) {
  const [cartCount, setCartCount] = useState(2);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: 'Urban Street Relaxed Hoodie',
      price: 1249,
      originalPrice: 2499,
      discount: '50% OFF',
      rating: '4.2',
      shared: '500+ shared',
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Vegan Leather Structured Tote',
      price: 899,
      originalPrice: 1999,
      discount: '55% OFF',
      rating: '4.8',
      shared: '1.2k shared',
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Minimalist Floral Silk Scarf',
      price: 450,
      originalPrice: 999,
      discount: '54% OFF',
      rating: '4.5',
      shared: '200 shared',
      image:
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Vintage Retro Graphic Tee',
      price: 599,
      originalPrice: 1199,
      discount: '50% OFF',
      rating: '4.9',
      shared: '3.4k shared',
      image:
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      title: 'Classic Tapered Denim Jeans',
      price: 1699,
      originalPrice: 3299,
      discount: '48% OFF',
      rating: '4.0',
      shared: '800+ shared',
      image:
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    },
  ]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleRemove = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    triggerToast('Item removed from Wishlist');
  };

  const handleMoveToCart = (item) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
    setCartCount((c) => c + 1);
    triggerToast(`Moved "${item.title}" to Cart! 🛒`);
  };

  const handleClearAll = () => {
    setWishlistItems([]);
    triggerToast('All wishlist items cleared');
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen font-sans antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex justify-between items-center px-4 md:px-8 py-3.5 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('reseller'))}
              className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 text-[#191C1E] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-extrabold text-lg tracking-tight text-[#191C1E]">My Wishlist</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('explorer')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#191C1E] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#FF3F6C] cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF3F6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 pb-32 px-4 max-w-5xl mx-auto">
        {/* Header Summary */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1">
              Your Curated Collection
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#191c1e]">
              Saved Styles{' '}
              <span className="text-[#FF3F6C] font-extrabold">({wishlistItems.length})</span>
            </h2>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-[#FF3F6C] hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('product')}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 cursor-pointer"
              >
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-red-500 active:scale-90 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm font-bold">close</span>
                </button>

                {/* Product Image */}
                <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-0.5 rounded-md">
                    {item.shared}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-3.5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-xs md:text-sm text-[#191c1e] line-clamp-1 pr-1">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-extrabold text-[#006a34] bg-green-50 px-1.5 py-0.5 rounded-md">
                        {item.rating} ★
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-sm md:text-base font-extrabold text-[#191c1e]">
                        ₹{item.price}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-[#FF3F6C]">
                        {item.discount}
                      </span>
                    </div>
                  </div>

                  {/* Move to Cart CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToCart(item);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-md shadow-pink-500/20 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">shopping_bag</span>
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}

            {/* Explore More Card */}
            <div
              onClick={() => onNavigate('explorer')}
              className="flex flex-col items-center justify-center bg-pink-50/50 border-2 border-dashed border-pink-200 rounded-2xl min-h-[260px] text-center p-5 cursor-pointer hover:bg-pink-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-[#FF3F6C]">
                <span className="material-symbols-outlined text-2xl">add</span>
              </div>
              <h3 className="font-extrabold text-sm text-[#191c1e] mb-1">Find More Styles</h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Explore trending catalog to save more styles.
              </p>
              <button
                onClick={() => onNavigate('explorer')}
                className="px-4 py-1.5 bg-[#FF3F6C] text-white text-xs font-bold rounded-full shadow-sm cursor-pointer"
              >
                Browse Shop
              </button>
            </div>
          </div>
        ) : (
          /* Empty Wishlist State */
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-pink-50 text-[#FF3F6C] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">favorite_border</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#191c1e] mb-2">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Explore our vast collection and tap the heart icon on items you love to save them here!
            </p>
            <button
              onClick={() => onNavigate('explorer')}
              className="bg-[#FF3F6C] text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition-transform cursor-pointer"
            >
              Explore Trending Now
            </button>
          </div>
        )}

        {/* Reseller Social Proof Banner */}
        <section className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
                Reseller Opportunity
              </span>
              <h4 className="text-lg md:text-xl font-black mt-1 mb-1">
                Resell these favorites?
              </h4>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Share your curated wishlist catalog with your WhatsApp customers and earn up to{' '}
                <span className="text-pink-300 font-bold">₹2,500</span> margin!
              </p>
            </div>
            <button
              onClick={() => triggerToast('Wishlist catalog shared to WhatsApp!')}
              className="whitespace-nowrap px-5 py-3 bg-white text-indigo-900 font-extrabold text-xs rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center gap-2 cursor-pointer hover:bg-pink-50"
            >
              <span className="material-symbols-outlined text-base text-[#FF3F6C]">share</span>
              <span>Share & Earn</span>
            </button>
          </div>
        </section>
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />
    </div>
  );
}