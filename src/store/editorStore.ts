import { create } from 'zustand';
import { EditorState } from '../types/editor';
import { createCanvasSlice } from './slices/canvasSlice';
import { createHistorySlice } from './slices/historySlice';
import { createLayerSlice } from './slices/layerSlice';
import { createObjectSlice } from './slices/objectSlice';
import { createAdjustmentSlice } from './slices/adjustmentSlice';

const useEditorStore = create<EditorState>((set, get) => ({
  ...createCanvasSlice(set, get),
  ...createHistorySlice(set, get),
  ...createLayerSlice(set, get),
  ...createObjectSlice(set, get),
  ...createAdjustmentSlice(set, get),
  filters: [],
}));

export default useEditorStore;