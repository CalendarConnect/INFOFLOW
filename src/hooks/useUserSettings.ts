import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useUserSettings() {
  // Get user settings
  const settings = useQuery(api.userSettings.getUserSettings);
  
  // Update user settings
  const updateSettings = useMutation(api.userSettings.updateUserSettings);
  
  // Add a project to recent list
  const addRecentProject = useMutation(api.userSettings.addRecentProject);
  
  return {
    settings,
    updateSettings,
    addRecentProject
  };
} 