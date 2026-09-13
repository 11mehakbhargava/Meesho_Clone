import React, { useState } from 'react';

export default function WriteAReview({ onNavigate = () => {}, onBack }) {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommend, setRecommend] = useState('yes');
  const [selectedFit, setSelectedFit] = useState('Perfect Fit');
  const [fabricScore, setFabricScore] = useState(80);
  const [valueRating, setValueRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200&auto=format&fit=crop&q=80',
  ]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const ratingLabels = {
    1: 'Needs Improvement',
    2: 'Fair Quality',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent & Luxe',
  };

  const handlePhotoUpload = () => {
    if (uploadedPhotos.length >= 5) {
      triggerToast('Maximum 5 photos allowed');
      return;
    }
    const samplePhotos = [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop&q=80',
    ];
    const nextPhoto = samplePhotos[uploadedPhotos.length % samplePhotos.length];
    setUploadedPhotos([...uploadedPhotos, nextPhoto]);
    triggerToast('Photo attached successfully! 📸');
  };

  const handleRemovePhoto = (idx) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx));
    triggerToast('Photo removed');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    triggerToast('Submitting your verified review... ⭐');
    setTimeout(() => {
      setIsSubmitting(false);
      triggerToast('Review published successfully! 🎉');
      setTimeout(() => {
        onNavigate('reviews');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="bg-[#f8f9fb] font-sans text-[#191c1e] min-h-screen flex flex-col pb-32 antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#b90041] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar */}
      <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onBack ? onBack() : onNavigate('reviews'))}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-700 cursor-pointer transition-colors"
            title="Cancel"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <h1 className="font-extrabold text-base md:text-lg text-[#b90041]">
            Rate & Review Product
          </h1>
        </div>
        <button
          onClick={() => onNavigate('product')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          View Product
        </button>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Product Preview Card */}
        <section
          onClick={() => onNavigate('product')}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-pink-200 transition-all group"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              alt="Minimalist Silk Scarf"
              src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200&auto=format&fit=crop&q=80"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-[#191c1e] font-extrabold text-sm md:text-base leading-tight group-hover:text-[#b90041] transition-colors">
                Minimalist Silk Embroidered Scarf
              </h2>
              <span className="text-[10px] font-bold text-[#b90041] bg-pink-50 px-2 py-0.5 rounded-full">
                Verified Purchase
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">Order #MEE-294810 • Delivered on 22 Oct</p>
          </div>
        </section>

        {/* Main Star Rating Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center space-y-3">
          <h3 className="text-[#191c1e] font-extrabold text-lg">Overall Experience</h3>
          <p className="text-xs text-slate-500">Tap stars to give your overall rating</p>

          <div className="flex justify-center items-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => {
                    setRating(star);
                    triggerToast(`Rated ${star} Star${star > 1 ? 's' : ''}`);
                  }}
                  className="p-1 cursor-pointer transition-transform hover:scale-125 active:scale-95"
                >
                  <span
                    className={`material-symbols-outlined text-4xl md:text-5xl transition-colors ${
                      active ? 'text-[#df2457]' : 'text-slate-200'
                    }`}
                    style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    star
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[#b90041] font-black text-sm tracking-wide">
            {ratingLabels[rating] || 'Select your rating'}
          </p>
        </section>

        {/* Photo Upload Section */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-[#191c1e]">Add Real Photos / Video</h3>
              <p className="text-xs text-slate-400">Help buyers see how it looks in person</p>
            </div>
            <span className="text-xs text-slate-500 font-bold">{uploadedPhotos.length}/5</span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {/* Upload Button */}
            <div
              onClick={handlePhotoUpload}
              className="min-w-[84px] h-24 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-pink-300 hover:bg-pink-50/50 hover:border-pink-500 transition-all cursor-pointer group flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[#b90041] text-2xl group-hover:scale-110 transition-transform">
                add_a_photo
              </span>
              <span className="text-[10px] font-black text-[#b90041] mt-1 uppercase tracking-wider">
                Upload
              </span>
            </div>

            {/* Uploaded Thumbnails */}
            {uploadedPhotos.map((photo, index) => (
              <div
                key={index}
                className="relative min-w-[84px] h-24 rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex-shrink-0 group"
              >
                <img
                  src={photo}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer transition-colors"
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Review Input */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-[#191c1e]">Share your detailed feedback</h3>
            <span className="text-xs text-slate-400">{reviewText.length}/500</span>
          </div>
          <textarea
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
            placeholder="Tell other shoppers about the material quality, exact color match, stitching, and wearing comfort..."
            className="w-full p-4 bg-[#f8f9fb] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 resize-none"
          />
        </section>

        {/* Recommendation Toggle */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-extrabold text-sm text-[#191c1e]">
            Would you recommend this product to friends?
          </h3>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setRecommend('yes');
                triggerToast('Recommended 👍');
              }}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                recommend === 'yes'
                  ? 'bg-[#b90041] text-white shadow-md shadow-pink-500/25 scale-[1.02]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={recommend === 'yes' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                thumb_up
              </span>
              <span>Yes, Definitely</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRecommend('no');
                triggerToast('Marked as Not Recommended 👎');
              }}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                recommend === 'no'
                  ? 'bg-slate-800 text-white shadow-md scale-[1.02]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={recommend === 'no' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                thumb_down
              </span>
              <span>No, Not Really</span>
            </button>
          </div>
        </section>

        {/* Detailed Ratings Breakdown */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-extrabold text-sm text-[#191c1e]">Detailed Quality Breakdown</h3>

          {/* Fabric Quality Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600">Fabric & Material Quality</span>
              <span className="text-xs font-black text-[#4d41df]">
                {fabricScore >= 75 ? 'Luxe Quality' : fabricScore >= 50 ? 'Good' : 'Average'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fabricScore}
              onChange={(e) => setFabricScore(Number(e.target.value))}
              className="w-full accent-[#4d41df] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Standard</span>
              <span>Average</span>
              <span>Premium Luxe</span>
            </div>
          </div>

          {/* Fit Selector */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-600 block">How was the size & fit?</span>
            <div className="flex flex-wrap gap-2">
              {['Too Small', 'Slightly Small', 'Perfect Fit', 'Slightly Loose', 'Too Large'].map(
                (fit) => {
                  const isSelected = selectedFit === fit;
                  return (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => {
                        setSelectedFit(fit);
                        triggerToast(`Fit set to: ${fit}`);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#4d41df] text-white shadow-md shadow-indigo-500/25'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {fit}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Value for Money */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600">Value for Money</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setValueRating(s)}
                    className="cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${
                        valueRating >= s ? 'text-[#008644]' : 'text-slate-200'
                      }`}
                      style={valueRating >= s ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 w-full p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-40">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : onNavigate('reviews'))}
            className="px-5 py-4 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl hover:bg-slate-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-4 bg-gradient-to-r from-[#b90041] to-[#df2457] text-white font-extrabold text-sm md:text-base rounded-2xl shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Submit Verified Review</span>
                <span>➔</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}