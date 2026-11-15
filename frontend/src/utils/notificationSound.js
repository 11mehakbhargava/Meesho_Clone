/**
 * Zero-dependency Web Audio API Notification Sound Synthesizer
 * Provides crisp audio chimes for dropshipper events without external audio file assets.
 */

class NotificationSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.STORAGE_KEY = 'mshoppy_dropshipper_notification_sound';
  }

  /**
   * Lazily initializes or resumes AudioContext upon user gesture
   */
  getAudioContext() {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  /**
   * Check if sound is enabled (defaults to true)
   */
  isSoundEnabled() {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  }

  /**
   * Toggle or set sound preference
   */
  setSoundEnabled(enabled) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, enabled ? 'true' : 'false');
    }
  }

  /**
   * 1. Cash Register / Margin Credited Chime
   * Harmonic dual-bell chime (E5 -> B5) representing earning success
   */
  playMarginCreditedChime() {
    if (!this.isSoundEnabled()) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Bell Note 1: E5 (659.25 Hz) with sine warmth
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Bell Note 2: B5 (987.77 Hz) high sparkle
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.65);
    } catch (err) {
      console.warn('Audio chime warning:', err);
    }
  }

  /**
   * 2. General Notification Ping (Two-tone ascending bubble ping)
   * Used for Order Dispatches, KYC updates, and Support replies
   */
  playNotificationPing() {
    if (!this.isSoundEnabled()) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18); // G5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (err) {
      console.warn('Audio ping warning:', err);
    }
  }

  /**
   * Dispatch sound dynamically based on notification payload type
   */
  playSoundByType(type = 'system') {
    if (type === 'earning' || type === 'margin') {
      this.playMarginCreditedChime();
    } else {
      this.playNotificationPing();
    }
  }
}

export const notificationSound = new NotificationSoundEngine();
export default notificationSound;

