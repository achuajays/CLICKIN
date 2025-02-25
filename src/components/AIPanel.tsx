import React, { useState } from 'react';
import { X, Wand2, Image as ImageIcon, Instagram, Loader2, ChevronLeft, AlertCircle } from 'lucide-react';
import useEditorStore from '../store/editorStore';

interface AIPanelProps {
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'caption' | 'post'>('caption');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { canvas } = useEditorStore();

  const hasImage = () => {
    if (!canvas) return false;
    return canvas.getObjects().some(obj => obj instanceof fabric.Image);
  };

  const exportCanvasAsBlob = async (): Promise<Blob | null> => {
    if (!canvas) return null;

    return new Promise((resolve) => {
      const objects = canvas.getObjects();
      if (objects.length === 0) {
        resolve(null);
        return;
      }

      const mainImage = objects.find(obj => obj instanceof fabric.Image);
      if (!mainImage) {
        resolve(null);
        return;
      }

      const tempCanvas = document.createElement('canvas');
      const mainImageWidth = (mainImage as fabric.Image).width! * (mainImage as fabric.Image).scaleX!;
      const mainImageHeight = (mainImage as fabric.Image).height! * (mainImage as fabric.Image).scaleY!;
      tempCanvas.width = mainImageWidth;
      tempCanvas.height = mainImageHeight;

      const tempFabricCanvas = new fabric.Canvas(tempCanvas);
      tempFabricCanvas.setDimensions({
        width: mainImageWidth,
        height: mainImageHeight
      });

      objects.forEach(obj => {
        const clone = fabric.util.object.clone(obj);
        const relativeLeft = obj.left! - mainImage.left!;
        const relativeTop = obj.top! - mainImage.top!;
        clone.set({
          left: relativeLeft,
          top: relativeTop
        });
        tempFabricCanvas.add(clone);
      });

      tempFabricCanvas.renderAll();
      tempCanvas.toBlob((blob) => {
        tempFabricCanvas.dispose();
        resolve(blob);
      }, 'image/png', 1.0);
    });
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setGeneratedText('');
      setError('');
      setCopied(false);

      if (!hasImage()) {
        throw new Error('Please add an image to generate a caption');
      }

      const blob = await exportCanvasAsBlob();
      if (!blob) {
        throw new Error('Failed to export image. Please try again.');
      }

      const formData = new FormData();
      formData.append('image', blob, 'image.png');

      const endpoint = activeTab === 'caption' 
        ? 'https://clickin-fastapi.onrender.com/caption'
        : 'https://clickin-fastapi.onrender.com/instagram';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }

      const data = await response.json();
      const text = activeTab === 'caption' ? data.caption : data.instagram_caption;
      
      if (!text) {
        throw new Error('No text was generated. Please try again.');
      }

      setGeneratedText(text);
    } catch (error) {
      console.error('Error generating text:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Wand2 className="w-5 h-5 text-blue-500" />
            AI Assistant
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-lg p-1 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1 bg-gray-50 rounded-lg">
          <button
            className={`flex-1 py-2 px-3 rounded-md transition-all ${
              activeTab === 'caption' 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => {
              setActiveTab('caption');
              setGeneratedText('');
              setError('');
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Caption
            </div>
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded-md transition-all ${
              activeTab === 'post' 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => {
              setActiveTab('post');
              setGeneratedText('');
              setError('');
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Instagram className="w-4 h-4" />
              Post
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {!hasImage() && (
          <div className="mb-4 text-sm text-amber-600 bg-amber-50 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>Please add an image to generate a caption</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !hasImage()}
          className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
            loading || !hasImage()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate {activeTab === 'caption' ? 'Caption' : 'Post'}
            </>
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {generatedText && (
          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">
                  Generated {activeTab === 'caption' ? 'Caption' : 'Post'}
                </h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{generatedText}</p>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleCopy}
                  className={`text-sm flex items-center gap-2 transition-all ${
                    copied 
                      ? 'text-green-600' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;