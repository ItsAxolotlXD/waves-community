import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Copy, CheckCircle2, FileText, Share2, BookOpen } from 'lucide-react';
import { NewsArticle } from '../types';
import { exportArticleToDocx } from '../utils/docxExport';

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
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Generate structured summary bullet points from article content
  const bulletPoints = article.content.slice(0, 3).map((p) => {
    // Extract first sentence or key clause
    const firstSentence = p.split(/[.!?]/)[0];
    return firstSentence.length > 20 ? firstSentence + '.' : p;
  });

  const handleCopySummary = () => {
    const summaryText = `[TÓM TẮT TIN TỨC - ${article.title}]\n\n• ${article.excerpt}\n\nĐiểm tin chính:\n${bulletPoints.map((b) => `- ${b}`).join('\n')}\n\nNguồn: Vplay News (${article.author.name})`;
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
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            id="news-summary-dialog"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#1E1D22] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2C2C34]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E6005A] to-[#FF4D8D] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <span>Tóm tắt bài viết thông minh</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#E6005A]/20 text-[#FF4D8D] text-[10px] font-extrabold uppercase">
                      AI Summary
                    </span>
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">Điểm tin cốt lõi và nội dung cô đọng</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#28282E] flex items-center justify-center text-[#9CA3AF] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D8D]">
                  {article.category}
                </span>
                <h4 className="text-base font-bold text-white mt-1 leading-snug">
                  {article.title}
                </h4>
              </div>

              {/* Core takeaway */}
              <div className="p-4 rounded-2xl bg-[#141318] border border-[#2D2D35] border-l-4 border-l-[#E6005A]">
                <p className="text-xs sm:text-sm font-medium text-[#E0E0E6] italic leading-relaxed">
                  "{article.excerpt}"
                </p>
              </div>

              {/* Bullet points */}
              <div>
                <h5 className="text-xs font-bold uppercase text-[#9CA3AF] mb-2 tracking-wider">
                  Các điểm mấu chốt:
                </h5>
                <div className="space-y-2">
                  {bulletPoints.map((bp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#141318] border border-[#26262E] text-xs text-[#D1D5DB] flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#E6005A]/20 text-[#E6005A] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{bp}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8E8E93] pt-2 border-t border-[#26262E]">
                <span>Tác giả: <strong className="text-white">{article.author.name}</strong></span>
                <span>Thời gian đọc gốc: {article.readingTime}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex-1 py-3 px-4 rounded-full bg-[#28282E] hover:bg-[#34343E] border border-[#3E3E48] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép tóm tắt' : 'Sao chép tóm tắt'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportDocx}
                disabled={exporting}
                className="flex-1 py-3 px-4 rounded-full bg-[#E6005A] hover:bg-[#FF267A] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
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
