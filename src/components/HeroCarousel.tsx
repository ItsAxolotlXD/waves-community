import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES, DEFAULT_BANNER_PLACEHOLDER } from '../data/heroSlides';
import { Channel } from '../types';

interface HeroCarouselProps {
  navigate?: (route: string) => void;
  onSelectChannel?: (channel: Channel) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = HERO_SLIDES.length;

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
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
      timerRef.current = setInterval(nextSlide, 5000);
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

  const currentSlide = HERO_SLIDES[currentIndex] || HERO_SLIDES[0];

  return (
    <div 
      id="hero-3d-coverflow-carousel"
      className="relative w-full overflow-hidden select-none pt-1 sm:pt-2 pb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background phía sau banner chính: lấy chính banner hiện tại và làm mờ (ambient blurred background) */}
      <div 
        className="absolute inset-0 -top-8 -bottom-8 overflow-hidden pointer-events-none z-0 select-none"
        aria-hidden="true"
      >
        <img
          key={currentSlide?.id || currentIndex}
          src={currentSlide?.backgroundImage || DEFAULT_BANNER_PLACEHOLDER}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-150 blur-3xl opacity-40 dark:opacity-35 transition-all duration-1000 ease-out"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== DEFAULT_BANNER_PLACEHOLDER) {
              target.src = DEFAULT_BANNER_PLACEHOLDER;
            }
          }}
        />
        {/* Gradient mờ viền giúp hòa vào nền giao diện */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141416]/50 via-transparent to-[#141416]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141416]/40 via-transparent to-[#141416]/40" />
      </div>

      {/* 3D Stage Container */}
      <div 
        className="relative z-10 w-full flex items-center justify-center"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Aspect ratio spacer so stage height strictly matches the banner height without dead gap */}
        <div 
          className="w-[88%] sm:w-[74%] md:w-[65%] lg:w-[62%] max-w-[840px] aspect-[16/9] pointer-events-none invisible" 
          aria-hidden="true" 
        />

        {HERO_SLIDES.map((slide, i) => {
          const diff = getSlidePosition(i);
          const isCenter = diff === 0;
          const isLeft = diff === -1;
          const isRight = diff === 1;
          const isVisible = Math.abs(diff) <= 1;

          // Xây dựng style 3D tương ứng theo phong cách Coverflow
          let transformStyle: React.CSSProperties = {
            transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
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
              {/* Ảnh nền slide - Chỉ xem, không thể bấm */}
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

              {/* Lớp phủ tối mờ khi slide ở 2 bên */}
              {!isCenter && (
                <div className="absolute inset-0 bg-black/40 hover:bg-black/15 transition-colors z-10 pointer-events-none" />
              )}
            </div>
          );
        })}

        {/* Nút mũi tên Chevron trái (<) nổi trên slide bên trái */}
        {totalSlides > 1 && (
          <button
            id="btn-coverflow-prev"
            onClick={prevSlide}
            aria-label="Slide trước"
            className="absolute left-[2%] sm:left-[6%] md:left-[10%] lg:left-[13%] top-1/2 -translate-y-1/2 z-40 text-white/90 hover:text-white hover:scale-125 active:scale-95 transition-all p-2 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 stroke-[2.5]" />
          </button>
        )}

        {/* Nút mũi tên Chevron phải (>) nổi trên slide bên phải */}
        {totalSlides > 1 && (
          <button
            id="btn-coverflow-next"
            onClick={nextSlide}
            aria-label="Slide tiếp theo"
            className="absolute right-[2%] sm:right-[6%] md:right-[10%] lg:right-[13%] top-1/2 -translate-y-1/2 z-40 text-white/90 hover:text-white hover:scale-125 active:scale-95 transition-all p-2 cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Pagination Indicators (Dạng vạch dài viên thuốc và các chấm tròn nhỏ) */}
      {totalSlides > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 sm:w-9 h-1 sm:h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.85)]'
                  : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/60'
              }`}
              aria-label={`Đi tới slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
