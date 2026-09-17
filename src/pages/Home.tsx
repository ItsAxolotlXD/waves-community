import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { OnAirSlider } from '../components/OnAirSlider';
import { NEWS_DATA } from '../data/news';
import { DEFAULT_BANNER_PLACEHOLDER } from '../data/heroSlides';
import { Channel } from '../types';
import { Megaphone, Sparkles, ArrowRight, Shield, ExternalLink } from 'lucide-react';

interface HomeProps {
  navigate: (route: string, state?: any) => void;
  onSelectChannel: (channel: Channel) => void;
  channels: Channel[];
}

export const Home: React.FC<HomeProps> = ({
  navigate,
  onSelectChannel,
  channels
}) => {
  const featuredArticle = NEWS_DATA.find((a) => 
    a.slug.includes('nghe-thuat-cua-su-tien-hoa-tinh-te') ||
    a.title.toLowerCase().includes('tiến hóa tinh tế')
  ) || NEWS_DATA[0];

  return (
    <div className="space-y-4 sm:space-y-6 pb-16">
      {/* 1. 3D Coverflow Hero Banner */}
      <HeroCarousel
        navigate={navigate}
        onSelectChannel={onSelectChannel}
        channels={channels}
      />

      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* 2. Đề xuất cho bạn */}
        <OnAirSlider
          channels={channels}
          onSelectChannel={onSelectChannel}
          navigate={navigate}
        />

        {/* 3. News Feed: Banner ngang - Nghệ thuật tiến hóa tinh tế */}
        {featuredArticle && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#E6005A]" />
                  <span>News Feed</span>
                </h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Tiêu điểm nhận diện thương hiệu & chuyển đổi số truyền hình
                </p>
              </div>

              <button
                id="btn-home-all-news"
                onClick={() => navigate('/news')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#FF4D8B] hover:text-white transition-colors cursor-pointer"
              >
                <span>Xem tất cả bài viết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Banner */}
            <div
              id="home-news-horizontal-banner"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/news/${featuredArticle.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/news/${featuredArticle.slug}`);
                }
              }}
              className="group relative w-full overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/10 hover:border-[#E6005A]/60 bg-[#27121d] hover:bg-[#321726] transition-all duration-300 shadow-2xl cursor-pointer flex flex-col md:flex-row items-stretch select-none"
            >
              {/* Image banner side */}
              <div className="w-full md:w-[42%] lg:w-[40%] relative min-h-[200px] sm:min-h-[230px] md:min-h-[260px] overflow-hidden shrink-0">
                <img
                  src={featuredArticle.coverImage || DEFAULT_BANNER_PLACEHOLDER}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== DEFAULT_BANNER_PLACEHOLDER) {
                      target.src = DEFAULT_BANNER_PLACEHOLDER;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

                {/* Badge on image */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6005A] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>Tiêu điểm</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-medium border border-white/10">
                    {featuredArticle.readingTime}
                  </span>
                </div>
              </div>

              {/* Text info side */}
              <div className="flex-1 p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                    <span className="font-bold text-[#FF4D8B] uppercase tracking-wider text-[11px]">
                      {featuredArticle.category}
                    </span>
                    <span>•</span>
                    <span>{featuredArticle.publishedAt}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white group-hover:text-[#FF4D8B] transition-colors leading-snug tracking-tight">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#D1D5DB] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                {/* Author & Action footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/20"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">
                        {featuredArticle.author.name}
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] truncate">
                        {featuredArticle.author.role}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E6005A] hover:bg-[#FF267A] text-white text-xs font-bold transition-all shadow-md group-hover:scale-105"
                  >
                    <span>Đọc bài viết</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. Nội dung Giới thiệu Vplay (Chuyển toàn bộ nội dung từ Giới thiệu vào Home) */}
        <section id="home-about-section" className="space-y-8 pt-4 border-t border-[#26262E]">
          {/* Hero Intro */}
          <div className="text-center space-y-4 pt-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Vplay -{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2020] via-[#FF3366] to-[#E6005A]">
                Gói trọn Việt Nam trong tầm mắt bạn
              </span>
            </h2>

            <div className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed text-left space-y-3 pt-2">
              <p className="flex items-start gap-2">
                <span className="text-[#E6005A] font-bold select-none">•</span>
                <span>
                  Vplay là nền tảng xem truyền hình trực tuyến phi lợi nhuận cung cấp cho người dùng trải nghiệm xem chất lượng cao, đa dạng cánh sóng và hoàn toàn miễn phí.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#E6005A] font-bold select-none">•</span>
                <span>
                  Ngoài ra Vplay còn giữ vai trò cập nhật toàn diện các thông tin về công nghệ phát thanh truyền hình, đồ họa nhận diện và văn hóa truyền thông Việt Nam, các thông báo của Waves nói chung và Vplay nói riêng.
                </span>
              </p>
            </div>
          </div>

          {/* Disclaimer and Ethics Card */}
          <div
            id="home-about-disclaimer-card"
            className="p-6 sm:p-8 rounded-[28px] bg-white/10 backdrop-blur-md shadow-xl space-y-3 transition-all border-0"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#E6005A] shrink-0" />
              <h3 id="about-disclaimer-title" className="text-base sm:text-lg font-bold text-white">
                Tuyên bố bản quyền & Nguồn phát sóng
              </h3>
            </div>
            <p id="about-disclaimer-text" className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Tất cả logo, nhãn hiệu truyền hình, hình ảnh trường quay và luồng phát sóng thuộc quyền sở hữu trí tuệ của các Đài Truyền hình (Đài Truyền hình Việt Nam VTV, Đài Truyền hình TP.HCM HTV, Đài Truyền hình Kỹ thuật số VTC và các Đài PT-TH địa phương). Vplay phục vụ mục đích nghiên cứu, học thuật, hỗ trợ kỹ thuật và phi thương mại.
            </p>
          </div>

          {/* Community Connect */}
          <div
            id="home-about-community-card"
            className="text-center p-6 sm:p-8 rounded-[28px] bg-white/10 backdrop-blur-md space-y-4 transition-all border-0"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white">Tham gia cộng đồng Waves</h3>
            <p className="text-xs sm:text-sm text-[#D1D5DB] max-w-2xl mx-auto leading-relaxed">
              “Nhịp sóng lưu dấu thời đại” – nơi kết nối những tâm hồn từ khắp mọi miền Bắc – Trung – Nam, cùng gặp gỡ, sẻ chia và trò chuyện qua những câu chuyện của thời đại. Không chỉ là nơi hội tụ của những tiếng nói và góc nhìn đa dạng, đây còn là không gian lưu giữ những ký ức, khoảnh khắc và dấu ấn truyền thông – những mảnh ghép nhỏ góp phần tạo nên bức tranh lớn của một thời đã qua.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="relative group p-[2px] rounded-full overflow-hidden inline-flex shadow-[0_0_20px_rgba(88,101,242,0.35)] hover:shadow-[0_0_30px_rgba(255,51,153,0.6)] transition-all">
                <span className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#5865F2,#FF3399,#7289DA,#FF66B2,#5865F2)] animate-[spin_4s_linear_infinite] opacity-90 group-hover:opacity-100" />
                <a
                  id="btn-home-join-discord"
                  href="https://discord.gg/wcdjaDDayK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(88,101,242,0.45)] hover:shadow-[0_6px_20px_rgba(88,101,242,0.6)] cursor-pointer active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current text-white transition-colors" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.078.078 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Join Waves on Discord</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-90 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
