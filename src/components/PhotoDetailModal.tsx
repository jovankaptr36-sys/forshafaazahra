import React from 'react';
import { X, Calendar, Heart } from 'lucide-react';
import { PolaroidPhoto } from '../types';

interface PhotoDetailModalProps {
  photo: PolaroidPhoto | null;
  onClose: () => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white p-5 pb-6 rounded-3xl max-w-sm w-full shadow-2xl text-center transform transition-all scale-100 relative text-gray-800">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Polaroid Image Frame */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden mb-4 aspect-square shadow-inner relative group">
          <img
            src={photo.url}
            alt={photo.caption}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Polaroid Caption */}
        <h4 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
          <span>{photo.caption}</span>
          <Heart className="w-4 h-4 text-cyan-500 fill-cyan-500" />
        </h4>

        {/* Date */}
        {photo.date && (
          <p className="text-xs text-gray-500 font-mono flex items-center justify-center gap-1.5 mb-5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{photo.date}</span>
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-full text-xs sm:text-sm transition"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
