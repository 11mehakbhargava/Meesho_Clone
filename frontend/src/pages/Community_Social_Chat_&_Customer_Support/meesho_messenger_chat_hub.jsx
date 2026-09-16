import React, { useState } from 'react';
import AppBottomNav from '../../components/AppBottomNav';

const INITIAL_STORIES = [
  {
    id: 'story-rajesh',
    name: 'Rajesh K.',
    role: 'Surat Textiles',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBiCfW738xKENo5y_Dpdnm1wmF-qSlFqdTFYRDAi4V-VV_2Ob8wbB-lBUi6m9IAIhlySuq_u-VUO7c93sBiC5pxFCd2sEJ8R0UqqUc2Gqvo2HCCI37qzxEtK5Befvcn1cqY8jKKxGFDntvPAlnKHB2pzIW4KOWnL6-s7vtcE-wY-OyhuDMyS7riCq50U5W1cqWEh6dGRp1lKrB_hryNev9-8RLe3TaPT4a5uCueMjwAI1625gJj2CGbGPeTeziqziVdGDJI1J5ASWU',
    storyText: '✨ New Banarasi Silk Sarees dispatched! 100+ units in transit.',
  },
  {
    id: 'story-priya',
    name: 'Priya S.',
    role: 'Top Reseller',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALrag4BONFCklaNRkaSvO2vAnW7K1zAqcI_bzrGluc64rHWx-WrlnXMxJ80tglJohRyT07xo8_ztEq5TaBrTqsJpYrMxhFq99TlRBUlIl7b2Vbtqv7XQbbWttu63IgUwjQiis7cWP4J-NPkCYnsXcee3UGVOngoMeD_pgz7e7n0NaeXiV9TjDdbMwPDoeztBt2M_SvmGjCgbDpquo76CqfVCRIQ84bMOaXM_HHVLb0cj_rjc9qqmn6BLLd1DuTxjuPuJ35huFbyME',
    storyText: '📦 Packaging 42 orders for festive deliveries today!',
  },
  {
    id: 'story-ankit',
    name: 'Ankit V.',
    role: 'Hub Logistics',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtWSP4jS-nKPHfYaZu0J_dJGKeU3NoHmOvjPN5CyxGCMZ_7ycY2zEzVPXwxN61E-ic6WzcOvHZvbAMCklPMiRdJeBxRTkyTEWEtZVI7c99yUdz_i6QgeKVAIFYA8cTe2w8O08NpLoIj_zW6zJOe1dmie2_yFJ9UrMu2Sz60qgXvxZGVEXXJEl9ORoCqkX4Ht8gVMR95oQt3AaEeDLLJLt_Gi8HEnaV1OvPpJ2rbzJ3LjDSSAUbItuMTpyscXZ54fhR3M9HhZoZG08',
    storyText: '⚡ Delhi Hub operating at 24/7 express dispatch capacity.',
  },
];

const INITIAL_CHATS = [
  {
    id: 'chat-1',
    name: 'Varanasi Silks',
    type: 'supplier',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3CXmiCJTkUBgfAZD78N7CQvDchFlfGI51TEstPAjPveHqZGaXDvH5m5ESZndZg9-Wrx7IKuL3wPe4WHTn_qi3UJaCCwc27TtouBGajzX4msFFwZXbfvbvKnLpu00www7Vtfo-i9aRgL3bt6qpXn0d1WmIEcKuJfXjenL45le1T6r9Nj_D0qpOWTZRBfY60gVuyJ3NV-iDWSCNn8Leh7lpEGG07f1JM5O6xrmAoxUOiaxnYb--JdIDFzNKl1jOIxI-di5oyJBmCNU',
    isOnline: true,
    time: '10:30 AM',
    unreadCount: 2,
    messages: [
      { id: 'm1', sender: 'them', text: 'Namaste! We received your bulk inquiry for Kanjivaram silk sarees.', time: '10:28 AM' },
      { id: 'm2', sender: 'them', text: 'Is this saree in stock for bulk order?', time: '10:30 AM' },
    ],
  },
  {
    id: 'chat-2',
    name: 'Aditi Designer Hub',
    type: 'supplier',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBuOGkFkQ5ltfyNu5mBrHZah1cm9PsvZO8Ct2mTJp6uaYUgGO0tZ3zPuAAxdWgENdu9NWod4KZtcCfFzNRRphUmBGwXlhULYIDg7PBB5p4wrjpxAk68eZOzrkPuu0UvizRQRs1SANpfiPJTBDCzamGNIdIi-puaRs6CxOV_l4MrjpoQviDS04CpnfGrpXhTlI6CVM9Ol3lktpzLr0Az-aPlRzMGKz5mV8lAXaiDcaWJ1wnGPI8gIuhQxSCrvd2LZ_pqHkEM5a4HXMg',
    isOnline: true,
    time: '09:15 AM',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Price updated for the Kurti set. Check catalog.', time: '09:15 AM' },
    ],
  },
  {
    id: 'chat-3',
    name: 'Reseller Network Mumbai',
    type: 'group',
    isGroup: true,
    isOnline: false,
    time: 'YESTERDAY',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'Amit', text: 'New collection launching at 5PM today team!', time: 'Yesterday' },
      { id: 'm2', sender: 'Pooja', text: 'Catalog images downloaded. Ready for WhatsApp share.', time: 'Yesterday' },
    ],
  },
  {
    id: 'chat-4',
    name: 'Global Fashion Hub',
    type: 'supplier',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrD5qWXRR8JmBzXMO-k0bU9qhCAcnrfJ-z5Cw6BvB2UEDZ_VwtTr3XYktc-1SP44i1XcXqHKqzIio-AFMnCzDz5gHLbdG3TEUnD0DgK0rBr1DLvhl2Mxjqv1IgMiHwepc88vTIWZDjtX38XeQEW2Xkotvx9rhm8OkCzIPRSzKKKGVzVdcL9mT8E-fh7FuDukTFftGugCLKZ76Tv3JMFqb0d8jMw8qGcKF9ybR-17FpDJL7qQ4be0ukjAkEtXUKWnpAXIdjU4BzCo4',
    isOnline: false,
    time: 'OCT 24',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Your shipment #MS452 has been dispatched via BlueDart.', time: 'Oct 24' },
    ],
  },
  {
    id: 'chat-5',
    name: 'Quality Check Dept.',
    type: 'support',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAT4Th86cNC8zsZk2w7GGrnsHu4fWSTLX6toNYDNEM7fFEnlunTBQYzOxUSUAQ1J8KGCOOwBAkIJgb-UZyeDe36XQGn0Rj7COjxKUMm_b0ePR_-qQtM6bvsjVwsHwFaXlK-onq-URmJSsPAFWR351lmuoF6-G3RG96moanXLvVnUeR0hDwjg_M7mbZQZbfuN3sSPmsAZ_CqIyYmaarlNELQGfXK60p7M1gjylMpEcUUEawT4F9zIalhn_tFa5nTHdjGKgwHfgs5PEM',
    isOnline: false,
    time: 'OCT 22',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Photos of the sample approved for catalog upload.', time: 'Oct 22' },
    ],
  },
];

export function MeeshoMessengerChatHub({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'groups' | 'suppliers' | 'settings'
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [previewStory, setPreviewStory] = useState(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenChat = (chat) => {
    // Clear unread count
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    setSelectedChat(chat);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessageInput.trim() || !selectedChat) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: chatMessageInput.trim(),
      time: 'Just now',
    };

    const updatedMessages = [...selectedChat.messages, newMsg];
    const updatedChat = { ...selectedChat, messages: updatedMessages, time: 'Just now' };

    setSelectedChat(updatedChat);
    setChats((prev) =>
      prev.map((c) => (c.id === selectedChat.id ? updatedChat : c))
    );
    setChatMessageInput('');

    // Simulated supplier auto-reply after 1.5 seconds
    setTimeout(() => {
      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: 'Thank you for your message! Our supplier team will confirm stock in 5 minutes.',
        time: 'Just now',
      };
      setSelectedChat((curr) =>
        curr && curr.id === selectedChat.id
          ? { ...curr, messages: [...curr.messages, replyMsg] }
          : curr
      );
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChat.id
            ? { ...c, messages: [...c.messages, replyMsg], time: 'Just now' }
            : c
        )
      );
    }, 1500);
  };

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages[chat.messages.length - 1]?.text.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'groups') return chat.isGroup;
    if (activeTab === 'suppliers') return chat.type === 'supplier';
    return true;
  });

  return (
    <div className="bg-[#f9f9fb] text-[#1a1c1d] min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2f06be] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce text-xs font-semibold">
          <span className="material-symbols-outlined text-lg">chat</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TopAppBar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl sticky top-0 w-full z-40 border-b border-slate-100 shadow-xs">
        <div className="flex justify-between items-center w-full px-4 md:px-8 py-3.5 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('community')}
              className="p-2 hover:bg-slate-100 text-slate-700 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="relative active:scale-95 transition-all duration-200 ease-out cursor-pointer">
              <img
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG7et8w7My0dVTNwNbLhEuUg5Cb9wzVMqB6RNCLgRJCyhWxKD3OXF2TljDAuKte1L-W7-nRudAtqpTugWCAZI_aomL38Eyq8CQcw-PXJBeI5YxRoe6Ou0GbdYMySbQJ6wn_zz5Oit63AtmhnL3aUGx7xu7pWlafG8pu1X5wJLgn6Z8E2-j-tfuwqgGkYSDBiyYznesIiTTi2UWfGdYfbr3iJsNnG_n3jHfEppW9hWd_WfXgpy2IWbe4G-vFX3CAuW19DKyfCPxlRw"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-slate-900 text-xl leading-none">
                Messenger
              </h1>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Supplier & Reseller Chat</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 text-lg">
                search
              </span>
              <input
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-11 pr-4 focus:ring-2 focus:ring-[#2f06be]/30 text-xs text-slate-800 outline-none"
                placeholder="Search people, suppliers or groups..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsNewChatOpen(true)}
              className="p-2 text-[#2f06be] hover:bg-indigo-50 rounded-full cursor-pointer transition-colors"
              title="Start New Chat"
            >
              <span className="material-symbols-outlined text-2xl">edit_square</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Messenger Settings & Online Status active')}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-4 pb-32 px-4 max-w-3xl mx-auto w-full">
        {/* Mobile Search Bar */}
        <div className="md:hidden mb-5">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400 text-lg">
              search
            </span>
            <input
              className="w-full bg-white border border-slate-200/80 shadow-xs rounded-full py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[#2f06be]/30 text-xs text-slate-800 outline-none"
              placeholder="Search chats..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Actions / Stories Carousel */}
        <section className="mb-6 overflow-x-auto flex gap-4 py-2 select-none">
          {/* Add Story */}
          <div
            onClick={() => showToast('Story camera opened! You can upload a dispatch story.')}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer"
          >
            <div className="w-15 h-15 rounded-full bg-white border-2 border-dashed border-indigo-300 flex items-center justify-center group-active:scale-95 transition-all shadow-xs">
              <span className="material-symbols-outlined text-[#2f06be] text-2xl">add</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Your Story
            </span>
          </div>

          {/* Contact Stories */}
          {INITIAL_STORIES.map((story) => (
            <div
              key={story.id}
              onClick={() => setPreviewStory(story)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#2f06be] to-[#4834D4] group-hover:scale-105 transition-transform shadow-xs">
                <img
                  alt={story.name}
                  className="w-14 h-14 rounded-full border-2 border-white object-cover"
                  src={story.avatar}
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 truncate max-w-[64px]">
                {story.name}
              </span>
            </div>
          ))}
        </section>

        {/* Filter Tabs Bar (Chats / Groups / Suppliers) */}
        <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-2xl w-fit">
          {[
            { id: 'chats', label: 'All Chats', icon: 'chat' },
            { id: 'suppliers', label: 'Suppliers', icon: 'inventory_2' },
            { id: 'groups', label: 'Groups', icon: 'groups' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#2f06be] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <div className="space-y-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">chat</span>
              <p className="text-sm font-bold text-slate-700">No conversations found</p>
              <p className="text-xs text-slate-400 mt-1">Try a different search query or start a new chat</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              return (
                <div
                  key={chat.id}
                  onClick={() => handleOpenChat(chat)}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200 group cursor-pointer active:scale-[0.99] shadow-xs"
                >
                  {/* Avatar with status indicator */}
                  <div className="relative flex-shrink-0">
                    {chat.isGroup ? (
                      <div className="flex items-center justify-center w-13 h-13 rounded-full bg-indigo-100 text-[#2f06be] shadow-xs">
                        <span className="material-symbols-outlined text-2xl">groups</span>
                      </div>
                    ) : (
                      <img
                        alt={chat.name}
                        className="w-13 h-13 rounded-full object-cover border border-slate-100 shadow-xs"
                        src={chat.avatar}
                      />
                    )}
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-slate-900 truncate text-sm">{chat.name}</h3>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        {chat.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {lastMsg ? lastMsg.text : 'No messages'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div className="bg-[#2f06be] text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Floating Action Button (New Chat) */}
      <button
        type="button"
        onClick={() => setIsNewChatOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2f06be] to-[#4834D4] hover:brightness-110 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center active:scale-90 transition-transform duration-200 z-40 cursor-pointer"
        title="Start New Chat"
      >
        <span className="material-symbols-outlined text-2xl">edit_square</span>
      </button>

      {/* Universal Responsive Bottom Navigation Bar */}
      <AppBottomNav activeNav="home" onNavigate={onNavigate} />

      {/* Active Conversation Drawer/Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[85vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
            {/* Thread Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedChat(null)}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
                <div className="relative">
                  {selectedChat.isGroup ? (
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-[#2f06be] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-lg">groups</span>
                    </div>
                  ) : (
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  )}
                  {selectedChat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 leading-tight">
                    {selectedChat.name}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    {selectedChat.isOnline ? 'Online now' : 'Active recently'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => showToast(`Calling ${selectedChat.name}...`)}
                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Order history shared in chat')}
                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">receipt_long</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChat(null)}
                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Quick Inquiry Suggestions */}
            <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-100 flex gap-2 overflow-x-auto text-[11px]">
              {['Is bulk discount available?', 'Send live photos', 'Fulfillment timeline?'].map(
                (quick, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => setChatMessageInput(quick)}
                    className="bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 hover:text-[#2f06be] hover:border-indigo-300 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {quick}
                  </button>
                )
              )}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fb]">
              {selectedChat.messages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {!isMe && msg.sender !== 'them' && (
                      <span className="text-[10px] text-slate-400 font-bold mb-0.5 ml-2">
                        {msg.sender}
                      </span>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-xs ${
                        isMe
                          ? 'bg-[#2f06be] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Message Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => showToast('Image attachment picker opened')}
                className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">attach_file</span>
              </button>

              <input
                type="text"
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                placeholder="Type a message or inquiry..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#2f06be]"
              />

              <button
                type="submit"
                className="p-2.5 bg-[#2f06be] hover:bg-[#4834d4] text-white rounded-2xl cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Story Preview Modal */}
      {previewStory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={previewStory.avatar}
                  alt={previewStory.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400"
                />
                <div>
                  <h4 className="font-bold text-sm">{previewStory.name}</h4>
                  <p className="text-[10px] text-indigo-300">{previewStory.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewStory(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl text-sm leading-relaxed border border-slate-700 font-medium">
              {previewStory.storyText}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPreviewStory(null);
                  showToast(`Connected with ${previewStory.name}`);
                }}
                className="px-4 py-2 bg-[#4834D4] hover:bg-[#2f06be] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Reply to Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Contacts Modal */}
      {isNewChatOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2f06be]">person_add</span>
                <h3 className="font-bold text-base text-slate-900">Start New Message</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewChatOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[
                { name: 'Jaipur Kurtis Wholesale', type: 'Supplier', location: 'Jaipur' },
                { name: 'Kolkata Saree Mills', type: 'Supplier', location: 'Kolkata' },
                { name: 'Delhi Smart Electronics', type: 'Supplier', location: 'Delhi' },
                { name: 'Reseller Elite Club', type: 'Community Group', location: 'All India' },
              ].map((contact, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setIsNewChatOpen(false);
                    showToast(`Started conversation with ${contact.name}`);
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50/50 border border-slate-100 cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{contact.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      {contact.type} • {contact.location}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-sm">chat</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeeshoMessengerChatHub;
