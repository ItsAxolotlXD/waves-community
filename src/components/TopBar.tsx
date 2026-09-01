import React, { useState } from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { ToolsMenu } from './ToolsMenu';
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
  onChangeFontSize = () => {}
}) => {
  const { settings, updateSetting } = useSettings();
  const [logoError, setLogoError] = useState(false);

  const isLightMode = settings.theme === 'light';

  const toggleTheme = () => {
    updateSetting('theme', isLightMode ? 'dark' : 'light');
  };

  return (
    <header className="w-full h-16 bg-transparent border-0 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 pointer-events-none">
      {/* Left Side (Mobile Only Logo & Hamburger) */}
      <div className="flex items-center gap-3 md:hidden pointer-events-auto">
        <button
          id="btn-mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-white bg-transparent hover:text-[#E6005A] transition-colors cursor-pointer"
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
          className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white hover:opacity-80 bg-transparent transition-all drop-shadow-sm cursor-pointer"
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
          className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-white hover:opacity-80 bg-transparent transition-all relative drop-shadow-sm cursor-pointer"
          title="Thông báo cộng đồng"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E6005A]" />
        </button>

        {/* Light Mode / Dark Mode Toggle button */}
        <button
          id="btn-top-light-mode"
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center text-[#18181B] dark:text-[#D1D5DB] dark:hover:text-[#FBBF24] hover:opacity-80 bg-transparent transition-all drop-shadow-sm cursor-pointer"
          title={isLightMode ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
          aria-label="Chuyển chế độ sáng/tối"
        >
          {isLightMode ? (
            <Moon className="w-5 h-5 text-[#18181B]" />
          ) : (
            <Sun className="w-5 h-5 text-white hover:rotate-45 transition-transform duration-300" />
          )}
        </button>
      </div>
    </header>
  );
};
