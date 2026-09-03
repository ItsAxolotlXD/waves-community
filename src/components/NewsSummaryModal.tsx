import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Copy, CheckCircle2, FileText } from 'lucide-react';
import { NewsArticle } from '../types';
import { exportArticleToDocx } from '../utils/docxExport';
import { useSettings } from '../hooks/useSettings';

interface NewsSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle;
}

export const NewsSummaryModal: React.FC<NewsSummaryModalProps> = ({
  isOpen,
  onClose,
  article
}) => {
  const { settings } = useSettings();
  const shouldAnimate = !settings.reduceAllMotion && settings.animateModals;
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Generate structured summary bullet points from article content
  const bulletPoints = article.content.slice(0, 3).map((p) => {
    // Extract first sentence or key clause
    const firstSentence = p.split(/[.!?]/)[0];
    return firstSentence.length > 20 ? firstSentence + '.' : p;
  });

  const handleCopySummary = () => {
    const summaryText = `[TÓM TẮT TIN TỨC - ${article.title}]\n\n• ${article.excerpt}\n\nĐiểm tin chính:\n${bulletPoints.map((b) => `- ${b}`).join('\n')}\n\nNguồn: Waves / Vplay News (${article.publishedAt})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportDocx = async () => {
    setExporting(true);
    try {
      await exportArticleToDocx(article);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            id="news-summary-dialog"
            initial={shouldAnimate ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldAnimate ? { opacity: 0, scale: 1.05 } : { opacity: 0 }}
            transition={{ duration: shouldAnimate ? 0.25 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] bg-white dark:bg-[#1E1D22] border border-[#E5E7EB] dark:border-white/10 rounded-[24px] p-5 sm:p-6 shadow-2xl z-10 text-[#111827] dark:text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB] dark:border-[#2C2C34]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E6005A] to-[#FF4D8D] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold flex items-center gap-2 text-[#111827] dark:text-white">
                    <span>Tóm tắt bài viết thông minh</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E6005A]/15 text-[#E6005A] dark:text-[#FF4D8D] text-[10px] font-extrabold uppercase">
                      AI Summary
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Điểm tin cốt lõi và nội dung cô đọng</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-[#F3F4F6] dark:bg-[#28282E] flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E50914] dark:text-[#FF4D8D]">
                  {article.category}
                </span>
                <h4 className="text-base font-bold text-[#111827] dark:text-white mt-1 leading-snug">
                  {article.title}
                </h4>
              </div>

              {/* Core takeaway */}
              <div className="p-4 rounded-2xl bg-[#F9FAFB] dark:bg-[#141318] border border-[#E5E7EB] dark:border-[#2D2D35] border-l-4 border-l-[#E6005A]">
                <p className="text-xs sm:text-sm font-medium text-[#374151] dark:text-[#E0E0E6] italic leading-relaxed">
                  "{article.excerpt}"
                </p>
              </div>

              {/* Bullet points */}
              <div>
                <h5 className="text-xs font-bold uppercase text-[#6B7280] dark:text-[#9CA3AF] mb-2 tracking-wider">
                  Các điểm mấu chốt:
                </h5>
                <div className="space-y-2">
                  {bulletPoints.map((bp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-[#141318] border border-[#E5E7EB] dark:border-[#26262E] text-xs text-[#374151] dark:text-[#D1D5DB] flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#E6005A]/15 text-[#E6005A] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{bp}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#6B7280] dark:text-[#8E8E93] pt-2 border-t border-[#E5E7EB] dark:border-[#26262E]">
                <span>Chuyên mục: <strong className="text-[#111827] dark:text-white">{article.category}</strong></span>
                <span>Ngày xuất bản: {article.publishedAt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex-1 py-3 px-4 rounded-full bg-[#F3F4F6] dark:bg-[#28282E] hover:bg-[#E5E7EB] dark:hover:bg-[#34343E] border border-[#E5E7EB] dark:border-[#3E3E48] text-xs font-bold text-[#111827] dark:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép tóm tắt' : 'Sao chép tóm tắt'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportDocx}
                disabled={exporting}
                className="flex-1 py-3 px-4 rounded-full bg-[#E50914] hover:bg-[#CC0812] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>{exporting ? 'Đang xuất...' : 'Xuất .docx'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
