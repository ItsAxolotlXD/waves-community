import React, { useState } from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../hooks/useSettings';
import { ToolsMenu } from './ToolsMenu';
import { SfCheckmark } from './SfCheckmark';
import { Channel, NewsArticle } from '../types';

interface TopBarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu?: () => void;
  currentChannel?: Channel;
  channels?: Channel[];
  onOpenHelp?: () => void;
  onOpenDiscord?: () => void;
  onOpenSummarize?: (article: NewsArticle) => void;
  onOpenFindWords?: () => void;
  onOpenAddStream?: () => void;
  onImportChannels?: (channels: Channel[]) => void;
  onOpenNotifications?: () => void;
  fontSize?: number;
  onChangeFontSize?: (size: number) => void;
  showUnsavedTooltip?: boolean;
  onDismissUnsavedTooltip?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  navigate,
  onOpenSearch,
  onOpenMobileMenu,
  currentChannel,
  channels = [],
  onOpenHelp = () => {},
  onOpenDiscord = () => {},
  onOpenSummarize = () => {},
  onOpenFindWords = () => {},
  onOpenAddStream = () => {},
  onImportChannels = () => {},
  onOpenNotifications = () => {},
  fontSize = 16,
  onChangeFontSize = () => {},
  showUnsavedTooltip = false,
  onDismissUnsavedTooltip = () => {}
}) => {
  const { settings, updateSetting, hasChanges, applyDraftSettings } = useSettings();
  const [logoError, setLogoError] = useState(false);

  const isLightMode = settings.theme === 'light';

  const toggleTheme = () => {
    updateSetting('theme', isLightMode ? 'dark' : 'light');
  };

  const handleApplySettings = () => {
    applyDraftSettings();
    onDismissUnsavedTooltip();
  };

  return (
    <header className="w-full h-16 bg-transparent border-0 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 pointer-events-none">
      {/* Progressive Blur Layer over the top header bar spanning search, tools, notifications, and theme toggle */}
      <div 
        id="topbar-progressive-blur" 
        className="topbar-progressive-blur" 
        aria-hidden="true"
      >
        <div className="progressive-blur-layer layer-1" />
        <div className="progressive-blur-layer layer-2" />
        <div className="progressive-blur-layer layer-3" />
        <div className="progressive-blur-layer layer-4" />
        <div className="progressive-blur-gradient" />
      </div>

      {/* Left Side (Mobile Only Logo & Hamburger) */}
      <div className="flex items-center gap-3 md:hidden pointer-events-auto">
        <button
          id="btn-mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#18181B] dark:text-white transition-all cursor-pointer"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="h-8 flex items-center justify-center overflow-hidden">
            {!logoError ? (
              <img 
                src={isLightMode 
                  ? "https://static.wikia.nocookie.net/ep-deo/images/f/f3/Vplay_light_mode.png/revision/latest/scale-to-width-down/1000?cb=20260829062448"
                  : "https://static.wikia.nocookie.net/ep-deo/images/f/f8/Vpla.png/revision/latest/scale-to-width-down/1000?cb=20260829062528"
                } 
                alt="Vplay Logo" 
                referrerPolicy="no-referrer"
                className="h-7 w-auto max-w-[120px] object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-[#E6005A] font-black text-sm">V</span>
            )}
          </div>
        </div>
      </div>

      {/* Empty placeholder on desktop left */}
      <div className="hidden md:flex items-center gap-3" />

      {/* Right Action Icons: Search, Tools Menu, Notifications & Light Mode Toggle */}
      <div className="flex items-center gap-2.5 md:gap-3.5 pointer-events-auto ml-auto">
        {/* Quick Spotlight Search trigger */}
        <button
          id="btn-top-search"
          onClick={onOpenSearch}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white transition-all drop-shadow-sm cursor-pointer"
          title="Spotlight Search (⌘K)"
        >
          <img
            src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
            alt="Search"
            referrerPolicy="no-referrer"
            className="w-5 h-5 object-contain topbar-search-icon"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </button>

        {/* Tools Menu Icon (Contextual hover dropdown for each tab) - Placed directly right of search */}
        <ToolsMenu
          currentRoute={currentRoute}
          currentChannel={currentChannel}
          channels={channels}
          isLightMode={isLightMode}
          onNavigate={navigate}
          onOpenHelp={onOpenHelp}
          onOpenDiscord={onOpenDiscord}
          onOpenSummarize={onOpenSummarize}
          onOpenFindWords={onOpenFindWords}
          onOpenAddStream={onOpenAddStream}
          onImportChannels={onImportChannels}
          fontSize={fontSize}
          onChangeFontSize={onChangeFontSize}
        />

        {/* Notifications button */}
        <button
          id="btn-top-notifications"
          onClick={onOpenNotifications}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white transition-all relative drop-shadow-sm cursor-pointer"
          title="Thông báo cộng đồng"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E6005A]" />
        </button>

        {/* In Settings tab: replace light/dark mode button with Apply Settings Checkbox button */}
        {currentRoute === '/settings' ? (
          <div className="relative flex items-center justify-center">
            <button
              id="btn-top-settings-apply-checkbox"
              type="button"
              onClick={handleApplySettings}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer select-none transition-all text-white bg-[#E6005A] ${
                hasChanges 
                  ? 'ring-2 ring-[#E6005A] ring-offset-2 ring-offset-[#141416] animate-pulse shadow-[0_0_14px_rgba(230,0,90,0.7)]' 
                  : 'shadow-[0_2px_10px_rgba(230,0,90,0.35)] hover:scale-105 active:scale-95'
              } ${showUnsavedTooltip ? 'animate-shake' : ''}`}
              data-checked="true"
              title={
                hasChanges
                  ? "Có thay đổi cài đặt chưa áp dụng. Bấm vào đây để áp dụng!"
                  : "Tất cả cài đặt đã được áp dụng"
              }
              aria-label={hasChanges ? "Áp dụng cài đặt" : "Cài đặt đã áp dụng"}
            >
              <SfCheckmark className="w-[24px] h-[24px] text-white" strokeWidth={2.7} color="#FFFFFF" />
            </button>

            {/* Unsaved Settings Warning Tooltip */}
            <AnimatePresence>
              {showUnsavedTooltip && (
                <motion.div
                  id="settings-unsaved-tooltip"
                  initial={{ opacity: 0, y: -6, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.94 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full mt-2.5 right-0 z-50 flex flex-col items-end pointer-events-auto"
                >
                  <div className="settings-unsaved-tooltip-arrow w-2.5 h-2.5 rotate-45 bg-[#1C1C1E] border-t border-l border-white/20 translate-y-[5px] mr-3 z-10" />
                  <div className="settings-unsaved-tooltip-card px-3.5 py-2 rounded-2xl bg-[#1C1C1E]/95 border border-white/20 text-white shadow-2xl backdrop-blur-xl flex items-center gap-2 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-[#E6005A] shadow-[0_0_8px_rgba(230,0,90,0.9)] shrink-0 animate-ping" />
                    <span className="text-[12.5px] font-medium tracking-wide">
                      Vui lòng lưu thay đổi cài đặt trước khi rời
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Other tabs: Light Mode / Dark Mode Toggle button */
          <button
            id="btn-top-light-mode"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-[#FBBF24] transition-all drop-shadow-sm cursor-pointer"
            title={isLightMode ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
            aria-label="Chuyển chế độ sáng/tối"
          >
            {isLightMode ? (
              <Moon className="w-5 h-5 text-[#18181B]" />
            ) : (
              <Sun className="w-5 h-5 text-white hover:rotate-45 transition-transform duration-300" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
