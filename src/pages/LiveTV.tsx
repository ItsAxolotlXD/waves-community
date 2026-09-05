import React, { useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { Channel } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { 
  Tv, 
  ChevronRight,
  Hash,
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';

interface LiveTVProps {
  currentChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  channels: Channel[];
  onOpenCustomStreamModal: () => void;
}

export const LiveTV: React.FC<LiveTVProps> = ({
  currentChannel,
  onSelectChannel,
  channels,
  onOpenCustomStreamModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const { isChannelFavorite, toggleFavoriteChannel } = useFavorites();

  // Distinct category list maintaining natural broadcast order
  const distinctCategories = Array.from(new Set(channels.map((c) => c.category)));
  const categoryTabs = ['Tất cả', ...distinctCategories];

  // Filter channels by tab
  const filteredChannels = channels.filter((c) => {
    return selectedCategory === 'Tất cả' || c.category === selectedCategory;
  });

  // Group channels by category when viewing "Tất cả" (or show single category if filtered)
  const groupedCategories = distinctCategories
    .map((category) => ({
      category,
      channels: filteredChannels.filter((c) => c.category === category)
    }))
    .filter((group) => group.channels.length > 0);

  return (
    <div className="space-y-4 sm:space-y-8 pb-16">
      {/* Top Banner / Channel Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight flex items-center gap-2">
            <span>{currentChannel.name}</span>
            {currentChannel.channelCode && (
              <span className="px-1.5 py-0.5 text-[11px] sm:text-xs font-mono font-bold bg-[#E50914]/15 text-[#E50914] dark:bg-[#E50914]/25 dark:text-[#FF4D4D] rounded-md border border-[#E50914]/30">
                {currentChannel.channelCode}
              </span>
            )}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] mt-0.5 font-medium flex items-center gap-2">
          <span>{currentChannel.category}</span>
        </p>
      </div>

      {/* Video Player Section */}
      <div className="w-full">
        <VideoPlayer
          channel={currentChannel}
          onOpenCustomStreamModal={onOpenCustomStreamModal}
          isTheaterMode={isTheaterMode}
          onToggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
        />
      </div>

      {/* Channel List Section */}
      <div className="space-y-6 pt-2">
        {/* Section Header & Filters */}
        <div className="flex flex-col gap-3 sm:gap-3.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white">
              Danh sách kênh
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F3F5] dark:bg-[#26262C] text-[#4B5563] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#383842]">
              {filteredChannels.length} kênh
            </span>
          </div>

          {/* Category Tabs Filter */}
          <div id="livetv-category-tabs" className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categoryTabs.map((cat, idx) => (
              <button
                key={cat}
                id={`livetv-cat-btn-${idx}`}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none ${
                  selectedCategory === cat
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'bg-[#F1F3F5] hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#111827] dark:bg-[#26262C] dark:hover:bg-[#32323A] dark:text-[#A1A1AA] dark:hover:text-white border border-[#E5E7EB] dark:border-[#383842]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Categories & Grids */}
        {filteredChannels.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1E1E22] border border-[#E5E7EB] dark:border-[#2D2D35]">
            <Tv className="w-10 h-10 mx-auto text-[#9CA3AF] mb-2" />
            <p className="text-sm font-semibold text-[#111827] dark:text-white">Không tìm thấy kênh phù hợp</p>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">Vui lòng thử tìm kiếm với từ khóa hoặc số hiệu khác</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedCategories.map((group) => (
              <section key={group.category} className="space-y-3">
                {/* Category Section Header & Divider */}
                <div className="livetv-category-divider flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#2D2D35] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#E50914] rounded-full" />
                    <h3 className="text-sm sm:text-base font-bold text-[#111827] dark:text-white">
                      {group.category}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
                      ({group.channels.length})
                    </span>
                  </div>
                </div>

                {/* Channel Grid: Mobile 3 cols / Desktop 5 cols */}
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4">
                  {group.channels.map((ch) => {
                    const isSelected = ch.id === currentChannel.id;
                    const isChFav = isChannelFavorite(ch.id);

                    return (
                      <div
                        key={ch.id}
                        id={`livetv-channel-card-${ch.id}`}
                        onClick={() => onSelectChannel(ch)}
                        className={`group relative rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden flex flex-col p-2.5 sm:p-3.5 select-none ${
                          isSelected ? 'is-selected' : ''
                        }`}
                      >
                        {/* Channel Logo Box without background (transparent background, strictly only logo) */}
                        <div className="w-full h-16 sm:h-20 flex items-center justify-center p-1.5 mb-1.5 sm:mb-2 relative">
                          <img
                            src={ch.logo}
                            alt={ch.name}
                            referrerPolicy="no-referrer"
                            className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          
                          {/* Fallback Text if image fails */}
                          <span className="text-[11px] font-extrabold text-neutral-400 absolute pointer-events-none -z-10 uppercase tracking-tighter">
                            {ch.channelCode || String(ch.channelNumber || 1).padStart(3, '0')}
                          </span>

                          {/* Favorite Heart Button */}
                          <button
                            id={`btn-fav-card-${ch.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteChannel(ch.id);
                            }}
                            className={`absolute top-0 right-0 p-1 rounded-full backdrop-blur-sm transition-colors cursor-pointer ${
                              isChFav 
                                ? 'bg-[#E50914] text-white shadow-sm' 
                                : 'bg-black/5 hover:bg-[#E50914]/15 text-[#9CA3AF] hover:text-[#E50914] dark:bg-black/40 dark:text-white/80 dark:hover:text-white dark:hover:bg-black/60'
                            }`}
                            title={isChFav ? 'Bỏ thích' : 'Yêu thích'}
                          >
                            <Heart className={`w-3 h-3 ${isChFav ? 'fill-current' : ''}`} />
                          </button>

                          {/* Playing indicator */}
                          {isSelected && (
                            <div className="absolute bottom-0 right-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#E6005A] text-white text-[8px] font-bold shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              <span className="hidden sm:inline">Đang phát</span>
                            </div>
                          )}
                        </div>

                        {/* Channel Number Only Underneath (e.g. 001, 002) */}
                        <div className="min-w-0 text-center">
                          <span className={`text-xs sm:text-sm font-mono font-bold tracking-wider transition-colors ${
                            isSelected 
                              ? 'text-[#E6005A]' 
                              : 'text-[#4B5563] dark:text-[#9CA3AF] group-hover:text-black dark:group-hover:text-white'
                          }`}>
                            {ch.channelCode || String(ch.channelNumber || 1).padStart(3, '0')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
