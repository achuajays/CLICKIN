import React, { useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import useEditorStore from '../store/editorStore';

const ImageUpload: React.FC = () => {
  const { addImage } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        addImage(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }, [addImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        addImage(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }, [addImage]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          addImage(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [addImage]);

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer pointer-events-auto">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">
            Drop images here, paste from clipboard,<br />or click to upload
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supports multiple images
          </p>
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;