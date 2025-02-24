import { fabric } from 'fabric';
import { CanvasSlice } from '../store/slices/canvasSlice';
import { HistorySlice } from '../store/slices/historySlice';
import { LayerSlice } from '../store/slices/layerSlice';
import { ObjectSlice } from '../store/slices/objectSlice';
import { AdjustmentSlice } from '../store/slices/adjustmentSlice';

export interface EditorState extends 
  CanvasSlice,
  HistorySlice,
  LayerSlice,
  ObjectSlice,
  AdjustmentSlice {
  filters: Filter[];
}

export interface ImageState {
  json: string;
  timestamp: number;
}

export interface Filter {
  id: string;
  name: string;
  type: 'preset' | 'adjustment';
  apply: (canvas: fabric.Canvas) => void;
}

export interface Layer {
  id: string;
  type: 'image' | 'text' | 'sticker';
  name: string;
  visible: boolean;
  object: fabric.Object;
}