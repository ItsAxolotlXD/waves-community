import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Mic, Tv, Newspaper, Box, Play } from 'lucide-react';
import { CHANNELS_DATA } from '../data/channels';
import { NEWS_DATA } from '../data/news';
import { Channel } from '../types';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string, state?: any) => void;
  onSelectChannel: (channel: Channel) => void;
}

export const SpotlightModal: React.FC<SpotlightModalProps> = ({
  isOpen,
  onClose,
  navigate,
  onSelectChannel
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery('');
    }
  }, [isOpen]);

  // Global Cmd+K / Ctrl+K keyboard shortcut & ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const normalizedQuery = query.toLowerCase().trim();

  // Search channels
  const matchedChannels = CHANNELS_DATA.filter((ch) => 
    ch.name.toLowerCase().includes(normalizedQuery) ||
    ch.shortName?.toLowerCase().includes(normalizedQuery) ||
    ch.category.toLowerCase().includes(normalizedQuery) ||
    ch.tags?.some((t) => t.toLowerCase().includes(normalizedQuery)) ||
    ch.currentProgram?.title.toLowerCase().includes(normalizedQuery)
  );

  // Search news
  const matchedNews = NEWS_DATA.filter((n) =>
    n.title.toLowerCase().includes(normalizedQuery) ||
    n.category.toLowerCase().includes(normalizedQuery) ||
    n.tags?.some((t) => t.toLowerCase().includes(normalizedQuery))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="spotlight-container"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-24 px-4"
        >
          {/* 1. Backdrop / Lớp nền mờ */}
          <motion.div 
            id="spotlight-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* 2. Dialog Modal Box */}
          <motion.div 
            id="spotlight-popup-card"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              transition: {
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.97,
              y: -6,
              transition: {
                duration: 0.2,
                ease: [0.32, 0, 0.67, 0]
              }
            }}
            className="relative w-full max-w-[380px] sm:max-w-[420px] bg-[#1A1A20] border border-[#2E2E38] rounded-[28px] p-4 sm:p-5 shadow-2xl overflow-hidden z-10"
          >
            {/* Capsule Pill Search Input Bar with reflective bubble style & increased height */}
            <div className="w-full h-[46px] flex items-center justify-between px-4 rounded-full spotlight-bubble-box text-sm transition-all focus-within:ring-1 focus-within:ring-white/40 spotlight-input-container">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center shrink-0">
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/2/21/Searchhh.png/revision/latest?cb=20260717131751"
                    alt="Search"
                    referrerPolicy="no-referrer"
                    className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Spotlight Search..."
                  className="w-full bg-transparent text-white placeholder-[#8E8E93] text-sm focus:outline-none font-medium truncate"
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {query ? (
                  <button 
                    onClick={() => setQuery('')}
                    className="p-1 rounded-full text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-4 h-4 min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] flex items-center justify-center shrink-0">
                    <img
                      src="https://github.com/andrewtavis/sf-symbols-online/raw/master/glyphs/mic.png"
                      alt="Mic"
                      referrerPolicy="no-referrer"
                      className="w-full h-full aspect-square object-contain brightness-0 invert opacity-80"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Content Area: Figure 2 Empty Prompt or Live Match List */}
            {!query ? (
              /* Empty Search Prompt (Matching Figure 2 text & typography) */
              <div className="py-7 sm:py-9 px-3 text-center">
                <p className="text-[13px] sm:text-sm text-[#8E8E93] leading-relaxed font-normal select-none max-w-[290px] mx-auto">
                  Nhập từ khóa hoặc số kênh để tìm kiếm trong Waves Community
                </p>
              </div>
            ) : (
              /* Live Results List */
              <div className="mt-3 max-h-[300px] overflow-y-auto space-y-1.5 pr-1 sidebar-scroller">
                {matchedChannels.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DF37EE] flex items-center gap-1.5">
                      <Tv className="w-3 h-3" />
                      <span>Kênh truyền hình ({matchedChannels.length})</span>
                    </div>
                    {matchedChannels.slice(0, 5).map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => {
                          onSelectChannel(ch);
                          navigate(`/live-tv?channel=${ch.slug}`);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-[14px] bg-[#22222A] hover:bg-[#2C2C36] cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#141418] border border-[#34343E] flex items-center justify-center text-xs font-bold text-white shrink-0 p-1 overflow-hidden">
                            <img
                              src={ch.logo}
                              alt={ch.name}
                              referrerPolicy="no-referrer"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-[#DF37EE] truncate">
                              {ch.name}
                            </div>
                            <div className="text-[10px] text-[#9CA3AF] truncate">
                              {ch.currentProgram?.title || ch.category}
                            </div>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#2F2F3A] group-hover:bg-[#DF37EE] flex items-center justify-center text-white shrink-0 transition-colors">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {matchedNews.length > 0 && (
                  <div className="space-y-1 mt-2">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] flex items-center gap-1.5">
                      <Newspaper className="w-3 h-3" />
                      <span>Tin tức ({matchedNews.length})</span>
                    </div>
                    {matchedNews.slice(0, 3).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          navigate(`/news/${n.slug}`);
                          onClose();
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-[14px] bg-[#22222A] hover:bg-[#2C2C36] cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-7 rounded bg-[#141418] overflow-hidden shrink-0">
                          <img src={n.coverImage} alt={n.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-white line-clamp-1 flex-1">{n.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchedChannels.length === 0 && matchedNews.length === 0 && (
                  <div className="py-6 text-center text-xs text-[#8E8E93]">
                    Không tìm thấy kênh phù hợp với "<span className="text-white font-medium">{query}</span>"
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
