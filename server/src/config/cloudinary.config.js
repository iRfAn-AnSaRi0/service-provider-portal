import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
    api_secret: process.env.CLOUDINARY_CLOUD_APISECRET,
});

const uploadFile = (buffer, folderName) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                resource_type: "image",
                transformation: [
                    { width: 1200, crop: "limit" },
                    {
                        quality: "auto",
                        fetch_format: "auto",
                    },
                ],
            },
            (error, result) => {
                if (error) {
                    console.error(
                        "Cloudinary upload error:",
                        error
                    );
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(buffer);
    });
};

const deleteFile = async (publicId) => {
    try {
        if (!publicId) return null;

        const response =
            await cloudinary.uploader.destroy(publicId);

        return response;

    } catch (error) {
        console.error(
            "Cloudinary delete error:",
            error
        );

        return null;
    }
};

export { uploadFile, deleteFile };