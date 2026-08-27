import React, { useState, useEffect, useRef } from 'react';
import { Play, ChevronLeft, ChevronRight, Sparkles, Radio } from 'lucide-react';
import { HERO_SLIDES } from '../data/heroSlides';
import { HeroSlide, Channel } from '../types';
import { CHANNELS_DATA } from '../data/channels';

interface HeroCarouselProps {
  navigate: (route: string) => void;
  onSelectChannel: (channel: Channel) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  navigate,
  onSelectChannel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide: HeroSlide = HERO_SLIDES[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(nextSlide, 7000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  const handleWatchNow = () => {
    const targetChannel = CHANNELS_DATA.find((c) => c.id === currentSlide.channelId) || CHANNELS_DATA[0];
    onSelectChannel(targetChannel);
    navigate(`/live-tv?channel=${targetChannel.slug}`);
  };

  return (
    <div 
      id="hero-carousel-container"
      className="relative w-full overflow-hidden bg-[#141416] min-h-[500px] md:min-h-[580px] lg:min-h-[640px] flex items-end group transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Cinematic Overlay */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={slide.backgroundImage}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 group-hover:scale-100"
          />
          {/* Multi-layered cinematic gradient overlays */}
          <div className="absolute inset-0 hero-overlay-t bg-gradient-to-t from-[#141416] via-[#141416]/75 to-transparent" />
          <div className="absolute inset-0 hero-overlay-r bg-gradient-to-r from-[#141416] via-[#141416]/80 to-transparent w-full md:w-3/4" />
          <div className="absolute inset-0 hero-overlay-radial bg-radial from-transparent via-[#141416]/30 to-[#141416]/90" />
        </div>
      ))}

      {/* Decorative top watermark logo text */}
      <div className="absolute top-8 left-12 md:left-20 opacity-15 pointer-events-none select-none flex items-center gap-3">
        <div className="w-10 h-10 border-4 border-white transform rotate-12" />
        <span className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase hero-watermark-text">
          {currentSlide.title}
        </span>
      </div>

      {/* Content Container (Bottom/Left aligned as in screenshot) */}
      <div className="relative z-10 w-full p-6 sm:p-10 md:p-14 lg:p-16 pb-12 md:pb-16 max-w-5xl flex flex-col justify-end">
        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase drop-shadow-md leading-tight">
          {currentSlide.title}
        </h1>

        {/* Subtitle with Red to Magenta gradient */}
        <div className="mt-1 md:mt-2">
          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF2020] via-[#FF3366] to-[#F000FF] bg-clip-text text-transparent drop-shadow">
            {currentSlide.subtitle}
          </span>
        </div>

        {/* Channel branding badge */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 hero-badge-channel">
            <div className="w-5 h-5 flex items-center justify-center bg-[#FF2020] rounded-sm transform skew-x-[-12deg]">
              <span className="text-white font-black text-[11px] transform skew-x-[12deg]">V</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              VIETNAM TODAY • VTV4
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF2020]/20 border border-[#FF2020]/40 text-[#FF4D4D] text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{currentSlide.badge}</span>
          </div>
        </div>

        {/* Rich Description */}
        <p className="mt-4 text-xs sm:text-sm md:text-base text-[#D1D5DB] leading-relaxed max-w-3xl line-clamp-3 md:line-clamp-none font-normal">
          {currentSlide.description}
        </p>

        {/* Metadata row: Category red tag • Quality specifications */}
        <div className="flex flex-wrap items-center gap-2.5 mt-5 text-xs text-[#9CA3AF] font-medium">
          <span className="px-2.5 py-1 rounded-full bg-[#FF2020] text-white font-extrabold text-[10px] tracking-wider uppercase shadow-sm">
            {currentSlide.category}
          </span>
          <span>•</span>
          <span className="text-[#E0E0E6]">{currentSlide.quality}</span>
        </div>

        {/* CTA Button Row + Navigation Arrows */}
        <div className="flex items-center gap-4 mt-6">
          {/* Main Colored CTA Button matching Under Construction Enter password button design */}
          <button
            id="btn-hero-watch-now"
            onClick={handleWatchNow}
            className="flex items-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full font-bold text-[#2E1065] bg-[#CEBEFE] hover:bg-[#DBCFFF] active:scale-[0.98] transition-all text-sm sm:text-base cursor-pointer tracking-tight shadow-lg hover:shadow-xl group/btn select-none"
          >
            <Play className="w-4.5 h-4.5 fill-[#2E1065] text-[#2E1065] ml-0.5 group-hover/btn:scale-110 transition-transform" />
            <span>{currentSlide.ctaText || 'Xem ngay'}</span>
          </button>

          {/* Previous & Next circular arrow buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-hero-prev"
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-[#26262C]/80 hover:bg-[#34343E] border border-[#3E3E48] flex items-center justify-center text-[#D1D5DB] hover:text-white transition-colors"
              aria-label="Slide trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="btn-hero-next"
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-[#26262C]/80 hover:bg-[#34343E] border border-[#3E3E48] flex items-center justify-center text-[#D1D5DB] hover:text-white transition-colors"
              aria-label="Slide tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pagination indicator: dots + active red bar pill */}
        <div className="flex items-center gap-2 mt-6">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full h-2 ${
                idx === currentIndex
                  ? 'w-7 bg-[#FF2020] shadow-[0_0_8px_#FF2020]'
                  : 'w-2 bg-[#4B4B54] hover:bg-[#6B6B76]'
              }`}
              aria-label={`Đi tới slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
