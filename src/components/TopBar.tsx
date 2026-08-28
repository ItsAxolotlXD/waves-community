import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Home, 
  Tv, 
  Newspaper, 
  Heart, 
  Box, 
  BookOpen, 
  Info, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Layers,
  Palette,
  Radio,
  Film
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useClock } from '../hooks/useClock';
import { useFavorites } from '../hooks/useFavorites';
import { CHANNELS_DATA } from '../data/channels';
import { Channel } from '../types';
import { DiscordWelcomeModal } from './DiscordWelcomeModal';

interface TopBarProps {
  currentRoute: string;
  navigate: (route: string, state?: any) => void;
  onOpenSearch: () => void;
  selectedChannel?: Channel | null;
  onSelectChannel?: (channel: Channel) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  navigate,
  onOpenSearch,
  onSelectChannel
}) => {
  const { timeString, dateString } = useClock();
  const { favoriteChannelIds } = useFavorites();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);

  // Accordion states for mobile drawer (matching desktop sidebar)
  const [isLiveTvExpanded, setIsLiveTvExpanded] = useState(false);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  const [isToolboxExpanded, setIsToolboxExpanded] = useState(false);
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);

  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('waves_theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('waves_theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('waves_theme', 'dark');
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  const favoriteChannels = CHANNELS_DATA.filter((ch) => favoriteChannelIds.includes(ch.id));

  const isActive = (route: string) => {
    if (route === '/' && currentRoute === '/') return true;
    if (route !== '/' && currentRoute.startsWith(route)) return true;
    return false;
  };

  const handleMobileNav = (route: string, state?: any) => {
    navigate(route, state);
    setMobileMenuOpen(false);
  };

  const notifications = [
    { id: 1, title: 'Trực tiếp VIETNAM TODAY lúc 20:00 trên VTV4 HD', time: 'Vừa xong', unread: true },
    { id: 2, title: 'Thời sự 19h đã cập nhật tiêu điểm kinh tế số', time: '45 phút trước', unread: false },
    { id: 3, title: 'Bản tin số hóa truyền hình DVB-T2 các tỉnh thành', time: '2 giờ trước', unread: false }
  ];

  return (
    <>
      {/* Top Header Bar for Desktop & Mobile */}
      <header className="w-full h-16 bg-transparent border-0 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 pointer-events-none">
        {/* Left Side (Mobile Only Logo & Hamburger Button) */}
        <div className="flex items-center gap-3 md:hidden pointer-events-auto">
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#242429]/90 border border-[#34343C] flex items-center justify-center text-white dark:text-white light:text-[#111827] hover:text-[#DF37EE] hover:bg-[#2F2F36] active:scale-95 transition-all shadow-sm cursor-pointer"
            aria-label="Mở menu điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 flex items-center justify-center overflow-hidden">
              {!logoError ? (
                <img 
                  src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest?cb=20260825072411" 
                  alt="Waves Logo" 
                  className="w-6 h-6 object-contain topbar-brand-logo"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-white font-black text-base">W</span>
              )}
            </div>
            <span className="font-bold text-sm tracking-tight text-white dark:text-white light:text-[#111827]">
              Waves <span className="text-[#DF37EE]">Community</span>
            </span>
          </div>
        </div>

        {/* Empty placeholder on desktop left */}
        <div className="hidden md:flex items-center gap-3"></div>

        {/* Right Action Icons: Search, Notifications & Light Mode Toggle */}
        <div className="flex items-center gap-2.5 md:gap-3.5 pointer-events-auto ml-auto">
          {/* Quick Spotlight Search trigger */}
          <button
            id="btn-top-search"
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-full bg-[#242429]/80 border border-[#34343C] md:border-transparent md:bg-transparent flex items-center justify-center text-white/90 hover:text-white dark:text-[#D1D5DB] dark:hover:text-white light:text-[#374151] light:hover:text-[#111827] hover:bg-[#2F2F36] transition-all cursor-pointer shadow-xs active:scale-95"
            title="Spotlight Search (⌘K)"
          >
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
              alt="Search"
              referrerPolicy="no-referrer"
              className="w-4.5 h-4.5 object-contain brightness-0 invert opacity-85 hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              id="btn-top-notifications"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 rounded-full bg-[#242429]/80 border border-[#34343C] md:border-transparent md:bg-transparent flex items-center justify-center text-white/90 hover:text-white dark:text-[#D1D5DB] dark:hover:text-white light:text-[#374151] light:hover:text-[#111827] hover:bg-[#2F2F36] transition-all relative cursor-pointer shadow-xs active:scale-95"
              title="Thông báo cộng đồng"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DF37EE] ring-2 ring-[#171719]" />
            </button>

            {/* Notification dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#242429] border border-[#34343C] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 topbar-notification-box">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#303036] topbar-notification-header">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Thông báo phát sóng</span>
                  <span className="text-[10px] text-[#DF37EE] font-medium cursor-pointer hover:underline">Đã đọc tất cả</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer topbar-notification-item ${n.unread ? 'bg-[#2E2E34] border border-[#40404A]' : 'bg-transparent hover:bg-[#28282E]'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-white font-medium leading-snug">{n.title}</p>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#DF37EE] shrink-0 mt-1" />}
                      </div>
                      <span className="text-[10px] text-[#8E8E93] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Light Mode / Dark Mode Toggle */}
          <button
            id="btn-top-light-mode"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-[#242429]/80 border border-[#34343C] md:border-transparent md:bg-transparent flex items-center justify-center text-white/90 hover:text-[#FBBF24] dark:text-[#D1D5DB] dark:hover:text-[#FBBF24] light:text-[#374151] light:hover:text-[#FBBF24] hover:bg-[#2F2F36] transition-all cursor-pointer shadow-xs active:scale-95"
            title={isLightMode ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
            aria-label="Chuyển chế độ sáng/tối"
          >
            {isLightMode ? (
              <Moon className="w-4.5 h-4.5 text-[#FBBF24]" />
            ) : (
              <Sun className="w-4.5 h-4.5 hover:rotate-45 transition-transform duration-300" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer - Identical style & branding to Desktop Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex select-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar Content matching Desktop Sidebar design */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[300px] max-w-[85vw] h-full bg-[#242429] border-r border-[#34343C] flex flex-col shadow-2xl z-10 overflow-hidden"
            >
              {/* Header: Monochrome Logo + Clock + Close Button */}
              <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-[#34343C]/40">
                <div className="flex items-center gap-3.5 pl-1">
                  {/* Monochrome Logo without background */}
                  <div 
                    onClick={() => handleMobileNav('/')}
                    className="cursor-pointer flex items-center justify-center p-0 hover:opacity-80 transition-opacity"
                    title="Waves Community"
                  >
                    {!logoError ? (
                      <img 
                        src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest?cb=20260825072411" 
                        alt="Waves Logo" 
                        className="w-8 h-8 object-contain sidebar-brand-logo"
                        onError={() => setLogoError(true)}
                      />
                    ) : (
                      <span className="text-white font-black text-2xl tracking-tighter">W</span>
                    )}
                  </div>

                  {/* Real-time Clock display */}
                  <div className="flex flex-col">
                    <div className="text-white text-base font-bold tracking-tight font-mono leading-tight">
                      {timeString || '20:16:35'}
                    </div>
                    <div className="text-[#A1A1AA] text-[11px] font-medium leading-none mt-0.5">
                      {dateString || 'Th 5, 27/08/2026'}
                    </div>
                  </div>
                </div>

                {/* Close mobile drawer button */}
                <button 
                  id="btn-close-mobile-menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#2F2F36] border border-[#3E3E48] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#3C3C46] transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Đóng menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Spotlight Search Capsule Box */}
              <div className="px-4 pt-3 pb-4">
                <button
                  id="btn-mobile-spotlight-search"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full h-[44px] flex items-center justify-between px-4 rounded-full spotlight-bubble-box text-left text-sm text-[#A1A1AA] hover:text-white transition-all group cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0 truncate">
                    <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center shrink-0">
                      <img
                        src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
                        alt="Search"
                        referrerPolicy="no-referrer"
                        className="w-full h-full aspect-square object-contain brightness-0 invert opacity-75 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-sm text-[#9CA3AF] group-hover:text-white font-medium truncate">Spotlight Search...</span>
                  </div>
                  <div className="w-4 h-4 min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] flex items-center justify-center shrink-0 ml-1">
                    <img
                      src="https://github.com/andrewtavis/sf-symbols-online/raw/master/glyphs/mic.png"
                      alt="Mic"
                      referrerPolicy="no-referrer"
                      className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </button>
              </div>

              {/* Scrollable Navigation Menu - Exactly identical to Desktop Sidebar */}
              <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2.5 text-sm font-medium sidebar-scroller">
                {/* 1. Home */}
                <button
                  id="mobile-nav-home"
                  onClick={() => handleMobileNav('/')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all duration-200 ${
                    isActive('/') && currentRoute === '/'
                      ? 'bg-[#DF37EE] text-white font-bold shadow-md shadow-[#DF37EE]/20'
                      : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
                  }`}
                >
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/6/6e/New_hom.png/revision/latest?cb=20260722124341"
                    alt="Home"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 object-contain shrink-0 brightness-0 invert"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="truncate">Home</span>
                </button>

                {/* 2. Live TV with Accordion */}
                <div className="w-full">
                  <button
                    id="mobile-nav-live-tv"
                    onClick={() => handleMobileNav('/live-tv')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all ${
                      isActive('/live-tv')
                        ? 'bg-[#DF37EE] text-white font-bold shadow-md shadow-[#DF37EE]/20'
                        : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 truncate">
                      <Tv className="w-5 h-5 shrink-0" />
                      <span className="truncate">Live TV</span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLiveTvExpanded(!isLiveTvExpanded);
                      }}
                      className="p-1 hover:text-white"
                    >
                      {isLiveTvExpanded ? (
                        <ChevronDown className="w-4 h-4 opacity-70" />
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Channels list */}
                  {isLiveTvExpanded && (
                    <div className="mt-2 ml-4 pl-3 border-l border-[#3E3E48] space-y-1">
                      {CHANNELS_DATA.slice(0, 5).map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            if (onSelectChannel) onSelectChannel(ch);
                            handleMobileNav(`/live-tv?channel=${ch.slug}`);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
                        >
                          <span className="truncate">{ch.shortName || ch.name}</span>
                          <span className="px-1.5 py-0.2 text-[9px] bg-[#DF37EE]/20 text-[#FF55FF] border border-[#DF37EE]/40 rounded-full font-bold">
                            HD
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => handleMobileNav('/live-tv')}
                        className="w-full text-left px-3 py-1.5 text-[11px] text-[#DF37EE] hover:underline font-medium"
                      >
                        + Xem tất cả kênh
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. News */}
                <button
                  id="mobile-nav-news"
                  onClick={() => handleMobileNav('/news')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all ${
                    isActive('/news')
                      ? 'bg-[#DF37EE] text-white font-bold shadow-md shadow-[#DF37EE]/20'
                      : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
                  }`}
                >
                  <Newspaper className="w-5 h-5 shrink-0" />
                  <span className="truncate">News</span>
                </button>

                {/* Divider */}
                <div className="py-1 w-full">
                  <hr className="border-[#34343C]" />
                </div>

                {/* 5. Favorites Accordion */}
                <div className="w-full">
                  <button
                    id="mobile-nav-favorites"
                    onClick={() => handleMobileNav('/favorites')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all ${
                      isActive('/favorites')
                        ? 'bg-[#DF37EE] text-white font-bold shadow-md shadow-[#DF37EE]/20'
                        : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 truncate">
                      <Heart className="w-5 h-5 shrink-0" />
                      <span className="truncate">Favorites</span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFavoritesExpanded(!isFavoritesExpanded);
                      }}
                      className="p-1 hover:text-white"
                    >
                      {isFavoritesExpanded ? (
                        <ChevronDown className="w-4 h-4 opacity-70" />
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      )}
                    </div>
                  </button>

                  {isFavoritesExpanded && (
                    <div className="mt-2 ml-4 pl-3 border-l border-[#3E3E48] space-y-1">
                      {favoriteChannels.length > 0 ? (
                        favoriteChannels.map((ch) => (
                          <button
                            key={ch.id}
                            onClick={() => {
                              if (onSelectChannel) onSelectChannel(ch);
                              handleMobileNav(`/live-tv?channel=${ch.slug}`);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors group"
                          >
                            <span className="truncate">{ch.shortName || ch.name}</span>
                            <span className="px-2 py-0.5 text-[9px] bg-[#3E3E48] text-[#E0E0E6] group-hover:bg-[#DF37EE] group-hover:text-white rounded-full font-semibold transition-colors">
                              Phát
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-1.5 text-[11px] text-[#8E8E93] italic">
                          Chưa có kênh yêu thích
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 6. Toolbox Accordion */}
                <div className="w-full">
                  <button
                    id="mobile-nav-toolbox"
                    onClick={() => handleMobileNav('/toolbox')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all ${
                      isActive('/toolbox')
                        ? 'bg-[#DF37EE] text-white font-bold shadow-md shadow-[#DF37EE]/20'
                        : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 truncate">
                      <Box className="w-5 h-5 shrink-0" />
                      <span className="truncate">Toolbox</span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsToolboxExpanded(!isToolboxExpanded);
                      }}
                      className="p-1 hover:text-white"
                    >
                      {isToolboxExpanded ? (
                        <ChevronDown className="w-4 h-4 opacity-70" />
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      )}
                    </div>
                  </button>

                  {isToolboxExpanded && (
                    <div className="mt-2 ml-4 pl-3 border-l border-[#3E3E48] space-y-1">
                      <button
                        onClick={() => handleMobileNav('/toolbox', { tab: 'safe-area' })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#FF6B6B]" />
                        <span className="truncate">Aspect Ratio & Safe Area</span>
                      </button>
                      <button
                        onClick={() => handleMobileNav('/toolbox', { tab: 'color-bars' })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
                      >
                        <Palette className="w-3.5 h-3.5 text-[#FF5555]" />
                        <span className="truncate">SMPTE Color Bars & Tone</span>
                      </button>
                      <button
                        onClick={() => handleMobileNav('/toolbox', { tab: 'm3u-tester' })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
                      >
                        <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span className="truncate">M3U Playlist Parser</span>
                      </button>
                      <button
                        onClick={() => handleMobileNav('/toolbox', { tab: 'timecode' })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
                      >
                        <Film className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span className="truncate">Broadcast Timecode</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 7. Help Accordion */}
                <div className="w-full">
                  <button
                    id="mobile-nav-help"
                    onClick={() => setIsHelpExpanded(!isHelpExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36] transition-all"
                  >
                    <div className="flex items-center gap-3.5 truncate">
                      <BookOpen className="w-5 h-5 shrink-0" />
                      <span className="truncate">Help</span>
                    </div>
                    {isHelpExpanded ? (
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    )}
                  </button>

                  {isHelpExpanded && (
                    <div className="mt-2 ml-4 pl-3 border-l border-[#3E3E48] space-y-1.5 text-xs text-[#A1A1AA] p-2">
                      <p>• Phím tắt: ⌘K tìm kiếm, Space tạm dừng</p>
                      <p>• Báo lỗi phát sóng trực tiếp qua Discord</p>
                    </div>
                  )}
                </div>

                {/* 8. About */}
                <button
                  id="mobile-nav-about"
                  onClick={() => handleMobileNav('/about')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all ${
                    isActive('/about')
                      ? 'bg-[#DF37EE] text-white font-bold shadow-md shadow-[#DF37EE]/20'
                      : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
                  }`}
                >
                  <Info className="w-5 h-5 shrink-0" />
                  <span className="truncate">About</span>
                </button>

                {/* 9. Join Waves on Discord */}
                <button
                  type="button"
                  id="mobile-nav-discord"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsDiscordModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] text-[#D1D5DB] hover:text-white hover:bg-white/10 border border-transparent transition-all group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <svg className="w-5 h-5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.078.078 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span className="truncate text-xs font-medium">Join Waves on Discord</span>
                  </div>
                </button>

                {/* 10. Settings */}
                <button
                  id="mobile-nav-settings"
                  onClick={() => handleMobileNav('/settings')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] transition-all ${
                    isActive('/settings')
                      ? 'bg-[#DF37EE] text-white font-bold shadow-md shadow-[#DF37EE]/20'
                      : 'text-[#D1D5DB] hover:text-white hover:bg-[#2F2F36]'
                  }`}
                >
                  <Settings className="w-5 h-5 shrink-0" />
                  <span className="truncate">Cài đặt</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Discord Welcome Modal Dialog */}
      <DiscordWelcomeModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
      />
    </>
  );
};
