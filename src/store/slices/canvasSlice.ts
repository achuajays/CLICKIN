import { StateCreator } from 'zustand';
import { fabric } from 'fabric';
import { EditorState } from '../../types/editor';

export interface CanvasSlice {
  canvas: fabric.Canvas | null;
  initCanvas: (canvas: fabric.Canvas) => void;
}

export const createCanvasSlice: StateCreator<EditorState, [], [], CanvasSlice> = (set, get) => ({
  canvas: null,
  initCanvas: (canvas: fabric.Canvas) => {
    // Ensure stickers stay on top and selectable
    canvas.preserveObjectStacking = true;

    // Handle object selection
    canvas.on('selection:created', (e) => {
      if (e.target instanceof fabric.Image) {
        // When selecting an image, bring all stickers to front
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if (obj instanceof fabric.Text && obj !== e.target) {
            obj.bringToFront();
          }
        });
        canvas.renderAll();
      }
    });

    // Handle object added
    canvas.on('object:added', (e) => {
      if (e.target instanceof fabric.Text) {
        // Ensure new stickers are always on top
        e.target.bringToFront();
      }
    });

    canvas.on('object:modified', () => {
      const state = get();
      state.saveState();
    });

    set({ canvas });
  },
});