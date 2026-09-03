import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  PictureInPicture2,
  X
} from 'lucide-react';
import { Channel } from '../types';
import { useHLS } from '../hooks/useHLS';

interface VideoPlayerProps {
  channel: Channel;
  onOpenCustomStreamModal?: () => void;
  onSelectAlternativeStream?: () => void;
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
  onClose?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  channel,
  onOpenCustomStreamModal,
  isTheaterMode,
  onToggleTheaterMode,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    videoRef,
    isPlaying,
    isLoading,
    isBuffering,
    error,
    volume,
    isMuted,
    qualities,
    currentQuality,
    duration,
    currentTime,
    togglePlay,
    changeVolume,
    toggleMute,
    setQuality,
    retry
  } = useHLS(channel.streamUrl, true);

  // Auto-hide controls after 3.5 seconds of inactivity
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3500);
  };

  useEffect(() => {
    if (isPlaying) {
      resetControlsTimeout();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, channel.id]);

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.warn);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.warn);
      setIsFullscreen(false);
    }
    resetControlsTimeout();
  };

  const handlePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP not supported or failed', e);
    }
    resetControlsTimeout();
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Format seconds to M:SS or MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Compute playback display values
  let displayCurrent = '0:00';
  let displayRemaining = '-0:00';
  let progressPercent = 0;

  if (duration && isFinite(duration) && duration > 0) {
    displayCurrent = formatTime(currentTime);
    const rem = Math.max(0, duration - currentTime);
    displayRemaining = `-${formatTime(rem)}`;
    progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));
  } else if (videoRef.current?.seekable && videoRef.current.seekable.length > 0) {
    const s = videoRef.current.seekable;
    const start = s.start(0);
    const end = s.end(s.length - 1);
    const total = end - start;
    if (total > 5) {
      const cur = videoRef.current.currentTime - start;
      displayCurrent = formatTime(cur);
      const rem = Math.max(0, end - videoRef.current.currentTime);
      displayRemaining = rem < 3 ? '-0:00' : `-${formatTime(rem)}`;
      progressPercent = Math.min(100, Math.max(0, (cur / total) * 100));
    } else {
      displayCurrent = formatTime(currentTime);
      displayRemaining = '-0:00';
      progressPercent = 100;
    }
  } else {
    displayCurrent = formatTime(currentTime);
    displayRemaining = '-0:00';
    progressPercent = 100;
  }

  // Seek backward 10s
  const handleRewind10 = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
    resetControlsTimeout();
  };

  // Seek forward 10s
  const handleForward10 = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && isFinite(video.duration)) {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    } else if (video.seekable && video.seekable.length > 0) {
      const end = video.seekable.end(video.seekable.length - 1);
      video.currentTime = Math.min(end, video.currentTime + 10);
    } else {
      video.currentTime = video.currentTime + 10;
    }
    resetControlsTimeout();
  };

  // Scrubber click
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (video.duration && isFinite(video.duration) && video.duration > 0) {
      video.currentTime = pos * video.duration;
    } else if (video.seekable && video.seekable.length > 0) {
      const start = video.seekable.start(0);
      const end = video.seekable.end(video.seekable.length - 1);
      video.currentTime = start + pos * (end - start);
    }
    resetControlsTimeout();
  };

  // Volume slider click
  const handleVolumeSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    changeVolume(pos);
    resetControlsTimeout();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFullscreen) {
      handleFullscreenToggle();
    } else if (onClose) {
      onClose();
    } else if (isPlaying) {
      togglePlay();
    }
  };

  return (
    <div
      ref={containerRef}
      id="waves-video-player-container"
      onMouseMove={resetControlsTimeout}
      onPointerMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full rounded-[32px] sm:rounded-[36px] md:rounded-[40px] overflow-hidden bg-black shadow-2xl transition-all duration-300 select-none ${
        isTheaterMode ? 'aspect-[21/9] max-h-[75vh]' : 'aspect-video'
      } ${!showControls && isPlaying ? 'cursor-none' : ''}`}
      style={{
        WebkitMaskImage: '-webkit-radial-gradient(white, black)'
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        className="w-full h-full object-contain bg-black cursor-pointer rounded-[32px] sm:rounded-[36px] md:rounded-[40px]"
        onClick={togglePlay}
      />

      {/* Subtle Dark Gradient Overlay when controls are active */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/50 pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {/* TOP BAR: [X] on Left, and Volume Pill + Secondary actions on Right */}
      <div 
        className={`absolute top-3 sm:top-5 md:top-6 left-3 right-3 sm:left-5 sm:right-5 md:left-7 md:right-7 flex items-center justify-between z-20 pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top-Left: Circular Glass X (Close / Minimize) Button */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            id="video-player-close-btn"
            type="button"
            onClick={handleClose}
            className="glass-player-btn w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer shadow-md"
            title="Đóng / Thoát"
            aria-label="Đóng hoặc thu nhỏ"
          >
            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.2]" />
          </button>

          {/* Subtle Channel Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/15 text-white">
            <span className="text-[11px] font-semibold drop-shadow-sm truncate max-w-[140px]">
              {channel.name}
            </span>
            <span className="px-1.5 py-0.5 text-[8.5px] font-extrabold bg-white/20 rounded-full uppercase tracking-wider">
              {channel.quality}
            </span>
          </div>
        </div>

        {/* Top-Right: Auxiliary controls & Volume Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Quality Selector */}
          <div className="relative">
            <button
              id="video-player-quality-btn"
              type="button"
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="glass-player-btn w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center cursor-pointer"
              title="Chất lượng phát sóng"
              aria-label="Cài đặt chất lượng"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </button>

            {showQualityMenu && qualities.length > 0 && (
              <div
                id="video-player-quality-menu"
                className="video-player-quality-menu absolute top-full right-0 mt-2 w-36 rounded-2xl p-1.5 shadow-2xl z-30 pointer-events-auto backdrop-blur-2xl"
              >
                <div className="text-[10px] uppercase font-bold text-white/70 px-2 py-1">
                  Chất lượng phát
                </div>
                <button
                  onClick={() => {
                    setQuality(-1);
                    setShowQualityMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                    currentQuality === -1 ? 'bg-[#E6005A] text-white font-bold' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span>Tự động (Auto)</span>
                </button>
                {qualities.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setQuality(q.id);
                      setShowQualityMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                      currentQuality === q.id ? 'bg-[#E6005A] text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>{q.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Picture-in-Picture */}
          <button
            id="video-player-pip-btn"
            type="button"
            onClick={handlePiP}
            className="glass-player-btn hidden sm:flex w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full items-center justify-center cursor-pointer"
            title="Thu nhỏ Picture-in-Picture"
            aria-label="Thu nhỏ PiP"
          >
            <PictureInPicture2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </button>

          {/* Fullscreen */}
          <button
            id="video-player-fullscreen-btn"
            type="button"
            onClick={handleFullscreenToggle}
            className="glass-player-btn w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center cursor-pointer"
            title="Toàn màn hình"
            aria-label="Toàn màn hình"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
          </button>

          {/* The Volume Pill (Slider on Left, Speaker on Right) */}
          <div
            id="video-player-volume-pill"
            className="glass-player-volume-pill rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-2.5 shadow-md"
          >
            {/* Volume Track */}
            <div
              onClick={handleVolumeSliderClick}
              className="w-12 sm:w-16 md:w-20 h-1.5 bg-white/35 hover:bg-white/45 rounded-full relative cursor-pointer overflow-hidden transition-colors"
              title={`Âm lượng: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-75 shadow-sm"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>

            {/* Speaker Icon */}
            <button
              id="video-player-mute-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
                resetControlsTimeout();
              }}
              className="text-white hover:text-white/80 active:scale-90 transition-all cursor-pointer flex items-center justify-center"
              title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
              aria-label={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.2]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Buffering & Loading Spinner */}
      {(isLoading || isBuffering) && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-3 border-[#E50914]/20 border-t-[#E50914] animate-spin mb-3 glow-purple" />
          <span
            id="video-player-buffering-badge"
            className="video-player-glass-badge text-xs font-medium text-white/90 tracking-wide px-3.5 py-1.5 rounded-full"
          >
            {isLoading ? 'Đang kết nối luồng phát sóng HLS...' : 'Đang nạp bộ đệm (Buffering)...'}
          </span>
        </div>
      )}

      {/* Error Overlay UI if Stream fails */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#17171A]/95 p-6 z-20 text-center animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-[#FF2020]/15 border border-[#FF2020]/30 flex items-center justify-center text-[#FF4D4D] mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-1">
            Không thể phát kênh này
          </h3>
          <p className="text-xs md:text-sm text-[#9CA3AF] max-w-md mb-6 leading-relaxed">
            Luồng trực tiếp của <span className="text-white font-semibold">{channel.name}</span> đang tạm thời bảo trì hoặc địa chỉ M3U8 nguồn thay đổi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="video-player-retry-btn"
              type="button"
              onClick={retry}
              className="video-player-accent-btn flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>

            {onOpenCustomStreamModal && (
              <button
                id="video-player-custom-stream-btn"
                type="button"
                onClick={onOpenCustomStreamModal}
                className="video-player-glass-btn flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E6005A]" />
                <span>Dán URL M3U8 Khác</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* CENTER CONTROLS: [Rewind 10s] [Play/Pause] [Forward 10s] */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-3.5 sm:gap-5 md:gap-6 z-20 pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Rewind 10s Button */}
        <button
          id="video-player-rewind-btn"
          type="button"
          onClick={handleRewind10}
          className="glass-player-center-seek pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer group shadow-lg"
          title="Lùi 10 giây"
          aria-label="Lùi 10 giây"
        >
          <svg
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white transition-transform group-hover:-rotate-12 group-active:-rotate-20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <text
              x="12"
              y="15.5"
              fontSize="7.5"
              fontWeight="800"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              10
            </text>
          </svg>
        </button>

        {/* Center Main Play / Pause Button */}
        <button
          id="video-player-play-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
            resetControlsTimeout();
          }}
          className="glass-player-center-play pointer-events-auto w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer group shadow-xl"
          title={isPlaying ? 'Tạm dừng' : 'Phát'}
          aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
        >
          {isPlaying ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 sm:w-2 h-4 sm:h-5.5 bg-white rounded-full shadow-sm" />
              <div className="w-1.5 sm:w-2 h-4 sm:h-5.5 bg-white rounded-full shadow-sm" />
            </div>
          ) : (
            <Play className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 fill-white text-white ml-0.5 sm:ml-1 drop-shadow-md" />
          )}
        </button>

        {/* Forward 10s Button */}
        <button
          id="video-player-forward-btn"
          type="button"
          onClick={handleForward10}
          className="glass-player-center-seek pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer group shadow-lg"
          title="Tua tới 10 giây"
          aria-label="Tua tới 10 giây"
        >
          <svg
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white transition-transform group-hover:rotate-12 group-active:rotate-20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <text
              x="12"
              y="15.5"
              fontSize="7.5"
              fontWeight="800"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              10
            </text>
          </svg>
        </button>
      </div>

      {/* BOTTOM PROGRESS BAR CAPSULE: [3:58] [=================---------] [-0:36] */}
      <div
        className={`absolute bottom-3 sm:bottom-4 md:bottom-5 left-3 right-3 sm:left-6 sm:right-6 md:left-10 md:right-10 max-w-2xl sm:max-w-3xl mx-auto z-20 pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          id="video-player-progress-pill"
          className="glass-player-progress-pill pointer-events-auto rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2.5 sm:gap-3.5 select-none shadow-xl"
        >
          {/* Current Time Stamp */}
          <span className="text-[11px] sm:text-xs font-medium text-white/95 font-mono select-none tracking-tight whitespace-nowrap min-w-[30px] text-right">
            {displayCurrent}
          </span>

          {/* Horizontal Scrubber Track */}
          <div
            onClick={handleScrubberClick}
            className="relative flex-1 h-1.5 sm:h-1.5 bg-white/35 hover:bg-white/45 rounded-full cursor-pointer overflow-hidden group/bar transition-colors"
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-75 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Remaining Time Stamp */}
          <span className="text-[11px] sm:text-xs font-medium text-white/95 font-mono select-none tracking-tight whitespace-nowrap min-w-[34px] text-left">
            {displayRemaining}
          </span>
        </div>
      </div>
    </div>
  );
};
