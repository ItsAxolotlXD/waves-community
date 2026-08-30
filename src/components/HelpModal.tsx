import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard, HelpCircle, Tv, Search, Moon, Bookmark, Share2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useSettings();
  const shouldAnimate = !settings.reduceAllMotion && settings.animateModals;

  const shortcuts = [
    { key: '⌘ + K / Ctrl + K', desc: 'Mở Spotlight tìm kiếm nhanh toàn ứng dụng' },
    { key: 'Space', desc: 'Tạm dừng / Tiếp tục phát luồng Live TV' },
    { key: 'M', desc: 'Bật / Tắt âm thanh (Mute / Unmute)' },
    { key: 'F', desc: 'Xem toàn màn hình (Fullscreen Player)' },
    { key: 'T', desc: 'Chế độ Rạp chiếu (Theater Mode)' },
    { key: '↑ / ↓', desc: 'Tăng / Giảm âm lượng' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldAnimate ? 0.3 : 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            id="help-modal-dialog"
            initial={shouldAnimate ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldAnimate ? { opacity: 0, scale: 1.05 } : { opacity: 0 }}
            transition={{ duration: shouldAnimate ? 0.35 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#1E1D22] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 text-white"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#2C2C34]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6005A]/20 text-[#E6005A] flex items-center justify-center border border-[#E6005A]/30">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Trợ giúp & Hướng dẫn Vplay</h3>
                  <p className="text-xs text-[#9CA3AF]">Phím tắt và mẹo sử dụng nền tảng</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#28282E] flex items-center justify-center text-[#9CA3AF] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6005A] flex items-center gap-2 mb-2.5">
                  <Keyboard className="w-4 h-4" />
                  <span>Phím tắt thao tác nhanh</span>
                </h4>
                <div className="space-y-2">
                  {shortcuts.map((sc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#141318] border border-[#2D2D35] text-xs"
                    >
                      <span className="text-[#D1D5DB]">{sc.desc}</span>
                      <kbd className="px-2 py-1 rounded-md bg-[#24242B] border border-[#3E3E48] font-mono text-[11px] text-[#FF4D8D]">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141318] border border-[#2D2D35] text-xs text-[#9CA3AF] space-y-1.5 leading-relaxed">
                <p className="font-semibold text-white">💡 Mẹo phát luồng:</p>
                <p>• Dùng menu Tools trên thanh công cụ để nhập luồng M3U8 tùy chỉnh hoặc xuất danh sách kênh của bạn.</p>
                <p>• Trong trang tin tức, công cụ Tools hỗ trợ tóm tắt AI, tìm kiếm từ ngữ và xuất file Word .docx.</p>
              </div>
            </div>

            <div className="mt-6 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-full bg-[#E6005A] text-white font-bold text-sm hover:bg-[#FF267A] transition-all cursor-pointer shadow-md"
              >
                Đã hiểu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
