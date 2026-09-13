import React, { useState } from 'react';

export default function RatingsReviews({ onNavigate = () => {}, onBack }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [helpfulCounts, setHelpfulCounts] = useState({ 1: 24, 2: 12, 3: 8 });
  const [helpfulClicked, setHelpfulClicked] = useState(new Set());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleHelpful = (id) => {
    if (helpfulClicked.has(id)) {
      setHelpfulClicked((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setHelpfulCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      triggerToast('Removed feedback');
    } else {
      setHelpfulClicked((prev) => new Set(prev).add(id));
      setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      triggerToast('Marked review as Helpful! 👍');
    }
  };

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Priya R.',
      initials: 'PR',
      rating: 5,
      verified: true,
      time: '2 days ago',
      comment:
        'The fabric is very soft and the fit is perfect! I ordered it for my boutique customers and they absolutely loved the design. The stitching is high quality. Highly recommend for resellers looking for premium stock.',
      photos: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80',
      ],
      type: 'positive',
    },
    {
      id: 2,
      name: 'Aman Sharma',
      initials: 'AS',
      rating: 4,
      verified: true,
      time: '1 week ago',
      comment:
        'Great product for the price. The color is slightly brighter than the pictures but still looks elegant. Delivery was super fast, reached in 3 days. My customers are happy with the purchase.',
      photos: [],
      type: 'positive',
    },
    {
      id: 3,
      name: 'Meena Kumari',
      initials: 'MK',
      rating: 5,
      verified: true,
      time: '12 days ago',
      comment:
        'Amazing quality. Truly value for money. The dupatta work is very intricate. I will be ordering more in different colors soon.',
      photos: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&auto=format&fit=crop&q=80',
      ],
      type: 'positive',
    },
  ]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      triggerToast('Please enter your review comment');
      return;
    }

    const createdReview = {
      id: Date.now(),
      name: newName.trim() || 'Verified Customer',
      initials: (newName.trim() || 'VC').slice(0, 2).toUpperCase(),
      rating: newRating,
      verified: true,
      time: 'Just now',
      comment: newComment,
      photos: [],
      type: newRating >= 4 ? 'positive' : 'critical',
    };

    setReviews([createdReview, ...reviews]);
    setShowReviewModal(false);
    setNewComment('');
    setNewName('');
    triggerToast('Thank you! Your review has been published ✨');
  };

  const filterOptions = ['All', 'With Photos (420)', 'Verified Purchases', 'Positive', 'Critical'];

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'With Photos (420)') return r.photos.length > 0;
    if (activeFilter === 'Verified Purchases') return r.verified;
    if (activeFilter === 'Positive') return r.rating >= 4;
    if (activeFilter === 'Critical') return r.rating < 4;
    return true;
  });

  const photoGallery = [
    {
      user: '@Priya_S',
      img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
    },
    {
      user: '@Anita_K',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    },
    {
      user: '@Meena_V',
      img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="bg-[#f8f9fb] font-sans text-[#191c1e] min-h-screen antialiased selection:bg-pink-100 selection:text-pink-600 pb-32">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#008644] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 h-16 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onBack ? onBack() : onNavigate('product'))}
            className="p-2 hover:bg-slate-100 transition-colors rounded-full active:scale-95 text-[#191c1e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div onClick={() => onNavigate('product')} className="cursor-pointer">
            <h1 className="font-extrabold text-base md:text-lg text-[#191c1e]">
              Ratings & Reviews
            </h1>
            <p className="text-[11px] text-slate-400">Royal Orchid Kurta Set ➔</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('cart')}
            className="p-2 hover:bg-slate-100 rounded-full active:scale-95 text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
          </button>
          <button
            onClick={() => triggerToast('Review breakdown link copied!')}
            className="p-2 hover:bg-slate-100 rounded-full active:scale-95 text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">share</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-4 max-w-3xl mx-auto space-y-6">
        {/* Ratings Overview Section */}
        <section className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            {/* Average Rating Block */}
            <div className="flex flex-col items-center justify-center p-5 bg-[#f8f9fb] rounded-2xl md:w-48 border border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black text-[#191c1e]">4.5</span>
                <span className="text-lg font-bold text-slate-400">/5</span>
              </div>
              <div className="flex items-center gap-0.5 my-2 text-[#FF3F6C]">
                {'★★★★☆'}
              </div>
              <p className="text-xs text-slate-500 font-semibold">2,540 Customer Ratings</p>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="flex-1 space-y-2.5">
              {[
                { star: 5, pct: '75%', count: '1,905' },
                { star: 4, pct: '15%', count: '381' },
                { star: 3, pct: '5%', count: '127' },
                { star: 2, pct: '3%', count: '76' },
                { star: 1, pct: '2%', count: '51' },
              ].map((row) => (
                <div key={row.star} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-4 text-slate-700">{row.star}★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] rounded-full"
                      style={{ width: row.pct }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 w-12 text-right font-medium">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Filters */}
        <section className="space-y-3">
          <h3 className="font-extrabold text-sm text-[#191c1e]">Popular Filters</h3>
          <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF3F6C] text-white shadow-md shadow-pink-500/20 scale-102'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {/* Reviews with Photos Gallery */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#191c1e]">Customer Photos (420)</h3>
            <button
              onClick={() => triggerToast('Viewing all 420 customer photos')}
              className="text-[#FF3F6C] font-bold text-xs hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-1">
            {photoGallery.map((item, idx) => (
              <div
                key={idx}
                onClick={() => triggerToast(`Photo uploaded by ${item.user}`)}
                className="flex-none w-32 h-40 bg-slate-100 rounded-2xl overflow-hidden relative group cursor-pointer border border-slate-200 shadow-sm"
              >
                <img
                  src={item.img}
                  alt="Customer review photo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="text-[10px] text-white font-bold">{item.user}</span>
                </div>
              </div>
            ))}
            <div
              onClick={() => triggerToast('Viewing +417 more customer photos')}
              className="flex-none w-32 h-40 bg-pink-500/90 text-white rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-md hover:bg-pink-600 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl mb-1">photo_library</span>
              <span className="font-black text-base">+417</span>
              <span className="text-[10px] font-semibold">More Photos</span>
            </div>
          </div>
        </section>

        {/* Vertical Helpful Review Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#191c1e]">
              Customer Reviews ({filteredReviews.length})
            </h3>
          </div>

          {filteredReviews.map((review) => {
            const isHelpful = helpfulClicked.has(review.id);
            const count = helpfulCounts[review.id] || 0;
            return (
              <div
                key={review.id}
                className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100 space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-[#FF3F6C] font-black flex items-center justify-center text-xs">
                      {review.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#191c1e]">{review.name}</span>
                        {review.verified && (
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            <span
                              className="material-symbols-outlined text-[12px] text-[#006a34]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                            <span className="text-[9px] font-bold text-[#006a34]">
                              Verified Buyer
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{review.time}</span>
                    </div>
                  </div>

                  <div className="bg-[#006a34] text-white px-2 py-0.5 rounded-lg flex items-center gap-0.5 text-xs font-extrabold">
                    {review.rating} ★
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{review.comment}</p>

                {review.photos.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {review.photos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="User review attachment"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 cursor-pointer hover:opacity-90"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 italic">
                    {count > 0 ? `${count} people found this helpful` : 'Was this review helpful?'}
                  </p>
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      isHelpful
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                    <span>{isHelpful ? 'Helpful ✓' : 'Helpful'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Floating Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg text-[#191c1e]">Write a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className={`text-2xl cursor-pointer ${
                        star <= newRating ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Your Feedback</label>
                <textarea
                  rows={4}
                  placeholder="Share details of your experience regarding fabric quality, fit, and customer satisfaction..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-[#f8f9fb] border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#FF3F6C] hover:bg-[#e02659] text-white font-bold text-xs shadow-md shadow-pink-500/25 cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md z-40 border-t border-slate-100 max-w-3xl mx-auto shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => onNavigate('write_review')}
          className="w-full bg-gradient-to-r from-[#FF3F6C] to-[#DF2457] text-white py-3.5 rounded-2xl font-extrabold text-sm md:text-base shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">rate_review</span>
          <span>Write a Detailed Review ⭐</span>
        </button>
      </div>
    </div>
  );
}