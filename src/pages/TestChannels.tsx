import React, { useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { Channel } from '../types';
import {
  Tv,
  FlaskConical,
  Activity,
  Radio,
  Wifi
} from 'lucide-react';

interface TestChannelsProps {
  currentChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  channels: Channel[];
  onOpenCustomStreamModal: () => void;
}

export const TestChannels: React.FC<TestChannelsProps> = ({
  currentChannel,
  onSelectChannel,
  channels,
  onOpenCustomStreamModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [isTheaterMode, setIsTheaterMode] = useState(false);

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
      {/* Top Banner / Channel Title with Developer Test Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight flex items-center gap-2">
              <span>{`${String(currentChannel.channelNumber || 1).padStart(3, '0')} | ${currentChannel.name}`}</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <FlaskConical className="w-3 h-3 text-amber-400" />
              Test nội bộ luồng
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] mt-0.5 font-medium flex items-center gap-2">
            <span>{currentChannel.category}</span>
            <span className="text-white/20">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              Luồng phát hoạt động
            </span>
          </p>
        </div>

        {/* Quick Custom Stream Button for Testing */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCustomStreamModal}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 text-white/90 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer select-none"
          >
            <Activity className="w-3.5 h-3.5 text-[#FF4D8B]" />
            Thử luồng tùy chỉnh
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
        <div className="flex flex-col gap-3 sm:gap-3.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white">
              Danh sách kênh kiểm thử
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
                    : 'bg-[#F1F3F5] hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#111827] dark:bg-[#27121d] dark:hover:bg-[#331726] dark:text-[#A1A1AA] dark:hover:text-white border border-[#E5E7EB] dark:border-white/10'
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

                    return (
                      <div
                        key={ch.id}
                        id={`test-channel-card-${ch.id}`}
                        onClick={() => onSelectChannel(ch)}
                        className={`group relative rounded-xl sm:rounded-2xl transition-none cursor-pointer overflow-hidden flex items-center justify-center p-2.5 sm:p-3 select-none ${
                          isSelected ? 'is-selected' : ''
                        }`}
                        title={ch.name}
                      >
                        {/* Channel Logo Box without background */}
                        <div className="w-full h-10 sm:h-12 flex items-center justify-center p-1 relative">
                          <img
                            src={ch.logo}
                            alt={ch.name}
                            referrerPolicy="no-referrer"
                            className={`${
                              ch.category === 'Kênh VTV'
                                ? 'max-h-7 sm:max-h-8 max-w-[78%] scale-100'
                                : 'max-h-8 sm:max-h-10 max-w-[85%]'
                            } w-auto object-contain filter drop-shadow-sm`}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
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
