import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, HelpCircle, Info, Megaphone, Search, Settings, Tv, MessageCircle } from 'lucide-react';

interface BottomDockProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenSearch: () => void;
  onOpenHelp?: () => void;
  onOpenDiscord?: () => void;
}

const HOME_ICON = 'https://static.wikia.nocookie.net/ep-deo/images/6/6e/New_hom.png/revision/latest?cb=20260722124341';
const TV_ICON = 'https://vtvgo-next-assets.vtvdigital.vn/prod/images/menu/20260905/2026090508/b467d7552a-tv-1.webp';

export const BottomDock: React.FC<BottomDockProps> = ({ currentRoute, navigate, onOpenSearch, onOpenHelp, onOpenDiscord }) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const isActive = (path: string) => path === '/' ? currentRoute === '/' || currentRoute === '/home' : currentRoute.startsWith(path);
  const pages = [
    [
      { id: 'dock-home', label: 'Home', route: '/', image: HOME_ICON },
      { id: 'dock-tv', label: 'Truyền hình', route: '/live-tv', image: TV_ICON },
      { id: 'dock-news', label: 'News', route: '/news', icon: Megaphone },
      { id: 'dock-search', label: 'Search', action: onOpenSearch, icon: Search },
    ],
    [
      { id: 'dock-discord', label: 'Discord', action: onOpenDiscord, icon: MessageCircle },
      { id: 'dock-help', label: 'Help', action: onOpenHelp, icon: HelpCircle },
      { id: 'dock-about', label: 'Giới thiệu', route: '/about', icon: Info },
      { id: 'dock-settings', label: 'Cài đặt', route: '/settings', icon: Settings },
    ],
  ];

  return (
    <nav className="floaty-bar fixed bottom-5 left-1/2 -translate-x-1/2 z-40 select-none" aria-label="Floaty bar">
      <div className="floaty-bar__surface flex items-center gap-2 px-3 py-2 rounded-full">
        <button type="button" aria-label="Trang dock trước" onClick={() => { setDirection(-1); setPage((current) => (current + pages.length - 1) % pages.length); }} className="floaty-bar__arrow size-10 rounded-full flex items-center justify-center cursor-pointer"><ChevronLeft /></button>
        <div className="floaty-bar__items">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="floaty-bar__page"
            >
              {pages[page].map((item) => {
                const active = item.route ? isActive(item.route) : false;
                const Icon = item.icon;
                return <button key={item.id} id={item.id} type="button" title={item.label} onClick={() => item.action ? item.action() : item.route && navigate(item.route)} className={`floaty-bar__item size-12 rounded-full flex items-center justify-center cursor-pointer ${active ? 'is-active' : ''}`}>
                  {item.image ? <img src={item.image} alt={item.label} referrerPolicy="no-referrer" className={`size-7 object-contain ${active ? 'brightness-0 invert' : 'sidebar-nav-home-icon'}`} /> : Icon ? <Icon /> : null}
                </button>;
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        <button type="button" aria-label="Trang dock tiếp theo" onClick={() => { setDirection(1); setPage((current) => (current + 1) % pages.length); }} className="floaty-bar__arrow size-10 rounded-full flex items-center justify-center cursor-pointer"><ChevronRight /></button>
      </div>
    </nav>
  );
};

export { BottomDock as FloatyBar };
