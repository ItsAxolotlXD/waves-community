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
        {/* 2. Đang phát sóng (On Air Section) */}
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
                <Megaphone className="w-6 h-6 text-[#FF4D8B]" />
                <span>Tin tức & Chuyên san Truyền hình</span>
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Cập nhật xu hướng kỹ thuật, trường quay và nhận diện truyền hình Việt Nam
              </p>
            </div>

            <button
              onClick={() => navigate('/news')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#E6005A] hover:underline"
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

        {/* 4. Chuyên mục nổi bật (Featured Broadcast Topics) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#E6005A]" />
              <span>Chuyên mục nổi bật</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div 
              onClick={() => navigate('/toolbox', { tab: 'safe-area' })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#E6005A]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E6005A]/15 text-[#E6005A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E6005A] transition-colors">
                Quy chuẩn Safe Area
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Mô phỏng tiêu chuẩn vùng an toàn Action Safe 90% & Title Safe 80% theo chuẩn EBU/ITU.
              </p>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => navigate('/toolbox', { tab: 'color-bars' })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#FF267A]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF267A]/15 text-[#FF267A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FF267A] transition-colors">
                SMPTE Color Bars
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Bảng màu chuẩn hiệu chuẩn màn hình và phát âm tham chiếu 1kHz âm thanh chuẩn đài.
              </p>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => navigate('/toolbox', { tab: 'dvb-t2' })}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#00E5FF]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/15 text-[#00E5FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                Tần số DVB-T2
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                Bảng tra cứu tần số kênh UHF/VHF số hóa truyền hình tại các tỉnh thành Việt Nam.
              </p>
            </div>

            {/* Card 4 */}
            <div 
              onClick={() => navigate('/about')}
              className="p-6 rounded-[28px] bg-gradient-to-br from-[#24242A] to-[#1A1A1E] border border-[#34343E] hover:border-[#E6005A]/60 cursor-pointer group transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E6005A]/15 text-[#E6005A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#E6005A] transition-colors">
                Waves Community
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
