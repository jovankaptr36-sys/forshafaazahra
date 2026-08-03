import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { ConfigData } from '../types';

interface SplashScreenProps {
  config: ConfigData;
  onEnterGalaxy: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ config, onEnterGalaxy }) => {
  const [typedText, setTypedText] = useState('');
  const subtitleTarget = "i have somethin' for u!!";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= subtitleTarget.length) {
        setTypedText(subtitleTarget.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 90);

    return () => clearInterval(interval);
  }, []);

  const handleClickHere = () => {
    onEnterGalaxy();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-950 via-indigo-950 to-black overflow-hidden text-white select-none transition-opacity duration-300">
      {/* Background Star Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-70">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-indigo-300 rounded-full animate-ping" />
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-10 w-1 h-1 bg-blue-300 rounded-full animate-ping" />
        <div className="absolute bottom-10 right-10 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse" />
      </div>

      {/* Top Heart Icon */}
      <div className="mt-6 flex items-center justify-center">
        <div className="p-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.5)] animate-bounce">
          <Heart className="w-10 h-10 text-cyan-400 fill-cyan-500/80" />
        </div>
      </div>

      {/* Main Content Center */}
      <div className="my-auto flex flex-col items-center justify-center text-center max-w-xl w-full px-2">
        {/* 2 Lines Sequential Letter Chaser Text in Montserrat Bold */}
        <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 font-montserrat font-black tracking-wider leading-none">
          {/* Row 1: FOR YOU */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-wider flex justify-center flex-wrap gap-x-3 sm:gap-x-5">
            {["FOR", "YOU"].map((word, wordIdx) => {
              const startIdx = wordIdx === 0 ? 0 : 3;
              return (
                <span key={`word-foryou-${wordIdx}`} className="inline-flex whitespace-nowrap">
                  {word.split("").map((char, charIdx) => (
                    <span
                      key={`char-foryou-${wordIdx}-${charIdx}`}
                      className="animate-letter-chase"
                      style={{ animationDelay: `${((startIdx + charIdx) * 0.12).toFixed(2)}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              );
            })}
          </h1>

          {/* Row 2: SHAFA AZAHRA */}
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-wider flex justify-center flex-wrap gap-x-3 sm:gap-x-5">
            {(config.partnerName ? config.partnerName.toUpperCase() : "SHAFA AZAHRA").split(" ").map((word, wordIdx, wordsArr) => {
              const charOffset = wordsArr.slice(0, wordIdx).reduce((acc, w) => acc + w.length, 0);
              return (
                <span key={`word-name-${wordIdx}`} className="inline-flex whitespace-nowrap">
                  {word.split("").map((char, charIdx) => (
                    <span
                      key={`char-name-${wordIdx}-${charIdx}`}
                      className="animate-letter-chase"
                      style={{ animationDelay: `${((7 + charOffset + charIdx) * 0.12).toFixed(2)}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Typing Effect Subtitle */}
        <div className="mt-8 font-romantic text-2xl sm:text-4xl text-cyan-200 tracking-wide flex items-center justify-center gap-1 min-h-[40px]">
          <span>{typedText}</span>
          <span className="w-0.5 h-7 bg-cyan-400 animate-pulse inline-block"></span>
        </div>

        {/* Pulsing Frameless "click here" Button */}
        <button
          onClick={handleClickHere}
          className="btn-pulse-glow pointer-events-auto mt-8 text-cyan-200 hover:text-white font-bold text-2xl sm:text-3xl cursor-pointer tracking-wider transition-all transform active:scale-95"
        >
          click here ✨
        </button>
      </div>

      {/* Footer Credit */}
      <div className="mb-4 text-xs sm:text-sm text-cyan-200/60 font-light text-center tracking-wide">
        Created by <span className="font-semibold text-cyan-300">{config.senderName || 'Kamu'}</span>
      </div>
    </div>
  );
};

