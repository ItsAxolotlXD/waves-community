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
        className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
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
            className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] h-[95px] sm:h-[105px] md:h-[115px] shrink-0 rounded-[22px] sm:rounded-[26px] p-3 sm:p-4 flex items-center justify-center cursor-pointer group select-none"
            title={ch.name}
            aria-label={ch.name}
          >
            <div className="w-full h-full flex items-center justify-center p-1.5">
              <img
                src={ch.logo}
                alt={ch.name}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
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
