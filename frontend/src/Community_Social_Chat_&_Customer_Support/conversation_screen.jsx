import React, { useState, useRef, useEffect } from 'react';

const INITIAL_MESSAGES = [
  {
    id: 'm1',
    sender: 'them',
    text: 'Is this item available in XL?',
    time: '10:15 AM',
  },
  {
    id: 'm2',
    sender: 'me',
    text: 'Yes, we just restocked it!',
    time: '10:16 AM',
    status: 'delivered',
  },
  {
    id: 'm3',
    sender: 'them',
    text: 'Perfect. Can you ship it by tomorrow if I place the order now?',
    time: '10:18 AM',
  },
  {
    id: 'm4',
    sender: 'me',
    text: 'Ready for dispatch! We have 12 units of XL remaining.',
    time: '10:20 AM',
    status: 'delivered',
    mediaUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtSLAzZr8RCs9vjAzzFfbapht0Notl4uebAq55GN0EmKJT2qQcXOfMvRaLuhqJR6rkYtN6abeewrQb1K3KSKxkNdGEgJPy1bXm57RdJKdswC0Xf0brp-iX2V3DobWXJgB67Ztzoeb8xU96WbplUntUXNHV5wD3tiB8IBrAP3VYWAH3yyN8hYVC3xCSSBhDleE4Ilg__QwDod-2hlJ6lzEymBm7euHneaI0a7ycnqSSbeSq1zg2JjcLNeNUEiAAT7Qi-MCW2_wGS00',
  },
];

export function ConversationScreen({ onNavigate, onBack }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulated supplier response
    setTimeout(() => {
      let replyText = "Great! I have confirmed your request. We'll update the tracking number shortly.";
      if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('discount')) {
        replyText = 'For bulk orders above 10 pieces, we can offer an additional 12% margin discount!';
      } else if (userText.toLowerCase().includes('photo') || userText.toLowerCase().includes('video')) {
        replyText = 'Sharing the unboxing video and raw camera clips to your WhatsApp right away.';
      }

      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const handleSendPreset = (text) => {
    setInputMessage(text);
  };

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2f06be] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce text-xs font-semibold">
          <span className="material-symbols-outlined text-lg">chat_bubble</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TopAppBar - Supplier Profile Context */}
      <header className="fixed top-0 left-0 w-full z-40 flex items-center px-4 md:px-8 py-3 h-16 bg-white/85 backdrop-blur-3xl border-b border-indigo-500/10 shadow-xs">
        <div className="flex items-center w-full max-w-4xl mx-auto justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (onBack ? onBack() : onNavigate && onNavigate('messenger'))}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="relative cursor-pointer" onClick={() => setIsCalling(true)}>
              <img
                alt="Alex Rivera"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYIWJGvVF9x6xwSYsW2O8630jBgwN_qdKvO84ODHaNJ7cF-9atMuYOTbMBDcwBWYi6dYHmCcC-229NdNapDM65u-N9JW-U5Q8ChWzYkbfMKQazBNFbouQbe29Iuoi4itfJCqg3N1oRIR5xGJ_hCDMmHZssY7OZKiXA63_BpjjZ5Yw-rsnktqOgbIGIZvPsaqGBUbWWAHqSICezCy40Du_IkzJndaXXHfJm3VQizda9NxXNRuMk2XWLl97rCF4_yH2UphO7XyzEeTo"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-headline text-base font-bold tracking-tight text-slate-900 leading-tight">
                Alex Rivera
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Now • Verified Supplier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsCalling(true)}
              className="p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-600 cursor-pointer"
              title="Call Supplier"
            >
              <span className="material-symbols-outlined text-xl">call</span>
            </button>
            <button
              type="button"
              onClick={() => setIsProductModalOpen(true)}
              className="p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-600 cursor-pointer"
              title="View Linked Product"
            >
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Supplier Rating: 4.9 ★ • 10k+ Dispatches')}
              className="p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Canvas */}
      <main className="pt-20 pb-36 px-4 md:px-8 max-w-4xl mx-auto flex flex-col gap-5 w-full flex-1">
        {/* Day Divider */}
        <div className="flex justify-center my-2">
          <span className="px-4 py-1 bg-slate-200/80 text-slate-600 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full">
            Today
          </span>
        </div>

        {/* Product Context Card (Bento Style) */}
        <div className="flex justify-center w-full">
          <div
            onClick={() => setIsProductModalOpen(true)}
            className="w-full max-w-sm p-3.5 bg-white border border-slate-200/80 rounded-3xl shadow-xs flex items-center gap-3.5 group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all"
          >
            <img
              alt="Embroidered Silk Saree"
              className="w-16 h-16 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-zmSpVIahy8KGiSdimC_yd04lqZI2JErL2m3pbtCEvoBIoBRUqZz-xqhR8p4BC-LbSna0AeB94hqCgEd014RTteoa15n-Pjtt7HyoUxYdUTIkixfeQa2ZZvwtIo5QLUbTiVrqgd8eAaI0_4vDt4pHqnAhutqLM7R7iR06auoPiISKJjEJ1iPxaEXXfMKgpbW0fufAm7gxcO52jXDrnttz7XvDPD0PLnsZ1CWHvIAOO81nMSyvoPRpOl55owCTyXDxdBG04BYwedI"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#2f06be] mb-0.5">
                Linked Product
              </p>
              <h3 className="text-xs font-bold text-slate-900 truncate">
                Embroidered Silk Saree
              </h3>
              <p className="text-xs font-black text-slate-700 mt-0.5">₹1,249</p>
            </div>
            <span className="material-symbols-outlined text-[#4834D4] group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </div>
        </div>

        {/* Quick Inquiry Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs justify-center flex-wrap">
          {[
            'Is bulk order discount available?',
            'Can you ship express tomorrow?',
            'Send real catalog photos',
            'Are size variants M, L, XL in stock?',
          ].map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendPreset(preset)}
              className="bg-white hover:bg-indigo-50 border border-slate-200 text-slate-600 hover:text-[#2f06be] px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="space-y-4 pt-2">
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end self-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}
              >
                {/* Media Image Bubble */}
                {msg.mediaUrl && (
                  <div className="overflow-hidden rounded-2xl bg-indigo-900 shadow-md mb-1 max-w-sm">
                    <img
                      alt="Packaging"
                      className="w-full h-48 object-cover cursor-pointer hover:scale-102 transition-transform"
                      src={msg.mediaUrl}
                      onClick={() => showToast('Full image enlarged')}
                    />
                    <div className="p-3 bg-gradient-to-br from-[#686DE0] to-[#4834D4]">
                      <p className="text-xs text-white/95 leading-relaxed font-medium">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Normal Text Bubble */}
                {!msg.mediaUrl && (
                  <div
                    className={`px-4.5 py-3 text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-gradient-to-br from-[#686DE0] to-[#4834D4] text-white rounded-[20px] rounded-br-[4px] shadow-[0_4px_16px_-4px_rgba(72,52,212,0.3)]'
                        : 'bg-white text-slate-900 border border-slate-100 rounded-[20px] rounded-bl-[4px]'
                    }`}
                  >
                    <p className="font-medium text-[13px]">{msg.text}</p>
                  </div>
                )}

                {/* Timestamp & Read Tick */}
                <div
                  className={`flex items-center gap-1 mt-1 text-[10px] font-medium tracking-wider text-slate-400 ${
                    isMe ? 'mr-1' : 'ml-1'
                  }`}
                >
                  <span>{msg.time}</span>
                  {isMe && (
                    <span
                      className="material-symbols-outlined text-[13px] text-[#4834D4]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      done_all
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Floating Glassmorphism Input Bar */}
      <div className="fixed bottom-0 left-0 w-full px-4 pb-6 pt-3 pointer-events-none z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-2 p-2 bg-white/90 backdrop-blur-3xl rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] border border-slate-200/80 pointer-events-auto">
          <button
            type="button"
            onClick={() => showToast('Photo & Video Attachment opened')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 transition-all text-slate-600 cursor-pointer flex-shrink-0"
            title="Attach file or catalog"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>

          <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message or inquiry..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-medium text-slate-900 placeholder:text-slate-400 px-2 outline-none"
            />

            <button
              type="button"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-lg">mood</span>
            </button>

            <button
              type="submit"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2f06be] to-[#4834D4] hover:brightness-110 text-white shadow-md active:scale-90 transition-all cursor-pointer flex-shrink-0"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                send
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Linked Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Linked Product Details</h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-44 bg-slate-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-zmSpVIahy8KGiSdimC_yd04lqZI2JErL2m3pbtCEvoBIoBRUqZz-xqhR8p4BC-LbSna0AeB94hqCgEd014RTteoa15n-Pjtt7HyoUxYdUTIkixfeQa2ZZvwtIo5QLUbTiVrqgd8eAaI0_4vDt4pHqnAhutqLM7R7iR06auoPiISKJjEJ1iPxaEXXfMKgpbW0fufAm7gxcO52jXDrnttz7XvDPD0PLnsZ1CWHvIAOO81nMSyvoPRpOl55owCTyXDxdBG04BYwedI"
                alt="Embroidered Silk Saree"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900">Embroidered Silk Saree</h4>
              <p className="text-xs text-slate-500 mt-0.5">Supplier: Alex Rivera • SKU: SILK-XL-MRN</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xl font-black text-[#2f06be]">₹1,249</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                  12 Units Remaining
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsProductModalOpen(false);
                  showToast('Added product to your resell catalog!');
                }}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Share Catalog
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsProductModalOpen(false);
                  showToast('Order request placed with supplier!');
                }}
                className="flex-1 py-2.5 bg-[#2f06be] text-white text-xs font-bold rounded-xl hover:bg-[#4834D4] shadow-xs cursor-pointer"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Call Modal */}
      {isCalling && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="text-center text-white space-y-6 max-w-xs w-full">
            <div className="relative mx-auto w-24 h-24 rounded-full border-4 border-emerald-400 p-1 animate-pulse">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYIWJGvVF9x6xwSYsW2O8630jBgwN_qdKvO84ODHaNJ7cF-9atMuYOTbMBDcwBWYi6dYHmCcC-229NdNapDM65u-N9JW-U5Q8ChWzYkbfMKQazBNFbouQbe29Iuoi4itfJCqg3N1oRIR5xGJ_hCDMmHZssY7OZKiXA63_BpjjZ5Yw-rsnktqOgbIGIZvPsaqGBUbWWAHqSICezCy40Du_IkzJndaXXHfJm3VQizda9NxXNRuMk2XWLl97rCF4_yH2UphO7XyzEeTo"
                alt="Alex Rivera"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">Alex Rivera</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1">Calling Supplier...</p>
            </div>

            <div className="flex justify-center gap-6 pt-4">
              <button
                type="button"
                onClick={() => showToast('Muted microphone')}
                className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined">mic_off</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCalling(false)}
                className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-xl active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">call_end</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversationScreen;
