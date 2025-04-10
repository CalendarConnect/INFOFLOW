import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get user settings
export const getUserSettings = query({
  handler: async (ctx) => {
    const userId = "admin"; // Simplified for our basic auth
    
    // Get existing settings or create default
    const existingSettings = await ctx.db
      .query("userSettings")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    
    if (existingSettings) {
      return existingSettings;
    }
    
    // Create default settings
    const defaultSettings = {
      userId,
      theme: "system",
      defaultCanvasSettings: {
        width: 1920,
        height: 1080,
        background: "#f8f8f8",
        grid: true,
        gridSize: 20,
      },
      recentProjects: [],
    };
    
    // Fix: Create a new query function to create the settings if none exist
    // Since insert is not allowed in a query function, we should handle this differently
    // For now, just return the default settings without persisting
    return defaultSettings;
  },
});

// Update user settings
export const updateUserSettings = mutation({
  args: {
    theme: v.optional(v.string()),
    defaultCanvasSettings: v.optional(v.object({
      width: v.number(),
      height: v.number(),
      background: v.string(),
      grid: v.boolean(),
      gridSize: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = "admin"; // Simplified for our basic auth
    
    // Get existing settings
    const existingSettings = await ctx.db
      .query("userSettings")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    
    if (existingSettings) {
      // Update existing settings
      return await ctx.db.patch(existingSettings._id, {
        ...args,
      });
    }
    
    // Create new settings
    const defaultSettings = {
      userId,
      theme: args.theme || "system",
      defaultCanvasSettings: args.defaultCanvasSettings || {
        width: 1920,
        height: 1080,
        background: "#f8f8f8",
        grid: true,
        gridSize: 20,
      },
      recentProjects: [],
    };
    
    return await ctx.db.insert("userSettings", defaultSettings);
  },
});

// Add project to recent list
export const addRecentProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = "admin"; // Simplified for our basic auth
    
    // Get existing settings
    const existingSettings = await ctx.db
      .query("userSettings")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    
    if (!existingSettings) {
      // Create new settings with this project as recent
      return await ctx.db.insert("userSettings", {
        userId,
        theme: "system",
        defaultCanvasSettings: {
          width: 1920,
          height: 1080,
          background: "#f8f8f8",
          grid: true,
          gridSize: 20,
        },
        recentProjects: [args.projectId],
      });
    }
    
    // Add to recent projects (remove if exists, then add to front)
    const recentProjects = existingSettings.recentProjects.filter(
      id => id !== args.projectId
    );
    
    // Add to front and limit to 10 projects
    recentProjects.unshift(args.projectId);
    if (recentProjects.length > 10) {
      recentProjects.pop();
    }
    
    // Update settings
    return await ctx.db.patch(existingSettings._id, {
      recentProjects,
    });
  },
}); 