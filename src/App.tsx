import { useState, useEffect } from 'react';
import { ThreeScene } from './components/ThreeScene';
import { OverlayUI } from './components/OverlayUI';
import { SplashScreen } from './components/SplashScreen';
import { LoveLetterModal } from './components/LoveLetterModal';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { CustomizerModal } from './components/CustomizerModal';
import { HtmlCodeViewer } from './components/HtmlCodeViewer';
import { TapFireworksCanvas } from './components/TapFireworksCanvas';
import { DEFAULT_CONFIG } from './data/defaultData';
import { audioEngine } from './utils/audioSynthesizer';
import { ConfigData, PolaroidPhoto } from './types';

const CONFIG_STORAGE_KEY = 'galaxy_romantic_config_v7';

export default function App() {
  const [config, setConfig] = useState<ConfigData>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse saved config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  });

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(null);
  const [isLoveLetterOpen, setIsLoveLetterOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isCodeExporterOpen, setIsCodeExporterOpen] = useState<boolean>(false);

  // Auto-play music on first user interaction anywhere on the page
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (!isPlayingMusic) {
        const playing = await audioEngine.playUrl(config.musicUrl);
        setIsPlayingMusic(playing);
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [config.musicUrl, isPlayingMusic]);

  // Save config changes to localStorage
  const handleSaveConfig = (newConfig: ConfigData) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('LocalStorage save quota exceeded (e.g. large audio file). Config saved in session state.', e);
      // Fallback: save config without large musicUrl string to avoid crashing storage
      try {
        const lightweightConfig = { ...newConfig, musicUrl: newConfig.musicUrl.startsWith('data:') ? '' : newConfig.musicUrl };
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(lightweightConfig));
      } catch (err) {
        console.error('Could not save to localStorage:', err);
      }
    }

    // Play updated audio immediately
    if (newConfig.musicUrl) {
      audioEngine.playUrl(newConfig.musicUrl).then((playing) => {
        setIsPlayingMusic(playing);
      });
    }
  };

  // Toggle Music / Synth
  const handleToggleMusic = async () => {
    const isNowPlaying = await audioEngine.togglePlay(config.musicUrl, false);
    setIsPlayingMusic(isNowPlaying);
  };

  // Enter galaxy from splash screen: automatically start playing selected song or synth
  const handleEnterGalaxy = async () => {
    setShowSplash(false);
    const isNowPlaying = await audioEngine.playUrl(config.musicUrl);
    setIsPlayingMusic(isNowPlaying);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-radial from-purple-950 via-slate-950 to-black select-none font-sans text-white">
      {/* 1. Splash Screen Opening */}
      {showSplash && (
        <SplashScreen
          config={config}
          onEnterGalaxy={handleEnterGalaxy}
        />
      )}

      {/* 2. 3D Three.js Interactive Galaxy Scene */}
      <ThreeScene
        config={config}
        showSplash={showSplash}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />

      {/* Tap Fireworks Canvas when on planet view */}
      <TapFireworksCanvas
        active={!showSplash}
        girlfriendName={config.girlfriendName}
      />

      {/* 3. Floating UI Controls & Glowing Headers */}
      {!showSplash && (
        <OverlayUI
          config={config}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={handleToggleMusic}
          onOpenLoveLetter={() => setIsLoveLetterOpen(true)}
          onReturnHome={() => setShowSplash(true)}
        />
      )}

      {/* Love Letter Modal */}
      <LoveLetterModal
        isOpen={isLoveLetterOpen}
        onClose={() => setIsLoveLetterOpen(false)}
        config={config}
      />

      {/* Photo Detail Modal */}
      <PhotoDetailModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Customizer / Data Editor Drawer */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />

      {/* HTML Exporter & Code Inspector */}
      <HtmlCodeViewer
        isOpen={isCodeExporterOpen}
        onClose={() => setIsCodeExporterOpen(false)}
        config={config}
      />
    </div>
  );
}
