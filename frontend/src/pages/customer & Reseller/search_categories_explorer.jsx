import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function SearchCategoriesExplorer({ onNavigate = () => {}, onBack }) {
  const [activeCategory, setActiveCategory] = useState('ethnic');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      onNavigate('search');
    }
  };

  const handleSubcategoryClick = (subName) => {
    if (subName.toLowerCase().includes('saree') || activeCategory === 'ethnic') {
      onNavigate('sarees');
    } else if (activeCategory === 'western') {
      onNavigate('western');
    } else {
      onNavigate('search');
    }
  };

  const categories = [
    { id: 'ethnic', name: 'Women Ethnic', icon: 'styler' },
    { id: 'western', name: 'Women Western', icon: 'checkroom' },
    { id: 'men', name: 'Men', icon: 'man' },
    { id: 'kids', name: 'Kids', icon: 'child_care' },
    { id: 'home', name: 'Home & Kitchen', icon: 'flatware' },
    { id: 'beauty', name: 'Beauty & Health', icon: 'face' },
    { id: 'jewellery', name: 'Jewellery & Acc', icon: 'diamond' },
    { id: 'footwear', name: 'Footwear', icon: 'steps' },
    { id: 'brands', name: 'Top Brands', icon: 'verified' },
  ];

  const categoryData = {
    ethnic: {
      title: 'Women Ethnic',
      subtitle: 'Curated traditional wear for every occasion & celebration',
      bannerTitle: 'Earn 2x Profit on Ethnic Wear',
      bannerTag: 'Mega Reseller Sale',
      featured: {
        title: 'Sarees Collection',
        subtitle: 'Silk, Cotton, Georgette & Party Wear',
        image:
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80',
        badge: 'Trending Now',
      },
      subcategories: [
        {
          name: 'Kurtis & Sets',
          items: '1,420+ styles',
          image:
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Jewellery Sets',
          items: '890+ designs',
          image:
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Lehengas',
          items: '640+ pieces',
          image:
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Dress Materials',
          items: '950+ sets',
          image:
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Ethnic Footwear',
          items: '380+ juttis',
          image:
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Blouse & Inners',
          items: '520+ styles',
          image:
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    western: {
      title: 'Women Western',
      subtitle: 'Trendy streetwear, chic workwear & casual essentials',
      bannerTitle: 'Flat 50% Off On Summer Western Wear',
      bannerTag: 'Luxe Runway Drop',
      featured: {
        title: 'Floral & Midi Dresses',
        subtitle: 'Maxi, Wrap & Bodycon Dresses',
        image:
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80',
        badge: 'Hot Seller',
      },
      subcategories: [
        {
          name: 'Tops & Tees',
          items: '2,100+ styles',
          image:
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Jeans & Jeggings',
          items: '780+ fits',
          image:
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Satin & Denim Skirts',
          items: '430+ styles',
          image:
            'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Co-ord Sets',
          items: '620+ sets',
          image:
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Blazers & Jackets',
          items: '310+ pieces',
          image:
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Activewear',
          items: '490+ gears',
          image:
            'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    men: {
      title: 'Men Fashion',
      subtitle: 'Premium casuals, formals & ethnic wear for men',
      bannerTitle: 'Up to 60% Margin on Men Shirts & Polos',
      bannerTag: 'Top Earner Choice',
      featured: {
        title: 'Casual & Formal Shirts',
        subtitle: 'Cotton, Linen & Oxford Weaves',
        image:
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&auto=format&fit=crop&q=80',
        badge: 'Best Value',
      },
      subcategories: [
        {
          name: 'Graphic T-Shirts',
          items: '3,200+ designs',
          image:
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Trousers & Chinos',
          items: '940+ styles',
          image:
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Men Ethnic Kurtas',
          items: '580+ sets',
          image:
            'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Jackets & Hoodies',
          items: '760+ designs',
          image:
            'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Men Footwear',
          items: '1,100+ shoes',
          image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Accessories & Belts',
          items: '420+ items',
          image:
            'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    kids: {
      title: 'Kids & Infants',
      subtitle: 'Comfortable clothing, baby care & fun accessories',
      bannerTitle: 'Newborn to 14 Years Collections',
      bannerTag: 'Soft & Gentle Fabrics',
      featured: {
        title: 'Festive & Party Wear',
        subtitle: 'Kurta sets, gowns & frocks',
        image:
          'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&auto=format&fit=crop&q=80',
        badge: 'Popular',
      },
      subcategories: [
        {
          name: 'Boys Clothing Sets',
          items: '1,200+ outfits',
          image:
            'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Girls Frocks & Dresses',
          items: '1,450+ styles',
          image:
            'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Infant Essentials',
          items: '620+ packs',
          image:
            'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Kids Footwear',
          items: '530+ pairs',
          image:
            'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Toys & Games',
          items: '890+ toys',
          image:
            'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'School Supplies',
          items: '310+ items',
          image:
            'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    home: {
      title: 'Home & Kitchen',
      subtitle: 'Elevate living spaces with curtains, bedsheets & cookware',
      bannerTitle: 'Direct Factory Prices for Home Decor',
      bannerTag: 'High Repeat Orders',
      featured: {
        title: 'Bedsheets & Comforters',
        subtitle: '100% Pure Cotton & Microfiber',
        image:
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&auto=format&fit=crop&q=80',
        badge: 'Top Pick',
      },
      subcategories: [
        {
          name: 'Curtains & Drapes',
          items: '740+ designs',
          image:
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Kitchen Storage',
          items: '1,120+ containers',
          image:
            'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Cookware & Pans',
          items: '480+ utensils',
          image:
            'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Wall Decor & Clocks',
          items: '670+ frames',
          image:
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Bathroom Essentials',
          items: '390+ sets',
          image:
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Lighting & Lamps',
          items: '310+ lamps',
          image:
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    beauty: {
      title: 'Beauty & Wellness',
      subtitle: 'Skincare, makeup, hair remedies & wellness essentials',
      bannerTitle: 'Trending Herbal & Organic Cosmetics',
      bannerTag: 'Dermat Tested',
      featured: {
        title: 'Skincare Serums & Creams',
        subtitle: 'Vitamin C, Niacinamide & Glow Boosters',
        image:
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&auto=format&fit=crop&q=80',
        badge: 'Glow Drops',
      },
      subcategories: [
        {
          name: 'Lipsticks & Lip Gels',
          items: '890+ shades',
          image:
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Hair Oils & Shampoos',
          items: '640+ products',
          image:
            'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Foundation & Compact',
          items: '420+ shades',
          image:
            'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Fragrances & Deos',
          items: '530+ perfumes',
          image:
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Eye Makeup & Kajal',
          items: '310+ items',
          image:
            'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Beauty Appliances',
          items: '280+ tools',
          image:
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    jewellery: {
      title: 'Jewellery & Accessories',
      subtitle: 'Oxidised silver, bridal sets, fashion earrings & rings',
      bannerTitle: 'Flat 65% Margin on Designer Jewellery',
      bannerTag: 'Wedding Special',
      featured: {
        title: 'Kundan & Temple Sets',
        subtitle: 'Choker sets, pearls & semi-precious stones',
        image:
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop&q=80',
        badge: 'High Demand',
      },
      subcategories: [
        {
          name: 'Earrings & Studs',
          items: '2,400+ styles',
          image:
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Necklace & Chokers',
          items: '1,200+ pieces',
          image:
            'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Bangles & Bracelets',
          items: '890+ sets',
          image:
            'https://images.unsplash.com/photo-1611591475836-8c465a3d7d74?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Rings & Toe Rings',
          items: '710+ designs',
          image:
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Watches & Clutches',
          items: '540+ items',
          image:
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Hair Accessories',
          items: '420+ clips',
          image:
            'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    footwear: {
      title: 'Footwear Collection',
      subtitle: 'Ethnic juttis, casual sneakers, stylish heels & sliders',
      bannerTitle: 'Daily Wear to Party Heels',
      bannerTag: 'Comfort First',
      featured: {
        title: 'Ethnic Juttis & Mojaris',
        subtitle: 'Hand-embroidered Punjabi Juttis',
        image:
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&auto=format&fit=crop&q=80',
        badge: 'Top Pick',
      },
      subcategories: [
        {
          name: 'Sneakers & Sports Shoes',
          items: '1,400+ pairs',
          image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Flats & Kolhapuris',
          items: '950+ styles',
          image:
            'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Block Heels & Wedges',
          items: '620+ pairs',
          image:
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Men Formal Shoes',
          items: '780+ pairs',
          image:
            'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Kids School Shoes',
          items: '410+ models',
          image:
            'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Comfort Sliders',
          items: '380+ designs',
          image:
            'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
    brands: {
      title: 'Top Verified Brands',
      subtitle: 'Shop authentic products directly from verified national & premium brands',
      bannerTitle: 'Up to 70% Off on Top Brands',
      bannerTag: 'Brand Mall',
      featured: {
        title: 'boAt Audio & Wearables',
        subtitle: 'Headphones, Earbuds & Smartwatches',
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
        badge: 'Verified Brand',
      },
      subcategories: [
        {
          name: 'Puma Sports & Shoes',
          items: '520+ styles',
          image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'boAt Audio & Gear',
          items: '380+ items',
          image:
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Libas Ethnic Kurti',
          items: '450+ styles',
          image:
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
        },
        {
          name: 'Roadster Denims & Jackets',
          items: '610+ styles',
          image:
            'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&auto=format&fit=crop&q=80',
        },
      ],
    },
  };

  const currentData = categoryData[activeCategory] || categoryData.ethnic;

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans antialiased selection:bg-pink-100 selection:text-pink-600 pb-20">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Search Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('reseller'))}
              className="p-1.5 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-[#FF3F6C] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <span
              onClick={() => onNavigate('reseller')}
              className="font-black text-xl tracking-tight text-[#FF3F6C] cursor-pointer hidden sm:inline"
            >
              Meesho
            </span>
          </div>

          <div className="flex-1 max-w-2xl relative">
            <div
              onClick={() => onNavigate('search')}
              className="absolute inset-y-0 left-3.5 flex items-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search across 500+ categories & 50,000+ products... (Press Enter)"
              className="w-full bg-[#f2f4f6] hover:bg-slate-200/60 focus:bg-white border border-transparent focus:border-pink-300 rounded-full py-2.5 pl-11 pr-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3F6C]/20 placeholder:text-slate-400 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-all cursor-pointer hidden sm:flex"
              title="Wishlist"
            >
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 rounded-full hover:bg-pink-50 text-[#FF3F6C] active:scale-95 transition-all cursor-pointer relative"
              title="Shopping Bag"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="max-w-7xl mx-auto flex flex-1 overflow-hidden h-[calc(100vh-130px)] px-0 sm:px-4 lg:px-8 py-0 sm:py-4">
        {/* Navigation Sidebar Drawer */}
        <aside className="h-full w-24 sm:w-48 md:w-56 lg:w-64 flex flex-col bg-[#F2F4F6] sm:rounded-2xl border-r sm:border border-slate-200/60 overflow-y-auto shrink-0 select-none shadow-sm">
          <div className="p-3 hidden sm:block border-b border-slate-200/50">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
              Explore Categories
            </span>
          </div>
          <nav className="flex flex-col py-2 space-y-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-3 px-3 sm:px-4 flex sm:flex-row flex-col items-center sm:gap-3 gap-1 transition-all cursor-pointer relative text-left rounded-xl mx-1.5 ${
                    isActive
                      ? 'bg-white text-[#FF3F6C] font-extrabold shadow-sm'
                      : 'text-slate-600 opacity-80 hover:opacity-100 hover:bg-white/50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-1.5 bg-[#FF3F6C] rounded-r-full sm:hidden" />
                  )}
                  <span
                    className="material-symbols-outlined text-2xl sm:text-xl shrink-0"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {cat.icon}
                  </span>
                  <span className="text-[10.5px] sm:text-xs leading-tight font-bold truncate">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Category Content Canvas */}
        <section className="flex-1 bg-white sm:rounded-2xl sm:border border-slate-200/60 sm:ml-4 overflow-y-auto p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#191c1e]">
                {currentData.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                {currentData.subtitle}
              </p>
            </div>
            <button
              onClick={() => handleSubcategoryClick(currentData.title)}
              className="text-xs font-bold text-[#FF3F6C] bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full cursor-pointer transition-all self-start sm:self-auto shadow-sm"
            >
              Explore All Styles ➔
            </button>
          </div>

          {/* Hero Feature Banner Card */}
          <div
            onClick={() => handleSubcategoryClick(currentData.featured.title)}
            className="relative group cursor-pointer overflow-hidden rounded-3xl bg-slate-100 aspect-[16/8] sm:aspect-[21/8] lg:aspect-[24/8] mb-8 shadow-md border border-slate-100 active:scale-[0.99] transition-transform"
          >
            <img
              src={currentData.featured.image}
              alt={currentData.featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-8">
              <span className="bg-[#FF3F6C] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full w-max mb-2 shadow-sm">
                {currentData.featured.badge}
              </span>
              <span className="text-white font-black text-lg sm:text-2xl md:text-3xl leading-tight">
                {currentData.featured.title}
              </span>
              <span className="text-white/90 text-xs sm:text-sm mt-1">
                {currentData.featured.subtitle}
              </span>
            </div>
          </div>

          {/* Subcategories Bento Grid: 2 cols on mobile, 3 on sm, 4 on lg, 5 on xl */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {currentData.subcategories.map((sub, idx) => (
              <div
                key={idx}
                onClick={() => handleSubcategoryClick(sub.name)}
                className="group cursor-pointer bg-[#f8f9fb] hover:bg-white p-3 rounded-2xl border border-slate-100 hover:border-pink-300 hover:shadow-xl transition-all duration-300 active:scale-95 flex flex-col transform hover:-translate-y-1"
              >
                <div className="aspect-square rounded-xl bg-slate-200 overflow-hidden mb-2.5 relative shadow-inner">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white text-[9.5px] px-2 py-0.5 rounded-md font-bold">
                    {sub.items}
                  </span>
                </div>
                <span className="text-xs md:text-sm font-bold text-center text-[#191c1e] line-clamp-1 group-hover:text-[#FF3F6C] transition-colors">
                  {sub.name}
                </span>
              </div>
            ))}
          </div>

          {/* Reseller Promotion Banner */}
          <div className="mt-10 mb-6 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#FF3F6C] via-[#e02659] to-[#910031] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-pink-500/20">
            <div className="max-w-xl">
              <p className="text-xs font-extrabold uppercase tracking-wider text-pink-200">
                {currentData.bannerTag}
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight mt-1">
                {currentData.bannerTitle}
              </h3>
              <button
                onClick={() => onNavigate('flash')}
                className="mt-4 bg-white text-[#FF3F6C] hover:bg-pink-50 px-6 py-2.5 rounded-full text-xs font-extrabold active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                Shop Flash Deals ⚡
              </button>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-inner shrink-0 self-end sm:self-center">
              <span className="material-symbols-outlined text-4xl text-white">trending_up</span>
            </div>
          </div>
        </section>
      </main>

      {/* Universal Bottom Navigation Bar */}
      <AppBottomNav activeNav="categories" onNavigate={onNavigate} />
    </div>
  );
}