import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Define types that align with what the frontend expects to send
export interface CreateProjectRequest {
  name: string;
  canvasSettings?: {
    width: number;
    height: number;
    background: string;
    grid: boolean;
    gridSize: number;
    snapToGrid?: boolean; // This is not stored in Convex
  };
}

export interface UpdateProjectRequest {
  projectId: Id<"projects">;
  update: {
    name?: string;
    nodes?: unknown[];
    edges?: unknown[];
    canvasSettings?: {
      width?: number;
      height?: number;
      background?: string;
      grid?: boolean;
      gridSize?: number;
      snapToGrid?: boolean; // This is not stored in Convex
    };
  };
}

export interface DeleteProjectRequest {
  projectId: Id<"projects">;
}

export function useProjects() {
  // Get all projects
  const projects = useQuery(api.projects.listProjects);
  
  // Create a project
  const createProjectMutation = useMutation(api.projects.createProject);
  
  const createProject = async (args: CreateProjectRequest) => {
    // Prepare args for Convex by removing unsupported fields
    const convexArgs: {
      name: string;
      canvasSettings?: Omit<NonNullable<CreateProjectRequest['canvasSettings']>, 'snapToGrid'>;
    } = {
      name: args.name,
    };
    
    // If canvasSettings exists, filter out the snapToGrid property
    if (args.canvasSettings) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { snapToGrid, ...validCanvasSettings } = args.canvasSettings;
      
      // Add filtered canvasSettings to the convex args
      Object.assign(convexArgs, { canvasSettings: validCanvasSettings });
    }
    
    console.log('Creating project in Convex with args:', convexArgs);
    
    // Call the Convex mutation and return the result
    const projectId = await createProjectMutation(convexArgs);
    console.log('Convex returned project ID:', projectId);
    
    return projectId;
  };
  
  // Update a project
  const updateProjectMutation = useMutation(api.projects.updateProject);
  
  const updateProject = async (args: UpdateProjectRequest) => {
    const convexArgs: {
      projectId: Id<"projects">;
      update: Omit<UpdateProjectRequest['update'], 'canvasSettings'> & {
        canvasSettings?: Omit<NonNullable<UpdateProjectRequest['update']['canvasSettings']>, 'snapToGrid'>;
      };
    } = {
      projectId: args.projectId,
      update: { ...args.update }
    };
    
    // If canvasSettings exists in the update, filter out the snapToGrid property
    if (convexArgs.update.canvasSettings) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { snapToGrid, ...validCanvasSettings } = convexArgs.update.canvasSettings;
      convexArgs.update.canvasSettings = validCanvasSettings;
    }
    
    return await updateProjectMutation(convexArgs);
  };
  
  // Delete a project
  const deleteProjectMutation = useMutation(api.projects.deleteProject);
  
  const deleteProject = async (args: DeleteProjectRequest) => {
    return await deleteProjectMutation(args);
  };
  
  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
  };
} 