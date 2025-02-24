import React, { useState } from 'react';
import { 
  Type, 
  Sticker, 
  Sliders, 
  Undo2, 
  Redo2,
  Download,
  Layers,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Wand2
} from 'lucide-react';
import useEditorStore from '../store/editorStore';
import AdjustmentPanel from './AdjustmentPanel';
import StickerPanel from './StickerPanel';
import LayersPanel from './LayersPanel';
import TextPanel from './TextPanel';
import AIPanel from './AIPanel';

const Toolbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const { undo, redo, exportImage, addText, removeActiveObject, canvas } = useEditorStore();

  const hasActiveObject = canvas?.getActiveObject() != null;

  const closeAllPanels = () => {
    setActivePanel(null);
  };

  const togglePanel = (panelName: string) => {
    if (activePanel === panelName) {
      setActivePanel(null);
    } else {
      setActivePanel(panelName);
    }
  };

  const tools = [
    { 
      icon: Type, 
      label: 'Text', 
      action: () => {
        addText();
        togglePanel('text');
      }
    },
    { icon: Sticker, label: 'Sticker', action: () => togglePanel('sticker') },
    { 
      icon: Sliders, 
      label: 'Adjust', 
      action: () => togglePanel('adjust')
    },
    { icon: Layers, label: 'Layers', action: () => togglePanel('layers') },
    { icon: Wand2, label: 'AI Tools', action: () => togglePanel('ai') },
    { 
      icon: Trash2, 
      label: 'Remove', 
      action: () => removeActiveObject(),
      disabled: !hasActiveObject,
      className: !hasActiveObject ? 'opacity-50 cursor-not-allowed' : ''
    },
  ];

  return (
    <>
      <div 
        className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 flex ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className="flex flex-col w-full">
          {/* Tools Section */}
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className={`text-sm font-semibold text-gray-600 mb-4 ${!isExpanded && 'sr-only'}`}>
              Tools
            </h2>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.label}
                  onClick={tool.action}
                  disabled={tool.disabled}
                  className={`w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                    !isExpanded && 'justify-center'
                  } ${tool.className || ''} ${activePanel === tool.label.toLowerCase() && 'bg-blue-50 text-blue-600'}`}
                >
                  <tool.icon className={`w-5 h-5 ${activePanel === tool.label.toLowerCase() ? 'text-blue-600' : 'text-gray-700'}`} />
                  {isExpanded && (
                    <span className="text-sm">{tool.label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* History Section */}
          <div className="p-4 border-t border-gray-200">
            <h2 className={`text-sm font-semibold text-gray-600 mb-4 ${!isExpanded && 'sr-only'}`}>
              History
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={undo}
                className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Undo"
              >
                <Undo2 className="w-5 h-5 text-gray-700" />
                {isExpanded && <span className="text-sm">Undo</span>}
              </button>
              <button 
                onClick={redo}
                className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Redo"
              >
                <Redo2 className="w-5 h-5 text-gray-700" />
                {isExpanded && <span className="text-sm">Redo</span>}
              </button>
            </div>
          </div>

          {/* Export Section */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={exportImage}
              className={`w-full flex items-center gap-3 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors ${
                !isExpanded && 'justify-center'
              }`}
            >
              <Download className="w-5 h-5" />
              {isExpanded && <span className="text-sm">Export</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Panels */}
      {activePanel === 'adjust' && (
        <AdjustmentPanel onClose={closeAllPanels} />
      )}

      {activePanel === 'sticker' && (
        <StickerPanel onClose={closeAllPanels} />
      )}

      {activePanel === 'layers' && (
        <LayersPanel onClose={closeAllPanels} />
      )}

      {activePanel === 'text' && (
        <TextPanel onClose={closeAllPanels} />
      )}

      {activePanel === 'ai' && (
        <AIPanel onClose={closeAllPanels} />
      )}
    </>
  );
};

export default Toolbar;