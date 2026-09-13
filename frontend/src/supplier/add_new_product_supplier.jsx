import React, { useState } from 'react';

const INITIAL_COLORS = ['Red', 'Blue', 'Green', 'Black'];
const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export function AddNewProductSupplier({ onBack, onSaveDraft, onPublish }) {
  // Form State
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState('');
  const [supplierPrice, setSupplierPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [skuId, setSkuId] = useState('');

  // Variants State
  const [selectedColors, setSelectedColors] = useState(['Red']);
  const [availableColors, setAvailableColors] = useState(INITIAL_COLORS);
  const [newColorInput, setNewColorInput] = useState('');
  const [showAddColorInput, setShowAddColorInput] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState(['M']);

  // Media state
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([null, null, null, null]);

  // Toast alert
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculate discount automatically if MRP and Supplier Price are provided
  const handlePriceChange = (val, type) => {
    if (type === 'mrp') {
      setMrp(val);
      if (val && supplierPrice) {
        const m = parseFloat(val);
        const s = parseFloat(supplierPrice);
        if (m > 0 && s >= 0 && m >= s) {
          setDiscount(Math.round(((m - s) / m) * 100).toString());
        }
      }
    } else if (type === 'supplierPrice') {
      setSupplierPrice(val);
      if (mrp && val) {
        const m = parseFloat(mrp);
        const s = parseFloat(val);
        if (m > 0 && s >= 0 && m >= s) {
          setDiscount(Math.round(((m - s) / m) * 100).toString());
        }
      }
    }
  };

  // Color toggle
  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleAddCustomColor = () => {
    if (newColorInput.trim() && !availableColors.includes(newColorInput.trim())) {
      const color = newColorInput.trim();
      setAvailableColors([...availableColors, color]);
      setSelectedColors([...selectedColors, color]);
      setNewColorInput('');
      setShowAddColorInput(false);
    }
  };

  // Size toggle
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Image Upload handler
  const handleImageUpload = (e, index) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (index === 'primary') {
        setPrimaryImage(url);
      } else {
        const updated = [...secondaryImages];
        updated[index] = url;
        setSecondaryImages(updated);
      }
    }
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      showToast('Please enter a Product Name.');
      return;
    }

    const newProduct = {
      name: productName,
      category,
      brand,
      description,
      mrp,
      price: `₹${supplierPrice || '0'}`,
      stock: parseInt(stockQuantity, 10) || 0,
      sku: skuId || `SKU-${Date.now().toString().slice(-6)}`,
      colors: selectedColors,
      sizes: selectedSizes,
      image: primaryImage,
    };

    if (onPublish) {
      onPublish(newProduct);
    } else {
      showToast('🚀 Product successfully published to your Meesho catalog!');
    }
  };

  const handleDraft = () => {
    showToast('💾 Product draft saved successfully.');
    if (onSaveDraft) onSaveDraft();
  };

  return (
    <div className="bg-[#F8F9FB] text-[#191C1E] min-h-screen pb-36 font-['Inter',sans-serif] antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#006a34] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ===================== TopAppBar ===================== */}
      <header className="sticky top-0 w-full z-40 flex items-center px-4 h-16 bg-[#F8F9FB] dark:bg-slate-900 border-b border-slate-200/60">
        <div className="flex items-center w-full max-w-3xl mx-auto">
          <button
            type="button"
            onClick={onBack || (() => window.history.back())}
            aria-label="Go Back"
            className="p-2 mr-2 active:scale-95 duration-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#191C1E] dark:text-slate-400">
              arrow_back
            </span>
          </button>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl tracking-tight text-[#191C1E] dark:text-white">
            Add New Product
          </h1>
        </div>
      </header>

      {/* ===================== Form Canvas ===================== */}
      <form onSubmit={handleSubmit}>
        <main className="pt-6 px-4 max-w-3xl mx-auto space-y-8">
          {/* Section 1: Image Upload */}
          <section className="space-y-4">
            <div>
              <h2 className="text-[#191C1E] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg">
                Product Media
              </h2>
              <p className="text-slate-500 text-sm">Add up to 5 high-quality photos</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Primary Large Photo */}
              <label className="col-span-2 aspect-[4/5] bg-white rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#b90041] flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative shadow-xs">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'primary')}
                />
                {primaryImage ? (
                  <>
                    <img
                      src={primaryImage}
                      alt="Primary Product"
                      className="w-full h-full object-cover rounded-3xl"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2">
                      <span className="material-symbols-outlined text-lg">edit</span> Change Photo
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-[#b90041]/10 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[#b90041] text-3xl">
                        add_a_photo
                      </span>
                    </div>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#b90041]">
                      Add Primary Photo
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Recommended: 1080 x 1350 px</p>
                  </>
                )}
              </label>

              {/* Secondary Placeholders */}
              {[0, 1, 2, 3].map((idx) => (
                <label
                  key={idx}
                  className="aspect-square bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#b90041] flex items-center justify-center cursor-pointer transition-all overflow-hidden relative shadow-xs"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, idx)}
                  />
                  {secondaryImages[idx] ? (
                    <img
                      src={secondaryImages[idx]}
                      alt={`Photo ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400 hover:text-[#b90041] transition-colors">
                      add
                    </span>
                  )}
                </label>
              ))}
            </div>
          </section>

          {/* Section 2: Basic Info */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] space-y-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-[#b90041]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                info
              </span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191C1E]">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2 ml-1">
                  Product Name *
                </label>
                <input
                  required
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Premium Silk Floral Saree"
                  className="w-full bg-[#f2f4f6] border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all placeholder:text-slate-400 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 ml-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#f2f4f6] border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all cursor-pointer outline-none text-sm font-medium"
                >
                  <option value="">Select Category</option>
                  <option value="Ethnic Wear">Ethnic Wear</option>
                  <option value="Western Wear">Western Wear</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 ml-1">
                  Brand (Optional)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full bg-[#f2f4f6] border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all placeholder:text-slate-400 outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Product Description */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] space-y-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-[#b90041]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                description
              </span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191C1E]">
                Product Description
              </h3>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about the fabric, fit, style, and care instructions..."
              className="w-full bg-[#f2f4f6] border border-transparent rounded-2xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all placeholder:text-slate-400 outline-none text-sm font-medium"
            ></textarea>
          </div>

          {/* Section 4: Pricing & Inventory */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] space-y-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-[#b90041]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                payments
              </span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191C1E]">
                Pricing &amp; Inventory
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 ml-1">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => handlePriceChange(e.target.value, 'mrp')}
                  placeholder="0.00"
                  className="w-full bg-[#f2f4f6] border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 ml-1">
                  Supplier Price (₹) *
                </label>
                <input
                  type="number"
                  value={supplierPrice}
                  onChange={(e) => handlePriceChange(e.target.value, 'supplierPrice')}
                  placeholder="0.00"
                  className="w-full bg-[#f2f4f6] border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 ml-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#f2f4f6] border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2 ml-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-[#f2f4f6] border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all outline-none text-sm font-semibold"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2 ml-1">
                  SKU ID
                </label>
                <input
                  type="text"
                  value={skuId}
                  onChange={(e) => setSkuId(e.target.value)}
                  placeholder="e.g. BLK-SILK-SR-01"
                  className="w-full bg-[#f2f4f6] border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#b90041]/40 focus:ring-2 focus:ring-[#b90041]/20 transition-all outline-none text-sm font-semibold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Variants */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_12px_32px_rgba(25,28,30,0.04)] space-y-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-[#b90041]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                palette
              </span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191C1E]">
                Variants
              </h3>
            </div>

            <div className="space-y-6">
              {/* Available Colors */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-3 ml-1">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {availableColors.map((color) => {
                    const isSelected = selectedColors.includes(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#b90041] text-white shadow-sm'
                            : 'bg-[#f2f4f6] text-[#191C1E] hover:bg-[#e7e8ea]'
                        }`}
                      >
                        {color}
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm">close</span>
                        )}
                      </button>
                    );
                  })}

                  {showAddColorInput ? (
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                      <input
                        type="text"
                        value={newColorInput}
                        onChange={(e) => setNewColorInput(e.target.value)}
                        placeholder="Color name..."
                        className="text-xs bg-transparent outline-none w-24"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomColor}
                        className="text-xs font-bold text-[#b90041]"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddColorInput(true)}
                      aria-label="Add Color"
                      className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[#b90041] hover:bg-[#b90041]/5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Available Sizes */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-3 ml-1">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-3">
                  {ALL_SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`w-12 h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#b90041] text-white shadow-lg shadow-[#b90041]/20'
                            : 'bg-[#f2f4f6] text-[#191C1E] hover:border-[#b90041] border-2 border-transparent'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Helpful Tip Overlay */}
          <div className="bg-[#675df9]/10 p-6 rounded-3xl flex gap-4 items-start border border-[#675df9]/20">
            <div className="bg-[#4d41df] p-2 rounded-xl text-white flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-lg">lightbulb</span>
            </div>
            <div>
              <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#4d41df]">
                Supplier Tip
              </h4>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                Products with at least 3 photos and detailed descriptions have a{' '}
                <span className="font-bold text-[#191C1E]">45% higher conversion rate</span> on our
                social feeds.
              </p>
            </div>
          </div>
        </main>

        {/* ===================== Sticky Footer CTA ===================== */}
        <footer className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-4 z-40 border-t border-slate-200/50 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button
              type="button"
              onClick={handleDraft}
              className="flex-1 bg-[#f2f4f6] hover:bg-[#e7e8ea] text-[#191C1E] font-['Plus_Jakarta_Sans',sans-serif] font-bold py-3.5 px-6 rounded-2xl active:scale-[0.98] transition-all cursor-pointer text-sm"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="flex-[2] bg-gradient-to-r from-[#B90041] to-[#DF2457] hover:from-[#a00037] hover:to-[#c71e4d] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-[#b90041]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Save &amp; List Product
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

export default AddNewProductSupplier;
