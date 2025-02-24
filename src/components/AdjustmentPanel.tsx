import React from 'react';
import { ChevronLeft, SunMedium, Contrast, Droplets, Palette, Sparkles, Mountain } from 'lucide-react';
import useEditorStore from '../store/editorStore';

interface AdjustmentPanelProps {
  onClose: () => void;
}

const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({ onClose }) => {
  const { canvas, adjustments, updateAdjustment, resetAdjustments } = useEditorStore();
  const activeObject = canvas?.getActiveObject();
  const isImage = activeObject instanceof fabric.Image;

  const adjustmentControls = [
    { icon: SunMedium, label: 'Brightness', min: -100, max: 100, value: adjustments.brightness },
    { icon: Contrast, label: 'Contrast', min: -100, max: 100, value: adjustments.contrast },
    { icon: Droplets, label: 'Saturation', min: -100, max: 100, value: adjustments.saturation },
    { icon: Palette, label: 'Hue', min: -180, max: 180, value: adjustments.hue },
    { icon: Sparkles, label: 'Exposure', min: -100, max: 100, value: adjustments.exposure },
    { icon: Mountain, label: 'Clarity', min: -100, max: 100, value: adjustments.clarity },
  ];

  if (!isImage) {
    return (
      <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Tools</span>
          </button>
        </div>
        <div className="text-center text-gray-600 mt-8">
          <p>Adjustments are only available for images.</p>
          <p className="mt-2">Please select an image to adjust.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg p-6 transform transition-transform duration-300">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Tools</span>
        </button>
      </div>

      <div className="space-y-6">
        {adjustmentControls.map((adjustment) => (
          <div key={adjustment.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <adjustment.icon className="w-5 h-5" />
                <span className="font-medium">{adjustment.label}</span>
              </div>
              <span className="text-sm text-gray-500">{adjustment.value}</span>
            </div>
            <input
              type="range"
              min={adjustment.min}
              max={adjustment.max}
              value={adjustment.value}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              onChange={(e) => updateAdjustment(adjustment.label.toLowerCase(), parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{adjustment.min}</span>
              <span>{adjustment.max}</span>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200">
          <button 
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            onClick={resetAdjustments}
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentPanel;