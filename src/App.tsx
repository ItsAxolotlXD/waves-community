import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SpotlightModal } from './components/SpotlightModal';
import { CustomStreamModal } from './components/CustomStreamModal';
import { UnderConstructionModal } from './components/UnderConstructionModal';
import { CrashScreen } from './components/CrashScreen';
import { Home } from './pages/Home';
import { LiveTV } from './pages/LiveTV';
import { News } from './pages/News';
import { Article } from './pages/Article';
import { Channels } from './pages/Channels';
import { Favorites } from './pages/Favorites';
import { Toolbox } from './pages/Toolbox';
import { About } from './pages/About';
import { Settings } from './pages/Settings';
import { CHANNELS_DATA } from './data/channels';
import { Channel } from './types';

export default function App() {
  // Security & Construction Gate State: modal dialog Under Construction always appears on each refresh/load
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);
  const [crashReason, setCrashReason] = useState<string>('');

  // Navigation Route State (supports browser pathname or internal state)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname === '/' ? '/' : window.location.pathname;
  });
  const [routeState, setRouteState] = useState<any>(null);

  // Channels State (base channels + imported channels from localStorage)
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('waves_custom_channels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...CHANNELS_DATA, ...parsed];
      } catch {
        return CHANNELS_DATA;
      }
    }
    return CHANNELS_DATA;
  });

  // Current Active Channel for Live TV Player
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    // Check if URL has ?channel=slug
    const urlParams = new URLSearchParams(window.location.search);
    const channelSlug = urlParams.get('channel');
    if (channelSlug) {
      const matched = CHANNELS_DATA.find((c) => c.slug === channelSlug);
      if (matched) return matched;
    }
    return CHANNELS_DATA[0];
  });

  // Modals state
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isCustomStreamModalOpen, setIsCustomStreamModalOpen] = useState(false);

  // Navigation handler
  const navigate = (path: string, state?: any) => {
    setRouteState(state);
    
    // Parse query params if any
    if (path.includes('?')) {
      const [baseRoute, query] = path.split('?');
      const params = new URLSearchParams(query);
      const chSlug = params.get('channel');
      if (chSlug) {
        const matched = channels.find((c) => c.slug === chSlug);
        if (matched) setCurrentChannel(matched);
      }
      window.history.pushState(null, '', path);
      setCurrentRoute(baseRoute);
    } else {
      window.history.pushState(null, '', path);
      setCurrentRoute(path);
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const chSlug = params.get('channel');
      if (chSlug) {
        const matched = channels.find((c) => c.slug === chSlug);
        if (matched) setCurrentChannel(matched);
      }
      setCurrentRoute(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [channels]);

  // Handle playing a custom single channel
  const handlePlayCustomChannel = (newChannel: Channel) => {
    setChannels((prev) => {
      const exists = prev.some((c) => c.id === newChannel.id);
      if (exists) return prev;
      const updated = [newChannel, ...prev];
      return updated;
    });
    setCurrentChannel(newChannel);
    navigate(`/live-tv?channel=${newChannel.slug}`);
  };

  // Handle importing a list of M3U channels
  const handleImportPlaylist = (importedList: Channel[]) => {
    setChannels((prev) => {
      const updated = [...importedList, ...prev];
      try {
        localStorage.setItem('waves_custom_channels', JSON.stringify(importedList));
      } catch {}
      return updated;
    });
    if (importedList.length > 0) {
      setCurrentChannel(importedList[0]);
      navigate(`/live-tv?channel=${importedList[0].slug}`);
    }
  };

  // Render Page Content based on currentRoute
  const renderContent = () => {
    // Route matching for news detail: /news/:slug
    if (currentRoute.startsWith('/news/')) {
      const slug = currentRoute.replace('/news/', '');
      return <Article slug={slug} navigate={navigate} />;
    }

    switch (currentRoute) {
      case '/':
      case '/home':
        return (
          <Home
            navigate={navigate}
            onSelectChannel={setCurrentChannel}
            channels={channels}
          />
        );

      case '/live-tv':
        return (
          <LiveTV
            currentChannel={currentChannel}
            onSelectChannel={setCurrentChannel}
            channels={channels}
            onOpenCustomStreamModal={() => setIsCustomStreamModalOpen(true)}
          />
        );

      case '/news':
        return <News navigate={navigate} />;

      case '/channels':
        return (
          <Channels
            channels={channels}
            onSelectChannel={setCurrentChannel}
            navigate={navigate}
            onOpenCustomStreamModal={() => setIsCustomStreamModalOpen(true)}
          />
        );

      case '/favorites':
        return (
          <Favorites
            channels={channels}
            onSelectChannel={setCurrentChannel}
            navigate={navigate}
          />
        );

      case '/toolbox':
        return (
          <Toolbox
            initialTab={routeState?.tab || 'safe-area'}
            onSelectChannel={setCurrentChannel}
            navigate={navigate}
          />
        );

      case '/about':
        return <About />;

      case '/settings':
        return <Settings />;

      default:
        return (
          <Home
            navigate={navigate}
            onSelectChannel={setCurrentChannel}
            channels={channels}
          />
        );
    }
  };

  // Handle unlocking the website
  const handleUnlock = () => {
    setIsUnlocked(true);
    try {
      sessionStorage.setItem('waves_unlocked', 'true');
    } catch {}
  };

  // Handle crashing the website
  const handleCrash = (reason: string) => {
    setIsCrashed(true);
    setCrashReason(reason);
    try {
      sessionStorage.removeItem('waves_unlocked');
    } catch {}
  };

  // If website is in crashed state, render fatal crash screen
  if (isCrashed) {
    return <CrashScreen reason={crashReason || 'FATAL_SYSTEM_SHUTDOWN'} />;
  }

  return (
    <div className="min-h-screen bg-[#141416] text-[#E0E0E6] flex font-sans selection:bg-[#C83DFF] selection:text-white relative">
      {/* Under Construction Modal Gate (if not unlocked) */}
      {!isUnlocked && (
        <UnderConstructionModal
          onUnlock={handleUnlock}
          onCrash={handleCrash}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        navigate={navigate}
        onOpenSearch={() => setIsSpotlightOpen(true)}
        onSelectChannel={setCurrentChannel}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:pl-[290px] transition-all duration-200">
        {/* TopBar Header */}
        <TopBar
          currentRoute={currentRoute}
          navigate={navigate}
          onOpenSearch={() => setIsSpotlightOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className={`flex-1 w-full mx-auto animate-in fade-in duration-200 ${
          currentRoute === '/' || currentRoute === '/home' 
            ? 'p-0 max-w-none' 
            : 'px-4 sm:px-6 md:px-8 py-5 max-w-7xl'
        }`}>
          {renderContent()}
        </main>
      </div>

      {/* Global Modals */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        navigate={navigate}
        onSelectChannel={setCurrentChannel}
      />

      <CustomStreamModal
        isOpen={isCustomStreamModalOpen}
        onClose={() => setIsCustomStreamModalOpen(false)}
        onPlayCustomChannel={handlePlayCustomChannel}
        onImportPlaylist={handleImportPlaylist}
      />
    </div>
  );
}
