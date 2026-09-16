import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

export default function WriteAReview({ onNavigate = () => {}, onBack }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommend, setRecommend] = useState('yes');
  const [selectedFit, setSelectedFit] = useState('Perfect Fit');
  const [fabricScore, setFabricScore] = useState(85);
  const [stitchingScore, setStitchingScore] = useState(90);
  const [valueRating, setValueRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
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
    1: { label: 'Terrible & Poor Quality', emoji: '😞', color: 'text-red-500' },
    2: { label: 'Fair / Below Expectation', emoji: '😕', color: 'text-orange-500' },
    3: { label: 'Average & Decent', emoji: '😐', color: 'text-amber-500' },
    4: { label: 'Very Good Quality', emoji: '😊', color: 'text-emerald-500' },
    5: { label: 'Excellent & Luxe! Loved it', emoji: '😍', color: 'text-[#df2457]' },
  };

  const quickReviewTags = [
    'True to size & perfect fit',
    'Fabric is super soft & breathable',
    'Exact color match as shown in photos',
    'Premium zari border & embroidery',
    'Value for money purchase',
    'Fast delivery & safe packaging',
  ];

  const handlePhotoUpload = () => {
    if (uploadedPhotos.length >= 6) {
      triggerToast('Maximum 6 photos allowed');
      return;
    }
    const samplePhotos = [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80',
    ];
    const nextPhoto = samplePhotos[uploadedPhotos.length % samplePhotos.length];
    setUploadedPhotos([...uploadedPhotos, nextPhoto]);
    triggerToast('Real photo attached! 📸');
  };

  const handleRemovePhoto = (idx) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx));
    triggerToast('Photo removed');
  };

  const handleAddTagToReview = (tag) => {
    if (reviewText.includes(tag)) return;
    setReviewText((prev) => (prev ? `${prev}. ${tag}` : tag));
    triggerToast(`Added "${tag}" to review! ✨`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      triggerToast('Please select a star rating first!');
      return;
    }
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

  const currentMood = ratingLabels[hoverRating || rating] || ratingLabels[5];

  return (
    <div className="bg-[#f8f9fb] font-sans text-[#191c1e] min-h-screen flex flex-col pb-32 antialiased selection:bg-pink-100 selection:text-pink-600">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#b90041] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">star</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar */}
      <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBack ? onBack() : onNavigate('reviews'))}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-700 cursor-pointer transition-colors active:scale-95"
              title="Back to Reviews"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-[#b90041] leading-none">
                Write a Verified Review
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Help Millions of Meesho Shoppers
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('product')}
            className="text-xs font-bold text-slate-600 hover:text-[#b90041] px-3 py-1.5 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
          >
            View Product ➔
          </button>
        </div>
      </header>

      {/* Main Responsive Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Product Info & Review Tips) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Product Summary Card */}
            <div
              onClick={() => onNavigate('product')}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 cursor-pointer hover:border-pink-200 transition-all group"
            >
              <div className="flex gap-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Minimalist Silk Scarf"
                    src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&auto=format&fit=crop&q=80"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[10px] font-black text-[#b90041] bg-pink-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      ✓ Verified Buyer
                    </span>
                    <h2 className="text-[#191c1e] font-extrabold text-sm leading-snug group-hover:text-[#b90041] transition-colors line-clamp-2">
                      Minimalist Silk Embroidered Floral Dupatta &amp; Scarf
                    </h2>
                  </div>
                  <p className="text-slate-400 text-[11px] font-semibold">
                    Order #MEE-294810 • ₹450
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Delivered on 14 Sept</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span> Return window active
                </span>
              </div>
            </div>

            {/* Review Tips Card */}
            <div className="bg-gradient-to-br from-indigo-50/70 to-pink-50/50 p-5 rounded-3xl border border-indigo-100/60 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
                <span className="material-symbols-outlined text-lg text-indigo-600">lightbulb</span>
                <span>Tips for a Helpful Review</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Upload clear, unboxing or wearing photos in good lighting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Mention if the size matches standard Indian sizing charts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Describe the fabric feel, color accuracy, and stitching quality.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (Review Form & Star Ratings) */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Overall Star Rating Card */}
              <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
                <div>
                  <h3 className="text-[#191c1e] font-black text-xl sm:text-2xl">
                    Rate Your Experience
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    How satisfied are you with this product?
                  </p>
                </div>

                {/* Stars Row */}
                <div className="flex justify-center items-center gap-2 sm:gap-3 py-2">
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
                          className={`material-symbols-outlined text-4xl sm:text-5xl transition-colors ${
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

                {/* Live Mood Indicator */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                  <span className="text-xl">{currentMood.emoji}</span>
                  <span className={`font-black text-sm ${currentMood.color}`}>
                    {currentMood.label}
                  </span>
                </div>
              </section>

              {/* Photo & Video Upload */}
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#191c1e]">
                      Add Photos / Video
                    </h3>
                    <p className="text-xs text-slate-400">
                      Show other shoppers how it looks in real life
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                    {uploadedPhotos.length}/6 Photos
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {/* Upload Button */}
                  <div
                    onClick={handlePhotoUpload}
                    className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-pink-300 hover:bg-pink-50/50 hover:border-pink-500 transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-[#b90041] text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
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
                      className="relative aspect-square rounded-2xl overflow-hidden shadow-xs border border-slate-200 group"
                    >
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer transition-colors shadow-sm"
                        title="Remove photo"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Review Text & Suggestion Chips */}
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#191c1e]">
                      Write Your Review
                    </h3>
                    <p className="text-xs text-slate-400">Share your detailed thoughts</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {reviewText.length}/500 chars
                  </span>
                </div>

                {/* Review Headline Input */}
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Review Headline (e.g., 'Superb quality, loved the silk texture!')"
                  className="w-full p-3.5 bg-[#f8f9fb] border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all font-semibold"
                />

                {/* Review Content Textarea */}
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
                  placeholder="Tell buyers about the fabric quality, stitching, exact color, fitting, and overall look..."
                  className="w-full p-4 bg-[#f8f9fb] border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none transition-all leading-relaxed"
                />

                {/* Quick Suggestion Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tap to add quick highlights:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickReviewTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTagToReview(tag)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-pink-50 hover:text-[#b90041] border border-slate-200 hover:border-pink-200 rounded-full text-xs font-semibold text-slate-600 transition-all cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Recommendation Toggle */}
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
                <h3 className="font-extrabold text-sm sm:text-base text-[#191c1e]">
                  Would you recommend this product to friends?
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRecommend('yes');
                      triggerToast('Marked as Recommended 👍');
                    }}
                    className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      recommend === 'yes'
                        ? 'bg-[#b90041] text-white shadow-lg shadow-pink-500/25 scale-[1.01]'
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
                    className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      recommend === 'no'
                        ? 'bg-slate-800 text-white shadow-lg scale-[1.01]'
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

              {/* Detailed Quality Breakdown & Sliders */}
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                <h3 className="font-extrabold text-sm sm:text-base text-[#191c1e]">
                  Detailed Ratings Breakdown
                </h3>

                {/* Fabric Quality Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Fabric &amp; Material</span>
                    <span className="text-xs font-black text-[#4d41df] bg-indigo-50 px-2 py-0.5 rounded-md">
                      {fabricScore >= 75
                        ? 'Premium Luxe (High)'
                        : fabricScore >= 50
                        ? 'Good Standard'
                        : 'Average'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fabricScore}
                    onChange={(e) => setFabricScore(Number(e.target.value))}
                    className="w-full accent-[#4d41df] cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Standard</span>
                    <span>Average</span>
                    <span>Premium Luxe</span>
                  </div>
                </div>

                {/* Stitching Quality Slider */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Stitching &amp; Finish</span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {stitchingScore >= 80 ? 'Flawless Finish' : 'Standard Stitching'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stitchingScore}
                    onChange={(e) => setStitchingScore(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                </div>

                {/* Fit Selector */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block">
                    How was the size &amp; fit?
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Too Small',
                      'Slightly Small',
                      'Perfect Fit',
                      'Slightly Loose',
                      'Too Large',
                    ].map((fit) => {
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
                              ? 'bg-[#4d41df] text-white shadow-md shadow-indigo-500/25 scale-105'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {fit}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Value for Money & Delivery Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-bold text-slate-700">Value for Money</span>
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
                              valueRating >= s ? 'text-[#008644]' : 'text-slate-300'
                            }`}
                            style={valueRating >= s ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-bold text-slate-700">Delivery &amp; Packaging</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setDeliveryRating(s)}
                          className="cursor-pointer"
                        >
                          <span
                            className={`material-symbols-outlined text-lg ${
                              deliveryRating >= s ? 'text-[#008644]' : 'text-slate-300'
                            }`}
                            style={deliveryRating >= s ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Desktop & Mobile Submit Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => (onBack ? onBack() : onNavigate('reviews'))}
                  className="px-6 py-4 bg-slate-100 text-slate-700 font-extrabold text-xs sm:text-sm rounded-2xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-gradient-to-r from-[#b90041] to-[#df2457] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-pink-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">
                        progress_activity
                      </span>
                      <span>Publishing Review...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Verified Review</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="account" onNavigate={onNavigate} />
    </div>
  );
}