import imageCompression from 'browser-image-compression';

export type ImagePreset =
  | 'hero'
  | 'thumbnail'
  | 'content'
  | 'og'
  | 'avatar'
  | 'logo'
  | 'general';

export interface PresetConfig {
  name: string;
  description: string;
  maxWidthOrHeight: number;
  maxSizeMB: number;
  initialQuality: number;
  exactDimensions?: { width: number; height: number };
  preserveTransparency?: boolean;
}

export const IMAGE_PRESETS: Record<ImagePreset, PresetConfig> = {
  hero: {
    name: 'Hero & Banner',
    description: 'Resolusi tinggi untuk area header & banner utama situs web (maks. 2000px, ~300-500KB)',
    maxWidthOrHeight: 2000,
    maxSizeMB: 0.48,
    initialQuality: 0.85,
  },
  thumbnail: {
    name: 'Thumbnail Artikel & Industri',
    description: 'Optimal untuk kartu artikel, preview industri, dan grid (maks. 1200px, ~150-300KB)',
    maxWidthOrHeight: 1200,
    maxSizeMB: 0.28,
    initialQuality: 0.82,
  },
  content: {
    name: 'Konten Artikel',
    description: 'Gambar ilustrasi dan diagram di dalam tubuh artikel (maks. 1600px, ~200-400KB)',
    maxWidthOrHeight: 1600,
    maxSizeMB: 0.38,
    initialQuality: 0.83,
  },
  og: {
    name: 'WhatsApp / Open Graph Preview',
    description: 'Rasio lanskap standar 1200x630 untuk preview WhatsApp & media sosial (~150-300KB)',
    maxWidthOrHeight: 1200,
    maxSizeMB: 0.28,
    initialQuality: 0.85,
    exactDimensions: { width: 1200, height: 630 },
  },
  avatar: {
    name: 'Foto Profil / Penulis',
    description: 'Foto profil bundar / persegi untuk atribusi penulis & tim (maks. 800px, ~150-250KB)',
    maxWidthOrHeight: 800,
    maxSizeMB: 0.22,
    initialQuality: 0.85,
  },
  logo: {
    name: 'Logo & Ilustrasi Transparan',
    description: 'Mempertahankan transparansi PNG dan ketajaman vektor/ikonik (maks. 1000px)',
    maxWidthOrHeight: 1000,
    maxSizeMB: 0.35,
    initialQuality: 0.90,
    preserveTransparency: true,
  },
  general: {
    name: 'Umum / Standard',
    description: 'Penyeimbang kualitas visual dan kompresi untuk aset umum (maks. 1800px, ~200-400KB)',
    maxWidthOrHeight: 1800,
    maxSizeMB: 0.35,
    initialQuality: 0.83,
  },
};

export interface ImageAnalysis {
  width: number;
  height: number;
  aspectRatio: number;
  mimeType: string;
  sizeBytes: number;
  sizeFormatted: string;
  hasTransparency: boolean;
  isAlreadyOptimal: boolean;
}

export interface OptimizationResult {
  file: File;
  originalSize: number;
  optimizedSize: number;
  originalFormatted: string;
  optimizedFormatted: string;
  savingsBytes: number;
  savingsPercent: number;
  originalDimensions: { width: number; height: number };
  optimizedDimensions: { width: number; height: number };
  presetUsed: ImagePreset;
  mimeType: string;
  isSkipped: boolean; // true if already optimal
  previewUrl: string;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const ImageOptimizerService = {
  /**
   * Deep analysis of file: actual dimensions, mime type, and transparency
   */
  async analyzeImage(file: File, preset: ImagePreset = 'general'): Promise<ImageAnalysis> {
    return new Promise((resolve, reject) => {
      // Validate supported mime types
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        return reject(
          new Error(`Format "${file.type || 'unknown'}" tidak didukung. Harap gunakan format JPEG, PNG, atau WebP.`)
        );
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const aspectRatio = width / (height || 1);

        // Check transparency for PNG
        let hasTransparency = false;
        if (file.type === 'image/png') {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(width, 100);
            canvas.height = Math.min(height, 100);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
              for (let i = 3; i < data.length; i += 4) {
                if (data[i] < 255) {
                  hasTransparency = true;
                  break;
                }
              }
            }
          } catch {
            // In case of canvas read error, assume true if PNG
            hasTransparency = true;
          }
        }

        URL.revokeObjectURL(objectUrl);

        const config = IMAGE_PRESETS[preset];
        const isAlreadyOptimal =
          file.size <= config.maxSizeMB * 1024 * 1024 &&
          width <= config.maxWidthOrHeight &&
          height <= config.maxWidthOrHeight;

        resolve({
          width,
          height,
          aspectRatio,
          mimeType: file.type,
          sizeBytes: file.size,
          sizeFormatted: formatBytes(file.size),
          hasTransparency,
          isAlreadyOptimal,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('File gambar rusak atau tidak dapat dibaca oleh browser.'));
      };

      img.src = objectUrl;
    });
  },

  /**
   * Crop & fit specifically for WhatsApp / Open Graph 1200x630 landscape format
   * Prevents stretching or distortion; uses smart cover positioning
   */
  async generateOgLandscape(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        try {
          const targetW = 1200;
          const targetH = 630;
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            return resolve(file);
          }

          // Smart aspect cover crop (centered)
          const srcW = img.naturalWidth;
          const srcH = img.naturalHeight;
          const srcAspect = srcW / srcH;
          const targetAspect = targetW / targetH;

          let renderW = targetW;
          let renderH = targetH;
          let offsetX = 0;
          let offsetY = 0;

          if (srcAspect > targetAspect) {
            // Source is wider than 1200x630 -> scale by height, crop horizontal sides
            renderH = targetH;
            renderW = srcW * (targetH / srcH);
            offsetX = (targetW - renderW) / 2;
          } else {
            // Source is taller than 1200x630 -> scale by width, crop vertical top/bottom evenly
            renderW = targetW;
            renderH = srcH * (targetW / srcW);
            offsetY = (targetH - renderH) / 2;
          }

          // Background neutral fill in case of any sub-pixel gap
          ctx.fillStyle = '#0B1F33';
          ctx.fillRect(0, 0, targetW, targetH);

          // Draw image
          ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objectUrl);
              if (blob) {
                const cleanName = file.name.replace(/\.[^/.]+$/, '') + '-og.jpg';
                const ogFile = new File([blob], cleanName, { type: 'image/jpeg' });
                resolve(ogFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.88
          );
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Gagal memproses gambar untuk format Open Graph.'));
      };

      img.src = objectUrl;
    });
  },

  /**
   * Main optimization pipeline:
   * 1. Analyses file
   * 2. Checks if already optimal to prevent double compression
   * 3. Applies preset constraints (dimension & size)
   * 4. Preserves transparency for PNG
   * 5. Fallback gracefully to original file if compression fails
   */
  async optimizeImage(
    file: File,
    preset: ImagePreset = 'general',
    onProgress?: (progressPercent: number, statusText: string) => void
  ): Promise<OptimizationResult> {
    const config = IMAGE_PRESETS[preset] || IMAGE_PRESETS.general;

    // 1. Analysis
    onProgress?.(10, 'Menganalisis jenis, dimensi, dan ukuran gambar...');
    const analysis = await this.analyzeImage(file, preset);

    // 2. Check if already optimal
    if (analysis.isAlreadyOptimal && !config.exactDimensions) {
      onProgress?.(100, 'Gambar sudah berukuran optimal. Siap diunggah.');
      const previewUrl = URL.createObjectURL(file);
      return {
        file,
        originalSize: file.size,
        optimizedSize: file.size,
        originalFormatted: formatBytes(file.size),
        optimizedFormatted: formatBytes(file.size),
        savingsBytes: 0,
        savingsPercent: 0,
        originalDimensions: { width: analysis.width, height: analysis.height },
        optimizedDimensions: { width: analysis.width, height: analysis.height },
        presetUsed: preset,
        mimeType: file.type,
        isSkipped: true,
        previewUrl,
      };
    }

    let sourceFile = file;

    // 3. Special handling for WhatsApp / Open Graph exact landscape 1200x630
    if (preset === 'og') {
      onProgress?.(30, 'Menyesuaikan kanvas lanskap 1200x630 untuk WhatsApp / Open Graph...');
      try {
        sourceFile = await this.generateOgLandscape(file);
      } catch (err) {
        console.warn('Fallback to standard compression for OG preset:', err);
      }
    }

    // 4. Determine target format & options
    const shouldKeepPng = (config.preserveTransparency || analysis.hasTransparency) && file.type === 'image/png';
    const fileType = shouldKeepPng ? 'image/png' : 'image/jpeg';

    const compressionOptions: Parameters<typeof imageCompression>[1] = {
      maxSizeMB: config.maxSizeMB,
      maxWidthOrHeight: config.maxWidthOrHeight,
      initialQuality: config.initialQuality,
      useWebWorker: true,
      fileType: fileType,
      onProgress: (percent) => {
        const mapped = Math.min(90, Math.round(30 + percent * 0.6));
        onProgress?.(mapped, `Mengompresi gambar (${percent}%)...`);
      },
    };

    try {
      onProgress?.(40, 'Menjalankan optimasi kompresi browser...');
      const compressedBlob = await imageCompression(sourceFile, compressionOptions);

      // Verify that compressed blob is valid and not larger than original
      const isSmaller = compressedBlob.size < file.size;
      const finalFile = isSmaller
        ? new File([compressedBlob], file.name, { type: compressedBlob.type || fileType })
        : file;

      // Analyze new dimensions
      let finalWidth = analysis.width;
      let finalHeight = analysis.height;
      try {
        const finalAnalysis = await this.analyzeImage(finalFile, preset);
        finalWidth = finalAnalysis.width;
        finalHeight = finalAnalysis.height;
      } catch {
        // Retain original width/height if check fails
      }

      const savingsBytes = Math.max(0, file.size - finalFile.size);
      const savingsPercent = file.size > 0 ? Math.round((savingsBytes / file.size) * 1000) / 10 : 0;

      onProgress?.(100, `Optimasi selesai! Penghematan ${savingsPercent}%.`);

      const previewUrl = URL.createObjectURL(finalFile);

      return {
        file: finalFile,
        originalSize: file.size,
        optimizedSize: finalFile.size,
        originalFormatted: formatBytes(file.size),
        optimizedFormatted: formatBytes(finalFile.size),
        savingsBytes,
        savingsPercent,
        originalDimensions: { width: analysis.width, height: analysis.height },
        optimizedDimensions: { width: finalWidth, height: finalHeight },
        presetUsed: preset,
        mimeType: finalFile.type,
        isSkipped: !isSmaller,
        previewUrl,
      };
    } catch (err: any) {
      console.error('Image optimization failed, falling back to original file:', err);
      onProgress?.(100, 'Kompresi dilewati. Menggunakan file asli.');

      const previewUrl = URL.createObjectURL(file);
      return {
        file,
        originalSize: file.size,
        optimizedSize: file.size,
        originalFormatted: formatBytes(file.size),
        optimizedFormatted: formatBytes(file.size),
        savingsBytes: 0,
        savingsPercent: 0,
        originalDimensions: { width: analysis.width, height: analysis.height },
        optimizedDimensions: { width: analysis.width, height: analysis.height },
        presetUsed: preset,
        mimeType: file.type,
        isSkipped: true,
        previewUrl,
      };
    }
  },
};
