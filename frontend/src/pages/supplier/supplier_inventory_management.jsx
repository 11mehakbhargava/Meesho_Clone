import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

// Default initial products data matching design specs
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Aura Minimalist Timepiece',
    sku: 'AUR-WCH-001',
    price: '₹1,499',
    stock: 42,
    statusText: '42 units available',
    stockStatus: 'sufficient', // 'sufficient' | 'low' | 'out_of_stock'
    isActive: true,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAV-4ZvD8edFl9Lx7SCSwdFXrKFRysgbseviqrpcYwlPpsVwMh6SSVFORqFmVJG-aZH3i_-DNWbVQptPCLNiw8CTD_e9BbXD_we51x_ztnvwqIFVYXuiWj1_76nc8HgnYAsh_NOyFmzhPkVBnuaDIMKYijWD3twWldxefTiqS5RyroofWD7VV-jq8Jy9lWB_UNzy4C6eMCN8Fe-E5cybIAqaGsHyVSSqqW9YOfZUAqay8ve_ELMRJJ6OGJT6aGbgx_BiY6aPqBpTQ8',
    imageAlt: 'Modern minimalist wrist watch with white dial',
  },
  {
    id: 'prod-2',
    name: 'SonicFlow Studio Buds',
    sku: 'SNC-HDP-042',
    price: '₹2,299',
    stock: 5,
    statusText: '05 units remaining',
    stockStatus: 'low',
    isActive: true,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpf1xhClgaViwcD1tvJ8p52cL4Sfmkw06XotfX5KuzSAjOTm_EMVii_2t3xgDxVZVxopFmW1AoX5deQyT3NfgotaNOV1BXKtjZ6P8KiurUdzcHKva6xDoBWJ1zkouAgd1UP4lCSyiTGZ_dDecQuqUZCyiQrFFs0O-9ag4PFXAW2DsoBNIOmx3SZd3InVuStS1n5kvFjKO3B_pZqsnTGJ-VhXQzpF6zdSZIltKaMTjFGR_Gq6vtL28cmdp6n3PsIgI4B2lIa2sJ6tM',
    imageAlt: 'Premium black wireless over-ear headphones',
  },
  {
    id: 'prod-3',
    name: 'Velocity Pro Runners',
    sku: 'VEL-SNK-992',
    price: '₹1,899',
    stock: 0,
    statusText: 'Out of stock',
    stockStatus: 'out_of_stock',
    isActive: false,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBipv6iOh1No-Sk3kO1yZMB7VukLBZ-u8dbBQHAMyzIj7JNYevlScCb96BGSGBn9sUqPmj7KuCqnFnyXh2pdewmdHWUt31PKGsQ0Uasut7qrCn0TcOl1y-qoRwZOs8xBIIs-f8CyPi6r2ED0japxIZ7BTNFwns-q8mTXBUGnM5B-mPbFbPHt5FcypbupUeFT6BG6VvH_LusAebLRrD1OduDEREx1cRdIOEcpyyGCSzHdTDcDoIjMmVsVhI92yLJCIIig9vyEWsn7Ng',
    imageAlt: 'Vibrant red athletic running sneakers',
  },
  {
    id: 'prod-4',
    name: 'Urban Explorer Pack',
    sku: 'URB-BPK-112',
    price: '₹899',
    stock: 118,
    statusText: '118 units available',
    stockStatus: 'sufficient',
    isActive: true,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDHrYMcC-EEgrXqS1mkRlJvIiMJPwcEwPiiRQ_MZZqD-ha5M_yvOZYQLUyzmxhW5B_Wb4Z7vVkc7YctBI39fFI0RI_dOyNa59KlrsQtFAqeBkNjTHcEV6mzwwlM2-8R8chDMgFt5gK6kSNvmsGlS_WT8O2_3OwBhbWabtxZEtJsWliDGhep3lN691t0GsPCFtAlorMmMVjZ32z5u5v6NtLxEXkOfH5Rttm6gPoN2dlLCljSW_nZpkTgYqWK4vshasXyI9LaMB-52Wo',
    imageAlt: 'Durable olive green canvas hiking backpack',
  },
];

const NAV_ITEMS = [
  { id: 'Home', label: 'Home', icon: 'home' },
  { id: 'Orders', label: 'Orders', icon: 'assignment' },
  { id: 'Inventory', label: 'Inventory', icon: 'inventory_2' },
  { id: 'Earnings', label: 'Earnings', icon: 'payments' },
  { id: 'Profile', label: 'Profile', icon: 'person' },
];

export function SupplierInventoryManagement({ onNavigate, onAddProduct }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Inventory');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'low' | 'out_of_stock' | 'sufficient'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'editPrice' | 'updateStock' | 'addProduct' | null
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [tempStock, setTempStock] = useState('');

  // Toggle Product Active/Inactive switch
  const handleToggleActive = (productId) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // Open Edit Price Modal
  const openEditPrice = (product) => {
    setSelectedProduct(product);
    setTempPrice(product.price.replace(/[^0-9]/g, ''));
    setActiveModal('editPrice');
  };

  // Save Edit Price
  const handleSavePrice = () => {
    if (selectedProduct && tempPrice) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, price: `₹${Number(tempPrice).toLocaleString('en-IN')}` }
            : item
        )
      );
      setActiveModal(null);
    }
  };

  // Open Update Stock Modal
  const openUpdateStock = (product) => {
    setSelectedProduct(product);
    setTempStock(product.stock.toString());
    setActiveModal('updateStock');
  };

  // Save Updated Stock
  const handleSaveStock = () => {
    if (selectedProduct && tempStock !== '') {
      const stockNum = parseInt(tempStock, 10) || 0;
      let stockStatus = 'sufficient';
      let statusText = `${stockNum} units available`;

      if (stockNum <= 0) {
        stockStatus = 'out_of_stock';
        statusText = 'Out of stock';
      } else if (stockNum <= 10) {
        stockStatus = 'low';
        statusText = `${stockNum < 10 ? '0' + stockNum : stockNum} units remaining`;
      }

      setProducts((prev) =>
        prev.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, stock: stockNum, stockStatus, statusText }
            : item
        )
      );
      setActiveModal(null);
    }
  };

  // Search & Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (filterType === 'low') return p.stockStatus === 'low';
    if (filterType === 'out_of_stock') return p.stockStatus === 'out_of_stock';
    if (filterType === 'sufficient') return p.stockStatus === 'sufficient';
    return true;
  });

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen pb-28 font-['Inter',sans-serif] antialiased">
      {/* ===================== TopAppBar ===================== */}
      <header className="sticky top-0 w-full z-40 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none flex items-center justify-between px-4 h-16 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => alert('Supplier menu clicked')}
            className="active:scale-95 transition-transform p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-slate-500">menu</span>
          </button>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl text-[#FF3F6C] dark:text-[#FF5C85] tracking-tight">
            Inventory
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => {
              const inputEl = document.getElementById('inventory-search-input');
              if (inputEl) inputEl.focus();
            }}
            className="active:scale-95 transition-transform p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-slate-500">search</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-[#675df9] flex items-center justify-center text-white text-xs font-bold shadow-sm select-none">
            GE
          </div>
        </div>
      </header>

      {/* ===================== Main Content ===================== */}
      <main className="pt-4 px-4 max-w-5xl mx-auto">
        {/* Search Bar Section */}
        <section className="mt-4 mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input
              id="inventory-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-10 bg-[#e7e8ea]/60 hover:bg-[#e7e8ea] focus:bg-white border border-transparent focus:border-[#FF3F6C]/40 rounded-xl focus:ring-2 focus:ring-[#FF3F6C]/30 text-[#191c1e] placeholder-slate-400 text-sm font-medium transition-all outline-none"
              placeholder="Search by Product Name or SKU..."
              type="text"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </section>

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-3 gap-3 mb-10">
          {/* Total SKUs */}
          <div
            onClick={() => setFilterType('all')}
            className={`bg-white p-4 rounded-2xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-md ${
              filterType === 'all' ? 'ring-2 ring-[#4d41df]' : ''
            }`}
          >
            <span className="text-[#4d41df] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-2xl">
              1,284
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">
              Total SKUs
            </span>
          </div>

          {/* Low Stock */}
          <div
            onClick={() => setFilterType(filterType === 'low' ? 'all' : 'low')}
            className={`bg-white p-4 rounded-2xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-md ${
              filterType === 'low' ? 'ring-2 ring-[#df2457]' : ''
            }`}
          >
            <span className="text-[#df2457] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-2xl">
              14
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">
              Low Stock
            </span>
          </div>

          {/* Out of Stock */}
          <div
            onClick={() => setFilterType(filterType === 'out_of_stock' ? 'all' : 'out_of_stock')}
            className={`bg-white p-4 rounded-2xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] flex flex-col items-center text-center border-b-2 border-red-500/30 cursor-pointer transition-all hover:shadow-md ${
              filterType === 'out_of_stock' ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <span className="text-[#ba1a1a] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-2xl">
              3
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">
              Out of Stock
            </span>
          </div>
        </section>

        {/* Product List Header */}
        <div className="flex items-center justify-between mb-6 px-1 relative">
          <div className="flex items-center gap-2">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191c1e]">
              Live Inventory
            </h2>
            {filterType !== 'all' && (
              <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-xs font-semibold px-2 py-0.5 rounded-full">
                {filterType === 'low'
                  ? 'Low Stock Filter'
                  : filterType === 'out_of_stock'
                  ? 'OOS Filter'
                  : 'Sufficient Stock'}
              </span>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="text-[#b90041] hover:text-[#df2457] text-sm font-semibold flex items-center gap-1 cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filters
            </button>

            {/* Dropdown menu */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setFilterType('all');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    filterType === 'all' ? 'text-[#FF3F6C] font-bold' : 'text-slate-700'
                  }`}
                >
                  All Products
                  {filterType === 'all' && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterType('low');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    filterType === 'low' ? 'text-[#FF3F6C] font-bold' : 'text-slate-700'
                  }`}
                >
                  Low Stock (&le; 10)
                  {filterType === 'low' && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterType('out_of_stock');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    filterType === 'out_of_stock' ? 'text-[#FF3F6C] font-bold' : 'text-slate-700'
                  }`}
                >
                  Out of Stock
                  {filterType === 'out_of_stock' && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product List Vertical */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-2">search_off</span>
              <p className="font-semibold text-sm">No products found matching your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="mt-3 text-xs text-[#FF3F6C] font-bold underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isOOS = product.stockStatus === 'out_of_stock';
              const isLow = product.stockStatus === 'low';

              return (
                <article
                  key={product.id}
                  className={`bg-white p-4 rounded-2xl shadow-[0_8px_24px_rgba(25,28,30,0.03)] flex flex-col gap-4 transition-all hover:shadow-md ${
                    isOOS ? 'opacity-80' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img
                        alt={product.name}
                        data-alt={product.imageAlt}
                        src={product.imageUrl}
                        className={`w-20 h-20 object-cover rounded-xl border border-slate-100 ${
                          isOOS ? 'grayscale-[0.3]' : ''
                        }`}
                        loading="lazy"
                      />
                      {isOOS && (
                        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold uppercase tracking-tighter">
                            OOS
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-[#191c1e] truncate pr-2 text-base">
                          {product.name}
                        </h3>

                        {/* Status Toggle Switch */}
                        <div
                          role="switch"
                          aria-checked={product.isActive}
                          onClick={() => handleToggleActive(product.id)}
                          className={`flex items-center h-6 w-11 rounded-full px-1 transition-colors cursor-pointer ${
                            product.isActive ? 'bg-[#006a34]/20' : 'bg-slate-200'
                          }`}
                          title={product.isActive ? 'Active in Catalog' : 'Inactive in Catalog'}
                        >
                          <div
                            className={`h-4 w-4 rounded-full transition-transform ${
                              product.isActive
                                ? 'bg-[#006a34] translate-x-5'
                                : 'bg-slate-400 translate-x-0'
                            }`}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-slate-500 font-mono">SKU: {product.sku}</p>
                        <span className="text-slate-300">•</span>
                        <p className="text-xs font-bold text-slate-700">{product.price}</p>
                      </div>

                      {/* Stock Status Indicator */}
                      <div className="mt-2 flex items-center gap-2">
                        {isOOS ? (
                          <>
                            <div className="h-2 w-2 rounded-full bg-[#ba1a1a]"></div>
                            <span className="text-xs font-bold text-[#ba1a1a]">Out of stock</span>
                          </>
                        ) : isLow ? (
                          <>
                            <div className="h-2 w-2 rounded-full bg-[#FFA500]"></div>
                            <span className="text-xs font-bold text-[#B96D00]">
                              {product.statusText}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-2 rounded-full bg-[#5fde88]"></div>
                            <span className="text-xs font-bold text-[#006a34]">
                              {product.statusText}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit Price & Update Stock) */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditPrice(product)}
                      className="flex-1 py-2.5 bg-[#edeef0] hover:bg-[#e1e2e4] text-[#191c1e] text-xs font-bold rounded-xl active:scale-95 transition-all cursor-pointer"
                    >
                      Edit Price
                    </button>
                    <button
                      type="button"
                      onClick={() => openUpdateStock(product)}
                      className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer ${
                        isOOS
                          ? 'bg-[#df2457] hover:bg-[#b90041]'
                          : 'bg-[#4d41df] hover:bg-[#3622ca]'
                      }`}
                    >
                      Update Stock
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>

      {/* ===================== Floating Action Button ===================== */}
      <button
        type="button"
        onClick={onAddProduct || (() => alert('Opening Add New Product flow...'))}
        aria-label="Add New Product"
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#df2457] hover:bg-[#b90041] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl active:scale-90 transition-all z-40 cursor-pointer"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* ===================== BottomNavBar ===================== */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />

      {/* ===================== Modals for Price / Stock Edit ===================== */}
      {activeModal === 'editPrice' && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191c1e] mb-1">
              Edit Price
            </h3>
            <p className="text-xs text-slate-500 mb-4 truncate">{selectedProduct.name}</p>

            <div className="mb-5">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                New Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#FF3F6C]"
                  placeholder="e.g. 1499"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePrice}
                className="flex-1 py-2.5 bg-[#FF3F6C] text-white text-xs font-bold rounded-xl hover:bg-[#e0305a] shadow-sm"
              >
                Save Price
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'updateStock' && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191c1e] mb-1">
              Update Stock
            </h3>
            <p className="text-xs text-slate-500 mb-4 truncate">{selectedProduct.name}</p>

            <div className="mb-5">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Available Units
              </label>
              <input
                type="number"
                value={tempStock}
                onChange={(e) => setTempStock(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#4d41df]"
                placeholder="e.g. 50"
                min="0"
                autoFocus
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Setting to 0 will mark the product as Out of Stock (OOS).
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStock}
                className="flex-1 py-2.5 bg-[#4d41df] text-white text-xs font-bold rounded-xl hover:bg-[#3622ca] shadow-sm"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierInventoryManagement;
