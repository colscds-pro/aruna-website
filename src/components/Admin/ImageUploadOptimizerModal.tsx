import React, { useState, useEffect } from 'react';
import {
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
  X,
  FileImage,
  Layers,
  Percent,
} from 'lucide-react';
import {
  ImageOptimizerService,
  ImagePreset,
  IMAGE_PRESETS,
  OptimizationResult,
  ImageAnalysis,
} from '../../services/imageOptimization';
import { MediaService } from '../../services/supabase/mediaService';
import { MediaSection, SiteMedia } from '../../types';

interface ImageUploadOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFile: File | null;
  defaultPreset?: ImagePreset;
  folder?: 'insights' | 'authors' | 'homepage' | 'industries' | 'case-studies' | 'general';
  section?: MediaSection;
  onSuccess: (publicUrl: string, media?: SiteMedia | null) => void;
  metadata?: {
    name?: string;
    slug?: string;
    altText?: string;
    description?: string;
  };
}

export const ImageUploadOptimizerModal: React.FC<ImageUploadOptimizerModalProps> = ({
  isOpen,
  onClose,
  initialFile,
  defaultPreset = 'thumbnail',
  folder = 'general',
  section = 'general',
  onSuccess,
  metadata = {},
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);
  const [preset, setPreset] = useState<ImagePreset>(defaultPreset);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    if (initialFile) {
      setSelectedFile(initialFile);
      setPreset(defaultPreset);
      setErrorMessage(null);
      setOptimizationResult(null);
      runOptimization(initialFile, defaultPreset);
    }
  }, [initialFile, defaultPreset]);

  const runOptimization = async (file: File, targetPreset: ImagePreset) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setProgressPercent(10);
    setStatusText('Menganalisis properti gambar...');

    try {
      const initialAnalysis = await ImageOptimizerService.analyzeImage(file, targetPreset);
      setAnalysis(initialAnalysis);
      setIsAnalyzing(false);

      setIsOptimizing(true);
      const result = await ImageOptimizerService.optimizeImage(
        file,
        targetPreset,
        (percent, text) => {
          setProgressPercent(percent);
          setStatusText(text);
        }
      );

      setOptimizationResult(result);
      setIsOptimizing(false);
    } catch (err: any) {
      setIsAnalyzing(false);
      setIsOptimizing(false);
      setErrorMessage(err.message || 'Gagal menganalisis atau mengoptimalkan gambar.');
    }
  };

  const handlePresetChange = (newPreset: ImagePreset) => {
    setPreset(newPreset);
    if (selectedFile) {
      runOptimization(selectedFile, newPreset);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      runOptimization(file, preset);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const fileToUpload = optimizationResult?.file || selectedFile;
    setIsUploading(true);
    setStatusText('Mengunggah ke Supabase Storage (bucket: aruna-media)...');
    setProgressPercent(80);

    try {
      const { publicUrl, media, error } = await MediaService.uploadMedia(
        fileToUpload,
        folder,
        {
          name: metadata.name || selectedFile.name.split('.')[0],
          slug: metadata.slug,
          altText: metadata.altText || metadata.name || selectedFile.name,
          description: metadata.description,
          section,
        }
      );

      if (error) {
        throw error;
      }

      setProgressPercent(100);
      setStatusText('Selesai! Gambar berhasil disimpan.');
      onSuccess(publicUrl, media);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengunggah file ke Supabase Storage.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#EAECF0] overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-[#F5F6F7] border-b border-[#EAECF0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1F33] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#B59A5A]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0B1F33]">
                Kompresi & Optimasi Gambar Otomatis
              </h3>
              <p className="text-xs text-[#667085]">
                Pemeriksaan dimensi, penghematan ukuran file, dan unggah ke Supabase Storage
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="p-2 text-[#667085] hover:text-[#0B1F33] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold">Terjadi Kesalahan</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F33] mb-2">
              Pilih Preset Optimasi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(IMAGE_PRESETS) as ImagePreset[]).map((key) => {
                const p = IMAGE_PRESETS[key];
                const isSelected = preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePresetChange(key)}
                    disabled={isOptimizing || isUploading}
                    className={`p-2.5 rounded-lg text-left text-xs border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0B1F33] bg-[#0B1F33] text-white shadow-xs'
                        : 'border-[#EAECF0] bg-[#F5F6F7] text-[#0B1F33] hover:border-[#0B1F33]/40'
                    }`}
                  >
                    <span className="font-bold block truncate">{p.name}</span>
                    <span
                      className={`text-[10px] block truncate mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-[#667085]'
                      }`}
                    >
                      Maks. {p.maxWidthOrHeight}px
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#667085] mt-2 italic">
              {IMAGE_PRESETS[preset]?.description}
            </p>
          </div>

          {/* Comparison Cards: Before vs After */}
          {selectedFile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before */}
              <div className="p-4 rounded-xl bg-[#F5F6F7] border border-[#EAECF0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#667085] font-bold">
                    Sebelum Optimasi
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#667085] border border-[#EAECF0]">
                    {selectedFile.type.split('/')[1]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold text-[#0B1F33]">
                    {optimizationResult?.originalFormatted || (analysis ? analysis.sizeFormatted : '...')}
                  </span>
                </div>
                <p className="text-xs text-[#667085]">
                  Dimensi: {analysis ? `${analysis.width} × ${analysis.height} px` : 'Menganalisis...'}
                </p>
              </div>

              {/* After */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                    Setelah Optimasi
                  </span>
                  {optimizationResult && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold inline-flex items-center gap-1">
                      <Percent className="w-2.5 h-2.5" />
                      Hemat {optimizationResult.savingsPercent}%
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold text-emerald-900">
                    {isOptimizing
                      ? 'Mengompresi...'
                      : optimizationResult
                      ? optimizationResult.optimizedFormatted
                      : '...'}
                  </span>
                </div>
                <p className="text-xs text-emerald-700">
                  {optimizationResult
                    ? `Dimensi: ${optimizationResult.optimizedDimensions.width} × ${optimizationResult.optimizedDimensions.height} px`
                    : 'Memproses kompresi visual...'}
                </p>
              </div>
            </div>
          )}

          {/* Image Preview & Crop check */}
          {optimizationResult?.previewUrl && (
            <div className="rounded-xl overflow-hidden border border-[#EAECF0] bg-[#0B1F33]/5 relative aspect-[16/9] max-h-56 flex items-center justify-center">
              <img
                src={optimizationResult.previewUrl}
                alt="Preview hasil optimasi"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded">
                Format: {optimizationResult.mimeType.split('/')[1]?.toUpperCase()} • Siap diunggah
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {(isAnalyzing || isOptimizing || isUploading) && (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0B1F33]">
                <span>{statusText || 'Memproses gambar...'}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-[#F5F6F7] rounded-full overflow-hidden border border-[#EAECF0]">
                <div
                  className="h-full bg-[#0B1F33] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#F5F6F7] border-t border-[#EAECF0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B1F33] hover:text-[#B59A5A] cursor-pointer">
            <FileImage className="w-4 h-4" />
            <span>Pilih File Gambar Lain</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={isOptimizing || isUploading}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#EAECF0] bg-white text-xs font-semibold text-[#667085] hover:text-[#0B1F33] hover:bg-[#F5F6F7] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isAnalyzing || isOptimizing || isUploading || !selectedFile}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0B1F33] text-xs font-bold text-white hover:bg-[#132D47] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#B59A5A]" />
                  <span>Unggah Hasil Optimasi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
