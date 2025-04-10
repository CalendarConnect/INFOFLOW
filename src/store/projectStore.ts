import { create } from 'zustand';
import { Node } from 'reactflow';
import { NodeData } from './nodeStore';
import { Edge } from 'reactflow';
import { EdgeData } from './edgeStore';
import { CanvasSettings, useCanvasStore } from './canvasStore';
import { useNodeStore } from './nodeStore';
import { useEdgeStore } from './edgeStore';

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
    // Generate a unique ID for the project
    const id = `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Get the current canvas settings
    const canvasSettings = { ...useCanvasStore.getState().canvasSettings };
    
    // Create a new project
    const newProject: Project = {
      id,
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      canvasSettings,
      nodes: [],
      edges: [],
      version: 1,
    };
    
    set({
      currentProject: newProject,
      lastSavedAt: null,
      error: null,
    });
  },
  
  // Save the current project
  saveProject: async () => {
    set({ isSaving: true, error: null });
    
    try {
      const { currentProject } = get();
      if (!currentProject) {
        throw new Error('No project to save');
      }
      
      // Get current nodes and edges from their respective stores
      const nodes = useNodeStore.getState().nodes;
      const edges = useEdgeStore.getState().edges;
      const canvasSettings = useCanvasStore.getState().canvasSettings;
      
      // Create an updated project
      const updatedProject: Project = {
        ...currentProject,
        nodes,
        edges,
        canvasSettings,
        updatedAt: Date.now(),
      };
      
      // Save to local storage
      localStorage.setItem(`flowcanvas_project_${updatedProject.id}`, JSON.stringify(updatedProject));
      
      // Update the list of projects
      const projectList = JSON.parse(localStorage.getItem('flowcanvas_projects') || '[]');
      const existingIndex = projectList.findIndex((p: {id: string}) => p.id === updatedProject.id);
      
      if (existingIndex >= 0) {
        projectList[existingIndex] = {
          id: updatedProject.id,
          name: updatedProject.name,
          updatedAt: updatedProject.updatedAt,
        };
      } else {
        projectList.push({
          id: updatedProject.id,
          name: updatedProject.name,
          updatedAt: updatedProject.updatedAt,
        });
      }
      
      localStorage.setItem('flowcanvas_projects', JSON.stringify(projectList));
      
      // Add to recent projects
      const recentProjects = JSON.parse(localStorage.getItem('flowcanvas_recent_projects') || '[]');
      const recentIndex = recentProjects.indexOf(updatedProject.id);
      
      if (recentIndex >= 0) {
        recentProjects.splice(recentIndex, 1);
      }
      
      recentProjects.unshift(updatedProject.id);
      localStorage.setItem('flowcanvas_recent_projects', JSON.stringify(recentProjects.slice(0, 5)));
      
      set({
        currentProject: updatedProject,
        lastSavedAt: Date.now(),
        isSaving: false,
      });
    } catch (err) {
      console.error('Error saving project:', err);
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
      // Load from local storage
      const projectData = localStorage.getItem(`flowcanvas_project_${projectId}`);
      
      if (!projectData) {
        throw new Error('Project not found');
      }
      
      const loadedProject: Project = JSON.parse(projectData);
      
      // Update all stores with loaded data
      useNodeStore.getState().setNodes(loadedProject.nodes);
      useEdgeStore.getState().setEdges(loadedProject.edges);
      useCanvasStore.getState().updateCanvasSettings(loadedProject.canvasSettings);
      
      set({
        currentProject: loadedProject,
        isLoading: false,
        lastSavedAt: loadedProject.updatedAt,
      });
      
      // Update recent projects
      const recentProjects = JSON.parse(localStorage.getItem('flowcanvas_recent_projects') || '[]');
      const recentIndex = recentProjects.indexOf(projectId);
      
      if (recentIndex >= 0) {
        recentProjects.splice(recentIndex, 1);
      }
      
      recentProjects.unshift(projectId);
      localStorage.setItem('flowcanvas_recent_projects', JSON.stringify(recentProjects.slice(0, 5)));
    } catch (err) {
      console.error('Error loading project:', err);
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