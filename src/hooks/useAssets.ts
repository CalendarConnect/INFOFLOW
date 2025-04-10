import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAssets() {
  // These hooks are called directly inside the hook function
  const allAssets = useQuery(api.assets.listAssets, { type: undefined });
  const generateUploadUrl = useMutation(api.assets.generateUploadUrl);
  const createAsset = useMutation(api.assets.createAsset);
  const deleteAsset = useMutation(api.assets.deleteAsset);
  
  // Return the query results and a function to filter assets
  return {
    assets: allAssets,
    filterAssetsByType: (type: string) => allAssets?.filter(asset => asset.type === type) || [],
    generateUploadUrl,
    createAsset,
    deleteAsset
  };
} 