import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Channel } from '../types';

interface OnAirSliderProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  navigate: (route: string) => void;
}

export const OnAirSlider: React.FC<OnAirSliderProps> = ({
  channels,
  onSelectChannel,
  navigate
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full">
      {/* Header with Title & Slider Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Đề xuất cho bạn
        </h2>

        <div className="flex items-center gap-2">
          <button
            id="slider-prev-btn"
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all cursor-pointer"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            id="slider-next-btn"
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all cursor-pointer"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Cards Scroll: strictly only channel logos, no text, nothing else */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2.5 sm:gap-3.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
      >
        {channels.map((ch) => (
          <div
            key={ch.id}
            id={`recommended-channel-${ch.id}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              onSelectChannel(ch);
              navigate(`/live-tv?channel=${ch.slug}`);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectChannel(ch);
                navigate(`/live-tv?channel=${ch.slug}`);
              }
            }}
            className="min-w-[84px] sm:min-w-[96px] md:min-w-[106px] h-[48px] sm:h-[54px] md:h-[58px] shrink-0 rounded-xl sm:rounded-2xl p-2 flex items-center justify-center cursor-pointer group select-none"
            title={ch.name}
            aria-label={ch.name}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={ch.logo}
                alt={ch.name}
                referrerPolicy="no-referrer"
                className={`${
                  ch.category === 'Kênh VTV'
                    ? 'max-h-6 sm:max-h-[26px] md:max-h-[28px] max-w-[76%] scale-95'
                    : 'max-h-7 sm:max-h-8 md:max-h-[34px] max-w-[86%]'
                } w-auto object-contain filter drop-shadow-sm`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
