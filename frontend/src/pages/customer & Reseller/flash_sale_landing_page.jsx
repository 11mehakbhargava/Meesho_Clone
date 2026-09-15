import React, { useState, useEffect } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function FlashSaleLandingPage({ onNavigate = () => {}, onBack }) {
  const [activeFilter, setActiveFilter] = useState('All Deals');
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 15 });

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  const filterTabs = ['All Deals', 'Clothing', 'Footwear', 'Accessories'];

  const products = [
    {
      id: 1,
      title: 'Aurelia Silk Wrap Dress',
      category: 'Clothing',
      price: 459,
      originalPrice: 1299,
      margin: 120,
      stockTag: 'Only 5 left',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Urban Glide Sneakers',
      category: 'Footwear',
      price: 899,
      originalPrice: 2499,
      margin: 240,
      stockTag: 'Selling Fast',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Midi Leather Satchel',
      category: 'Accessories',
      price: 1249,
      originalPrice: 3999,
      margin: 350,
      image:
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Aviator Classic Gold',
      category: 'Accessories',
      price: 329,
      originalPrice: 999,
      margin: 85,
      stockTag: 'Only 2 left',
      image:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const filteredProducts =
    activeFilter === 'All Deals'
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-[#f8f9fb] min-h-screen font-sans text-[#191c1e] antialiased selection:bg-pink-100 selection:text-pink-700">
      {/* TopAppBar */}
      <header className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('reseller'))}
              className="hover:opacity-80 transition-opacity active:scale-95 text-[#FF3F6C] cursor-pointer"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1
              onClick={() => onNavigate('reseller')}
              className="font-extrabold text-lg text-[#FF3F6C] tracking-tight cursor-pointer"
            >
              ⚡ Flash Sale Drops
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('wishlist')}
              className="hover:opacity-80 transition-opacity active:scale-95 text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="hover:opacity-80 transition-opacity active:scale-95 text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-28 max-w-7xl mx-auto">
        {/* Hero Section with Live Countdown */}
        <section className="px-4 py-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-r from-[#b90041] via-[#df2457] to-[#675df9] text-white shadow-xl min-h-64 flex flex-col justify-center px-6 sm:px-10 py-8">
            <div className="relative z-10 max-w-lg space-y-3">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                Limited Time Offer
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                Flash Sale <br />
                <span className="text-yellow-300">Up to 70% Off</span>
              </h2>

              {/* Ticking Countdown Timer */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs sm:text-sm font-medium opacity-90">Ends in:</span>
                <div className="flex gap-2">
                  <div className="bg-white text-[#b90041] px-2.5 py-1 rounded-xl font-black text-base sm:text-lg shadow-xs">
                    {formatNumber(timeLeft.hours)}h
                  </div>
                  <div className="bg-white text-[#b90041] px-2.5 py-1 rounded-xl font-black text-base sm:text-lg shadow-xs">
                    {formatNumber(timeLeft.minutes)}m
                  </div>
                  <div className="bg-white text-[#b90041] px-2.5 py-1 rounded-xl font-black text-base sm:text-lg shadow-xs">
                    {formatNumber(timeLeft.seconds)}s
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-4 bottom-2 opacity-30 sm:opacity-90 select-none text-8xl md:text-9xl pointer-events-none">
              ⚡
            </div>
          </div>
        </section>

        {/* Filters Divider */}
        <div className="px-4 mb-6 flex gap-3 overflow-x-auto no-scrollbar py-2">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#b90041] text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <section className="px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onNavigate('product')}
                className="flex flex-col group justify-between cursor-pointer"
              >
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-3 bg-[#e7e8ea] shadow-xs">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#b90041] text-white text-[10px] font-bold rounded-md shadow-xs">
                    Flash Deal
                  </div>
                  {product.stockTag && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/95 backdrop-blur-md text-[#ba1a1a] text-[10px] font-bold rounded-md shadow-xs">
                      {product.stockTag}
                    </div>
                  )}
                </div>

                <div className="px-1 space-y-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#FF3F6C] transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-base sm:text-lg font-black text-gray-900">
                      ₹{product.price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </div>

                  {/* Resell Margin Tag */}
                  <div className="bg-[#4d41df]/10 py-1.5 px-3 rounded-xl flex items-center justify-between group-hover:bg-[#4d41df]/20 transition-colors cursor-pointer">
                    <span className="text-[10px] font-bold text-[#4d41df] uppercase tracking-wider">
                      Resell &amp; Earn
                    </span>
                    <span className="text-xs font-bold text-[#4d41df]">
                      ₹{product.margin}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />
    </div>
  );
}