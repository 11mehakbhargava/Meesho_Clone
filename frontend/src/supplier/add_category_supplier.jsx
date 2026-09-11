import React, { useState } from 'react';

export function AddCategorySupplier({ onBack, onSaveCategory }) {
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [description, setDescription] = useState('');
  const [iconImage, setIconImage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIconImage(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showToast('Please enter a Category Name.');
      return;
    }

    const categoryData = {
      name: categoryName,
      parent: parentCategory || 'None',
      description,
      icon: iconImage,
    };

    if (onSaveCategory) {
      onSaveCategory(categoryData);
    } else {
      showToast(`Category "${categoryName}" created successfully!`);
    }
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen flex flex-col font-['Inter',sans-serif] antialiased pb-32">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#006a34] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ===================== TopAppBar ===================== */}
      <header className="bg-[#F8F9FB] dark:bg-slate-900 sticky top-0 z-40 border-b border-slate-200/60">
        <div className="flex items-center px-4 h-16 w-full max-w-3xl mx-auto">
          <button
            type="button"
            onClick={onBack || (() => window.history.back())}
            aria-label="Go Back"
            className="hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors active:scale-95 p-2 rounded-full mr-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#191C1E] dark:text-slate-400">
              arrow_back
            </span>
          </button>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#191C1E] dark:text-white flex-1">
            Create New Category
          </h1>
        </div>
        {/* Style Separation Logic */}
        <div className="bg-[#F2F4F6] dark:bg-slate-800 h-2 w-full"></div>
      </header>

      {/* ===================== Main Content ===================== */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Category Image Upload */}
          <section>
            <div className="flex flex-col items-center">
              <label className="relative group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="w-32 h-32 rounded-2xl bg-[#e7e8ea] hover:bg-[#dde4e6] flex flex-col items-center justify-center border-2 border-dashed border-[#8f6f72]/40 hover:border-[#b90041] transition-all overflow-hidden relative shadow-xs">
                  {iconImage ? (
                    <>
                      <img
                        src={iconImage}
                        alt="Category Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <span className="material-symbols-outlined text-base">edit</span> Change
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[#8f6f72] text-4xl mb-1 group-hover:scale-110 transition-transform">
                        add_a_photo
                      </span>
                      <span className="text-xs font-medium text-[#8f6f72]">Upload Icon</span>
                    </>
                  )}
                </div>
              </label>
              <p className="mt-4 text-center text-slate-500 text-sm font-medium">
                Category Display Image
              </p>
            </div>
          </section>

          {/* Main Input Form */}
          <section className="space-y-6">
            {/* Category Name */}
            <div className="group">
              <label
                className="block text-sm font-semibold text-[#191c1e] mb-2 ml-1"
                htmlFor="category-name"
              >
                Category Name *
              </label>
              <input
                id="category-name"
                required
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Winter Wear"
                className="w-full h-14 px-4 bg-white rounded-xl border border-slate-200 focus:border-[#b90041] focus:ring-2 focus:ring-[#b90041]/20 transition-all text-base font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[#191c1e] placeholder:text-slate-400 placeholder:font-normal outline-none shadow-xs"
              />
            </div>

            {/* Parent Category Selection */}
            <div className="group">
              <label
                className="block text-sm font-semibold text-[#191c1e] mb-2 ml-1"
                htmlFor="parent-category"
              >
                Parent Category
              </label>
              <div className="relative">
                <select
                  id="parent-category"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className="appearance-none w-full h-14 px-4 bg-white rounded-xl border border-slate-200 focus:border-[#b90041] focus:ring-2 focus:ring-[#b90041]/20 transition-all text-[#191c1e] font-medium text-sm cursor-pointer outline-none shadow-xs"
                >
                  <option value="">None (Top Level Category)</option>
                  <option value="apparel">Apparel</option>
                  <option value="electronics">Electronics</option>
                  <option value="home">Home &amp; Living</option>
                  <option value="beauty">Beauty &amp; Wellness</option>
                  <option value="footwear">Footwear</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  expand_more
                </span>
              </div>
            </div>

            {/* Description Area */}
            <div className="group">
              <label
                className="block text-sm font-semibold text-[#191c1e] mb-2 ml-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about products that fall under this category..."
                className="w-full p-4 bg-white rounded-xl border border-slate-200 focus:border-[#b90041] focus:ring-2 focus:ring-[#b90041]/20 transition-all text-[#191c1e] text-sm placeholder:text-slate-400 resize-none outline-none shadow-xs"
              ></textarea>
            </div>
          </section>

          {/* Tip Section */}
          <section className="p-5 bg-[#006a34]/5 rounded-2xl border border-[#7dfca2]/40 flex gap-4 items-start">
            <div className="flex-shrink-0 text-[#006a34]">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#006a34] mb-1">Tips for better visibility</h4>
              <p className="text-sm text-[#005227] leading-relaxed">
                Use descriptive names and high-quality icons to help resellers find your products easily in the feed.
              </p>
            </div>
          </section>

          {/* Fixed Action Footer */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(25,28,30,0.06)] border-t border-slate-200/60 z-40">
            <div className="max-w-3xl mx-auto">
              <button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-[#b90041] to-[#df2457] hover:from-[#a00037] hover:to-[#c71e4d] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base rounded-2xl shadow-lg shadow-[#b90041]/20 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">save</span>
                Save Category
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddCategorySupplier;
