// Simple storage utility - for now just return the path as-is
// In a real implementation, this would create signed URLs for cloud storage

export async function createSignedUrl(imagePath: string): Promise<string> {
  // For now, just return the path as-is
  // In production, this would generate a signed URL for cloud storage (AWS S3, etc.)
  return imagePath
}