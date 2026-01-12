import { useState, useCallback } from 'react';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';

type InputMode = 'upload' | 'url';

interface ImageUploaderProps {
  onImageSelect: (image: File | string | null) => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageSelect, disabled }: ImageUploaderProps) {
  const [mode, setMode] = useState<InputMode>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setUrl('');
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
    onImageSelect(selectedFile);
  }, [onImageSelect]);

  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    setFile(null);
    setPreview(newUrl || null);
    onImageSelect(newUrl || null);
  }, [onImageSelect]);

  const handleClear = useCallback(() => {
    setFile(null);
    setUrl('');
    setPreview(null);
    onImageSelect(null);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('upload'); handleClear(); }}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              mode === 'upload'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button
            onClick={() => { setMode('url'); handleClear(); }}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              mode === 'url'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Link className="w-4 h-4" />
            URL
          </button>
        </div>
      </div>

      <div className="p-5">
        {mode === 'upload' ? (
          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`block cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : preview
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
            }`}>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleClear(); }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="mt-4 text-sm font-medium text-emerald-700">{file?.name}</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-700 font-semibold mb-1">Arraste uma imagem aqui</p>
                  <p className="text-sm text-slate-500">ou clique para selecionar</p>
                  <p className="text-xs text-slate-400 mt-3">PNG, JPG, JPEG, BMP, WEBP</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
              disabled={disabled}
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://exemplo.com/imagem.png"
                disabled={disabled}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm pr-10"
              />
              {url && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
            {preview && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
