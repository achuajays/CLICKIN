import { StateCreator } from 'zustand';
import { fabric } from 'fabric';
import { EditorState } from '../../types/editor';

export interface AdjustmentSlice {
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    exposure: number;
    clarity: number;
  };
  updateAdjustment: (type: string, value: number) => void;
  resetAdjustments: () => void;
}

export const createAdjustmentSlice: StateCreator<EditorState, [], [], AdjustmentSlice> = (set, get) => ({
  adjustments: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    exposure: 0,
    clarity: 0,
  },

  updateAdjustment: (type: string, value: number) => {
    const { canvas } = get();
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject instanceof fabric.Image)) return;

    if (!activeObject.getElement()) return;

    set((state) => ({
      adjustments: {
        ...state.adjustments,
        [type.toLowerCase()]: value,
      },
    }));

    const adjustments = get().adjustments;
    activeObject.filters = [];

    if (adjustments.brightness !== 0) {
      activeObject.filters.push(new fabric.Image.filters.Brightness({
        brightness: adjustments.brightness / 100
      }));
    }

    if (adjustments.contrast !== 0) {
      activeObject.filters.push(new fabric.Image.filters.Contrast({
        contrast: adjustments.contrast / 100
      }));
    }

    if (adjustments.saturation !== 0) {
      activeObject.filters.push(new fabric.Image.filters.Saturation({
        saturation: 1 + (adjustments.saturation / 100)
      }));
    }

    if (adjustments.hue !== 0) {
      activeObject.filters.push(new fabric.Image.filters.HueRotation({
        rotation: adjustments.hue / 360
      }));
    }

    if (adjustments.exposure !== 0) {
      activeObject.filters.push(new fabric.Image.filters.Gamma({
        gamma: [
          1 + (adjustments.exposure / 100),
          1 + (adjustments.exposure / 100),
          1 + (adjustments.exposure / 100)
        ]
      }));
    }

    if (adjustments.clarity !== 0) {
      activeObject.filters.push(new fabric.Image.filters.Convolute({
        matrix: [
          0, -1, 0,
          -1, 5, -1,
          0, -1, 0
        ]
      }));
    }

    try {
      activeObject.applyFilters();
      canvas.renderAll();
      get().saveState();
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  },

  resetAdjustments: () => {
    const { canvas } = get();
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject instanceof fabric.Image)) return;

    if (!activeObject.getElement()) return;

    set(() => ({
      adjustments: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hue: 0,
        exposure: 0,
        clarity: 0,
      },
    }));

    activeObject.filters = [];
    activeObject.applyFilters();
    canvas.renderAll();
    get().saveState();
  },
});