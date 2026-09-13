import React, { useState } from 'react';

export default function SearchResults({ onNavigate = () => {}, onBack }) {
  const [searchQuery, setSearchQuery] = useState('Floral Kurtas');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  const [activeFilter, setActiveFilter] = useState('All');
  const [wishlist, setWishlist] = useState(new Set([1, 4]));
  const [cartCount, setCartCount] = useState(2);
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
        triggerToast('Removed from Wishlist');
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
    triggerToast(`Added "${product.title}" to Cart! 🛒`);
  };

  const shareToWhatsapp = (e, product) => {
    e.stopPropagation();
    triggerToast(`Catalog for "${product.title}" copied! Ready to share.`);
  };

  const products = [
    {
      id: 1,
      title: 'Embroidered Silk Kurta',
      price: 1249,
      originalPrice: 2499,
      discount: '50% OFF',
      rating: 4.2,
      reviews: '1.2k',
      resellMargin: 150,
      badge: 'Bestseller',
      category: 'Silk',
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Botanical Chiffon Set',
      price: 2199,
      originalPrice: 4399,
      discount: '50% OFF',
      rating: 4.8,
      reviews: '840',
      resellMargin: 250,
      badge: 'Luxe Pick',
      category: 'Chiffon',
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Vintage Rose Cotton Kurta',
      price: 899,
      originalPrice: 1799,
      discount: '50% OFF',
      rating: 4.5,
      reviews: '3.1k',
      resellMargin: 80,
      badge: 'Trending',
      category: 'Cotton',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Midnight Bloom Anarkali',
      price: 1599,
      originalPrice: 3199,
      discount: '50% OFF',
      rating: 4.0,
      reviews: '450',
      resellMargin: 180,
      badge: 'Festive Special',
      category: 'Anarkali',
      image:
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      title: 'Pastel Lilac Georgette Kurti',
      price: 1099,
      originalPrice: 2199,
      discount: '50% OFF',
      rating: 4.7,
      reviews: '1.9k',
      resellMargin: 130,
      badge: 'High Margin',
      category: 'Georgette',
      image:
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      title: 'Handblock Printed Kurta Set',
      price: 1399,
      originalPrice: 2799,
      discount: '50% OFF',
      rating: 4.6,
      reviews: '620',
      resellMargin: 190,
      badge: 'Artisan',
      category: 'Cotton',
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const filterOptions = ['All', 'Under ₹1000', 'Silk', 'Cotton', 'Chiffon', 'High Margin'];

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'Under ₹1000') return p.price < 1000;
    if (activeFilter === 'Silk') return p.category === 'Silk';
    if (activeFilter === 'Cotton') return p.category === 'Cotton';
    if (activeFilter === 'Chiffon') return p.category === 'Chiffon';
    if (activeFilter === 'High Margin') return p.resellMargin >= 180;
    return true;
  });

  return (
    <div className="bg-[#f8f9fb] min-h-screen text-[#191c1e] font-sans antialiased selection:bg-rose-100 selection:text-rose-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-gray-100 flex justify-between items-center w-full px-4 h-16">
        <div className="flex items-center gap-3 flex-1 max-w-2xl mx-auto">
          <button
            onClick={() => (onBack ? onBack() : onNavigate('explorer'))}
            className="hover:bg-slate-100 transition-colors rounded-full p-2 active:scale-95 duration-150 cursor-pointer text-[#FF3F6C]"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div className="flex-1 relative">
            <div className="bg-[#f2f4f6] flex items-center px-3 py-2 rounded-xl gap-2 focus-within:ring-2 focus-within:ring-[#FF3F6C]/20">
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm font-medium text-[#191c1e] focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
          <button
            onClick={() => onNavigate('wishlist')}
            className="hover:bg-slate-100 transition-colors rounded-full p-2 active:scale-95 duration-150 cursor-pointer text-[#FF3F6C]"
          >
            <span className="material-symbols-outlined text-2xl">favorite</span>
          </button>
          <button
            onClick={() => onNavigate('cart')}
            className="hover:bg-slate-100 transition-colors rounded-full p-2 active:scale-95 duration-150 cursor-pointer relative text-[#FF3F6C]"
          >
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute 1 top-0 right-0 bg-[#FF3F6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="pb-28 max-w-6xl mx-auto">
        {/* Horizontal Filters Bar */}
        <section className="bg-[#f8f9fb]/90 backdrop-blur-md sticky top-16 z-30 py-3 border-b border-slate-200/50">
          <div className="flex overflow-x-auto gap-2 px-4 no-scrollbar items-center">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex items-center gap-1 px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF3F6C] text-white shadow-md shadow-pink-500/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {/* Search Summary */}
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {filteredProducts.length} Results for "{searchQuery}"
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700 cursor-pointer">
            <span>Sort: {selectedSort}</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </div>
        </div>

        {/* Product Grid */}
        <section className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => {
            const isFav = wishlist.has(product.id);
            return (
              <div
                key={product.id}
                onClick={() => onNavigate('product')}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 group transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => toggleWishlist(e, product.id)}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-all"
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

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute bottom-2 left-2 bg-[#FF3F6C]/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1">
                      <span
                        className="material-symbols-outlined text-amber-400 text-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="text-[10px] font-bold text-[#191c1e]">
                        {product.rating}
                      </span>
                      <span className="text-[10px] text-slate-400">({product.reviews})</span>
                    </div>

                    <h3 className="text-xs md:text-sm font-bold text-[#191c1e] line-clamp-1 leading-tight mb-1 group-hover:text-[#FF3F6C] transition-colors">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-sm md:text-base font-extrabold text-[#191c1e]">
                        ₹{product.price}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-[#FF3F6C]">
                        {product.discount}
                      </span>
                    </div>
                  </div>

                  <div>
                    {/* Resell Margin Highlight */}
                    <div
                      onClick={(e) => shareToWhatsapp(e, product)}
                      className="bg-purple-50 hover:bg-purple-100 rounded-lg py-1.5 px-2 flex items-center justify-between cursor-pointer transition-colors mb-2"
                    >
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-purple-700 text-xs">
                          payments
                        </span>
                        <span className="text-[9px] font-bold text-purple-700 uppercase tracking-tight">
                          Resell & Earn ₹{product.resellMargin}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-purple-700 text-xs">
                        share
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => addToCart(e, product)}
                      className="w-full bg-[#FF3F6C] hover:bg-[#e02659] active:scale-95 text-white py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">add_shopping_cart</span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Sticky Bottom Nav Bar */}
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
            grid_view
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