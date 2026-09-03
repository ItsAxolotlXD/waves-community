import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings } = useSettings();
  const shouldAnimate = !settings.reduceAllMotion && settings.animateModals;

  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="welcome-modal-container"
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 select-none"
        >
          {/* 1. Backdrop / Lớp nền mờ */}
          <motion.div
            id="welcome-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* 2. Dialog Modal Box */}
          <motion.div
            id="welcome-modal-dialog"
            initial={{ opacity: 0, scale: 1.10 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 0.40,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.08,
              transition: {
                duration: 0.26,
                ease: [0.25, 0.1, 0.25, 1]
              }
            }}
            className="relative z-10 w-full max-w-[450px] bg-[#1E1D22] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 shadow-2xl border border-white/5"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6005A]/15 border border-[#E6005A]/30 text-[#E6005A] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Release Notes</span>
              </div>
              <button
                type="button"
                id="btn-welcome-close-icon"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <h1
              id="welcome-modal-title"
              className="text-xl sm:text-[23px] font-bold text-white tracking-tight mb-2.5 font-sans leading-tight"
            >
              Welcome to Vplay 26.9 - Developer Beta 5
            </h1>

            {/* Description & Changelogs */}
            <div
              id="welcome-modal-description"
              className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed mb-5 font-normal space-y-2.5"
            >
              <p className="font-semibold text-white/95 text-xs sm:text-sm tracking-wide">
                Changelogs:
              </p>
              <p className="text-[#C4C4CC] text-xs sm:text-[13px] leading-relaxed">
                Update changelogs are being updated... Stay tuned.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              {/* Button colored: Close */}
              <button
                type="button"
                id="btn-welcome-close"
                onClick={onClose}
                className="w-full py-2.5 sm:py-3 px-5 rounded-full font-bold text-white bg-[#E6005A] hover:bg-[#FF267A] active:scale-[0.98] transition-all text-sm sm:text-base cursor-pointer flex items-center justify-center shadow-md tracking-tight text-center"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
