import React, { useState } from 'react';
import { X, Copy, Download, Check, Code, Sparkles } from 'lucide-react';
import { ConfigData } from '../types';
import { generateStandaloneHTML } from '../utils/htmlExporter';

interface HtmlCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigData;
}

export const HtmlCodeViewer: React.FC<HtmlCodeViewerProps> = ({ isOpen, onClose, config }) => {
  const [copied, setCopied] = useState(false);
  const htmlCode = generateStandaloneHTML(config);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Gagal menyalin otomatis. Silakan salin manual.');
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `girlfriend-day-${config.partnerName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-pink-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>File Standalone HTML</span>
                <Sparkles className="w-4 h-4 text-pink-400" />
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Semua library (Three.js, UnrealBloomPass, Tailwind) via CDN. Tinggal buka di browser HP/PC!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Box */}
        <div className="bg-pink-950/30 border-b border-pink-500/20 p-3.5 px-5 text-xs text-pink-200/90 flex flex-wrap items-center justify-between gap-2">
          <span>
            💡 <strong>Petunjuk:</strong> Cari komentar <code>&lt;!-- EDIT NAMA / FOTO / LAGU --&gt;</code> di dalam file untuk menyesuaikan data secara langsung!
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
            <button
              onClick={handleDownloadFile}
              className="bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-600/30 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .html</span>
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs text-pink-100/80 leading-relaxed scrollbar-thin">
          <pre className="whitespace-pre-wrap break-words">{htmlCode}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-between items-center text-xs text-slate-400">
          <span>Siap dibagikan ke pasanganmu 🎉</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2 rounded-xl text-xs font-medium"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
