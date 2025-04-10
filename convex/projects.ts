import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new project
export const createProject = mutation({
  args: {
    name: v.string(),
    canvasSettings: v.optional(v.object({
      width: v.number(),
      height: v.number(),
      background: v.string(),
      grid: v.boolean(),
      gridSize: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Use hardcoded admin user ID for our simplified auth
    const userId = "admin";
    
    // Default canvas settings if not provided
    const defaultCanvasSettings = {
      width: 1920,
      height: 1080,
      background: "#f8f8f8",
      grid: true,
      gridSize: 20,
    };
    
    return await ctx.db.insert("projects", {
      name: args.name,
      ownerId: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      canvasSettings: args.canvasSettings || defaultCanvasSettings,
      nodes: [],
      edges: [],
      version: 1,
    });
  },
});

// Get a project by ID
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    
    if (!project) {
      throw new Error("Project not found");
    }
    
    return project;
  },
});

// Update a project
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    update: v.object({
      name: v.optional(v.string()),
      canvasSettings: v.optional(v.object({
        width: v.number(),
        height: v.number(),
        background: v.string(),
        grid: v.boolean(),
        gridSize: v.number(),
      })),
      nodes: v.optional(v.array(v.any())),
      edges: v.optional(v.array(v.any())),
    }),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    
    if (!project) {
      throw new Error("Project not found");
    }
    
    // Update project
    return await ctx.db.patch(args.projectId, {
      ...args.update,
      updatedAt: Date.now(),
      version: project.version + 1,
    });
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    
    if (!project) {
      throw new Error("Project not found");
    }
    
    await ctx.db.delete(args.projectId);
    return { success: true };
  },
});

// List all projects
export const listProjects = query({
  handler: async (ctx) => {
    const userId = "admin"; // Simplified for our basic auth
    
    return await ctx.db
      .query("projects")
      .filter(q => q.eq(q.field("ownerId"), userId))
      .order("desc")
      .collect();
  },
}); 