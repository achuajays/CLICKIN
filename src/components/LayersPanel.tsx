import React from 'react';
import { X, Eye, EyeOff, Image as ImageIcon, Type, Sticker } from 'lucide-react';
import useEditorStore from '../store/editorStore';

interface LayersPanelProps {
  onClose: () => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ onClose }) => {
  const { layers, toggleLayerVisibility, canvas } = useEditorStore();

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'sticker':
        return <Sticker className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleLayerClick = (object: fabric.Object) => {
    if (!canvas) return;
    canvas.setActiveObject(object);
    canvas.renderAll();
  };

  const handleVisibilityToggle = (layerId: string, object: fabric.Object) => {
    toggleLayerVisibility(layerId);
    if (canvas) {
      object.visible = !object.visible;
      canvas.renderAll();
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Layers</h2>
        <button 
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {layers.slice().reverse().map((layer) => (
          <div
            key={layer.id}
            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            onClick={() => handleLayerClick(layer.object)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVisibilityToggle(layer.id, layer.object);
              }}
              className="text-gray-600 hover:text-gray-900"
              aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
            >
              {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <span className="text-gray-600">
              {getLayerIcon(layer.type)}
            </span>
            
            <span className={`flex-1 text-sm truncate ${!layer.visible && 'text-gray-400'}`}>
              {layer.name}
            </span>
          </div>
        ))}

        {layers.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>No layers yet</p>
            <p className="text-sm">Add an image, text, or sticker to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;