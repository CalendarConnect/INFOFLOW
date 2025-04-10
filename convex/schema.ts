import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    ownerId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    canvasSettings: v.object({
      width: v.number(),
      height: v.number(),
      background: v.string(),
      grid: v.boolean(),
      gridSize: v.number(),
    }),
    nodes: v.array(v.any()),
    edges: v.array(v.any()),
    version: v.number(),
  }).index("by_owner", ["ownerId"]),
  
  assets: defineTable({
    name: v.string(),
    ownerId: v.string(),
    type: v.string(), // 'icon' | 'image' | 'font'
    storageId: v.string(), // reference to storage
    createdAt: v.number(), // timestamp
  })
  .index("by_owner", ["ownerId"])
  .index("by_type", ["type"]),
  
  userSettings: defineTable({
    userId: v.string(),
    theme: v.string(), // 'light' | 'dark' | 'system'
    defaultCanvasSettings: v.object({
      width: v.number(),
      height: v.number(),
      background: v.string(),
      grid: v.boolean(),
      gridSize: v.number(),
    }),
    recentProjects: v.array(v.string()),
  }).index("by_user", ["userId"]),
}); 