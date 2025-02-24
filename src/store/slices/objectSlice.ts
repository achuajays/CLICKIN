import { StateCreator } from 'zustand';
import { fabric } from 'fabric';
import { EditorState } from '../../types/editor';

export interface ObjectSlice {
  addImage: (url: string) => void;
  addText: () => void;
  addSticker: (emoji: string) => void;
  exportImage: () => void;
  removeActiveObject: () => void;
}

export const createObjectSlice: StateCreator<EditorState, [], [], ObjectSlice> = (set, get) => ({
  addImage: (url: string) => {
    const { canvas } = get();
    if (!canvas) return;

    fabric.Image.fromURL(url, (img) => {
      const canvasWidth = canvas.width ?? 800;
      const canvasHeight = canvas.height ?? 600;
      const scale = Math.min(
        (canvasWidth * 0.8) / img.width!,
        (canvasHeight * 0.8) / img.height!
      );

      img.scale(scale);
      img.set({
        left: (canvasWidth - img.width! * scale) / 2,
        top: (canvasHeight - img.height! * scale) / 2,
        selectable: true,
        hasControls: true,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      // Send image to back to ensure stickers stay on top
      img.sendToBack();

      get().addLayer({
        id: Date.now().toString(),
        type: 'image',
        name: 'Image Layer',
        visible: true,
        object: img,
      });

      get().saveState();
    });
  },

  addText: () => {
    const { canvas } = get();
    if (!canvas) return;

    const text = new fabric.IText('Double click to edit', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontSize: 40,
      fill: '#000000',
      fontFamily: 'Arial',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    get().addLayer({
      id: Date.now().toString(),
      type: 'text',
      name: 'Text Layer',
      visible: true,
      object: text,
    });

    get().saveState();
  },

  addSticker: (emoji: string) => {
    const { canvas } = get();
    if (!canvas) return;

    const text = new fabric.Text(emoji, {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontSize: 60,
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    
    // Ensure sticker stays on top
    text.bringToFront();
    
    canvas.renderAll();

    get().addLayer({
      id: Date.now().toString(),
      type: 'sticker',
      name: 'Sticker Layer',
      visible: true,
      object: text,
    });

    get().saveState();
  },

  removeActiveObject: () => {
    const { canvas } = get();
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // If the active object is an image, remove all objects from canvas
    if (activeObject instanceof fabric.Image) {
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        canvas.remove(obj);
        // Remove the layer associated with this object
        const layerId = get().layers.find(layer => layer.object === obj)?.id;
        if (layerId) {
          get().removeLayer(layerId);
        }
      });
    } else {
      // If not an image, just remove the active object
      canvas.remove(activeObject);
      // Remove the layer associated with this object
      const layerId = get().layers.find(layer => layer.object === activeObject)?.id;
      if (layerId) {
        get().removeLayer(layerId);
      }
    }

    canvas.renderAll();
    get().saveState();
  },

  exportImage: () => {
    const { canvas } = get();
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length === 0) return;

    const mainImage = objects.find(obj => obj instanceof fabric.Image);
    if (!mainImage) return;

    const originalStates = objects.map(obj => ({
      object: obj,
      left: obj.left,
      top: obj.top,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
      originX: obj.originX,
      originY: obj.originY
    }));

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

    const dataUrl = tempFabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    originalStates.forEach(state => {
      state.object.set({
        left: state.left,
        top: state.top,
        scaleX: state.scaleX,
        scaleY: state.scaleY,
        originX: state.originX,
        originY: state.originY
      });
    });
    canvas.renderAll();

    tempFabricCanvas.dispose();

    const link = document.createElement('a');
    link.download = `clickin-export-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
});