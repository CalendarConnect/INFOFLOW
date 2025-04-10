import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useProjects() {
  // Get all projects
  const projects = useQuery(api.projects.listProjects);
  
  // Create a project
  const createProject = useMutation(api.projects.createProject);
  
  // Update a project
  const updateProject = useMutation(api.projects.updateProject);
  
  // Delete a project
  const deleteProject = useMutation(api.projects.deleteProject);
  
  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
  };
} 