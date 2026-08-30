import React, { useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { Channel } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { 
  Tv, 
  Search, 
  Sparkles, 
  Heart, 
  Share2, 
  CheckCircle2, 
  X,
  ChevronRight,
  Hash
} from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const { isChannelFavorite, toggleFavoriteChannel } = useFavorites();
  const isFav = isChannelFavorite(currentChannel.id);

  // Distinct category list maintaining natural broadcast order
  const distinctCategories = Array.from(new Set(channels.map((c) => c.category)));
  const categoryTabs = ['Tất cả', ...distinctCategories];

  // Filter channels by search and tab
  const filteredChannels = channels.filter((c) => {
    const matchesCategory = selectedCategory === 'Tất cả' || c.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesSearch = 
      c.name.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      (c.channelCode && c.channelCode.includes(query)) ||
      (c.channelNumber && String(c.channelNumber) === query) ||
      (c.shortName && c.shortName.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Group channels by category when viewing "Tất cả" (or show single category if filtered)
  const groupedCategories = distinctCategories
    .map((category) => ({
      category,
      channels: filteredChannels.filter((c) => c.category === category)
    }))
    .filter((group) => group.channels.length > 0);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Top Banner / Channel Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight flex items-center gap-2.5">
              <span>{currentChannel.name}</span>
              {currentChannel.channelCode && (
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#E50914]/15 text-[#E50914] dark:bg-[#E50914]/25 dark:text-[#FF4D4D] rounded-md border border-[#E50914]/30">
                  {currentChannel.channelCode}
                </span>
              )}
              <span className="px-2 py-0.5 text-xs font-bold bg-[#FF2020] text-white rounded-md">
                {currentChannel.quality}
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] mt-1 font-medium flex items-center gap-2">
            <span>{currentChannel.category}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Add custom M3U8 */}
          <button
            id="btn-livetv-import-m3u8"
            onClick={onOpenCustomStreamModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F1F3F5] hover:bg-[#E5E7EB] dark:bg-[#26262C] dark:hover:bg-[#32323A] border border-[#E5E7EB] dark:border-[#383842] text-xs font-bold text-[#111827] dark:text-white transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
            <span>Nhập M3U8</span>
          </button>

          {/* Share */}
          <button
            id="btn-livetv-share"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F1F3F5] hover:bg-[#E5E7EB] dark:bg-[#26262C] dark:hover:bg-[#32323A] border border-[#E5E7EB] dark:border-[#383842] text-xs font-semibold text-[#4B5563] hover:text-[#111827] dark:text-[#D1D5DB] dark:hover:text-white transition-colors cursor-pointer"
            title="Sao chép liên kết kênh"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Đã sao chép' : 'Chia sẻ'}</span>
          </button>

          {/* Favorite */}
          <button
            id="btn-livetv-favorite"
            onClick={() => toggleFavoriteChannel(currentChannel.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition-colors cursor-pointer ${
              isFav 
                ? 'bg-[#E50914] border-[#E50914] text-white shadow-sm' 
                : 'bg-[#F1F3F5] hover:bg-[#E5E7EB] dark:bg-[#26262C] dark:hover:bg-[#32323A] border-[#E5E7EB] dark:border-[#383842] text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            <span>{isFav ? 'Đã thích' : 'Yêu thích'}</span>
          </button>
        </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white">
              Danh sách kênh
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F1F3F5] dark:bg-[#26262C] text-[#4B5563] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#383842]">
              {filteredChannels.length} kênh
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9CA3AF]" />
            <input
              id="livetv-channel-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên kênh hoặc số hiệu (VD: 001)..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-white dark:bg-[#171719] border border-[#E5E7EB] dark:border-[#34343C] text-xs text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#E50914] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E50914] text-white shadow-sm'
                  : 'bg-[#F1F3F5] hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#111827] dark:bg-[#26262C] dark:hover:bg-[#32323A] dark:text-[#A1A1AA] dark:hover:text-white border border-[#E5E7EB] dark:border-[#383842]'
              }`}
            >
              {cat}
            </button>
          ))}
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
                {/* Category Section Header (e.g. Kênh VTV, Kênh HTV,...) */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#2D2D35] pb-2">
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
                        className={`group relative rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col p-2.5 sm:p-3.5 select-none ${
                          isSelected
                            ? 'bg-[#E50914]/5 dark:bg-[#E50914]/15 border-[#E50914] shadow-sm ring-2 ring-[#E50914]/30'
                            : 'bg-white dark:bg-[#1E1E22] border-[#E5E7EB] dark:border-[#2D2D35] hover:border-[#E50914]/50 hover:shadow-md'
                        }`}
                      >
                        {/* Channel Logo Box without background (transparent background, strictly only logo) */}
                        <div className="w-full h-16 sm:h-20 flex items-center justify-center p-1.5 mb-2 sm:mb-2.5 relative">
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
                            {ch.shortName || ch.name.slice(0, 5)}
                          </span>

                          {/* Quality Pill */}
                          <span className="absolute top-0 left-0 px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-black bg-black/60 dark:bg-black/70 text-white">
                            {ch.quality}
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
                                : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
                            }`}
                            title={isChFav ? 'Bỏ thích' : 'Yêu thích'}
                          >
                            <Heart className={`w-3 h-3 ${isChFav ? 'fill-current' : ''}`} />
                          </button>

                          {/* Playing indicator */}
                          {isSelected && (
                            <div className="absolute bottom-0 right-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#E50914] text-white text-[8px] font-bold shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              <span className="hidden sm:inline">Đang phát</span>
                            </div>
                          )}
                        </div>

                        {/* Channel Title & Channel Number Underneath (e.g. VTV1 - 001) */}
                        <div className="min-w-0 text-center sm:text-left">
                          <h4 className={`text-[11px] sm:text-xs md:text-sm font-bold truncate transition-colors ${
                            isSelected ? 'text-[#E50914]' : 'text-[#111827] dark:text-white group-hover:text-[#E50914]'
                          }`}>
                            {ch.shortName || ch.name}
                          </h4>
                          
                          {/* Channel number in ascending order: e.g. "001", "002", etc. */}
                          <div className="flex items-center sm:justify-start justify-center gap-1 mt-0.5">
                            <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#6B7280] dark:text-[#9CA3AF] tracking-wide">
                              {ch.channelCode || String(ch.channelNumber || 1).padStart(3, '0')}
                            </span>
                          </div>
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
