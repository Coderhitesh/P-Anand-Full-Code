const cloudinary = require('cloudinary').v2;

cloudinary.config({
    api_key: "899193287131934",
    api_secret: "RN9ldy9uHfeWDTqWRPOX2-cvgMg",
    cloud_name: "dohzhn0ny"
});

const uploadPDF = async (file) => {
    try {
        const pdf = await cloudinary.uploader.upload(file,{
            folder:'artists'
        })
        return {pdf: pdf.secure_url, public_id: pdf.public_id}
    } catch (error) {
        console.error(error)
        throw new Error('Failed to upload PDF');
    }
}

const uploadImage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: "artists"
        });
        return { image: result.secure_url, public_id: result.public_id };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to upload Image');
    }
};

const uploadVideo = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: "artists",
            resource_type: "video"
        });
        return result.secure_url;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to upload video');
    }
};

const deleteImageFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log("Image Deleted");
    } catch (error) {
        console.error("Error deleting Image from Cloudinary", error);
        throw new Error('Failed to delete Image from Cloudinary');
    }
};

const deletePdfFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log('Image Deleted')
    } catch (error) {
        console.error('Error in deleting PDF from Cloudinary',error)
        throw new Error('Failed to delete Pdf fron the Cloudinary')
    }
}

module.exports = {
    uploadImage, uploadVideo, deleteImageFromCloudinary, uploadPDF, deletePdfFromCloudinary
};