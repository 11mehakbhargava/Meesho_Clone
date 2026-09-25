// frontend/src/services/affiliateSessionStore.js

const STORAGE_KEY = 'current_session_affiliate_app';
const LOCAL_STORAGE_KEY = 'affiliate_kyc_application';

// Detect if this specific browser page load was a reload (F5 / browser refresh)
let isPageReload = false;
try {
  if (typeof performance !== 'undefined' && performance.getEntriesByType) {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && navEntries[0].type === 'reload') {
      isPageReload = true;
    }
  } else if (typeof window !== 'undefined' && window.performance?.navigation?.type === 1) {
    isPageReload = true;
  }
} catch (e) {
  isPageReload = false;
}

// On page refresh/reload, reset all state back to initial clean default (no KYC submitted yet)
if (isPageReload) {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {}
}

let inMemoryApp = null;
try {
  if (!isPageReload) {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      inMemoryApp = JSON.parse(stored);
    }
  }
} catch (e) {}

const listeners = new Set();

export function getAffiliateApp() {
  if (inMemoryApp) return inMemoryApp;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      inMemoryApp = JSON.parse(stored);
      return inMemoryApp;
    }
  } catch (e) {}
  return null;
}

export function saveAffiliateApp(app) {
  inMemoryApp = app;
  try {
    if (app) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(app));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(app));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (e) {}
  listeners.forEach((listener) => {
    try {
      listener(inMemoryApp);
    } catch (e) {}
  });
}

export function subscribeAffiliateApp(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
