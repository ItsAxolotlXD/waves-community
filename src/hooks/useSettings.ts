import { useSyncExternalStore } from 'react';

export interface SystemSettings {
  theme: 'light' | 'dark';
  dockToSidebar: boolean;
  fontScale: number; // 0: Cực nhỏ, 1: Nhỏ, 2: Trung bình, 3: Lớn, 4: Cực lớn
  fontScaleVersion?: number;
  autoScrollBanner: boolean;
  autoHideSidebar: boolean;
  searchCategories: boolean;
  searchNews: boolean;
  searchTv: boolean;
  searchChannelNumber: boolean;
  searchSettings: boolean;
  reduceAllMotion: boolean;
  animateSidebar: boolean;
  animateModals: boolean;
  animatePageTransitions: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'light',
  dockToSidebar: true,
  fontScale: 2, // Mặc định là "Trung bình" (quy chuẩn chuẩn cho cả desktop nhỏ và mobile)
  fontScaleVersion: 2,
  autoScrollBanner: true,
  autoHideSidebar: false,
  searchCategories: true,
  searchNews: true,
  searchTv: true,
  searchChannelNumber: true,
  searchSettings: true,
  reduceAllMotion: false,
  animateSidebar: true,
  animateModals: true,
  animatePageTransitions: true,
};

export const FONT_SCALE_CONFIG = [
  { label: 'Cực nhỏ', value: 75, badge: 'Cực nhỏ', scale: '0.78' },
  { label: 'Nhỏ', value: 88, badge: 'Nhỏ', scale: '0.88' },
  { label: 'Trung bình', value: 100, badge: 'Trung bình', scale: '1' },
  { label: 'Lớn', value: 112, badge: 'Lớn', scale: '1.12' },
  { label: 'Cực lớn', value: 125, badge: 'Cực lớn', scale: '1.24' },
];

export const getStoredSettings = (): SystemSettings => {
  try {
    const saved = localStorage.getItem('waves_system_settings');
    const legacyTheme = localStorage.getItem('waves_theme');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      let fontScale = typeof parsed.fontScale === 'number' ? parsed.fontScale : DEFAULT_SETTINGS.fontScale;
      // Auto-migrate from old 4-item scheme if needed
      if (parsed.fontScaleVersion !== 2) {
        if (fontScale === 1) {
          fontScale = 2; // Old 'Mặc định' was idx 1 -> now 'Trung bình' at idx 2
        } else if (fontScale === 0) {
          fontScale = 1; // Old 'Nhỏ' was idx 0 -> now 'Nhỏ' at idx 1
        } else if (fontScale === 2) {
          fontScale = 3; // Old 'Lớn' was idx 2 -> now 'Lớn' at idx 3
        } else if (fontScale === 3) {
          fontScale = 4; // Old 'Cực lớn' was idx 3 -> now 'Cực lớn' at idx 4
        } else {
          fontScale = 2;
        }
      }
      return { 
        ...DEFAULT_SETTINGS, 
        ...parsed,
        fontScale,
        fontScaleVersion: 2,
        theme: parsed.theme || (legacyTheme === 'dark' ? 'dark' : 'light')
      };
    } else if (legacyTheme) {
      return {
        ...DEFAULT_SETTINGS,
        theme: legacyTheme === 'dark' ? 'dark' : 'light'
      };
    }
  } catch {}
  return DEFAULT_SETTINGS;
};

// Apply side-effects (theme class, font-scale property)
export const applySystemSettings = (settings: SystemSettings) => {
  if (typeof document === 'undefined') return;

  // Apply theme
  if (settings.theme === 'light') {
    document.documentElement.classList.add('light-mode');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark');
  }

  // Apply font scale
  const scaleVal = FONT_SCALE_CONFIG[settings.fontScale]?.scale || '1';
  document.documentElement.style.setProperty('--waves-font-scale', scaleVal);
};

// Initialize current settings and apply them to DOM immediately
let settingsStore = getStoredSettings();
let draftSettingsStore: SystemSettings = { ...settingsStore };

if (typeof window !== 'undefined') {
  applySystemSettings(settingsStore);
}

const listeners = new Set<() => void>();
const draftListeners = new Set<() => void>();

function notifyDraftListeners() {
  draftListeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error(err);
    }
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'waves_system_settings' || e.key === 'waves_theme' || !e.key) {
      settingsStore = getStoredSettings();
      draftSettingsStore = { ...settingsStore };
      applySystemSettings(settingsStore);
      callback();
      notifyDraftListeners();
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

function subscribeDraft(callback: () => void) {
  draftListeners.add(callback);
  return () => {
    draftListeners.delete(callback);
  };
}

function getSnapshot(): SystemSettings {
  return settingsStore;
}

function getDraftSnapshot(): SystemSettings {
  return draftSettingsStore;
}

export const updateDraftSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
  draftSettingsStore = { ...draftSettingsStore, [key]: value };
  notifyDraftListeners();
};

export const discardDraftSettings = () => {
  draftSettingsStore = { ...settingsStore };
  notifyDraftListeners();
};

export const applyDraftSettings = () => {
  updateMultipleSettings(draftSettingsStore);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('settings-applied-toast', { 
      detail: { timestamp: Date.now() } 
    }));
  }
};

export const updateGlobalSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
  settingsStore = { ...settingsStore, [key]: value, fontScaleVersion: 2 };
  draftSettingsStore = { ...settingsStore };
  try {
    localStorage.setItem('waves_system_settings', JSON.stringify(settingsStore));
    if (key === 'theme') {
      localStorage.setItem('waves_theme', value as string);
    }
  } catch {}
  applySystemSettings(settingsStore);
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error(err);
    }
  });
  notifyDraftListeners();
};

export const updateMultipleSettings = (newSettings: Partial<SystemSettings>) => {
  settingsStore = { ...settingsStore, ...newSettings, fontScaleVersion: 2 };
  draftSettingsStore = { ...settingsStore };
  try {
    localStorage.setItem('waves_system_settings', JSON.stringify(settingsStore));
    if (newSettings.theme) {
      localStorage.setItem('waves_theme', newSettings.theme);
    }
  } catch {}
  applySystemSettings(settingsStore);
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error(err);
    }
  });
  notifyDraftListeners();
};

export const useSettings = () => {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const draftSettings = useSyncExternalStore(subscribeDraft, getDraftSnapshot, getDraftSnapshot);

  const keys = Object.keys(draftSettings) as (keyof SystemSettings)[];
  const changedKeys = keys.filter((k) => draftSettings[k] !== settings[k]);
  const hasChanges = changedKeys.length > 0;

  return { 
    settings, 
    draftSettings,
    hasChanges,
    changedKeys,
    updateSetting: updateGlobalSetting,
    updateMultipleSettings,
    updateDraftSetting,
    applyDraftSettings,
    discardDraftSettings
  };
};
