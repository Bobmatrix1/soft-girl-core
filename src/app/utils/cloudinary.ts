// Cloudinary configuration and upload utility

// Cloudinary configuration - Using provided credentials
export const cloudinaryConfig = {
  cloudName: "drmrb4tae",
  uploadPreset: "softgirl_products", // Unsigned upload preset
  apiKey: "YOUR_API_KEY",
  apiSecret: "YOUR_API_SECRET"
};

/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`,
      { 
        method: 'POST', 
        body: formData 
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Fallback to local preview URL if upload fails (for testing UI)
    return URL.createObjectURL(file);
  }
};