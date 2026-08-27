import React, { useState } from 'react';

interface DiscordWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscordWelcomeModal: React.FC<DiscordWelcomeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 240);
  };

  const handleJoin = () => {
    window.open('https://discord.gg/wcdjaDDayK', '_blank', 'noopener,noreferrer');
    handleClose();
  };

  return (
    <div
      id="discord-welcome-backdrop"
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      {/* Modal Dialog Box matching exact rounded & button style from Under Construction modal */}
      <div
        id="discord-welcome-dialog"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[520px] bg-[#1E1D22] rounded-[38px] p-8 sm:p-10 shadow-2xl relative select-none border border-white/5 ${
          isClosing ? 'modal-dialog-exit' : 'modal-dialog-enter'
        }`}
      >
        {/* Title */}
        <h1
          id="discord-welcome-title"
          className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-3 font-sans leading-tight"
        >
          Chào mừng bạn đến Waves!
        </h1>

        {/* Subtitle */}
        <p
          id="discord-welcome-subtitle"
          className="text-sm sm:text-[15px] text-[#D1D5DB] leading-relaxed mb-8 font-normal"
        >
          “Nhịp sóng lưu dấu thời đại” – nơi kết nối những tâm hồn từ khắp mọi miền Bắc – Trung – Nam, cùng gặp gỡ, sẻ chia và trò chuyện qua những câu chuyện của thời đại. Không chỉ là nơi hội tụ của những tiếng nói và góc nhìn đa dạng, đây còn là không gian lưu giữ những ký ức, khoảnh khắc và dấu ấn truyền thông – những mảnh ghép nhỏ góp phần tạo nên bức tranh lớn của một thời đã qua.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {/* Button colored: Tham gia */}
          <button
            type="button"
            id="btn-discord-join"
            onClick={handleJoin}
            className="w-full py-4 px-6 rounded-full font-bold text-[#2E1065] bg-[#CEBEFE] hover:bg-[#DBCFFF] active:scale-[0.98] transition-all text-base sm:text-[17px] cursor-pointer flex items-center justify-center shadow-md tracking-tight text-center"
          >
            Tham gia
          </button>

          {/* Button normal: Close */}
          <button
            type="button"
            id="btn-discord-close"
            onClick={handleClose}
            className="w-full py-3.5 px-6 rounded-full font-medium text-[#A1A1AA] hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all text-sm sm:text-base cursor-pointer flex items-center justify-center text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
