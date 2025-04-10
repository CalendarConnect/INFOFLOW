import { create } from 'zustand';
import { Viewport } from 'reactflow';

export interface CanvasSettings {
  width: number;
  height: number;
  background: string;
  grid: boolean;
  gridSize: number;
  snapToGrid: boolean;
}

interface CanvasState {
  viewport: Viewport;
  canvasSettings: CanvasSettings;
  isPanelOpen: boolean;
  isGridVisible: boolean;
  isMinimapVisible: boolean;
  isAnimationActive: boolean;
  // Actions
  setViewport: (viewport: Viewport) => void;
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
  togglePanel: () => void;
  toggleGrid: () => void;
  toggleMinimap: () => void;
  toggleAnimation: () => void;
  resetView: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  viewport: { x: 0, y: 0, zoom: 1 },
  canvasSettings: {
    width: 1920,
    height: 1080,
    background: '#000000',
    grid: true,
    gridSize: 20,
    snapToGrid: true,
  },
  isPanelOpen: true,
  isGridVisible: true,
  isMinimapVisible: true,
  isAnimationActive: true,
  
  // Actions
  setViewport: (viewport) => set({ viewport }),
  
  updateCanvasSettings: (settings) =>
    set((state) => ({
      canvasSettings: { ...state.canvasSettings, ...settings },
    })),
  
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  
  toggleGrid: () => 
    set((state) => ({ 
      isGridVisible: !state.isGridVisible,
      canvasSettings: {
        ...state.canvasSettings,
        grid: !state.isGridVisible,
      }
    })),
  
  toggleMinimap: () => set((state) => ({ isMinimapVisible: !state.isMinimapVisible })),
  
  toggleAnimation: () => set((state) => ({ isAnimationActive: !state.isAnimationActive })),
  
  resetView: () => set({ viewport: { x: 0, y: 0, zoom: 1 } }),
})); 