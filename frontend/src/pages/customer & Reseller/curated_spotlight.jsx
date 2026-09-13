import React, { useState } from 'react';

export default function CuratedSpotlight({ onNavigate = () => {}, onBack }) {
  const [activeTab, setActiveTab] = useState('Trends');
  const [sharedToast, setSharedToast] = useState(false);

  const handleShare = (e) => {
    if (e) e.stopPropagation();
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  const lookbooks = [
    {
      id: 1,
      title: 'Workwear Revival',
      subtitle: 'Sophisticated essentials for the modern professional.',
      pieces: '9 Pieces',
      margin: '25%',
      image:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Weekend Brunch',
      subtitle: 'Effortless style for sun-drenched social afternoons.',
      pieces: '12 Pieces',
      margin: '18%',
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Coastal Escapism',
      subtitle: 'Breathable linens and nautical accents for vacations.',
      pieces: '7 Pieces',
      margin: '30%',
      image:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="bg-[#f8f9fb] min-h-screen font-sans text-[#191c1e] antialiased selection:bg-pink-100 selection:text-pink-700">
      {/* Toast Notification */}
      {sharedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">Lookbook link copied & ready to share!</span>
        </div>
      )}

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#F8F9FB]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (onBack ? onBack() : onNavigate('reseller'))}
            className="material-symbols-outlined text-[#191C1E] active:scale-95 transition-transform cursor-pointer"
          >
            arrow_back
          </button>
          <h1
            onClick={() => onNavigate('reseller')}
            className="text-xl font-extrabold text-[#191C1E] tracking-tight cursor-pointer"
          >
            ✨ Curated Spotlight
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('wishlist')}
            className="material-symbols-outlined text-[#191C1E] active:scale-95 transition-transform cursor-pointer"
          >
            favorite
          </button>
          <button
            onClick={() => onNavigate('cart')}
            className="material-symbols-outlined text-[#FF3F6C] active:scale-95 transition-transform cursor-pointer"
          >
            shopping_bag
          </button>
        </div>
      </header>

      <main className="pt-20 pb-32 max-w-7xl mx-auto">
        {/* Hero Editorial Section */}
        <section className="px-6 mb-12">
          <div className="relative w-full aspect-4/5 sm:aspect-16/9 rounded-3xl overflow-hidden shadow-2xl group bg-gray-900">
            <img
              alt="Editorial Fashion"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80"
            />

            {/* Editorial Text Overlay */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full bg-linear-to-t from-black/80 via-black/40 to-transparent">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-2 uppercase tracking-tighter leading-none">
                Modern<br />Ethnic
              </h2>
              <p className="text-white/80 text-xs sm:text-sm mb-6 max-w-xs leading-relaxed">
                Reimagining heritage silhouettes through a contemporary lens for the bold curator.
              </p>
              <button
                onClick={() => onNavigate('sarees')}
                className="bg-linear-to-r from-[#b90041] to-[#df2457] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-transform shadow-lg cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                Shop Modern Ethnic ➔
              </button>
            </div>

            {/* Shoppable Hotspot 1 */}
            <div
              onClick={() => onNavigate('product')}
              className="absolute top-[35%] right-[25%] group/tag cursor-pointer"
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-lg border-4 border-[#b90041] animate-pulse"></div>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl opacity-0 group-hover/tag:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                <p className="text-[10px] font-bold uppercase text-gray-500">Statement Neckpiece</p>
                <p className="text-sm font-black text-[#b90041]">₹1,499 (Click to view)</p>
              </div>
            </div>

            {/* Shoppable Hotspot 2 */}
            <div
              onClick={() => onNavigate('product')}
              className="absolute bottom-[45%] left-[20%] group/tag cursor-pointer"
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-lg border-4 border-[#b90041] animate-pulse"></div>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl opacity-0 group-hover/tag:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                <p className="text-[10px] font-bold uppercase text-gray-500">Silk Wrap Saree</p>
                <p className="text-sm font-black text-[#b90041]">₹4,200 (Click to view)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Lookbook Gallery */}
        <section className="mb-12">
          <div className="flex justify-between items-end px-6 mb-6">
            <div>
              <span className="text-[#b90041] font-bold text-xs uppercase tracking-[0.2em] block mb-1">
                Featured Series
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-none text-gray-900">
                Lookbook Series
              </h3>
            </div>
            <button
              onClick={() => onNavigate('explorer')}
              className="text-[#4d41df] font-bold text-xs sm:text-sm hover:underline cursor-pointer"
            >
              View All ➔
            </button>
          </div>

          <div className="flex overflow-x-auto gap-6 px-6 no-scrollbar pb-4">
            {lookbooks.map((look) => (
              <div
                key={look.id}
                onClick={() => onNavigate('product')}
                className="shrink-0 w-72 cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-gray-100">
                  <div className="relative h-96 bg-gray-100 overflow-hidden">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase text-gray-800 shadow-xs">
                      {look.pieces}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg mb-1 text-gray-900">{look.title}</h4>
                    <p className="text-gray-500 text-xs mb-4 leading-relaxed">{look.subtitle}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-[#b90041] font-black text-xs">
                        Est. Margin: {look.margin}
                      </span>
                      <button
                        onClick={handleShare}
                        className="material-symbols-outlined text-[#4d41df] hover:scale-110 transition-transform cursor-pointer"
                        title="Share Look"
                      >
                        ios_share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Asymmetric Bento Grid for Products */}
        <section className="px-6">
          <h3 className="text-2xl font-extrabold mb-6 text-gray-900">
            Hot Sellers in Ethnic
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Product Card 1 */}
            <div
              onClick={() => onNavigate('product')}
              className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
                  alt="Oxidised Silver Jhumkas"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="px-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Accessories
                </p>
                <h4 className="font-bold text-sm text-gray-800">Oxidised Silver Jhumkas</h4>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <p className="text-[#b90041] font-black text-base">₹499</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('cart');
                    }}
                    className="bg-gray-100 p-2 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 (Hero Product) */}
            <div
              onClick={() => onNavigate('product')}
              className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex flex-col justify-between cursor-pointer"
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-3 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80"
                  alt="Indigo Gold Embroidered Kurta"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="px-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Apparel
                </p>
                <h4 className="font-bold text-sm text-gray-800">Indigo Gold Embroidered Kurta</h4>
                <p className="text-xs text-gray-500 mt-1">Shared by 1.2k resellers</p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <p className="text-[#b90041] font-black text-base">₹2,850</p>
                  <button
                    onClick={handleShare}
                    className="bg-[#b90041] text-white p-2 rounded-xl active:scale-90 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Build Your Own Spotlight */}
            <div className="bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-2xl p-6 border border-pink-100 shadow-xs flex flex-col items-center justify-center text-center">
              <span
                className="material-symbols-outlined text-[#b90041] text-5xl mb-2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <h4 className="font-extrabold text-base text-gray-900 mb-1">
                Explore Western Runway
              </h4>
              <p className="text-xs text-gray-600 mb-4 max-w-xs">
                Check out the latest curated collection of chic streetwear and dresses.
              </p>
              <button
                onClick={() => onNavigate('western')}
                className="text-xs font-bold text-white bg-[#4d41df] hover:bg-[#3622ca] px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Explore Western ➔
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-white/90 backdrop-blur-xl shadow-lg border-t border-gray-100 flex justify-around items-center px-4 pb-6 pt-3 md:hidden">
        {[
          { name: 'Home', icon: 'home', target: 'reseller' },
          { name: 'Categories', icon: 'grid_view', target: 'explorer' },
          { name: 'Spotlight', icon: 'auto_awesome', target: 'spotlight' },
          { name: 'Wishlist', icon: 'favorite', target: 'wishlist' },
          { name: 'Cart', icon: 'shopping_bag', target: 'cart' },
        ].map((tab) => {
          const isActive = tab.name === 'Spotlight';
          return (
            <button
              key={tab.name}
              onClick={() => onNavigate(tab.target)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'text-[#FF3F6C] bg-[#FF3F6C]/10 font-bold'
                  : 'text-gray-500 hover:text-[#FF3F6C]'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}