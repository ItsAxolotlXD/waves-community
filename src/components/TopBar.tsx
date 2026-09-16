import React, { useState } from 'react';
import { Menu, Bell, Search, Tv, ShoppingBag, Settings } from 'lucide-react';
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
  onOpenTextToSpeech?: (article: NewsArticle) => void;
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
  onOpenTextToSpeech = () => {},
  onOpenFindWords = () => {},
  onOpenAddStream = () => {},
  onImportChannels = () => {},
  onOpenNotifications = () => {},
  fontSize = 16,
  onChangeFontSize = () => {},
  showUnsavedTooltip = false,
  onDismissUnsavedTooltip = () => {}
}) => {
  const { settings, hasChanges, applyDraftSettings } = useSettings();
  const [logoError, setLogoError] = useState(false);
  const isTopBarMode = settings.navigationMode === 'topbar';

  const handleApplySettings = () => {
    applyDraftSettings();
    onDismissUnsavedTooltip();
  };

  return (
    <header className="w-full h-16 bg-transparent border-0 px-3 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 pointer-events-none">
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

      {/* TOP BAR MODE: Brand Logo Capsule & Navigation Links (Truyền hình, News, Cài đặt) */}
      {isTopBarMode ? (
        <div className="flex items-center gap-1.5 sm:gap-3 pointer-events-auto shrink-0">
          {/* Logo capsule button - Khi nhấn vào logo web sẽ quay lại home page */}
          <button
            id="btn-topbar-brand-capsule"
            onClick={() => navigate('/')}
            className="h-9 px-3 sm:px-3.5 rounded-full bg-[#202020] hover:bg-[#282828] border border-white/10 flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all shadow-sm active:scale-95 group shrink-0 select-none"
            title="Trang chủ (Vplay)"
          >
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 drop-shadow-sm shrink-0" fill="none">
                <path 
                  d="M4.5 5.5L12 19L19.5 5.5H15.5L12 12.5L8.5 5.5H4.5Z" 
                  fill="#E6005A" 
                />
                <path 
                  d="M12 19L16 11.5L13.8 7.5L10 14.5L12 19Z" 
                  fill="#FF3366" 
                />
              </svg>
              <span className="font-extrabold tracking-tight text-white text-[13.5px] sm:text-[14px]">
                vplay
              </span>
            </div>
          </button>

          {/* Navigation links: Truyền hình, News (thay Shop) */}
          <nav className="flex items-center gap-0.5 sm:gap-1.5 ml-0.5 sm:ml-2" aria-label="Thanh điều hướng chính">
            {/* Truyền hình */}
            <button
              id="btn-topbar-nav-tv"
              onClick={() => navigate('/live-tv')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-[13.5px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentRoute === '/live-tv' || currentRoute === '/channels'
                  ? 'text-white font-semibold bg-white/10 shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
              }`}
              title="Truyền hình trực tiếp"
            >
              <Tv className="w-4 h-4 text-white/90 shrink-0" />
              <span>Truyền hình</span>
            </button>

            {/* News (Thay Shop) */}
            <button
              id="btn-topbar-nav-news"
              onClick={() => navigate('/news')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-[13.5px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentRoute === '/news' || currentRoute.startsWith('/article')
                  ? 'text-white font-semibold bg-white/10 shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
              }`}
              title="Tin tức (News)"
            >
              <ShoppingBag className="w-4 h-4 text-white/90 shrink-0" />
              <span>News</span>
            </button>
          </nav>
        </div>
      ) : (
        /* STANDARD MODE Left Side (Mobile Only Logo & Hamburger) */
        <>
          <div className="flex items-center gap-3 md:hidden pointer-events-auto">
            <button
              id="btn-mobile-menu-toggle"
              onClick={onOpenMobileMenu}
              className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-white bg-transparent border-0 shadow-none hover:bg-transparent transition-opacity hover:opacity-80 active:opacity-60 cursor-pointer p-0"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="h-8 flex items-center justify-center overflow-hidden">
                {!logoError ? (
                  <img 
                    src="https://static.wikia.nocookie.net/ep-deo/images/e/ed/New_Vplay.png/revision/latest?cb=20260906031000"
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
        </>
      )}

      {/* Right Action Icons: Search, Tools Menu, Settings Gear */}
      <div className="flex items-center gap-1.5 sm:gap-3 pointer-events-auto ml-auto shrink-0">
        {/* Quick Spotlight Search trigger */}
        <button
          id="btn-top-search"
          onClick={onOpenSearch}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#D1D5DB] hover:text-white hover:bg-white/10 transition-all drop-shadow-sm cursor-pointer"
          title="Spotlight Search (⌘K)"
        >
          <Search className="w-4.5 h-4.5 object-contain topbar-search-icon" strokeWidth={1.6} />
        </button>

        {/* Tools Menu Icon (Contextual hover dropdown for each tab) */}
        <ToolsMenu
          currentRoute={currentRoute}
          currentChannel={currentChannel}
          channels={channels}
          onNavigate={navigate}
          onOpenHelp={onOpenHelp}
          onOpenDiscord={onOpenDiscord}
          onOpenSummarize={onOpenSummarize}
          onOpenTextToSpeech={onOpenTextToSpeech}
          onOpenFindWords={onOpenFindWords}
          onOpenAddStream={onOpenAddStream}
          onImportChannels={onImportChannels}
          fontSize={fontSize}
          onChangeFontSize={onChangeFontSize}
        />

        {/* TopBar Mode: Settings Gear Icon */}
        {isTopBarMode && (
          <button
            id="btn-top-settings-gear"
            onClick={() => navigate('/settings')}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all drop-shadow-sm cursor-pointer ${
              currentRoute === '/settings'
                ? 'text-white bg-white/15'
                : 'text-[#D1D5DB] hover:text-white hover:bg-white/10'
            }`}
            title="Cài đặt hệ thống"
          >
            <Settings className="w-4.5 h-4.5" strokeWidth={1.6} />
          </button>
        )}

        {/* Standard Notifications button (when not in TopBar mode) */}
        {!isTopBarMode && (
          <button
            id="btn-top-notifications"
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white transition-all relative drop-shadow-sm cursor-pointer"
            title="Thông báo cộng đồng"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E6005A]" />
          </button>
        )}

        {/* In Settings tab: Apply Settings Checkbox button */}
        {currentRoute === '/settings' ? (
          <div className="relative flex items-center justify-center ml-0.5">
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
        ) : null}
      </div>
    </header>
  );
};
