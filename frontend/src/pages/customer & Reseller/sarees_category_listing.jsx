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
    const msg = encodeURIComponent(
      `🛍️ *${saree.title}*\n\n` +
      `✨ *Special Price:* ₹${saree.price} (${saree.discount})\n` +
      `⭐ *Rating:* ${saree.rating} (${saree.reviews} reviews)\n` +
      `🚚 Free Delivery & Cash on Delivery Available!\n\n` +
      `👉 *View & Order Here:* ${window.location.origin}/product`
    );
    triggerToast(`Opening WhatsApp to share ${saree.title}... 🚀`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
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
      <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('explorer'))}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#FF3F6C]"
              title="Go Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span
                  onClick={() => onNavigate('reseller')}
                  className="font-black text-lg text-[#FF3F6C] cursor-pointer hidden sm:inline"
                >
                  Meesho
                </span>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-[#191c1e]">
                  Sarees Collection
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">12,400+ Trending Sarees</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('search')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191C1E]"
              title="Search"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191C1E]"
              title="Wishlist"
            >
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 hover:bg-pink-50 text-[#FF3F6C] transition-colors active:scale-95 duration-200 rounded-full cursor-pointer relative"
              title="Shopping Bag"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF3F6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sub-category Filter Chips */}
        <section className="py-2 overflow-x-auto no-scrollbar flex gap-2.5 mb-6">
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

        {/* Products Grid: 2 cols on mobile, 3 on md, 4 on lg, 5 on xl */}
        <section className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {filteredSarees.map((saree) => {
              const isFav = wishlist.has(saree.id);
              return (
                <div
                  key={saree.id}
                  onClick={() => onNavigate('product')}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-pink-200 group transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <img
                      src={saree.image}
                      alt={saree.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      onClick={(e) => toggleWishlist(e, saree.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-md cursor-pointer active:scale-90 hover:scale-110 transition-all"
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

                  <div className="p-3.5 flex flex-col flex-1 justify-between">
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

                      <div className="flex items-baseline gap-1.5 mb-2.5">
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

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {/* Margin WhatsApp button */}
                      <div
                        onClick={(e) => shareSaree(e, saree)}
                        title="Share catalog on WhatsApp"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-emerald-100"
                      >
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider">
                          Earn ₹{saree.earn}
                        </span>
                        <span className="material-symbols-outlined text-emerald-700 text-sm">
                          share
                        </span>
                      </div>

                      <button
                        onClick={(e) => addToCart(e, saree)}
                        className="w-full bg-[#FF3F6C] hover:bg-[#e02659] text-white py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 shadow-md shadow-pink-500/20 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">shopping_bag</span>
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
        <section className="mt-8">
          <div className="bg-slate-100/80 rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-black text-lg md:text-xl text-[#191c1e]">
                  Curated Saree Lookbooks
                </h4>
                <p className="text-xs md:text-sm text-slate-500">Handpicked sets for festive occasions</p>
              </div>
              <button
                onClick={() => onNavigate('spotlight')}
                className="text-[#FF3F6C] font-bold text-xs md:text-sm hover:underline cursor-pointer"
              >
                See all Lookbooks ➔
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
              {collections.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('product')}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-full aspect-[4/3] rounded-2xl bg-white shadow-sm overflow-hidden p-2 border border-slate-100 group-hover:border-pink-300 group-hover:shadow-md transition-all">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#191c1e] text-center line-clamp-1 group-hover:text-[#FF3F6C] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
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