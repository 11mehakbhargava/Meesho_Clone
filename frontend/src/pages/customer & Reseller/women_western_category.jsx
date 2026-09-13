import React, { useState } from 'react';

export default function WomenWesternCategory({ onNavigate = () => {}, onBack }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlist, setWishlist] = useState(new Set([2, 4]));
  const [cartCount, setCartCount] = useState(0);
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
        triggerToast('Added to Wishlist ❤️');
      }
      return next;
    });
  };

  const addToCart = (e, product) => {
    e.stopPropagation();
    setCartCount((c) => c + 1);
    triggerToast(`Added ${product.title} to Bag! 🛍️`);
  };

  const shareMargin = (e, product) => {
    e.stopPropagation();
    triggerToast(`Catalog link for ${product.title} copied to clipboard!`);
  };

  const subCategories = ['All', 'Dresses', 'Tops & Tees', 'Jeans', 'Skirts', 'Jumpsuits', 'Jackets'];

  const products = [
    {
      id: 1,
      title: 'Floral A-line Summer Dress',
      category: 'Dresses',
      price: 459,
      originalPrice: 1299,
      discount: '64% OFF',
      rating: 4.2,
      reviews: '820',
      earn: 55,
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Pastel Ribbed Crop Top',
      category: 'Tops & Tees',
      price: 299,
      originalPrice: 899,
      discount: '67% OFF',
      rating: 4.5,
      reviews: '1.4k',
      earn: 40,
      image:
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Emerald Satin Midi Skirt',
      category: 'Skirts',
      price: 680,
      originalPrice: 1999,
      discount: '66% OFF',
      rating: 4.1,
      reviews: '560',
      earn: 72,
      image:
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'High-Waist Vintage Mom Jeans',
      category: 'Jeans',
      price: 799,
      originalPrice: 2499,
      discount: '68% OFF',
      rating: 4.3,
      reviews: '2.1k',
      earn: 85,
      image:
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      title: 'Chic Structured Blazer & Short Set',
      category: 'Jackets',
      price: 1199,
      originalPrice: 3299,
      discount: '63% OFF',
      rating: 4.7,
      reviews: '340',
      earn: 160,
      image:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      title: 'Casual Ribbed Cotton Jumpsuit',
      category: 'Jumpsuits',
      price: 649,
      originalPrice: 1899,
      discount: '65% OFF',
      rating: 4.4,
      reviews: '670',
      earn: 80,
      image:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] font-sans antialiased min-h-screen selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-3 max-w-6xl mx-auto w-full justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('explorer'))}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#FF3F6C]"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-extrabold text-lg tracking-tight text-[#191c1e]">
              Women Western
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('search')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191c1e]"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191c1e]"
            >
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191c1e] relative"
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

      {/* Main Container */}
      <main className="pt-20 pb-28 max-w-6xl mx-auto px-4">
        {/* Category Filter Chips */}
        <section className="py-2 overflow-x-auto no-scrollbar flex gap-2.5 mb-4">
          {subCategories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF3F6C] text-white shadow-md shadow-pink-500/25 scale-102'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </section>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => {
            const isFav = wishlist.has(product.id);
            return (
              <div
                key={product.id}
                onClick={() => onNavigate('product')}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 group transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, product.id)}
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

                {/* Details */}
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-[#191c1e] line-clamp-1 mb-1 group-hover:text-[#FF3F6C] transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-sm md:text-base font-extrabold text-[#191c1e]">
                        ₹{product.price}
                      </span>
                      <span className="text-slate-400 text-[10px] line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-[#008644] text-[10px] font-bold uppercase tracking-tight">
                        {product.discount}
                      </span>
                    </div>
                  </div>

                  <div>
                    {/* Resell Margin Box */}
                    <div
                      onClick={(e) => shareMargin(e, product)}
                      className="bg-pink-50 hover:bg-pink-100 rounded-xl p-2 flex items-center justify-between gap-1 transition-colors cursor-pointer mb-2"
                    >
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#FF3F6C] text-xs">
                          payments
                        </span>
                        <span className="text-[9px] font-bold text-[#FF3F6C] tracking-tight">
                          Resell & Earn ₹{product.earn}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[#FF3F6C] text-xs">
                        share
                      </span>
                    </div>

                    {/* Add to Bag */}
                    <button
                      onClick={(e) => addToCart(e, product)}
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
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <button
          onClick={() => onNavigate('reseller')}
          className="flex flex-col items-center justify-center text-slate-500 hover:text-[#FF3F6C] py-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>
        <button
          onClick={() => onNavigate('explorer')}
          className="flex flex-col items-center justify-center bg-rose-50 text-[#FF3F6C] rounded-xl px-4 py-1.5 cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            category
          </span>
          <span className="text-[10px] font-bold mt-0.5">Categories</span>
        </button>
        <button
          onClick={() => onNavigate('wishlist')}
          className="flex flex-col items-center justify-center text-slate-500 hover:text-[#FF3F6C] py-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">favorite</span>
          <span className="text-[10px] font-medium mt-0.5">Wishlist</span>
        </button>
        <button
          onClick={() => onNavigate('cart')}
          className="flex flex-col items-center justify-center text-slate-500 hover:text-[#FF3F6C] py-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">shopping_bag</span>
          <span className="text-[10px] font-medium mt-0.5">Cart</span>
        </button>
      </nav>
    </div>
  );
}