import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { Toolbox } from './pages/Toolbox';
import { About } from './pages/About';
import { Favorites } from './pages/Favorites';
import { Settings } from './pages/Settings';
import { Channels } from './pages/Channels';

import { CHANNELS_DATA } from './data/channels';
import { Channel } from './types';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [routeState, setRouteState] = useState<any>(null);

  // Channels state (seeded with 158+ comprehensive channels data)
  const [channels, setChannels] = useState<Channel[]>(CHANNELS_DATA);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(() => {
    const params = new URLSearchParams(window.location.search);
    const channelParam = params.get('channel');
    if (channelParam) {
      const found = CHANNELS_DATA.find(
        (c) => c.slug === channelParam || c.id === channelParam
      );
      if (found) return found;
    }
    return CHANNELS_DATA[0];
  });

  // Modal dialog states
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);
  const [isCustomStreamOpen, setIsCustomStreamOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Security passcode unlock & crash state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('waves_unlocked') === 'true';
  });
  const [crashReason, setCrashReason] = useState<string | null>(null);

  // Navigation handler
  const navigate = useCallback((route: string, state?: any) => {
    setRouteState(state || null);
    setCurrentRoute(route);
    window.history.pushState(state || {}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync URL query params with selected channel
  const handleSelectChannel = useCallback((channel: Channel) => {
    setSelectedChannel(channel);
    if (!currentRoute.startsWith('/live-tv')) {
      navigate(`/live-tv?channel=${channel.slug}`);
    } else {
      const newUrl = `/live-tv?channel=${channel.slug}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [currentRoute, navigate]);

  // Add custom stream to channels list and play immediately
  const handlePlayCustomChannel = useCallback((customChannel: Channel) => {
    setChannels((prev) => [customChannel, ...prev]);
    setSelectedChannel(customChannel);
    navigate(`/live-tv?channel=${customChannel.slug}`);
  }, [navigate]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K for Spotlight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsCustomStreamOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unlock callback
  const handleUnlock = () => {
    setIsUnlocked(true);
    try {
      localStorage.setItem('waves_unlocked', 'true');
    } catch {}
  };

  // Crash callback
  const handleCrash = (reason: string) => {
    setCrashReason(reason);
  };

  // Render Crash Screen if crashed
  if (crashReason) {
    return <CrashScreen reason={crashReason} />;
  }

  // Parse dynamic sub-routes (e.g. /news/:slug)
  const isArticleRoute = currentRoute.startsWith('/news/') && currentRoute.length > 6;
  const articleSlug = isArticleRoute ? currentRoute.replace('/news/', '') : '';

  // Render current view
  const renderCurrentView = () => {
    if (isArticleRoute) {
      return <Article slug={articleSlug} navigate={navigate} />;
    }

    switch (currentRoute) {
      case '/':
        return (
          <Home
            navigate={navigate}
            onSelectChannel={handleSelectChannel}
            channels={channels}
          />
        );
      case '/live-tv':
        return (
          <LiveTV
            currentChannel={selectedChannel}
            onSelectChannel={handleSelectChannel}
            channels={channels}
            onOpenCustomStreamModal={() => setIsCustomStreamOpen(true)}
          />
        );
      case '/channels':
        return (
          <Channels
            channels={channels}
            onSelectChannel={handleSelectChannel}
            navigate={navigate}
            onOpenCustomStreamModal={() => setIsCustomStreamOpen(true)}
          />
        );
      case '/news':
        return <News navigate={navigate} />;
      case '/toolbox':
        return (
          <Toolbox
            initialTab={routeState?.tab || 'safe-area'}
            onSelectChannel={handleSelectChannel}
            navigate={navigate}
          />
        );
      case '/about':
        return <About />;
      case '/favorites':
        return (
          <Favorites
            channels={channels}
            onSelectChannel={handleSelectChannel}
            navigate={navigate}
          />
        );
      case '/settings':
        return <Settings />;
      default:
        return (
          <Home
            navigate={navigate}
            onSelectChannel={handleSelectChannel}
            channels={channels}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#171719] text-[#E0E0E6] flex flex-row overflow-x-hidden selection:bg-[#DF37EE]/30 selection:text-white">
      {/* 1. Desktop Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        navigate={navigate}
        onOpenSearch={() => setIsSpotlightOpen(true)}
        selectedChannel={selectedChannel}
        onSelectChannel={handleSelectChannel}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Container with TopBar & Views */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* TopBar (Header on Desktop & Mobile Drawer Toggle) */}
        <TopBar
          currentRoute={currentRoute}
          navigate={navigate}
          onOpenSearch={() => setIsSpotlightOpen(true)}
          selectedChannel={selectedChannel}
          onSelectChannel={handleSelectChannel}
        />

        {/* Dynamic Page Content with Smooth Transition */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 sm:py-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute + (routeState?.tab || '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Global Spotlight Search Modal */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        navigate={navigate}
        onSelectChannel={handleSelectChannel}
      />

      {/* 4. Custom Stream / M3U Modal */}
      <CustomStreamModal
        isOpen={isCustomStreamOpen}
        onClose={() => setIsCustomStreamOpen(false)}
        onPlayCustomChannel={handlePlayCustomChannel}
      />

      {/* 5. Under Construction Modal (if not unlocked) */}
      {!isUnlocked && (
        <UnderConstructionModal
          isOpen={!isUnlocked}
          onUnlock={handleUnlock}
          onCrash={handleCrash}
        />
      )}
    </div>
  );
}
