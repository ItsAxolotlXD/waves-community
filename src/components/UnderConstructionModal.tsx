import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface UnderConstructionModalProps {
  onUnlock: () => void;
  onCrash: (reason: string) => void;
}

export const UnderConstructionModal: React.FC<UnderConstructionModalProps> = ({
  onUnlock,
  onCrash,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const lastChar = value.replace(/[^0-9]/g, '').slice(-1);
    
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);
    setErrorMessage('');

    // If a digit was entered, move to next box
    if (lastChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleVerifyPassword();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      if (i < pastedData.length) {
        newDigits[i] = pastedData[i];
      }
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyPassword = () => {
    const enteredCode = digits.join('');

    if (enteredCode.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã bảo mật.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    if (enteredCode === '190926') {
      // Trigger smooth exit animation before unmounting
      setIsClosing(true);
      setTimeout(() => {
        onUnlock();
      }, 260);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);

      // Clear input digits
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      if (newAttempts >= 3) {
        // Exceeded 3 attempts -> Crash web
        setIsClosing(true);
        setTimeout(() => {
          onCrash('EXCEEDED_MAX_PASSCODE_ATTEMPTS (Sai mật khẩu 3/3 lần)');
        }, 260);
      } else {
        const remaining = 3 - newAttempts;
        setErrorMessage(
          `Mật khẩu không chính xác! Còn ${remaining} lần thử trước khi web bị crash.`
        );
      }
    }
  };

  return (
    <div
      id="under-construction-backdrop"
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl selection:bg-[#C83DFF] selection:text-white transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Modal Dialog Box matching exact rounded & button style from screenshot */}
      <div
        id="under-construction-dialog"
        className={`w-full max-w-[500px] bg-[#1E1D22] rounded-[38px] p-8 sm:p-10 shadow-2xl relative select-none border border-white/5 ${
          isClosing ? 'modal-dialog-exit' : 'modal-dialog-enter'
        } ${isShaking ? 'animate-bounce' : ''}`}
      >
        {/* Title */}
        <h1
          id="under-construction-title"
          className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-3 font-sans leading-tight"
        >
          Under construction
        </h1>

        {/* Subtitle */}
        <p
          id="under-construction-subtitle"
          className="text-sm sm:text-[15px] text-[#D1D5DB] leading-relaxed mb-6 font-normal"
        >
          Nothing interesting to see here... yet... Unless you are the one who got approved or a developer, please enter this 6 digits password.
        </p>

        {/* 6-Digit Passcode Input Section */}
        <div className="mb-6">
          <div
            className="flex items-center justify-between gap-2 sm:gap-2.5"
            onPaste={handlePaste}
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                id={`passcode-digit-${index}`}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-[#141318] border rounded-[20px] transition-all outline-none ${
                  digit
                    ? 'border-[#CEBEFE] text-white bg-[#222129]'
                    : 'border-[#2D2D36] text-[#E0E0E6] focus:border-[#CEBEFE] focus:bg-[#201F26]'
                }`}
                autoComplete="off"
              />
            ))}
          </div>

          {/* Error and Attempt Counter */}
          {errorMessage && (
            <div className="mt-3.5 flex items-start gap-2 text-xs text-[#FF6B6B] bg-[#2C1417] border border-[#FF4D4D]/30 px-3.5 py-2.5 rounded-2xl animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {failedAttempts > 0 && failedAttempts < 3 && !errorMessage && (
            <p className="mt-2.5 text-xs text-[#FFB066] flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Cảnh báo: Còn {3 - failedAttempts} lần thử trước khi web dừng hoạt động.</span>
            </p>
          )}
        </div>

        {/* Action Buttons (Enter password only) */}
        <div className="flex flex-col gap-3.5">
          {/* Button colored: Enter password */}
          <button
            type="button"
            id="btn-enter-password"
            onClick={handleVerifyPassword}
            className="w-full py-4 px-6 rounded-full font-bold text-[#2E1065] bg-[#CEBEFE] hover:bg-[#DBCFFF] active:scale-[0.98] transition-all text-base sm:text-[17px] cursor-pointer flex items-center justify-center shadow-md tracking-tight"
          >
            Enter password
          </button>
        </div>
      </div>
    </div>
  );
};
