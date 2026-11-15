import { useState, useEffect, useRef, useTransition } from 'react';
import {
  Bell,
  CheckCheck,
  Package,
  Wallet,
  ShieldAlert,
  BadgeCheck,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  Loader2
} from 'lucide-react';
import {
  getDropshipperNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi
} from '../../services/dropshipperService.js';
import { initForegroundNotificationListener } from '../../utils/fcm.js';
import notificationSound from '../../utils/notificationSound.js';
import { toast } from 'sonner';

/**
 * Format relative time (e.g. 'Just now', '5m ago', '2h ago', 'Yesterday')
 */
const formatTimeAgo = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

/**
 * Render category-specific icon
 */
const renderNotificationIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'earning':
    case 'margin':
      return (
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
          <Wallet className="w-4 h-4" />
        </div>
      );
    case 'order':
      return (
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
          <Package className="w-4 h-4" />
        </div>
      );
    case 'kyc':
      return (
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
          <BadgeCheck className="w-4 h-4" />
        </div>
      );
    case 'dispute':
    case 'rot':
      return (
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
          <ShieldAlert className="w-4 h-4" />
        </div>
      );
    case 'support':
      return (
        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
          <MessageSquare className="w-4 h-4" />
        </div>
      );
    default:
      return (
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      );
  }
};

export const DropshipperNotificationBell = ({ firebaseUid, onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'earnings'
  const [soundEnabled, setSoundEnabled] = useState(() => notificationSound.isSoundEnabled());
  const dropdownRef = useRef(null);
  const [, startTransition] = useTransition();

  // 1. Fetch Notifications on Mount / User Change
  useEffect(() => {
    let isMounted = true;
    if (!firebaseUid) return;

    const fetchInitial = async () => {
      try {
        const res = await getDropshipperNotificationsApi(firebaseUid, 40);
        if (isMounted && res?.success) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (err) {
        console.warn('Could not fetch notifications:', err?.message);
      }
    };

    fetchInitial();

    return () => {
      isMounted = false;
    };
  }, [firebaseUid]);

  const refreshNotifications = async (uid = firebaseUid) => {
    if (!uid) return;
    try {
      setLoading(true);
      const res = await getDropshipperNotificationsApi(uid, 40);
      if (res?.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Could not refresh notifications:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Live Foreground FCM Sync
  useEffect(() => {
    const unsubscribe = initForegroundNotificationListener((payload) => {
      // Audio Chime is automatically played inside initForegroundNotificationListener
      // Prepend live incoming notification to the list & bump count
      const newNotif = {
        id: `live-${Date.now()}`,
        title: payload.notification?.title || payload.data?.title || 'Dropshipper Alert',
        body: payload.notification?.body || payload.data?.body || '',
        type: payload.data?.type || 'system',
        isRead: false,
        createdAt: new Date().toISOString(),
        data: payload.data
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // 3. Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // 4. Mark Single Notification as Read & Navigate
  const handleItemClick = async (notif) => {
    if (!notif.isRead && notif.id && !notif.id.startsWith('live-')) {
      try {
        await markNotificationReadApi(notif.id);
        startTransition(() => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
          );
          setUnreadCount((c) => Math.max(0, c - 1));
        });
      } catch (err) {
        console.warn('Failed to mark read:', err?.message);
      }
    }

    setIsOpen(false);

    // Resolve navigation target
    const clickAction = notif.data?.clickAction || '';
    if (clickAction.includes('tab=')) {
      const match = clickAction.match(/tab=([^&]+)/);
      if (match && match[1] && typeof onNavigateTab === 'function') {
        onNavigateTab(match[1]);
        return;
      }
    }

    if (notif.type === 'earning' || notif.type === 'margin') {
      if (onNavigateTab) onNavigateTab('settlements');
    } else if (notif.type === 'order') {
      if (onNavigateTab) onNavigateTab('orders-push');
    } else if (notif.type === 'rot' || notif.type === 'dispute') {
      if (onNavigateTab) onNavigateTab('rot');
    } else if (notif.type === 'kyc') {
      if (onNavigateTab) onNavigateTab('profile');
    }
  };

  // 5. Mark All As Read
  const handleMarkAllRead = async () => {
    if (!firebaseUid || unreadCount === 0) return;
    try {
      await markAllNotificationsReadApi(firebaseUid);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error('Could not mark all as read');
    }
  };

  // 6. Toggle Sound
  const handleToggleSound = (e) => {
    e.stopPropagation();
    const next = !soundEnabled;
    notificationSound.setSoundEnabled(next);
    setSoundEnabled(next);
    if (next) {
      notificationSound.playNotificationPing();
      toast.info('Notification sound enabled');
    } else {
      toast.info('Notification sound muted');
    }
  };

  // 7. Filtered list
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'earnings') return n.type === 'earning' || n.type === 'margin';
    return true;
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-[#b7004d] hover:bg-pink-50 transition-all cursor-pointer outline-none"
        aria-label="Dropshipper Notifications"
        title="Store Notifications"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-gradient-to-r from-[#b7004d] to-pink-500 rounded-full shadow-xs shadow-pink-500/40 animate-in zoom-in-50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-pink-50/70 via-white to-pink-50/30 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b7004d]/10 text-[#b7004d]">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                title={soundEnabled ? 'Mute notification sound' : 'Enable notification sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#b7004d]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-[#b7004d] hover:underline font-semibold flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-1.5 bg-gray-50/50">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white text-[#b7004d] shadow-xs border border-pink-100'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-white text-[#b7004d] shadow-xs border border-pink-100'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter('earnings')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'earnings'
                  ? 'bg-white text-emerald-600 shadow-xs border border-emerald-100'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              💰 Earnings
            </button>
          </div>

          {/* List Content */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
            {loading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#b7004d] mb-2" />
                <p className="text-xs">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-[#b7004d] mb-3">
                  <Bell className="w-6 h-6 opacity-60" />
                </div>
                <h4 className="text-xs font-bold text-gray-800">All caught up!</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {filter === 'unread'
                    ? 'No unread notifications at the moment.'
                    : 'No store alerts received yet.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-pink-50/40 transition-colors cursor-pointer group ${
                    !notif.isRead ? 'bg-pink-50/20' : ''
                  }`}
                >
                  {renderNotificationIcon(notif.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs truncate ${
                          !notif.isRead
                            ? 'font-bold text-gray-900'
                            : 'font-medium text-gray-700'
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                      {notif.body}
                    </p>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] font-semibold text-[#b7004d] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Open details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>

                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#b7004d] shrink-0"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Live Push Active
            </span>
            <button
              onClick={() => refreshNotifications(firebaseUid)}
              className="text-[#b7004d] hover:underline font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropshipperNotificationBell;
