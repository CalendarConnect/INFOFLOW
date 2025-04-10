import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAssets() {
  // List all assets or filter by type
  const listAssets = (type?: string) => useQuery(api.assets.listAssets, { type });
  
  // Generate upload URL
  const generateUploadUrl = useMutation(api.assets.generateUploadUrl);
  
  // Create a new asset
  const createAsset = useMutation(api.assets.createAsset);
  
  // Delete an asset
  const deleteAsset = useMutation(api.assets.deleteAsset);
  
  return {
    listAssets,
    generateUploadUrl,
    createAsset,
    deleteAsset
  };
} 