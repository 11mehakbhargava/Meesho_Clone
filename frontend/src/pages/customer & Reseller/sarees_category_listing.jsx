import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function SareesCategoryListing({ onNavigate = () => {}, onBack }) {
  const [selectedSubcat, setSelectedSubcat] = useState('All');
  const [wishlist, setWishlist] = useState(new Set([1]));
  const [cartCount, setCartCount] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const toggleWishlist = (e, id) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        triggerToast('Removed from favorites');
      } else {
        next.add(id);
        triggerToast('Saved to Wishlist ❤️');
      }
      return next;
    });
  };

  const addToCart = (e, saree) => {
    e.stopPropagation();
    setCartCount((c) => c + 1);
    triggerToast(`Added ${saree.title} to Bag! 🛍️`);
  };

  const shareSaree = (e, saree) => {
    e.stopPropagation();
    triggerToast(`Catalog link for ${saree.title} ready to share!`);
  };

  const subcategories = ['All', 'Silk', 'Cotton', 'Party Wear', 'Designer', 'Daily Wear'];

  const sarees = [
    {
      id: 1,
      title: 'Classic Banarasi Silk Saree',
      category: 'Silk',
      price: 1899,
      originalPrice: 3450,
      discount: '45% OFF',
      rating: 4.5,
      reviews: '1.2k',
      earn: 240,
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Blush Designer Georgette',
      category: 'Designer',
      price: 2450,
      originalPrice: 4999,
      discount: '51% OFF',
      rating: 4.2,
      reviews: '850',
      earn: 310,
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Yellow Floral Handblock Cotton',
      category: 'Cotton',
      price: 999,
      originalPrice: 1999,
      discount: '50% OFF',
      rating: 4.8,
      reviews: '430',
      earn: 120,
      image:
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Emerald Kanjeevaram Gold Zari',
      category: 'Silk',
      price: 3299,
      originalPrice: 5999,
      discount: '45% OFF',
      rating: 4.9,
      reviews: '2.5k',
      earn: 450,
      image:
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      title: 'Ruffle Tiered Party Wear Saree',
      category: 'Party Wear',
      price: 1699,
      originalPrice: 3299,
      discount: '48% OFF',
      rating: 4.4,
      reviews: '910',
      earn: 210,
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      title: 'Pastel Chiffon Daily Elegance',
      category: 'Daily Wear',
      price: 799,
      originalPrice: 1599,
      discount: '50% OFF',
      rating: 4.6,
      reviews: '1.4k',
      earn: 95,
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const filteredSarees = sarees.filter((s) => {
    if (selectedSubcat === 'All') return true;
    return s.category === selectedSubcat;
  });

  const collections = [
    {
      name: 'Bridal Silk',
      tag: 'Heavy Zari',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Chiffon Drapes',
      tag: 'Lightweight',
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Handloom Pure',
      tag: 'Artisanal',
      image:
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] font-sans min-h-screen antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex justify-between items-center px-4 h-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('explorer'))}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#FF3F6C]"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-[#191c1e]">
                Sarees Collection
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">12,400+ Trending Sarees</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('search')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191C1E]"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191C1E]"
            >
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191C1E] relative"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF3F6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 pb-28 max-w-6xl mx-auto">
        {/* Sub-category Filter Chips */}
        <section className="py-2 overflow-x-auto no-scrollbar flex gap-2.5 px-4 mb-3">
          {subcategories.map((subcat) => {
            const isActive = selectedSubcat === subcat;
            return (
              <button
                key={subcat}
                onClick={() => setSelectedSubcat(subcat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF3F6C] text-white shadow-md shadow-pink-500/25 scale-102'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {subcat}
              </button>
            );
          })}
        </section>

        {/* Products Grid */}
        <section className="px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredSarees.map((saree) => {
              const isFav = wishlist.has(saree.id);
              return (
                <div
                  key={saree.id}
                  onClick={() => onNavigate('product')}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 group transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <img
                      src={saree.image}
                      alt={saree.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => toggleWishlist(e, saree.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/85 backdrop-blur-md rounded-full shadow-sm cursor-pointer active:scale-90 hover:scale-105 transition-all"
                    >
                      <span
                        className={`material-symbols-outlined text-lg ${
                          isFav ? 'text-[#FF3F6C]' : 'text-slate-400'
                        }`}
                        style={isFav ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xs md:text-sm font-bold text-[#191C1E] line-clamp-1 mb-1 group-hover:text-[#FF3F6C] transition-colors">
                        {saree.title}
                      </h3>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="flex items-center text-[10px] font-extrabold bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md">
                          {saree.rating}
                          <span
                            className="material-symbols-outlined text-[11px] ml-0.5"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">({saree.reviews})</span>
                      </div>

                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-sm md:text-base font-extrabold text-[#191C1E]">
                          ₹{saree.price}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{saree.originalPrice}
                        </span>
                        <span className="text-[10px] font-bold text-[#FF3F6C]">
                          {saree.discount}
                        </span>
                      </div>
                    </div>

                    <div>
                      {/* Margin badge */}
                      <div
                        onClick={(e) => shareSaree(e, saree)}
                        className="bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors mb-2"
                      >
                        <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-wider">
                          Earn ₹{saree.earn}
                        </span>
                        <span className="material-symbols-outlined text-indigo-700 text-xs">
                          share
                        </span>
                      </div>

                      <button
                        onClick={(e) => addToCart(e, saree)}
                        className="w-full bg-[#FF3F6C] hover:bg-[#e02659] text-white py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Curated Collections Section */}
        <section className="mt-8 px-4">
          <div className="bg-slate-100 rounded-3xl p-5 border border-slate-200/60">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-extrabold text-base text-[#191c1e]">
                  Curated Saree Lookbooks
                </h4>
                <p className="text-xs text-slate-500">Handpicked sets for festive occasions</p>
              </div>
              <button
                onClick={() => onNavigate('spotlight')}
                className="text-[#FF3F6C] font-bold text-xs hover:underline cursor-pointer"
              >
                See all ➔
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {collections.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('product')}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-2xl bg-white shadow-sm overflow-hidden p-1.5 border border-slate-100 group-hover:border-pink-300 transition-all">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#191c1e] text-center line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="categories" onNavigate={onNavigate} />
    </div>
  );
}