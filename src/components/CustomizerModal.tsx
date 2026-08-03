import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Check, Image as ImageIcon, Music, Heart, Upload } from 'lucide-react';
import { ConfigData, PolaroidPhoto } from '../types';
import { DEFAULT_CONFIG } from '../data/defaultData';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigData;
  onSave: (newConfig: ConfigData) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<ConfigData>(config);
  const [activeTab, setActiveTab] = useState<'text' | 'photos' | 'settings'>('text');
  const [audioUploadStatus, setAudioUploadStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleTextChange = (field: keyof ConfigData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handlePhotoChange(index, 'url', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (index: number, field: keyof PolaroidPhoto, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.photos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, photos: updated };
    });
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setAudioUploadStatus(`Membaca file audio "${file.name}" (${sizeMb} MB)...`);

    const objectUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          musicUrl: event.target!.result as string,
        }));
        setAudioUploadStatus(`✅ Lagu "${file.name}" berhasil diupload!`);
      }
    };
    reader.onerror = () => {
      setFormData((prev) => ({
        ...prev,
        musicUrl: objectUrl,
      }));
      setAudioUploadStatus(`✅ Lagu "${file.name}" siap diputar!`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = () => {
    if (formData.photos.length >= 15) return;
    const newIndex = formData.photos.length + 1;
    const newPhoto: PolaroidPhoto = {
      id: `p_${Date.now()}`,
      url: `https://picsum.photos/id/${100 + newIndex * 15}/600/600`,
      caption: `Memori Baru #${newIndex}`,
      date: 'Hari Ini',
      orbitRadius: 5.0 + (newIndex % 4) * 0.6,
      orbitSpeed: 0.002,
      orbitTiltX: 0.2,
      orbitTiltZ: -0.2,
      selfRotationSpeed: 0.003,
    };
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, newPhoto] }));
  };

  const handleRemovePhoto = (index: number) => {
    if (formData.photos.length <= 4) {
      alert('Minimal menyisakan 4 foto dalam galaksi.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleReset = () => {
    if (confirm('Kembalikan semua pengaturan ke awal?')) {
      setFormData(DEFAULT_CONFIG);
    }
  };

  const handleSaveAndClose = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            <h3 className="font-serif text-lg font-bold text-slate-100">Edit Kejutan Galaksi</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs flex items-center gap-1"
              title="Reset ke Default"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 px-4 border-b-2 transition ${
              activeTab === 'text'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Nama & Kata-Kata
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-3 px-4 border-b-2 transition ${
              activeTab === 'photos'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Galaksi Foto ({formData.photos.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Musik & Warna
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nama Pacar</label>
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => handleTextChange('partnerName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="misal: Amanda"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nama Kamu (Pengirim)</label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleTextChange('senderName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="misal: Rizky"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Judul Utama</label>
                <input
                  type="text"
                  value={formData.mainTitle}
                  onChange={(e) => handleTextChange('mainTitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Sub-Judul Pesan Singkat</label>
                <input
                  type="text"
                  value={formData.customSubtitle || ''}
                  onChange={(e) => handleTextChange('customSubtitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Judul Surat Cinta</label>
                <input
                  type="text"
                  value={formData.loveLetterTitle}
                  onChange={(e) => handleTextChange('loveLetterTitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Isi Surat Cinta</label>
                <textarea
                  rows={5}
                  value={formData.loveLetterBody}
                  onChange={(e) => handleTextChange('loveLetterBody', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-light"
                />
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-xs">
                  Atur URL gambar, caption, dan tanggal pada polaroid 3D.
                </p>
                <button
                  onClick={handleAddPhoto}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Foto</span>
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {formData.photos.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-semibold text-xs flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Foto Polaroid #{idx + 1}</span>
                      </span>
                      <button
                        onClick={() => handleRemovePhoto(idx)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block text-[10px] text-slate-500">URL Foto atau Upload dari HP/Laptop</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={photo.url}
                            onChange={(e) => handlePhotoChange(idx, 'url', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs truncate"
                            placeholder="https://..."
                          />
                          <label className="cursor-pointer shrink-0 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 font-medium transition-colors">
                            <Upload className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Pilih File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoFileUpload(idx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Tanggal / Momen</label>
                        <input
                          type="text"
                          value={photo.date || ''}
                          onChange={(e) => handlePhotoChange(idx, 'date', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500">Caption Tulisan Tangan</label>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => handlePhotoChange(idx, 'caption', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-cyan-400" />
                    <span>File Lagu (MP3/Audio) atau URL</span>
                  </span>
                </label>

                <div className="mb-2">
                  <label className="cursor-pointer bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-200 px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Upload File Lagu MP3 dari Laptop/HP</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {audioUploadStatus && (
                  <p className="text-xs text-cyan-300 font-medium my-1.5">{audioUploadStatus}</p>
                )}

                <input
                  type="text"
                  value={formData.musicUrl}
                  onChange={(e) => handleTextChange('musicUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                  placeholder="https://.../lagu.mp3 atau data audio"
                />

                {formData.musicUrl && (
                  <div className="mt-2.5 p-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
                    <p className="text-[11px] text-slate-400 mb-1">Tes Audio:</p>
                    <audio controls src={formData.musicUrl} className="w-full h-8 rounded-lg" />
                  </div>
                )}

                <p className="text-[11px] text-slate-500 mt-1">
                  💡 Kamu dapat mengupload file lagu MP3 langsung dari HP/laptop dengan menekan tombol biru di atas, atau menempelkan link audio MP3.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Warna Planet Utama</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.planetColor}
                      onChange={(e) => handleTextChange('planetColor', e.target.value)}
                      className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">{formData.planetColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Warna Glow Atmosfer</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.atmosphereColor}
                      onChange={(e) => handleTextChange('atmosphereColor', e.target.value)}
                      className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">{formData.atmosphereColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSaveAndClose}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
