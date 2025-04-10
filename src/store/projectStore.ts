import { create } from 'zustand';
import { Edge, Node } from 'reactflow';
import { NodeData } from './nodeStore';
import { EdgeData } from './edgeStore';
import { CanvasSettings } from './canvasStore';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../../convex/_generated/api';
import { useNodeStore } from './nodeStore';
import { useEdgeStore } from './edgeStore';
import { useCanvasStore } from './canvasStore';

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  canvasSettings: CanvasSettings;
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  version: number;
}

interface ProjectState {
  currentProject: Project | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
  error: string | null;
  // Actions
  createNewProject: (name: string, description?: string) => void;
  saveProject: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  updateProjectMetadata: (data: { name?: string; description?: string }) => void;
  setError: (error: string | null) => void;
}

// Initial canvas settings
const defaultCanvasSettings: CanvasSettings = {
  width: 1920,
  height: 1080,
  background: '#f8f8f8',
  grid: true,
  gridSize: 20,
  snapToGrid: false,
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: null,
  isLoading: false,
  isSaving: false,
  lastSavedAt: null,
  error: null,
  
  // Create a new project
  createNewProject: (name, description = '') => {
    // Create a new project with default values
    const newProject: Project = {
      id: uuidv4(), // Temporary ID until saved to Convex
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      canvasSettings: defaultCanvasSettings,
      nodes: [],
      edges: [],
      version: 1,
    };
    
    set({
      currentProject: newProject,
      lastSavedAt: null,
      error: null,
    });
    
    // Initialize stores with empty data
    useNodeStore.getState().setNodes([]);
    useEdgeStore.getState().setEdges([]);
    useCanvasStore.getState().updateCanvasSettings(defaultCanvasSettings);
  },
  
  // Save the current project
  saveProject: async () => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    set({ isSaving: true, error: null });
    
    try {
      // Get current state from stores
      const nodes = useNodeStore.getState().nodes;
      const edges = useEdgeStore.getState().edges;
      const canvasSettings = useCanvasStore.getState().canvasSettings;
      
      // Update project with current data
      const updatedProject: Project = {
        ...currentProject,
        updatedAt: Date.now(),
        canvasSettings,
        nodes,
        edges,
        version: currentProject.version + 1,
      };
      
      // TODO: Save to Convex
      // const projectId = await convex.saveProject(updatedProject);
      
      set({
        currentProject: updatedProject,
        lastSavedAt: Date.now(),
        isSaving: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to save project',
        isSaving: false,
      });
    }
  },
  
  // Load a project by ID
  loadProject: async (projectId) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Load from Convex
      // const project = await convex.getProject(projectId);
      
      // For now, simulate with a dummy project
      const dummyProject: Project = {
        id: projectId,
        name: 'Sample Project',
        description: 'A sample project to demonstrate loading',
        createdAt: Date.now() - 86400000, // 1 day ago
        updatedAt: Date.now() - 3600000, // 1 hour ago
        canvasSettings: defaultCanvasSettings,
        nodes: [],
        edges: [],
        version: 1,
      };
      
      // Update all stores with loaded data
      useNodeStore.getState().setNodes(dummyProject.nodes);
      useEdgeStore.getState().setEdges(dummyProject.edges);
      useCanvasStore.getState().updateCanvasSettings(dummyProject.canvasSettings);
      
      set({
        currentProject: dummyProject,
        isLoading: false,
        lastSavedAt: dummyProject.updatedAt,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to load project',
        isLoading: false,
      });
    }
  },
  
  // Update project metadata
  updateProjectMetadata: (data) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    set({
      currentProject: {
        ...currentProject,
        ...data,
        updatedAt: Date.now(),
      },
    });
  },
  
  // Set error message
  setError: (error) => set({ error }),
})); 