import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Generate upload URL
export const generateUploadUrl = mutation({
  args: {
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl({
      contentType: args.contentType,
    });
  },
});

// Create asset entry
export const createAsset = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = "admin"; // Simplified for our basic auth
    
    return await ctx.db.insert("assets", {
      ownerId: userId,
      name: args.name,
      type: args.type,
      storageId: args.storageId,
      createdAt: Date.now(),
    });
  },
});

// List assets
export const listAssets = query({
  args: {
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = "admin"; // Simplified for our basic auth
    
    let assetsQuery = ctx.db
      .query("assets")
      .filter(q => q.eq(q.field("ownerId"), userId));
    
    // Filter by type if provided
    if (args.type) {
      assetsQuery = assetsQuery.filter(q => 
        q.eq(q.field("type"), args.type)
      );
    }
    
    return await assetsQuery
      .order("desc", q => q.field("createdAt"))
      .collect();
  },
});

// Delete asset
export const deleteAsset = mutation({
  args: { assetId: v.id("assets") },
  handler: async (ctx, args) => {
    const asset = await ctx.db.get(args.assetId);
    
    if (!asset) {
      throw new Error("Asset not found");
    }
    
    // Delete from storage
    await ctx.storage.delete(asset.storageId);
    
    // Delete record
    await ctx.db.delete(args.assetId);
    
    return { success: true };
  },
}); 