/**
 * Utility to process and compress images uploaded from the user's computer.
 * Resizes high-resolution images to an optimal web resolution (max 1280px)
 * and compresses to JPEG data URL to preserve browser storage and guarantee smooth rendering.
 */
export async function compressAndReadFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number; fileName: string }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const originalSize = file.size;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image preview.'));

      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional scaling
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context is unavailable
          const rawData = event.target?.result as string;
          resolve({
            dataUrl: rawData,
            originalSize,
            compressedSize: rawData.length,
            fileName: file.name
          });
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const compressedSize = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          fileName: file.name
        });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human-readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
