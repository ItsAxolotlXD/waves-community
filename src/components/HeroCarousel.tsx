import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_SLIDES, DEFAULT_BANNER_PLACEHOLDER } from '../data/heroSlides';
import { Channel } from '../types';
import { CHANNELS_DATA } from '../data/channels';

interface HeroCarouselProps {
  navigate?: (route: string) => void;
  onSelectChannel?: (channel: Channel) => void;
  channels?: Channel[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  channels
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Danh sách kênh hợp lệ có logo
  const channelList = useMemo(() => {
    const list = (channels && channels.length > 0) ? channels : CHANNELS_DATA;
    return list.filter((c) => Boolean(c.logo));
  }, [channels]);

  // Hàm chọn ngẫu nhiên 1 kênh đề xuất
  const pickRandomChannel = (excludeId?: string): Channel => {
    const available = channelList.filter((c) => c.id !== excludeId);
    const pool = available.length > 0 ? available : channelList;
    if (pool.length === 0) return CHANNELS_DATA[0];
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  };

  // State kênh đề xuất ngẫu nhiên
  const [recommendedChannel, setRecommendedChannel] = useState<Channel>(() => {
    return channelList.length > 0 ? channelList[0] : CHANNELS_DATA[0];
  });

  // Tạo danh sách slide gồm các banner gốc + 1 banner kênh đề xuất
  const allSlides = useMemo(() => {
    const recSlide = {
      id: 'banner-recommended-channel',
      isRecommended: true,
      title: recommendedChannel.name,
      channel: recommendedChannel,
      backgroundImage: recommendedChannel.logo,
    };
    return [...HERO_SLIDES, recSlide];
  }, [recommendedChannel]);

  const totalSlides = allSlides.length;

  // Randomize 1 kênh mới mỗi lần bấm nút mũi tên
  const randomizeChannel = () => {
    setRecommendedChannel((prev) => pickRandomChannel(prev.id));
  };

  const nextSlide = (isManualArrow = false) => {
    if (isManualArrow) {
      randomizeChannel();
    }
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = (isManualArrow = false) => {
    if (isManualArrow) {
      randomizeChannel();
    }
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Tự động trượt banner luôn enable
  useEffect(() => {
    if (totalSlides > 1 && !isHovered) {
      timerRef.current = setInterval(() => nextSlide(false), 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, totalSlides]);

  // Tính khoảng cách vòng tròn (circular diff) giữa index i và currentIndex
  const getSlidePosition = (i: number) => {
    let diff = (i - currentIndex) % totalSlides;
    if (diff < -Math.floor(totalSlides / 2)) {
      diff += totalSlides;
    } else if (diff > Math.floor(totalSlides / 2)) {
      diff -= totalSlides;
    }
    return diff;
  };

  return (
    <div 
      id="hero-3d-coverflow-carousel"
      className="relative w-full overflow-hidden select-none pt-1 sm:pt-2 pb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Stage Container */}
      <div 
        className="relative w-full flex items-center justify-center"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Aspect ratio spacer so stage height strictly matches the banner height without dead gap */}
        <div 
          className="w-[88%] sm:w-[74%] md:w-[65%] lg:w-[62%] max-w-[840px] aspect-[16/9] pointer-events-none invisible" 
          aria-hidden="true" 
        />

        {allSlides.map((slide, i) => {
          const diff = getSlidePosition(i);
          const isCenter = diff === 0;
          const isLeft = diff === -1;
          const isRight = diff === 1;
          const isVisible = Math.abs(diff) <= 1;
          const isRec = 'isRecommended' in slide && slide.isRecommended;

          // Xây dựng style 3D tương ứng theo phong cách Coverflow - chuyển động chậm, êm dịu và siêu mượt
          let transformStyle: React.CSSProperties = {
            transition: 'transform 1.15s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 1.15s cubic-bezier(0.2, 0.9, 0.3, 1)',
            willChange: 'transform, opacity',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          };

          if (isCenter) {
            transformStyle = {
              ...transformStyle,
              transform: 'translateX(0%) translateZ(0px) rotateY(0deg) scale(1)',
              zIndex: 30,
              opacity: 1,
            };
          } else if (isLeft) {
            transformStyle = {
              ...transformStyle,
              transform: 'translateX(-54%) translateZ(-90px) rotateY(24deg) scale(0.85)',
              zIndex: 20,
              opacity: 0.65,
            };
          } else if (isRight) {
            transformStyle = {
              ...transformStyle,
              transform: 'translateX(54%) translateZ(-90px) rotateY(-24deg) scale(0.85)',
              zIndex: 20,
              opacity: 0.65,
            };
          } else {
            transformStyle = {
              ...transformStyle,
              transform: `translateX(${diff > 0 ? 85 : -85}%) translateZ(-250px) rotateY(${diff > 0 ? -35 : 35}deg) scale(0.65)`,
              zIndex: 10,
              opacity: 0,
            };
          }

          return (
            <div
              key={slide.id}
              style={transformStyle}
              className={`absolute inset-0 m-auto w-[88%] sm:w-[74%] md:w-[65%] lg:w-[62%] max-w-[840px] aspect-[16/9] rounded-2xl sm:rounded-[24px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] cursor-default select-none pointer-events-none ${
                !isVisible ? 'hidden md:block' : ''
              }`}
            >
              {isRec ? (
                /* Banner Kênh Đề Xuất (Sử dụng logo kênh với hiệu ứng studio broadcast) */
                <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1C1C24] via-[#121217] to-[#0A0A0D]">
                  {/* Studio ambient radial glow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#E6005A]/25 to-[#FF3366]/20 blur-3xl opacity-80" />
                  </div>

                  {/* Top Badge: Đề xuất */}
                  <div className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-3 sm:mb-4 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF3366]" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white">
                      Kênh đề xuất cho bạn
                    </span>
                  </div>

                  {/* Logo chính giữa hiển thị nổi bật */}
                  <div className="relative z-10 w-full max-w-[240px] sm:max-w-[320px] max-h-[85px] sm:max-h-[110px] flex items-center justify-center p-2">
                    <img
                      src={recommendedChannel.logo}
                      alt={recommendedChannel.name}
                      referrerPolicy="no-referrer"
                      className="max-h-[75px] sm:max-h-[95px] max-w-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.75)]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== DEFAULT_BANNER_PLACEHOLDER) {
                          target.src = DEFAULT_BANNER_PLACEHOLDER;
                        }
                      }}
                    />
                  </div>

                  {/* Tên kênh & Thể loại */}
                  <div className="relative z-10 mt-3 text-center">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide">
                      {recommendedChannel.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#9CA3AF] mt-0.5 font-medium">
                      {recommendedChannel.category}
                    </p>
                  </div>
                </div>
              ) : (
                /* Ảnh nền slide thông thường - Chỉ xem, không thể bấm */
                <img
                  src={slide.backgroundImage || DEFAULT_BANNER_PLACEHOLDER}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== DEFAULT_BANNER_PLACEHOLDER) {
                      target.src = DEFAULT_BANNER_PLACEHOLDER;
                    }
                  }}
                />
              )}

              {/* Lớp phủ tối mờ khi slide ở 2 bên */}
              {!isCenter && (
                <div className="absolute inset-0 bg-black/40 hover:bg-black/15 transition-colors z-10 pointer-events-none" />
              )}
            </div>
          );
        })}

        {/* Nút mũi tên Chevron trái (<) - bấm sẽ randomize 1 kênh đề xuất */}
        {totalSlides > 1 && (
          <button
            id="btn-coverflow-prev"
            onClick={() => prevSlide(true)}
            aria-label="Slide trước"
            className="absolute left-[2%] sm:left-[6%] md:left-[10%] lg:left-[13%] top-1/2 -translate-y-1/2 z-40 text-white/90 hover:text-white hover:scale-125 active:scale-95 transition-all p-2 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 stroke-[2.5]" />
          </button>
        )}

        {/* Nút mũi tên Chevron phải (>) - bấm sẽ randomize 1 kênh đề xuất */}
        {totalSlides > 1 && (
          <button
            id="btn-coverflow-next"
            onClick={() => nextSlide(true)}
            aria-label="Slide tiếp theo"
            className="absolute right-[2%] sm:right-[6%] md:right-[10%] lg:right-[13%] top-1/2 -translate-y-1/2 z-40 text-white/90 hover:text-white hover:scale-125 active:scale-95 transition-all p-2 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Pagination Indicators có animation mượt mà sử dụng motion layout */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
          {allSlides.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="relative py-1.5 px-0.5 flex items-center justify-center cursor-pointer group focus:outline-none"
                aria-label={`Đi tới slide ${idx + 1}`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="hero-active-pill"
                    className="w-7 sm:w-9 h-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)]"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                ) : (
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white/60 transition-colors"
                    layout
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
