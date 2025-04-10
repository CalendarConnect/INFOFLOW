// Replaced Convex implementation with local storage

export function useProjects() {
  // Get all projects from local storage
  const getProjects = () => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('flowcanvas_projects') || '[]');
  };
  
  // Create a new project
  const createProject = (name: string) => {
    if (typeof window === 'undefined') return null;
    
    const id = `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const project = {
      id,
      name,
      updatedAt: Date.now(),
    };
    
    const projects = getProjects();
    projects.push(project);
    localStorage.setItem('flowcanvas_projects', JSON.stringify(projects));
    
    return id;
  };
  
  // Get a project by ID
  const getProject = (id: string) => {
    if (typeof window === 'undefined') return null;
    
    const projectData = localStorage.getItem(`flowcanvas_project_${id}`);
    return projectData ? JSON.parse(projectData) : null;
  };
  
  // Delete a project
  const deleteProject = (id: string) => {
    if (typeof window === 'undefined') return;
    
    // Remove from projects list
    const projects = getProjects();
    const index = projects.findIndex((p: {id: string}) => p.id === id);
    
    if (index >= 0) {
      projects.splice(index, 1);
      localStorage.setItem('flowcanvas_projects', JSON.stringify(projects));
    }
    
    // Remove project data
    localStorage.removeItem(`flowcanvas_project_${id}`);
    
    // Update recent projects
    const recentProjects = JSON.parse(localStorage.getItem('flowcanvas_recent_projects') || '[]');
    const recentIndex = recentProjects.indexOf(id);
    
    if (recentIndex >= 0) {
      recentProjects.splice(recentIndex, 1);
      localStorage.setItem('flowcanvas_recent_projects', JSON.stringify(recentProjects));
    }
  };
  
  return {
    projects: getProjects(),
    createProject,
    getProject,
    deleteProject,
    isLoading: false,
  };
} 