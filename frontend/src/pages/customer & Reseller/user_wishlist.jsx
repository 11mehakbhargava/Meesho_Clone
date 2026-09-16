import React, { useState, useMemo } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function UserWishlist({ onNavigate = () => {}, onBack }) {
  const [cartCount, setCartCount] = useState(2);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: 'Urban Street Relaxed Hoodie',
      category: 'Clothing',
      price: 1249,
      originalPrice: 2499,
      discount: '50% OFF',
      discountNum: 50,
      rating: '4.2',
      shared: '500+ shared',
      resellMargin: 350,
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Vegan Leather Structured Tote',
      category: 'Bags',
      price: 899,
      originalPrice: 1999,
      discount: '55% OFF',
      discountNum: 55,
      rating: '4.8',
      shared: '1.2k shared',
      resellMargin: 250,
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Minimalist Floral Silk Scarf',
      category: 'Accessories',
      price: 450,
      originalPrice: 999,
      discount: '54% OFF',
      discountNum: 54,
      rating: '4.5',
      shared: '200 shared',
      resellMargin: 120,
      image:
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Vintage Retro Graphic Tee',
      category: 'Clothing',
      price: 599,
      originalPrice: 1199,
      discount: '50% OFF',
      discountNum: 50,
      rating: '4.9',
      shared: '3.4k shared',
      resellMargin: 180,
      image:
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      title: 'Classic Tapered Denim Jeans',
      category: 'Clothing',
      price: 1699,
      originalPrice: 3299,
      discount: '48% OFF',
      discountNum: 48,
      rating: '4.0',
      shared: '800+ shared',
      resellMargin: 450,
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

  const handleMoveAllToCart = () => {
    if (wishlistItems.length === 0) return;
    setCartCount((c) => c + wishlistItems.length);
    setWishlistItems([]);
    triggerToast(`Moved all ${wishlistItems.length} items to your Cart! 🛍️`);
  };

  const handleClearAll = () => {
    setWishlistItems([]);
    triggerToast('All wishlist items cleared');
  };

  const handleShareWishlistToWhatsApp = () => {
    if (wishlistItems.length === 0) {
      triggerToast('Your wishlist is empty! Add items to share.');
      return;
    }

    const itemsText = wishlistItems
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.title}* - ₹${item.price} (${item.discount})`
      )
      .join('\n');

    const msg = encodeURIComponent(
      `✨ *Curated Fashion Collection from My Wishlist!*\n\n` +
      `${itemsText}\n\n` +
      `🚚 *Cash on Delivery (COD) & Free Shipping Available!*\n` +
      `🔄 7 Days Easy Returns & Exchanges\n\n` +
      `👉 *View & Order Full Catalog Here:* ${window.location.origin}/wishlist`
    );

    triggerToast('Opening WhatsApp with your Wishlist catalog... 🚀');
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  const handleShareSingleItemToWhatsApp = (item, e) => {
    if (e) e.stopPropagation();
    const msg = encodeURIComponent(
      `🛍️ *${item.title}*\n\n` +
      `✨ *Special Price:* ₹${item.price} (${item.discount})\n` +
      `⭐ *Rating:* ${item.rating} ★ (${item.shared})\n` +
      `🚚 Free Delivery & Cash on Delivery Available!\n\n` +
      `👉 *Order Here:* ${window.location.origin}/product`
    );
    triggerToast(`Opening WhatsApp to share "${item.title}"... 🚀`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  // Filter & Sort Logic
  const categories = ['All', 'Clothing', 'Bags', 'Accessories'];

  const filteredItems = useMemo(() => {
    return wishlistItems
      .filter((item) => {
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'discount') return b.discountNum - a.discountNum;
        return 0; // featured
      });
  }, [wishlistItems, selectedCategory, searchQuery, sortBy]);

  // Pricing Stats for Desktop Sidebar
  const totalBasePrice = useMemo(
    () => wishlistItems.reduce((acc, curr) => acc + curr.price, 0),
    [wishlistItems]
  );
  const totalOriginalPrice = useMemo(
    () => wishlistItems.reduce((acc, curr) => acc + curr.originalPrice, 0),
    [wishlistItems]
  );
  const totalSavings = totalOriginalPrice - totalBasePrice;
  const totalResellMargin = useMemo(
    () => wishlistItems.reduce((acc, curr) => acc + (curr.resellMargin || 200), 0),
    [wishlistItems]
  );

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen font-sans antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Responsive Top Navigation Header */}
      <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand & Back Button */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('reseller'))}
              className="p-2 rounded-full hover:bg-slate-100 active:scale-95 text-[#191C1E] cursor-pointer transition-colors"
              title="Go Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <span
                onClick={() => onNavigate('reseller')}
                className="font-black text-xl tracking-tight text-[#FF3F6C] cursor-pointer hidden sm:inline"
              >
                Meesho
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h1 className="font-extrabold text-lg md:text-xl tracking-tight text-[#191C1E]">
                My Wishlist
              </h1>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved items..."
                className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs md:text-sm pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-pink-300 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('explorer')}
              className="p-2 rounded-full hover:bg-slate-100 text-[#191C1E] cursor-pointer md:hidden"
              title="Search"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-pink-50 text-[#FF3F6C] font-bold text-xs cursor-pointer transition-colors relative"
              title="Shopping Cart"
            >
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-[#FF3F6C] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="pt-20 md:pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header Breadcrumbs & Action Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>Home</span>
              <span>›</span>
              <span className="text-pink-600">Wishlist Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#191c1e] flex items-center gap-2">
              Saved Styles
              <span className="text-sm md:text-base font-extrabold px-3 py-1 rounded-full bg-pink-100 text-[#FF3F6C]">
                {wishlistItems.length} items
              </span>
            </h2>
          </div>

          {/* Filter & Sort Controls for Desktop / Mobile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#191C1E] text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-full focus:outline-none focus:border-pink-500 cursor-pointer shadow-sm"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* Clear All CTA */}
            {wishlistItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer px-2 py-1"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout: Grid (Left) + Desktop Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Product Cards Grid (8 cols on lg, 9 on xl) */}
          <div className="lg:col-span-8 xl:col-span-9">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate('product')}
                    className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-pink-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  >
                    {/* Floating Top Actions: Discount Ribbon + Remove Button */}
                    <div className="absolute top-2 left-2 z-10 bg-[#FF3F6C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                      {item.discount}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white active:scale-90 transition-all cursor-pointer shadow-md"
                      title="Remove item"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">close</span>
                    </button>

                    {/* Product Media */}
                    <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9.5px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-pink-400">trending_up</span>
                        <span>{item.shared}</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-3.5 flex flex-col flex-grow justify-between bg-white">
                      <div>
                        <div className="flex justify-between items-start mb-1 gap-1">
                          <h3 className="font-bold text-xs md:text-sm text-[#191c1e] line-clamp-1 group-hover:text-[#FF3F6C] transition-colors">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-[10px] font-extrabold text-[#006a34] bg-green-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            ★ {item.rating}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Verified</span>
                        </div>

                        <div className="flex items-baseline gap-1.5 mb-3.5 flex-wrap">
                          <span className="text-sm md:text-base font-extrabold text-[#191c1e]">
                            ₹{item.price}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        </div>
                      </div>

                      {/* Action CTAs: Move to Bag + WhatsApp Share */}
                      <div className="flex gap-1.5 items-center pt-2 border-t border-slate-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveToCart(item);
                          }}
                          className="flex-grow py-2.5 bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] hover:from-[#e02e59] hover:to-[#c71745] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-md shadow-pink-500/20 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">shopping_bag</span>
                          <span>Move to Bag</span>
                        </button>
                        
                        <button
                          onClick={(e) => handleShareSingleItemToWhatsApp(item, e)}
                          title="Share item on WhatsApp"
                          className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl active:scale-95 transition-all cursor-pointer border border-emerald-200 flex items-center justify-center shadow-sm"
                        >
                          <span className="material-symbols-outlined text-base">share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Explore More Card */}
                <div
                  onClick={() => onNavigate('explorer')}
                  className="flex flex-col items-center justify-center bg-gradient-to-b from-pink-50/40 to-purple-50/40 border-2 border-dashed border-pink-200 rounded-2xl min-h-[280px] text-center p-5 cursor-pointer hover:border-pink-400 hover:bg-pink-50/70 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-md text-[#FF3F6C] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl font-bold">add</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#191c1e] mb-1">Discover More</h3>
                  <p className="text-[11px] text-slate-500 mb-4 max-w-[140px]">
                    Browse 50,000+ top trending styles.
                  </p>
                  <button
                    onClick={() => onNavigate('explorer')}
                    className="px-4 py-2 bg-[#FF3F6C] hover:bg-[#e02e59] text-white text-xs font-bold rounded-full shadow-md shadow-pink-500/25 cursor-pointer active:scale-95 transition-all"
                  >
                    Explore Shop
                  </button>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-slate-100 shadow-sm max-w-lg mx-auto my-8">
                <div className="w-20 h-20 bg-pink-50 text-[#FF3F6C] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <span className="material-symbols-outlined text-4xl">favorite_border</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-[#191c1e] mb-2">
                  No styles in your wishlist
                </h3>
                <p className="text-xs md:text-sm text-slate-500 mb-6 leading-relaxed max-w-sm mx-auto">
                  {searchQuery
                    ? `No items found matching "${searchQuery}". Try changing your search query.`
                    : 'Explore our vast catalog and tap the heart icon on any outfit to save and share it here!'}
                </p>
                <button
                  onClick={() => onNavigate('explorer')}
                  className="bg-[#FF3F6C] hover:bg-[#df2457] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  Explore Trending Catalog
                </button>
              </div>
            )}

            {/* Mobile / Tablet Reseller Banner (Visible on < lg screens) */}
            <section className="lg:hidden mt-8 p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="max-w-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
                    Reseller Opportunity
                  </span>
                  <h4 className="text-lg font-black mt-1 mb-1">
                    Resell these favorites?
                  </h4>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Share your curated wishlist catalog with your WhatsApp customers and earn up to{' '}
                    <span className="text-pink-300 font-bold">₹{totalResellMargin || 2500}</span> margin!
                  </p>
                </div>
                <button
                  onClick={handleShareWishlistToWhatsApp}
                  className="whitespace-nowrap px-5 py-3 bg-white text-indigo-900 font-extrabold text-xs rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center gap-2 cursor-pointer hover:bg-pink-50"
                >
                  <span className="material-symbols-outlined text-base text-[#FF3F6C]">share</span>
                  <span>Share & Earn on WhatsApp</span>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Desktop Sticky Reseller & Cart Summary Sidebar (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 space-y-5">
            
            {/* 1. Wishlist Financial & Cart Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-[#191c1e]">Wishlist Summary</h3>
                <span className="text-xs font-bold text-slate-400">
                  {wishlistItems.length} items
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Total MRP Value</span>
                  <span className="font-bold text-slate-800 line-through">₹{totalOriginalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Special Discounted Price</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹{totalBasePrice}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Total Savings</span>
                  <span>-₹{totalSavings}</span>
                </div>
              </div>

              {/* Move All to Bag CTA */}
              {wishlistItems.length > 0 && (
                <button
                  onClick={handleMoveAllToCart}
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] hover:from-[#e02e59] hover:to-[#c71745] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-pink-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">shopping_bag</span>
                  <span>Move All ({wishlistItems.length}) to Bag</span>
                </button>
              )}
            </div>

            {/* 2. Desktop WhatsApp Reseller Hub Card */}
            <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4 border border-indigo-700/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                  💰
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-pink-300 tracking-wider block">
                    Reseller Margin Hub
                  </span>
                  <h4 className="font-black text-sm text-white">Share & Earn Profit</h4>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-1 text-xs">
                <div className="flex justify-between text-indigo-200">
                  <span>Estimated Profit:</span>
                  <span className="text-pink-300 font-extrabold text-sm">
                    ₹{totalResellMargin || 2500}
                  </span>
                </div>
                <p className="text-[10px] text-indigo-300">
                  Direct WhatsApp sharing includes customized product margins.
                </p>
              </div>

              <button
                onClick={handleShareWishlistToWhatsApp}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">share</span>
                <span>Share Catalog on WhatsApp</span>
              </button>
            </div>

            {/* 3. Assurance Badges */}
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm grid grid-cols-2 gap-3 text-center text-slate-600 text-[10px] font-bold">
              <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50">
                <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
                <span>100% Quality Checked</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50">
                <span className="material-symbols-outlined text-emerald-600 text-lg">local_shipping</span>
                <span>Free COD & Returns</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />
    </div>
  );
}