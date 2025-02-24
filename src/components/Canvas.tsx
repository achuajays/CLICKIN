import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import useEditorStore from '../store/editorStore';
import ImageUpload from './ImageUpload';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initCanvas = useEditorStore(state => state.initCanvas);
  const layers = useEditorStore(state => state.layers);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    initCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [initCanvas]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
      <canvas ref={canvasRef} className="shadow-lg" />
      {layers.length === 0 && <ImageUpload />}
    </div>
  );
};

export default Canvas;