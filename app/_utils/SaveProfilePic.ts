"use server";
import { v2 } from "cloudinary"
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const saveImage = async (filePath: string, folder_name: string) => {

    return await v2.uploader.upload(filePath, { folder: folder_name, fetch_format: 'auto' },)
        .then(result => {
            return result.secure_url;
        })
        .catch(error => console.error(error));
    return ""
}