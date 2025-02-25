import React, { useEffect, useState } from 'react';
import { X, Crop, Check } from 'lucide-react';
import useEditorStore from '../store/editorStore';

interface CropPanelProps {
  onClose: () => void;
}

const CropPanel: React.FC<CropPanelProps> = ({ onClose }) => {
  const { canvas } = useEditorStore();
  const [isCropping, setIsCropping] = useState(false);
  const [originalState, setOriginalState] = useState<any>(null);

  useEffect(() => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject instanceof fabric.Image)) return;

    // Store original state
    setOriginalState({
      width: activeObject.width,
      height: activeObject.height,
      scaleX: activeObject.scaleX,
      scaleY: activeObject.scaleY,
      left: activeObject.left,
      top: activeObject.top,
      cropX: activeObject.cropX || 0,
      cropY: activeObject.cropY || 0
    });
  }, [canvas]);

  const startCropping = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject instanceof fabric.Image)) return;

    // Create crop rectangle
    const rect = new fabric.Rect({
      left: activeObject.left,
      top: activeObject.top,
      width: activeObject.width! * activeObject.scaleX!,
      height: activeObject.height! * activeObject.scaleY!,
      fill: 'rgba(0,0,0,0.3)',
      stroke: '#fff',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: true,
      hasControls: true
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    setIsCropping(true);
  };

  const applyCrop = () => {
    if (!canvas || !originalState) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const image = canvas.getObjects().find(obj => obj instanceof fabric.Image) as fabric.Image;
    if (!image) return;

    // Calculate crop coordinates
    const cropRect = activeObject as fabric.Rect;
    const scale = image.scaleX || 1;
    
    const cropX = Math.round((cropRect.left! - image.left!) / scale);
    const cropY = Math.round((cropRect.top! - image.top!) / scale);
    const cropWidth = Math.round(cropRect.width! / scale);
    const cropHeight = Math.round(cropRect.height! / scale);

    // Apply crop to image
    image.set({
      cropX: cropX,
      cropY: cropY,
      width: cropWidth,
      height: cropHeight
    });

    // Remove crop rectangle
    canvas.remove(activeObject);
    canvas.setActiveObject(image);
    canvas.renderAll();
    setIsCropping(false);
    onClose();
  };

  const cancelCrop = () => {
    if (!canvas || !originalState) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // Remove crop rectangle if exists
    if (activeObject instanceof fabric.Rect) {
      canvas.remove(activeObject);
    }

    // Restore original image state
    const image = canvas.getObjects().find(obj => obj instanceof fabric.Image) as fabric.Image;
    if (image) {
      image.set(originalState);
      canvas.setActiveObject(image);
    }

    canvas.renderAll();
    setIsCropping(false);
    onClose();
  };

  // Handle panel close
  const handleClose = () => {
    if (isCropping) {
      cancelCrop();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Crop className="w-5 h-5" />
          Crop Image
        </h2>
        <button 
          onClick={handleClose}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {!isCropping ? (
          <button
            onClick={startCropping}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Crop className="w-5 h-5" />
            Start Cropping
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Drag the handles to adjust the crop area
            </p>
            <div className="flex gap-2">
              <button
                onClick={applyCrop}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Apply
              </button>
              <button
                onClick={cancelCrop}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPanel;