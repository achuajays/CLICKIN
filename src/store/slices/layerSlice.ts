import { StateCreator } from 'zustand';
import { EditorState, Layer } from '../../types/editor';

export interface LayerSlice {
  layers: Layer[];
  addLayer: (layer: Layer) => void;
  removeLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
}

export const createLayerSlice: StateCreator<EditorState, [], [], LayerSlice> = (set, get) => ({
  layers: [],

  addLayer: (layer: Layer) => {
    set(state => ({
      layers: [...state.layers, layer],
    }));
  },

  removeLayer: (layerId: string) => {
    set(state => ({
      layers: state.layers.filter(layer => layer.id !== layerId),
    }));
  },

  toggleLayerVisibility: (layerId: string) => {
    set(state => ({
      layers: state.layers.map(layer =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      ),
    }));
  },
});