import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { OnAirSlider } from '../components/OnAirSlider';
import { NEWS_DATA } from '../data/news';
import { DEFAULT_BANNER_PLACEHOLDER } from '../data/heroSlides';
import { Channel } from '../types';
import { Megaphone, Sparkles, Radio, ArrowRight, ShieldCheck, Film, Layers } from 'lucide-react';

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
      />

      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* 2. Kênh truyền hình */}
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

        {/* 4. Chuyên mục nổi bật (Featured Topics) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#E50914]" />
              <span>Chuyên mục nổi bật</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div 
              onClick={() => navigate('/live-tv')}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#E50914]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E50914]/15 text-[#E50914] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors">
                Truyền hình Trực tiếp
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Thưởng thức các luồng phát sóng chất lượng cao trực tiếp ổn định và nhanh chóng.
              </p>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => navigate('/channels')}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#FF2020]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF2020]/15 text-[#FF2020] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FF2020] transition-colors">
                Danh sách Kênh TV
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Đầy đủ các đài VTV, HTV, VTC, Truyền hình địa phương và các kênh đặc sắc.
              </p>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => navigate('/news')}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#00E5FF]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/15 text-[#00E5FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                Chuyên san & Tư liệu
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Lịch sử truyền hình, phân tích kỹ thuật phát sóng và các bài viết cộng đồng.
              </p>
            </div>

            {/* Card 4 */}
            <div 
              onClick={() => navigate('/about')}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#E50914]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E50914]/15 text-[#E50914] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors">
                Vplay
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Không gian lưu trữ tư liệu, lịch sử hình hiệu idents và văn hóa truyền hình Việt Nam.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
