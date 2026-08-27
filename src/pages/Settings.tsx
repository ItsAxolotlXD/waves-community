import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Volume2, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

export const Settings: React.FC = () => {
  const [autoplay, setAutoplay] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState('auto');
  const [lowLatency, setLowLatency] = useState(true);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const { clearAllFavorites } = useFavorites();

  const handleSave = () => {
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#C83DFF] font-bold uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Cấu hình Hệ thống</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Cài đặt & Tùy chọn Ứng dụng
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
          Điều chỉnh cấu hình trình phát HLS, chất lượng stream mặc định và quản lý dữ liệu lưu trữ cục bộ.
        </p>
      </div>

      {/* Settings Panel */}
      <div className="p-6 md:p-8 rounded-[30px] bg-[#1E1E22] border border-[#2D2D35] shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#C83DFF]" />
          <span>Tùy chọn Trình phát Streaming (HLS Engine)</span>
        </h2>

        <div className="space-y-4 text-xs">
          {/* Autoplay */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141416] border border-[#2B2B32]">
            <div>
              <div className="font-bold text-white text-sm">Tự động phát khi chọn kênh (Autoplay)</div>
              <div className="text-[#8E8E93] mt-0.5">Tự động kết nối và phát luồng video ngay khi chuyển kênh.</div>
            </div>
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              className="w-5 h-5 rounded accent-[#C83DFF] cursor-pointer"
            />
          </div>

          {/* Low Latency Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141416] border border-[#2B2B32]">
            <div>
              <div className="font-bold text-white text-sm">Chế độ độ trễ thấp (Low-Latency HLS)</div>
              <div className="text-[#8E8E93] mt-0.5">Giảm thời gian đệm để sát nhất với thời gian phát sóng thực tế.</div>
            </div>
            <input
              type="checkbox"
              checked={lowLatency}
              onChange={(e) => setLowLatency(e.target.checked)}
              className="w-5 h-5 rounded accent-[#C83DFF] cursor-pointer"
            />
          </div>

          {/* Hardware acceleration */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141416] border border-[#2B2B32]">
            <div>
              <div className="font-bold text-white text-sm">Tăng tốc phần cứng (Hardware Acceleration)</div>
              <div className="text-[#8E8E93] mt-0.5">Sử dụng GPU để giải mã video H.264/HEVC mượt mà và tiết kiệm pin.</div>
            </div>
            <input
              type="checkbox"
              checked={hardwareAcceleration}
              onChange={(e) => setHardwareAcceleration(e.target.checked)}
              className="w-5 h-5 rounded accent-[#C83DFF] cursor-pointer"
            />
          </div>

          {/* Default Quality */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141416] border border-[#2B2B32]">
            <div>
              <div className="font-bold text-white text-sm">Chất lượng luồng mặc định</div>
              <div className="text-[#8E8E93] mt-0.5">Độ phân giải video khi bắt đầu tải kênh.</div>
            </div>
            <select
              value={defaultQuality}
              onChange={(e) => setDefaultQuality(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#222226] border border-[#34343C] text-xs font-bold text-white focus:outline-none"
            >
              <option value="auto">Tự động (Adaptive Bitrate)</option>
              <option value="1080p">1080p Full HD (Cao nhất)</option>
              <option value="720p">720p HD (Cân bằng)</option>
              <option value="480p">480p SD (Tiết kiệm dữ liệu)</option>
            </select>
          </div>
        </div>

        {/* Data Persistence */}
        <div className="pt-4 border-t border-[#2C2C34] space-y-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF2020]" />
            <span>Bộ nhớ Cục bộ (Local Storage)</span>
          </h2>

          <div className="p-4 rounded-2xl bg-[#141416] border border-[#2B2B32] flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">Xóa bộ nhớ đệm và kênh yêu thích</div>
              <div className="text-[#8E8E93] text-xs mt-0.5">Đặt lại danh sách yêu thích và lịch sử xem về mặc định.</div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn đặt lại dữ liệu?')) {
                  clearAllFavorites();
                  alert('Đã xóa dữ liệu lưu trữ thành công!');
                }
              }}
              className="px-4 py-2 rounded-full bg-[#26262C] hover:bg-[#FF2020]/20 text-[#FF4D4D] border border-[#383840] text-xs font-bold transition-colors"
            >
              Đặt lại dữ liệu
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4">
          {showSavedNotification ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã lưu cài đặt thành công!</span>
            </div>
          ) : <div />}

          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-full bg-gradient-purple-active text-white text-xs font-bold shadow-lg glow-purple hover:scale-[1.02] transition-transform"
          >
            Lưu Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};
