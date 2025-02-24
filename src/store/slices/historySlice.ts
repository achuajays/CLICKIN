import { StateCreator } from 'zustand';
import { EditorState, ImageState } from '../../types/editor';

export interface HistorySlice {
  history: ImageState[];
  currentHistoryIndex: number;
  saveState: () => void;
  undo: () => void;
  redo: () => void;
}

export const createHistorySlice: StateCreator<EditorState, [], [], HistorySlice> = (set, get) => ({
  history: [],
  currentHistoryIndex: -1,

  saveState: () => {
    const { canvas, history, currentHistoryIndex } = get();
    if (!canvas) return;

    const newState: ImageState = {
      json: JSON.stringify(canvas.toJSON()),
      timestamp: Date.now(),
    };

    set({
      history: [...history.slice(0, currentHistoryIndex + 1), newState],
      currentHistoryIndex: currentHistoryIndex + 1,
    });
  },

  undo: () => {
    const { currentHistoryIndex, history, canvas } = get();
    if (currentHistoryIndex <= 0 || !canvas) return;

    const previousState = history[currentHistoryIndex - 1];
    canvas.loadFromJSON(JSON.parse(previousState.json), () => {
      canvas.renderAll();
      set({ currentHistoryIndex: currentHistoryIndex - 1 });
    });
  },

  redo: () => {
    const { currentHistoryIndex, history, canvas } = get();
    if (currentHistoryIndex >= history.length - 1 || !canvas) return;

    const nextState = history[currentHistoryIndex + 1];
    canvas.loadFromJSON(JSON.parse(nextState.json), () => {
      canvas.renderAll();
      set({ currentHistoryIndex: currentHistoryIndex + 1 });
    });
  },
});