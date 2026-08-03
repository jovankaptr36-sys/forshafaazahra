import React from 'react';
import { X, Mail } from 'lucide-react';
import { ConfigData } from '../types';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigData;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({ isOpen, onClose, config }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/90 to-cyan-950/90 border border-cyan-500/40 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl text-center relative overflow-hidden text-slate-100">
        {/* Glow decorative orbs */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-2 text-cyan-400">
          <Mail className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="mb-4 text-center flex flex-col items-center justify-center gap-1">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cyan-200">
            FOR
          </h3>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cyan-200 flex items-center justify-center gap-2">
            <span>{config.loveLetterTitle}</span>
          </h3>
        </div>

        <div className="text-sm sm:text-base text-cyan-100/90 space-y-3 text-left font-light leading-relaxed max-h-72 overflow-y-auto pr-2 my-4 scrollbar-thin scrollbar-thumb-cyan-500/30">
          {config.loveLetterBody.split('\n').map((line, idx) => (
            <p key={idx} className="min-h-[1em]">
              {line}
            </p>
          ))}
        </div>

        <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between mt-6">
          <div className="text-left">
            <p className="font-serif text-xl text-cyan-300 italic">From {config.senderName === 'Seseorang yang Menyayangimu' ? 'someone who loves you' : config.senderName}</p>
          </div>

          <button
            onClick={onClose}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition hover:scale-105 shadow-md shadow-cyan-500/20"
          >
            Tutup Surat
          </button>
        </div>
      </div>
    </div>
  );
};
