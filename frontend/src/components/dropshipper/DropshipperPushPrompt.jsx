import { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  CheckCircle2,
  X,
  Sparkles,
  Loader2
} from 'lucide-react';
import {
  getPushPermissionState,
  requestNotificationPermission,
  syncUserPushToken
} from '../../utils/fcm.js';
import notificationSound from '../../utils/notificationSound.js';
import {
  sendDropshipperTestPushApi,
  getDropshipperFcmStatusApi
} from '../../services/dropshipperService.js';
import { toast } from 'sonner';

/**
 * Polite, High-Conversion Dropshipper Push Notification Opt-in Prompt
 * Conforms to modern UX guidelines (never prompt browser permission abruptly)
 */
export const DropshipperPushPrompt = ({ firebaseUid, onPermissionChanged }) => {
  const [permissionState, setPermissionState] = useState(() => getPushPermissionState());
  const [, setIsRegisteredForUser] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => notificationSound.isSoundEnabled());
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const dismissedAt = localStorage.getItem('dropshipper_push_prompt_dismissed');
    if (dismissedAt) {
      const hoursAgo = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      return hoursAgo < 24;
    }
    return false;
  });
  const [loading, setLoading] = useState(false);
  const [testingPush, setTestingPush] = useState(false);

  // Synchronize backend device registration for the specific logged-in dropshipper
  useEffect(() => {
    let isMounted = true;
    if (!firebaseUid) return;

    (async () => {
      try {
        const status = await getDropshipperFcmStatusApi(firebaseUid);
        if (isMounted && status?.isRegistered) {
          setIsRegisteredForUser(true);
        } else if (isMounted && getPushPermissionState() === 'granted') {
          // If browser already granted permission, ensure this specific account is registered in DB
          const syncRes = await syncUserPushToken(firebaseUid);
          if (isMounted && syncRes.success) {
            setIsRegisteredForUser(true);
          }
        }
      } catch (err) {
        console.warn('FCM status check error:', err?.message);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [firebaseUid]);

  const handleEnablePush = async () => {
    setLoading(true);
    try {
      const result = await requestNotificationPermission(firebaseUid);

      if (result.success) {
        setPermissionState('granted');
        toast.success('Instant alerts enabled!', {
          description: 'Real-time order delivery and margin credit notifications are active.'
        });
        // Play sweet confirmation chime
        notificationSound.playMarginCreditedChime();
        if (typeof onPermissionChanged === 'function') {
          onPermissionChanged('granted');
        }
      } else if (result.reason === 'PERMISSION_BLOCKED') {
        setPermissionState('denied');
        toast.error('Notifications Blocked in Browser', {
          description: result.message || 'Please click the lock/tune icon near the URL bar to allow notifications.'
        });
      } else {
        toast.warning('Browser Permission Required', {
          description: result.message || 'Please click "Allow" on the browser notification prompt.'
        });
      }
    } catch (err) {
      console.error('Push enable error:', err);
      toast.error('Failed to enable push notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('dropshipper_push_prompt_dismissed', String(Date.now()));
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    notificationSound.setSoundEnabled(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      notificationSound.playNotificationPing();
      toast.info('Notification sound enabled');
    } else {
      toast.info('Notification sound muted');
    }
  };

  const handleSendTestPush = async () => {
    if (!firebaseUid) return;
    setTestingPush(true);
    try {
      notificationSound.playMarginCreditedChime();
      const res = await sendDropshipperTestPushApi({
        firebaseUid,
        title: '💰 ₹450 Margin Credited (Live Preview)',
        body: 'Order #ORD-9821 successfully delivered. Margin unlocked to your wallet.'
      });
      toast.success('Test alert triggered!', {
        description: res.message || 'Check your screen and notification bell.'
      });
    } catch (err) {
      console.error('Test push error:', err);
      toast.error('Could not dispatch test push');
    } finally {
      setTestingPush(false);
    }
  };

  // If already granted, show a compact status pill with test trigger and sound toggle
  if (permissionState === 'granted') {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl mb-6 text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Live WebPush Active:
          </span>
          <span className="text-muted-foreground hidden sm:inline">
            Real-time delivery & margin alerts connected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mute notification sounds' : 'Enable notification sounds'}
            className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Test Push Button */}
          <button
            onClick={handleSendTestPush}
            disabled={testingPush}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1 transition-all disabled:opacity-50"
          >
            {testingPush ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Test Alert</span>
          </button>
        </div>
      </div>
    );
  }

  // If dismissed or unsupported or blocked, don't show banner
  if (isDismissed || permissionState === 'unsupported' || permissionState === 'denied') {
    return null;
  }

  // Polite Opt-In Banner
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-transparent border border-indigo-500/30 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shrink-0">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">
                Never Miss a Delivered Order or Profit Margin
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                Recommended
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              Enable instant browser alerts to receive real-time notifications when your COD orders get delivered, wallet profits unlock, and customer disputes are updated.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleEnablePush}
            disabled={loading}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bell className="w-3.5 h-3.5" />
            )}
            <span>Enable Instant Alerts</span>
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Close prompt"
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropshipperPushPrompt;
