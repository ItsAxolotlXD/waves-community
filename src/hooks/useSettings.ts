import { useSyncExternalStore } from 'react';

export interface SystemSettings {
  theme: 'light' | 'dark';
  dockToSidebar: boolean;
  fontScale: number; // 0: 85%, 1: 100%, 2: 115%, 3: 130%
  autoScrollBanner: boolean;
  autoHideSidebar: boolean;
  searchCategories: boolean;
  searchNews: boolean;
  searchTv: boolean;
  searchChannelNumber: boolean;
  searchToolbox: boolean;
  searchSettings: boolean;
  reduceAllMotion: boolean;
  animateSidebar: boolean;
  animateModals: boolean;
  animatePageTransitions: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'light',
  dockToSidebar: true,
  fontScale: 1,
  autoScrollBanner: true,
  autoHideSidebar: false,
  searchCategories: true,
  searchNews: true,
  searchTv: true,
  searchChannelNumber: true,
  searchToolbox: true,
  searchSettings: true,
  reduceAllMotion: false,
  animateSidebar: true,
  animateModals: true,
  animatePageTransitions: true,
};

export const FONT_SCALE_CONFIG = [
  { label: 'Nhỏ (85%)', value: 85, badge: 'Nhỏ (85%)', scale: '0.88' },
  { label: 'Mặc định (100%)', value: 100, badge: 'Mặc định (100%)', scale: '1' },
  { label: 'Lớn (115%)', value: 115, badge: 'Lớn (115%)', scale: '1.12' },
  { label: 'Cực lớn (130%)', value: 130, badge: 'Cực lớn (130%)', scale: '1.24' },
];

export const getStoredSettings = (): SystemSettings => {
  try {
    const saved = localStorage.getItem('waves_system_settings');
    const legacyTheme = localStorage.getItem('waves_theme');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...DEFAULT_SETTINGS, 
        ...parsed,
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
if (typeof window !== 'undefined') {
  applySystemSettings(settingsStore);
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'waves_system_settings' || e.key === 'waves_theme' || !e.key) {
      settingsStore = getStoredSettings();
      applySystemSettings(settingsStore);
      callback();
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

function getSnapshot(): SystemSettings {
  return settingsStore;
}

export const updateGlobalSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
  settingsStore = { ...settingsStore, [key]: value };
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
};

export const useSettings = () => {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { settings, updateSetting: updateGlobalSetting };
};
