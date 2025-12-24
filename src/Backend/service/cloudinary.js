import cloudinary from "../config/cloudinary.js";

export const destroyCloudData = async (publicId) => {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok' && result.result !== 'not found') {
        console.error(`Cloudinary deletion failed for ${publicId}:`, result);
        return false;
    }
        
    console.log(`Cloudinary file deleted successfully: ${publicId}`);
    return true;
}