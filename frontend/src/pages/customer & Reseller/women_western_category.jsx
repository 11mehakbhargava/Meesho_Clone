import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

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
    const msg = encodeURIComponent(
      `🛍️ *${product.title}*\n\n` +
      `✨ *Special Price:* ₹${product.price} (${product.discount})\n` +
      `⭐ *Rating:* ${product.rating} (${product.reviews} reviews)\n` +
      `🚚 Free Shipping & Cash on Delivery Available!\n\n` +
      `👉 *View & Order Here:* ${window.location.origin}/product`
    );
    triggerToast(`Opening WhatsApp to share "${product.title}"... 🚀`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
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
    {
      id: 7,
      title: 'Boho Tiered Smocked Maxi Dress',
      category: 'Dresses',
      price: 899,
      originalPrice: 2199,
      discount: '59% OFF',
      rating: 4.6,
      reviews: '1.1k',
      earn: 120,
      image:
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 8,
      title: 'Oversized Boyfriend Denim Jacket',
      category: 'Jackets',
      price: 1049,
      originalPrice: 2899,
      discount: '64% OFF',
      rating: 4.8,
      reviews: '980',
      earn: 140,
      image:
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
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
      <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('explorer'))}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#FF3F6C]"
              title="Go Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <span
                onClick={() => onNavigate('reseller')}
                className="font-black text-lg text-[#FF3F6C] cursor-pointer hidden sm:inline"
              >
                Meesho
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-[#191c1e]">
                Women Western
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('search')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191c1e]"
              title="Search"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 hover:bg-slate-100 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer text-[#191c1e]"
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

      {/* Main Container */}
      <main className="pt-20 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Chips */}
        <section className="py-2 overflow-x-auto no-scrollbar flex gap-2.5 mb-6">
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

        {/* Products Grid: 2 cols on mobile, 3 on md, 4 on lg, 5 on xl */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((product) => {
            const isFav = wishlist.has(product.id);
            return (
              <div
                key={product.id}
                onClick={() => onNavigate('product')}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-pink-200 group transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, product.id)}
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

                {/* Details */}
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-[#191c1e] line-clamp-1 mb-1 group-hover:text-[#FF3F6C] transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mb-2.5">
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

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {/* Resell Margin WhatsApp Box */}
                    <div
                      onClick={(e) => shareMargin(e, product)}
                      title="Share product with margin on WhatsApp"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1 transition-colors cursor-pointer border border-emerald-100"
                    >
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-emerald-700 text-sm">
                          payments
                        </span>
                        <span className="text-[9.5px] font-extrabold tracking-tight uppercase">
                          Resell & Earn ₹{product.earn}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-emerald-700 text-sm">
                        share
                      </span>
                    </div>

                    {/* Add to Bag */}
                    <button
                      onClick={(e) => addToCart(e, product)}
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
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="categories" onNavigate={onNavigate} />
    </div>
  );
}