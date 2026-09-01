import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface UnderConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnderConstructionModal: React.FC<UnderConstructionModalProps> = ({
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
          id="under-construction-modal-container"
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 select-none"
        >
          {/* 1. Backdrop / Lớp nền mờ */}
          <motion.div
            id="under-construction-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* 2. Dialog Modal Box */}
          <motion.div
            id="under-construction-modal-dialog"
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
            className="relative z-10 w-full max-w-[520px] bg-[#1E1D22] rounded-[38px] p-8 sm:p-10 shadow-2xl border border-white/5"
          >
            {/* Title */}
            <h1
              id="under-construction-modal-title"
              className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-3 font-sans leading-tight"
            >
              Under construction
            </h1>

            {/* Description */}
            <p
              id="under-construction-modal-description"
              className="text-sm sm:text-[15px] text-[#D1D5DB] leading-relaxed mb-8 font-normal"
            >
              This feature will come in the near future updates. Stay tuned!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* Button colored: Close */}
              <button
                type="button"
                id="btn-under-construction-close"
                onClick={onClose}
                className="w-full py-4 px-6 rounded-full font-bold text-white bg-[#E6005A] hover:bg-[#FF267A] active:scale-[0.98] transition-all text-base sm:text-[17px] cursor-pointer flex items-center justify-center shadow-md tracking-tight text-center"
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
