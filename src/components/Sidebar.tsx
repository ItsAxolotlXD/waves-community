import React, { useState } from 'react';
import { 
  Home, 
  Tv, 
  Newspaper, 
  Tag, 
  Heart, 
  Box, 
  BookOpen, 
  Info, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Mic, 
  ChevronLeft,
  Radio,
  Palette,
  Film,
  Layers
} from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { useFavorites } from '../hooks/useFavorites';
import { CHANNELS_DATA } from '../data/channels';
import { Channel } from '../types';

interface SidebarProps {
  currentRoute: string;
  navigate: (route: string, state?: any) => void;
  onOpenSearch: () => void;
  selectedChannel?: Channel | null;
  onSelectChannel?: (channel: Channel) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  navigate,
  onOpenSearch,
  onSelectChannel
}) => {
  const { timeString, dateString } = useClock();
  const { favoriteChannelIds } = useFavorites();

  const [isLiveTvExpanded, setIsLiveTvExpanded] = useState(false);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  const [isToolboxExpanded, setIsToolboxExpanded] = useState(false);
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const favoriteChannels = CHANNELS_DATA.filter((ch) => favoriteChannelIds.includes(ch.id));

  const isActive = (route: string) => {
    if (route === '/' && currentRoute === '/') return true;
    if (route !== '/' && currentRoute.startsWith(route)) return true;
    return false;
  };

  return (
    <aside 
      id="waves-desktop-sidebar"
      className="hidden md:flex flex-col w-[290px] h-screen bg-[#242429] border-r border-[#34343C] select-none shrink-0 fixed top-0 left-0 z-40 overflow-hidden"
    >
      {/* Top Header: Clock + Monochrome Logo (No Background) + Back Controls (NO border divider) */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Monochrome Logo without background (Black in Light Mode, White in Dark Mode) */}
          <div 
            onClick={() => navigate('/')} 
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
              <span className="text-white dark:text-white light:text-[#111827] font-black text-2xl tracking-tighter">W</span>
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

        {/* Back navigation button */}
        <button 
          id="btn-sidebar-back"
          onClick={() => window.history.back()}
          className="w-8 h-8 rounded-full bg-[#2F2F36] border border-[#3E3E48] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#3C3C46] transition-all"
          title="Quay lại"
        >
          <ChevronLeft className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Spotlight Search Box (Bubble Capsule style with reflective shiny border) */}
      <div className="px-3.5 py-2">
        <button
          id="btn-spotlight-search"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-full spotlight-bubble-box text-left text-sm text-[#A1A1AA] hover:text-white transition-all group cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-2.5 truncate">
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
              alt="Search"
              referrerPolicy="no-referrer"
              className="w-4 h-4 object-contain brightness-0 invert opacity-75 group-hover:opacity-100 transition-opacity shrink-0"
              onError={(e) => {
                // Fallback if network blocked
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs text-[#9CA3AF] group-hover:text-white font-medium truncate">Spotlight Search...</span>
          </div>
          <img
            src="https://github.com/andrewtavis/sf-symbols-online/raw/master/glyphs/mic.png"
            alt="Mic"
            referrerPolicy="no-referrer"
            className="w-4 h-4 object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </button>
      </div>

      {/* Scrollable Navigation Menu - Hidden Scrollbar with #DF37EE Active & GENTLY ROUNDED (14px) Corners & Enlarged Icons */}
      <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-2 text-sm font-medium sidebar-scroller no-scrollbar">
        {/* 1. Home */}
        <button
          id="nav-item-home"
          onClick={() => navigate('/')}
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
        <div>
          <button
            id="nav-item-live-tv"
            onClick={() => navigate('/live-tv')}
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
                    navigate(`/live-tv?channel=${ch.slug}`);
                    if (onSelectChannel) onSelectChannel(ch);
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
                onClick={() => navigate('/live-tv')}
                className="w-full text-left px-3 py-1.5 text-[11px] text-[#DF37EE] hover:underline font-medium"
              >
                + Xem tất cả kênh
              </button>
            </div>
          )}
        </div>

        {/* 3. News */}
        <button
          id="nav-item-news"
          onClick={() => navigate('/news')}
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
        <div className="py-1">
          <hr className="border-[#34343C]" />
        </div>

        {/* 5. Favorites Accordion */}
        <div>
          <button
            id="nav-item-favorites"
            onClick={() => navigate('/favorites')}
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
                      navigate(`/live-tv?channel=${ch.slug}`);
                      if (onSelectChannel) onSelectChannel(ch);
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
        <div>
          <button
            id="nav-item-toolbox"
            onClick={() => navigate('/toolbox')}
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
                onClick={() => navigate('/toolbox', { tab: 'safe-area' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span className="truncate">Aspect Ratio & Safe Area</span>
              </button>
              <button
                onClick={() => navigate('/toolbox', { tab: 'color-bars' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
              >
                <Palette className="w-3.5 h-3.5 text-[#FF5555]" />
                <span className="truncate">SMPTE Color Bars & Tone</span>
              </button>
              <button
                onClick={() => navigate('/toolbox', { tab: 'm3u-tester' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="truncate">M3U Playlist Parser</span>
              </button>
              <button
                onClick={() => navigate('/toolbox', { tab: 'timecode' })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs text-[#A1A1AA] hover:text-white hover:bg-[#2E2E35] transition-colors"
              >
                <Film className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span className="truncate">Broadcast Timecode</span>
              </button>
            </div>
          )}
        </div>

        {/* 7. Help (Book Icon) */}
        <div>
          <button
            id="nav-item-help"
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
          id="nav-item-about"
          onClick={() => navigate('/about')}
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
        <a
          id="nav-item-discord"
          href="https://discord.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] text-[#D1D5DB] hover:text-white hover:bg-[#5865F2]/20 hover:border-[#5865F2]/40 border border-transparent transition-all group"
        >
          <div className="flex items-center gap-3.5 truncate">
            <svg className="w-5 h-5 fill-current text-[#5865F2] shrink-0" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span className="truncate text-xs font-medium">Join Waves on Discord</span>
        </div>
      </a>

        {/* 10. Settings */}
        <button
          id="nav-item-settings"
          onClick={() => navigate('/settings')}
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
    </aside>
  );
};
