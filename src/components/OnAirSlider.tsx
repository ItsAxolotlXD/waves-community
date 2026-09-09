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
      const offset = direction === 'left' ? -360 : 360;
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
        className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
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
            className="min-w-[70px] sm:min-w-[80px] md:min-w-[88px] h-[42px] sm:h-[46px] md:h-[50px] shrink-0 rounded-xl sm:rounded-2xl p-1.5 flex items-center justify-center cursor-pointer group select-none"
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
                    ? 'max-h-5 sm:max-h-5.5 md:max-h-[24px] max-w-[72%] scale-90'
                    : 'max-h-6 sm:max-h-7 md:max-h-[30px] max-w-[84%]'
                } w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-200`}
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
