import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, Search, Sun, Moon, Home, Tv, Newspaper, Tag, Heart, Box, BookOpen, Info, Settings } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { DiscordWelcomeModal } from './DiscordWelcomeModal';

interface TopBarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  navigate,
  onOpenSearch
}) => {
  const { timeString, dateString } = useClock();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
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

  const notifications = [
    { id: 1, title: 'Trực tiếp VIETNAM TODAY lúc 20:00 trên VTV4 HD', time: 'Vừa xong', unread: true },
    { id: 2, title: 'Thời sự 19h đã cập nhật tiêu điểm kinh tế số', time: '45 phút trước', unread: false },
    { id: 3, title: 'Bản tin số hóa truyền hình DVB-T2 các tỉnh thành', time: '2 giờ trước', unread: false }
  ];

  return (
    <>
      {/* Top Bar for Desktop and Mobile without bar background */}
      <header className="w-full h-16 bg-transparent border-0 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 pointer-events-none">
        {/* Left Side (Mobile Only Logo & Hamburger) */}
        <div className="flex items-center gap-3 md:hidden pointer-events-auto">
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-white dark:text-white light:text-[#111827] bg-transparent hover:text-[#E50914] transition-colors"
            aria-label="Mở menu điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
              {!logoError ? (
                <img 
                  src="https://static.wikia.nocookie.net/ep-deo/images/7/72/Monochrom.png/revision/latest?cb=20260825072411" 
                  alt="Waves Logo" 
                  className="w-5 h-5 object-contain topbar-brand-logo"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-[#E50914] font-black text-sm">W</span>
              )}
            </div>
            <span className="font-bold text-sm tracking-tight text-white dark:text-white light:text-[#111827]">Waves <span className="text-[#E50914]">Community</span></span>
          </div>
        </div>

        {/* Empty placeholder on desktop left */}
        <div className="hidden md:flex items-center gap-3">
        </div>

        {/* Right Action Icons: Search, Notifications & Light Mode Toggle (No background bar) */}
        <div className="flex items-center gap-3 md:gap-4 pointer-events-auto ml-auto">
          {/* Quick Spotlight Search trigger (No background) */}
          <button
            id="btn-top-search"
            onClick={onOpenSearch}
            className="w-9 h-9 flex items-center justify-center text-white/90 hover:text-white dark:text-[#D1D5DB] dark:hover:text-white light:text-[#374151] light:hover:text-[#111827] bg-transparent transition-all drop-shadow-sm cursor-pointer"
            title="Spotlight Search (⌘K)"
          >
            <img
              src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
              alt="Search"
              referrerPolicy="no-referrer"
              className="w-5 h-5 object-contain brightness-0 invert opacity-85 hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </button>

          {/* Notifications button (No background) */}
          <div className="relative">
            <button
              id="btn-top-notifications"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 flex items-center justify-center text-white/90 hover:text-white dark:text-[#D1D5DB] dark:hover:text-white light:text-[#374151] light:hover:text-[#111827] bg-transparent transition-all relative drop-shadow-sm cursor-pointer"
              title="Thông báo cộng đồng"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E50914] ring-2 ring-[#171719]" />
            </button>

            {/* Notification dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#222226] border border-[#36363E] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 topbar-notification-box">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#303036] topbar-notification-header">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Thông báo phát sóng</span>
                  <span className="text-[10px] text-[#E50914] font-medium cursor-pointer hover:underline">Đã đọc tất cả</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer topbar-notification-item ${n.unread ? 'bg-[#2E2E34] border border-[#40404A]' : 'bg-transparent hover:bg-[#28282E]'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-white font-medium leading-snug">{n.title}</p>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shrink-0 mt-1" />}
                      </div>
                      <span className="text-[10px] text-[#8E8E93] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Light Mode / Dark Mode Toggle button (No background) */}
          <button
            id="btn-top-light-mode"
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center text-white/90 hover:text-[#FBBF24] dark:text-[#D1D5DB] dark:hover:text-[#FBBF24] light:text-[#374151] light:hover:text-[#FBBF24] bg-transparent transition-all drop-shadow-sm cursor-pointer"
            title={isLightMode ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
            aria-label="Chuyển chế độ sáng/tối"
          >
            {isLightMode ? (
              <Moon className="w-5 h-5 text-[#FBBF24]" />
            ) : (
              <Sun className="w-5 h-5 hover:rotate-45 transition-transform duration-300" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs h-full bg-[#1C1C1E] border-r border-[#2E2E34] flex flex-col p-4 shadow-2xl z-10 animate-in slide-in-from-left duration-250">
            <div className="flex items-center justify-between pb-4 border-b border-[#2E2E34]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                  <span className="text-[#E50914] font-black text-base">W</span>
                </div>
                <span className="font-bold text-white text-base">Waves Community</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Time in mobile */}
            <div className="py-2 text-xs font-mono text-[#A1A1AA]">
              {timeString} • {dateString}
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto py-2 space-y-1.5 text-sm">
              <button
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[20px] ${currentRoute === '/' ? 'bg-[#DF37EE] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#28282C]'}`}
              >
                <img
                  src="https://static.wikia.nocookie.net/ep-deo/images/6/6e/New_hom.png/revision/latest?cb=20260722124341"
                  alt="Home"
                  referrerPolicy="no-referrer"
                  className="w-4.5 h-4.5 object-contain brightness-0 invert shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span>Home</span>
              </button>
              <button
                onClick={() => { navigate('/live-tv'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[20px] ${currentRoute.startsWith('/live-tv') ? 'bg-[#E50914] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#28282C]'}`}
              >
                <Tv className="w-4 h-4" />
                <span>Live TV</span>
              </button>
              <button
                onClick={() => { navigate('/news'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[20px] ${currentRoute.startsWith('/news') ? 'bg-[#DF37EE] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#28282C]'}`}
              >
                <Newspaper className="w-4 h-4" />
                <span>News</span>
              </button>
              <button
                onClick={() => { navigate('/favorites'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[20px] ${currentRoute === '/favorites' ? 'bg-[#DF37EE] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#28282C]'}`}
              >
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
              </button>
              <button
                onClick={() => { navigate('/toolbox'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[20px] ${currentRoute === '/toolbox' ? 'bg-[#E50914] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#28282C]'}`}
              >
                <Box className="w-4 h-4" />
                <span>Toolbox</span>
              </button>
              <button
                onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[20px] ${currentRoute === '/about' ? 'bg-[#E50914] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#28282C]'}`}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
              <button
                onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[20px] ${currentRoute === '/settings' ? 'bg-[#DF37EE] text-white font-bold' : 'text-[#D1D5DB] hover:bg-[#28282C]'}`}
              >
                <Settings className="w-4 h-4" />
                <span>Cài đặt</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDiscordModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[20px] text-[#D1D5DB] hover:text-white hover:bg-white/10"
              >
                <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Join Waves on Discord</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Discord Welcome Modal Dialog */}
      <DiscordWelcomeModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
      />
    </>
  );
};
