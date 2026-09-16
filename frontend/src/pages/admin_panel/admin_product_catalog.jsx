import React, { useState } from 'react';

const INITIAL_CATALOG_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Velocity X1 Runners',
    sku: 'VEL-X1-RED',
    category: 'Footwear',
    categoryStyle: 'bg-indigo-100 text-indigo-700',
    supplier: 'Stride Tech Inc.',
    price: '$129.00',
    stock: 84,
    stockStatus: 'in_stock',
    stockLabel: '84 in stock',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC97PAC4wYFwMh12gzVN0OGatutkkuo8WR2h1_jxTDRCraJ_qVg7gnFwIJKtBVE-ag_ZgfWF-HopgGna1fMzMvgk6KZE0n6B513IF-PY6wtMCzCTWmSIPCOJD85xdUZmpG_lJpZQLPn4A6Bz8ibtoq2qWLE1AiPiWNAXXkmx-oSG0gXzszHft3RRdd9_ssBTQE5QNT3NOnSdwLOryWPRX33HK0BdCIcX5he_Nn6pjM0MERFsIc1vW0ibye8cHxtnDl2jlAYWUYawsY',
  },
  {
    id: 'prod-2',
    name: 'Lunar Minimalist Watch',
    sku: 'LUN-WTCH-WHT',
    category: 'Accessories',
    categoryStyle: 'bg-emerald-100 text-emerald-800',
    supplier: 'Aura Lifestyle',
    price: '$215.00',
    stock: 3,
    stockStatus: 'low_stock',
    stockLabel: 'Low: 3 left',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmNmAdGco1358n8YaV9MJ5-UzKpBG3SmOTWE2IJt_k_7HGYOmW6WJgKf-e3n2ajW08-tClrnne2LKW7p0-a_vLvDT4WPvOIwCDIIKu8CelATe4vpkU9xJ6LwUs38GdkO5-rfzZQihHn4GjAraAlrOWtI-dgHNlRnx44pov3RdIFpUPot133lSciCZwcFRZ7ACukdEGSaBjy4tPdMmKykq9hWy-m_5sVwX5SWhY5YVNsbnIeXNDwhwwACOQkhPNabGpM2Ltm0LalLY',
  },
  {
    id: 'prod-3',
    name: 'Eclipse Polarized Lenses',
    sku: 'ECL-SUN-BLK',
    category: 'Accessories',
    categoryStyle: 'bg-emerald-100 text-emerald-800',
    supplier: 'Elite Optics',
    price: '$85.00',
    stock: 0,
    stockStatus: 'out_of_stock',
    stockLabel: 'Out of stock',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9fUf1xTr2nkEgiH63M5gv8JVGka1njArpLviOyuVPo-rQBmlHBSU-YM5gck6ZnGsVNfQ6cXnRTO_652g62swxBsJ-IjRd73ipuPFsEVSHN3wI1M_XxtXh2a353kLNOrosrtC-CJe1nC9jMOlHVe1z3qg3yofUXBcLKmLvUOHo1dwzgiNu66VBO46VJ5PxkP1o1I_fjBPCOuYMPsC9b-rncJptQ6Zs3G7mliQFhJKeDmJIsbaKI7vQ91dVQWs_5oFztHPJEi-iORA',
  },
  {
    id: 'prod-4',
    name: 'Sonic Zen Headphones',
    sku: 'SNZ-HDP-BLK',
    category: 'Electronics',
    categoryStyle: 'bg-rose-100 text-rose-700',
    supplier: 'Sonic Audio Group',
    price: '$189.50',
    stock: 256,
    stockStatus: 'in_stock',
    stockLabel: '256 in stock',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYQ6BBjHMA8DaQi9riWCitInFFyhPd_v69pIXw_vpS512JhXfsxQnCxGh82aBzGBK2j56m1SfuIQwv0CzTdQsthGEFpOrGE7oo_K63AMo6Wd9xQ-iXi4_fAIushjZuEzXAywwFtH8jCQBFXs14jBrBa5RHjxMFayw6ML7t9TMgyHxegFZLTJTbJ_5Z4rppwPeMX2Kk5Z6YRv564kbL85nmbbZX8-7TQhQxwYIJfSoLDLKt1j9FVQzZAEV7R_F8eEJkyFLNoAIhYFw',
  },
];

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'catalog', label: 'Product Catalog', icon: 'inventory_2', active: true },
  { id: 'suppliers', label: 'Supplier Registry', icon: 'group' },
  { id: 'orders', label: 'Order Management', icon: 'shopping_cart' },
  { id: 'revenue', label: 'Revenue Analytics', icon: 'payments' },
];

export function AdminProductCatalog({ onNavigate, onAddNewProduct }) {
  const [products, setProducts] = useState(INITIAL_CATALOG_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id, name) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Removed "${name}" from catalog.`);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen flex flex-col font-['Inter',sans-serif] antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#b90041] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-xl">info</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="flex min-h-screen flex-1">
        {/* ===================== SideNavBar ===================== */}
        <aside className="hidden md:flex flex-col h-screen w-64 border-r border-slate-200/60 bg-slate-50 dark:bg-slate-950 py-6 pr-4 sticky top-0 flex-shrink-0 z-40">
          <div className="px-6 mb-8">
            <h1 className="text-xl font-black text-[#FF3F6C] font-['Plus_Jakarta_Sans',sans-serif]">
              Admin Console
            </h1>
            <p className="text-xs text-slate-500 font-medium">Catalog Management</p>
          </div>

          <div className="flex-1 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = item.active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate && onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full font-medium text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#FF3F6C] bg-white dark:bg-slate-900 font-bold shadow-xs translate-x-1'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:translate-x-1'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="px-4 mt-auto space-y-1 border-t border-slate-200/60 pt-4">
            <button
              type="button"
              onClick={() => showToast('Opening Admin Help Center...')}
              className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-r-full text-sm font-medium transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">help</span>
              <span>Help Center</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Admin logged out.')}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-r-full text-sm font-medium transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ===================== Main Content Canvas ===================== */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* TopNavBar */}
          <header className="sticky top-0 right-0 left-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs border-b border-slate-200/60">
            <div className="flex justify-between items-center px-6 py-3 w-full">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100/70 border border-transparent rounded-xl focus:bg-white focus:border-[#FF3F6C]/40 focus:ring-2 focus:ring-[#FF3F6C]/20 transition-all font-body text-sm outline-none"
                    placeholder="Search products, suppliers, SKU..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => showToast('No new notifications.')}
                  aria-label="Notifications"
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Catalog Settings')}
                  aria-label="Settings"
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined">settings</span>
                </button>
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                <img
                  alt="Admin profile avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdOhPkoDJWEXgfTT7st6Uk5LSePWHaxqmtsu4ltDuIWDykY8GODMjec0N2oxCDCGcVqrB5EOpKLFs8Q10IzlkIMquZeiiN2MG7hB9477HmfZfRQHslCgcG5XhYI79xnafW-rtfrQc0iH4QchGJ7WV4NDxk7YlsUmG7btSM8dYQF1aPyICk5jTsM_aATygpKNlQNI-zVhxynm9Touyo6hV_suuhRi0hoE98101B2f5iBa0-KWwh_xrfqEBqKHrMC6IhzeAqk6lZRYM"
                />
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6 md:p-8 pb-20">
            {/* Hero Action Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-[#191C1E]">
                  Product Catalog
                </h2>
                <p className="text-slate-500 font-body mt-1">
                  Manage your curated social commerce inventory and supplier listings.
                </p>
              </div>
              <button
                type="button"
                onClick={onAddNewProduct || (() => showToast('Opening Add Product Flow...'))}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#b90041] to-[#df2457] hover:from-[#a00037] hover:to-[#c71e4d] text-white rounded-xl font-semibold shadow-lg shadow-[#b90041]/20 hover:shadow-[#b90041]/40 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span>
                <span>Add New Product</span>
              </button>
            </div>

            {/* Stats Overview Cards (Bento Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:shadow-md transition-all">
                <p className="text-xs font-bold text-[#b90041] tracking-widest uppercase mb-1">
                  Total Products
                </p>
                <h3 className="text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif]">
                  1,284
                </h3>
                <div className="mt-2 text-xs text-[#006a34] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>12% from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:shadow-md transition-all">
                <p className="text-xs font-bold text-[#4d41df] tracking-widest uppercase mb-1">
                  Active Listings
                </p>
                <h3 className="text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif]">
                  1,102
                </h3>
                <div className="mt-2 text-xs text-slate-500 font-medium">
                  92% of total inventory
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:shadow-md transition-all">
                <p className="text-xs font-bold text-[#008644] tracking-widest uppercase mb-1">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif]">
                  $42.8k
                </h3>
                <div className="mt-2 text-xs text-[#006a34] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>8% growth</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:shadow-md transition-all">
                <p className="text-xs font-bold text-[#ba1a1a] tracking-widest uppercase mb-1">
                  Stock Alerts
                </p>
                <h3 className="text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif]">24</h3>
                <div className="mt-2 text-xs text-[#ba1a1a] font-medium">
                  Critical replenishment needed
                </div>
              </div>
            </div>

            {/* Product Table Module */}
            <div className="bg-white rounded-3xl shadow-xs overflow-hidden border border-slate-100">
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#191C1E]">
                    Inventory List
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Category:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Exporting catalog CSV...')}
                    title="Export CSV"
                    className="p-2 text-slate-400 hover:text-[#b90041] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    title="Print Table"
                    className="p-2 text-slate-400 hover:text-[#b90041] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">print</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Supplier</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          No products match your search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const isOOS = p.stockStatus === 'out_of_stock';
                        const isLow = p.stockStatus === 'low_stock';

                        return (
                          <tr key={p.id} className="group hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                                  <img
                                    alt={p.name}
                                    src={p.imageUrl}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-[#191C1E] text-sm">{p.name}</div>
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    SKU: {p.sku}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.categoryStyle}`}
                              >
                                {p.category}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                              {p.supplier}
                            </td>

                            <td className="px-6 py-4 text-sm font-bold text-[#191C1E]">
                              {p.price}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    isOOS
                                      ? 'bg-slate-300'
                                      : isLow
                                      ? 'bg-[#ba1a1a] animate-pulse'
                                      : 'bg-[#006a34]'
                                  }`}
                                ></div>
                                <span
                                  className={`text-xs font-semibold ${
                                    isOOS
                                      ? 'text-slate-400'
                                      : isLow
                                      ? 'text-[#ba1a1a]'
                                      : 'text-[#191C1E]'
                                  }`}
                                >
                                  {p.stockLabel}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => setEditingProduct(p)}
                                  title="Edit Product"
                                  className="p-2 text-slate-400 hover:text-[#4d41df] hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(p.id, p.name)}
                                  title="Delete Product"
                                  className="p-2 text-slate-400 hover:text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => showToast(`Viewing public page for "${p.name}"`)}
                                  title="View Listing"
                                  className="p-2 text-slate-400 hover:text-[#b90041] hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    visibility
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">
                  Showing 1-{filteredProducts.length} of 1,284 products
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-slate-400 hover:text-[#b90041] disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <div className="flex items-center gap-1 mx-2">
                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? 'bg-[#b90041] text-white shadow-xs'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <span className="text-slate-300 text-xs px-1">...</span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(321)}
                      className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                    >
                      321
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-2 text-slate-400 hover:text-[#b90041] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191C1E] mb-1">
              Quick Edit: {editingProduct.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">SKU: {editingProduct.sku}</p>

            <div className="space-y-3 mb-5">
              <label className="text-xs font-bold text-slate-700 block">
                Price
                <input
                  type="text"
                  defaultValue={editingProduct.price}
                  id="edit-price-input"
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#b90041]"
                />
              </label>
              <label className="text-xs font-bold text-slate-700 block">
                Stock Quantity
                <input
                  type="number"
                  defaultValue={editingProduct.stock}
                  id="edit-stock-input"
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#b90041]"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const newPrice = document.getElementById('edit-price-input')?.value;
                  const newStock = parseInt(
                    document.getElementById('edit-stock-input')?.value || '0',
                    10
                  );
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === editingProduct.id
                        ? {
                            ...p,
                            price: newPrice || p.price,
                            stock: newStock,
                            stockLabel:
                              newStock === 0
                                ? 'Out of stock'
                                : newStock <= 5
                                ? `Low: ${newStock} left`
                                : `${newStock} in stock`,
                            stockStatus:
                              newStock === 0
                                ? 'out_of_stock'
                                : newStock <= 5
                                ? 'low_stock'
                                : 'in_stock',
                          }
                        : p
                    )
                  );
                  showToast(`Updated "${editingProduct.name}" details.`);
                  setEditingProduct(null);
                }}
                className="flex-1 py-2.5 bg-[#b90041] text-white text-xs font-bold rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductCatalog;
