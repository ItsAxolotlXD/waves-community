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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6005A]/15 border border-[#E6005A]/30 text-[#E6005A] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Về Vplay</span>
            </div>

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
            className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-[#1E1E24] to-[#161618] border border-[#34343E] shadow-xl space-y-3 transition-all"
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
            className="text-center p-6 sm:p-8 rounded-[28px] bg-[#1E1E22] border border-[#2D2D35] space-y-4 transition-all"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white">Tham gia cùng Vplay</h3>
            <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-lg mx-auto leading-relaxed">
              Cùng trao đổi về kỹ thuật trường quay ảo, tần số DVB-T2, đồ họa nhận diện On-Air Graphics và chia sẻ tư liệu truyền hình quý giá.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://discord.gg/wcdjaDDayK"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
              >
                <span>Tham gia Discord Cộng Đồng</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#27121d] hover:bg-[#331726] text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
              >
                <span>Facebook Group Truyền Hình</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
