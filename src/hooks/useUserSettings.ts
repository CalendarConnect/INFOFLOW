// Replaced Convex implementation with local storage

export function useUserSettings() {
  // Get recent projects from local storage
  const getRecentProjects = () => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('flowcanvas_recent_projects') || '[]');
  };
  
  // Add a project to recent projects
  const addRecentProject = (projectId: string) => {
    if (typeof window === 'undefined') return;
    
    const recentProjects = JSON.parse(localStorage.getItem('flowcanvas_recent_projects') || '[]');
    const index = recentProjects.indexOf(projectId);
    
    // Remove if exists
    if (index >= 0) {
      recentProjects.splice(index, 1);
    }
    
    // Add to beginning
    recentProjects.unshift(projectId);
    
    // Keep only the most recent 5
    localStorage.setItem('flowcanvas_recent_projects', JSON.stringify(recentProjects.slice(0, 5)));
  };
  
  return {
    recentProjects: getRecentProjects(),
    addRecentProject,
    isLoading: false,
  };
} 