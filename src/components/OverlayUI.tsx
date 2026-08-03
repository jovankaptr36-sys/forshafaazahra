import React from 'react';
import { Music, Music2, Home, Mail } from 'lucide-react';
import { ConfigData } from '../types';

interface OverlayUIProps {
  config: ConfigData;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenLoveLetter?: () => void;
  onReturnHome: () => void;
}

export const OverlayUI: React.FC<OverlayUIProps> = ({
  isPlayingMusic,
  onToggleMusic,
  onOpenLoveLetter,
  onReturnHome,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between w-full gap-2">
        {/* Left Side: Home / Back to Initial Page Button */}
        <button
          onClick={onReturnHome}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs sm:text-sm font-medium transition hover:scale-105 shadow-xl pointer-events-auto"
          title="Kembali ke Laman Awal"
        >
          <Home className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Laman Awal</span>
        </button>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Music Button */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-300 text-xs sm:text-sm font-semibold shadow-lg hover:scale-105 ${
              isPlayingMusic
                ? 'bg-cyan-600 border-cyan-300 text-white animate-pulse'
                : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Putar atau jeda lagu LANY - you"
          >
            {isPlayingMusic ? <Music2 className="w-4 h-4 animate-spin text-cyan-200" /> : <Music className="w-4 h-4" />}
            <span>{isPlayingMusic ? '🎵 LANY - you' : 'Putar LANY - you'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pb-1">
        {/* Hint Text */}
        <div className="text-xs text-pink-200/80 font-light px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-xs border border-pink-500/30 shadow-lg">
          <span>Coba tap layar dan klik foto</span>
        </div>

        {/* Love Letter Button */}
        {onOpenLoveLetter && (
          <div className="pointer-events-auto">
            <button
              onClick={onOpenLoveLetter}
              className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-sky-500 hover:from-cyan-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 border border-cyan-300/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Click</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


