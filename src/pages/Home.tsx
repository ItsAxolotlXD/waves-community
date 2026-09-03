import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { OnAirSlider } from '../components/OnAirSlider';
import { NewsCard } from '../components/NewsCard';
import { NEWS_DATA } from '../data/news';
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
  return (
    <div className="space-y-12 pb-16">
      {/* 1. Big Full Page Hero Banner */}
      <HeroCarousel
        navigate={navigate}
        onSelectChannel={onSelectChannel}
      />

      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* 2. Đề xuất cho bạn (Recommended Section) */}
        <OnAirSlider
          channels={channels}
          onSelectChannel={onSelectChannel}
          navigate={navigate}
        />

        {/* 3. Tin tức mới (Latest TV & Broadcast News) */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-[#FF2020]" />
                <span>News Feed</span>
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Cập nhật xu hướng kỹ thuật, trường quay và nhận diện truyền hình Việt Nam
              </p>
            </div>

            <button
              onClick={() => navigate('/news')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#E50914] hover:underline"
            >
              <span>Xem tất cả bài viết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NEWS_DATA.slice(0, 3).map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onClick={(a) => navigate(`/news/${a.slug}`)}
              />
            ))}
          </div>
        </section>

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
