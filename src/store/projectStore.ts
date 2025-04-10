import { create } from 'zustand';
import { Edge, Node } from 'reactflow';
import { NodeData } from './nodeStore';
import { EdgeData } from './edgeStore';
import { CanvasSettings } from './canvasStore';
import { v4 as uuidv4 } from 'uuid';
import { Id } from '../../convex/_generated/dataModel';
import { useNodeStore } from './nodeStore';
import { useEdgeStore } from './edgeStore';
import { useCanvasStore } from './canvasStore';
import { api } from '../../convex/_generated/api';

// Import ConvexClient type
import type { ConvexReactClient } from 'convex/react';

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
  saveProject: (convexClient: ConvexReactClient) => Promise<void>;
  loadProject: (projectId: string, convexClient: ConvexReactClient) => Promise<void>;
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
  saveProject: async (convexClient) => {
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
      
      let projectId;
      
      // Check if this is a Convex ID
      // Convex IDs are in the format "tableName:base64string"
      const isConvexId = typeof currentProject.id === 'string' && 
                        currentProject.id.includes(':') && 
                        currentProject.id.startsWith('projects:');
      
      console.log('Project ID:', currentProject.id, 'Is Convex ID:', isConvexId);
      
      if (!isConvexId) {
        // It's a new project, create it in Convex
        console.log('Creating new project:', updatedProject.name);
        
        // Filter out snapToGrid from canvasSettings for Convex compatibility
        const { snapToGrid, ...convexCanvasSettings } = updatedProject.canvasSettings;
        
        projectId = await convexClient.mutation(api.projects.createProject, {
          name: updatedProject.name,
          canvasSettings: convexCanvasSettings,
        });
        
        console.log('Created new project with ID:', projectId);
        
        // Update the project with the Convex ID
        updatedProject.id = projectId;
      } else {
        // It's an existing project, update it
        console.log('Updating existing project:', currentProject.id);
        
        // Filter out snapToGrid from canvasSettings for Convex compatibility
        const { snapToGrid, ...convexCanvasSettings } = updatedProject.canvasSettings;
        
        await convexClient.mutation(api.projects.updateProject, {
          projectId: currentProject.id as unknown as Id<'projects'>,
          update: {
            name: updatedProject.name,
            canvasSettings: convexCanvasSettings,
            nodes: updatedProject.nodes,
            edges: updatedProject.edges,
          },
        });
        
        console.log('Updated project successfully');
        
        projectId = currentProject.id;
      }
      
      // Add to recent projects
      await convexClient.mutation(api.userSettings.addRecentProject, { 
        projectId: projectId as unknown as Id<'projects'> 
      });
      
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
  loadProject: async (projectId, convexClient) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Loading project with ID:', projectId);
      
      // Check if the ID is already in Convex format
      const isConvexId = typeof projectId === 'string' && 
                         projectId.includes(':') && 
                         projectId.startsWith('projects:');
                         
      console.log('Is projectId already a Convex ID?', isConvexId);
      
      // Convert to Convex ID if needed
      const convexProjectId = isConvexId 
        ? projectId as unknown as Id<'projects'>
        : projectId as unknown as Id<'projects'>;
      
      console.log('Using Convex Project ID:', convexProjectId);
        
      const getProject = await convexClient.query(api.projects.getProject, { 
        projectId: convexProjectId
      });
      
      if (!getProject) {
        throw new Error('Project not found');
      }
      
      console.log('Retrieved project:', getProject);
      console.log('Project _id:', getProject._id);
      
      // Convert Convex project to our Project format
      // Add any missing fields required by our local model
      const loadedProject: Project = {
        // IMPORTANT: Use the _id from the retrieved project to ensure 
        // we have the proper Convex ID format
        id: getProject._id,
        name: getProject.name,
        description: '', // Provide default empty string for description
        createdAt: getProject.createdAt,
        updatedAt: getProject.updatedAt,
        // Add snapToGrid property to canvasSettings if it's missing
        canvasSettings: {
          ...getProject.canvasSettings,
          snapToGrid: false, // Default to false if not present
        },
        nodes: getProject.nodes || [],
        edges: getProject.edges || [],
        version: getProject.version,
      };
      
      console.log('Loaded project with ID:', loadedProject.id);
      
      // Update all stores with loaded data
      useNodeStore.getState().setNodes(loadedProject.nodes);
      useEdgeStore.getState().setEdges(loadedProject.edges);
      useCanvasStore.getState().updateCanvasSettings(loadedProject.canvasSettings);
      
      set({
        currentProject: loadedProject,
        isLoading: false,
        lastSavedAt: loadedProject.updatedAt,
      });
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