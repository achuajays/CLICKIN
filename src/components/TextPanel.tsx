import React from 'react';
import { X, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, CassetteTape as LetterCase } from 'lucide-react';
import useEditorStore from '../store/editorStore';

interface TextPanelProps {
  onClose: () => void;
}

const TextPanel: React.FC<TextPanelProps> = ({ onClose }) => {
  const { canvas } = useEditorStore();
  
  const updateTextProperty = (property: string, value: any) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject instanceof fabric.IText)) return;
    
    activeObject.set(property, value);
    canvas.renderAll();
  };

  const toggleTextStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject instanceof fabric.IText)) return;

    const currentValue = activeObject.get(style) || false;
    activeObject.set(style, !currentValue);
    canvas.renderAll();
  };

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  const fonts = [
    'Arial', 'Times New Roman', 'Courier New', 'Georgia', 
    'Verdana', 'Helvetica', 'Comic Sans MS', 'Impact'
  ];

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Type className="w-5 h-5" />
          Text Controls
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Text Styles */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Text Style</label>
          <div className="flex gap-2">
            <button
              onClick={() => toggleTextStyle('bold')}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
              title="Bold"
            >
              <Bold className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => toggleTextStyle('italic')}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
              title="Italic"
            >
              <Italic className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => toggleTextStyle('underline')}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
              title="Underline"
            >
              <Underline className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Font Size</label>
          <div className="flex gap-2">
            <input
              type="range"
              min="8"
              max="200"
              defaultValue="40"
              className="flex-1"
              onChange={(e) => updateTextProperty('fontSize', parseInt(e.target.value))}
            />
            <input
              type="number"
              min="8"
              max="200"
              defaultValue="40"
              className="w-16 px-2 border rounded"
              onChange={(e) => updateTextProperty('fontSize', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Font Family</label>
          <select
            className="w-full p-2 border rounded-lg"
            onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Text Color</label>
          <div className="grid grid-cols-5 gap-2">
            {colors.map(color => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: color }}
                onClick={() => updateTextProperty('fill', color)}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Background Color</label>
          <div className="grid grid-cols-5 gap-2">
            {[...colors, 'transparent'].map(color => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: color }}
                onClick={() => updateTextProperty('backgroundColor', color)}
              />
            ))}
          </div>
        </div>

        {/* Character Spacing */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Character Spacing</label>
          <div className="flex gap-2">
            <input
              type="range"
              min="-200"
              max="800"
              defaultValue="0"
              className="flex-1"
              onChange={(e) => updateTextProperty('charSpacing', parseInt(e.target.value))}
            />
            <input
              type="number"
              defaultValue="0"
              className="w-16 px-2 border rounded"
              onChange={(e) => updateTextProperty('charSpacing', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Line Height</label>
          <div className="flex gap-2">
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              defaultValue="1"
              className="flex-1"
              onChange={(e) => updateTextProperty('lineHeight', parseFloat(e.target.value))}
            />
            <input
              type="number"
              min="0.5"
              max="2.5"
              step="0.1"
              defaultValue="1"
              className="w-16 px-2 border rounded"
              onChange={(e) => updateTextProperty('lineHeight', parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Text Alignment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Text Alignment</label>
          <div className="flex gap-2">
            <button
              onClick={() => updateTextProperty('textAlign', 'left')}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => updateTextProperty('textAlign', 'center')}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => updateTextProperty('textAlign', 'right')}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        {/* Text Transform */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Text Transform</label>
          <div className="flex gap-2">
            <button
              onClick={() => updateTextProperty('text', (activeObject: fabric.IText) => 
                activeObject.text?.toLowerCase()
              )}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
            >
              lowercase
            </button>
            <button
              onClick={() => updateTextProperty('text', (activeObject: fabric.IText) => 
                activeObject.text?.toUpperCase()
              )}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => updateTextProperty('text', (activeObject: fabric.IText) => 
                activeObject.text?.split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')
              )}
              className="flex-1 p-2 border rounded-lg hover:bg-gray-100"
            >
              Capitalize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPanel;