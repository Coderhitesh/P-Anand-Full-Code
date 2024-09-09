const { uploadImage, deleteImageFromCloudinary } = require("../utils/Cloudnary");
const Bundle = require('../Models/Bundles.Model')
const fs = require("fs")

exports.createBundle = async (req, res) => {
    try {
        console.log(req.body)
        const {
            bundleName,
            bundleStartingPrice,
            bundleEndingPrice,
            categoryId,
            bundleCourseId,
            tag,
            bundleDescription,
            bundleMode,
            feature
        } = req.body;

        

        // Parse the bundleMode field if it's passed as a string (e.g., from a form)
        const mode = JSON.parse(bundleMode);
        const bundleCourseIds = JSON.parse(bundleCourseId)
        // console.log(mode)


        const emptyField = [];
        let formattedBundleCourseId = [];

        // Validation
        if (!bundleName) emptyField.push('Bundle Name');
        if (!bundleStartingPrice) emptyField.push('Bundle Starting Price');
        if (!bundleEndingPrice) emptyField.push('Bundle Ending Price');
        if (!categoryId) emptyField.push('Category ID');
        if (!tag) emptyField.push('Tag');
        if (!bundleDescription) emptyField.push('Bundle Description');
        if (!mode || mode.length === 0) emptyField.push('Bundle Mode');
        if (!bundleCourseIds || bundleCourseIds.length === 0) emptyField.push('Bundle Course ID');

        if (emptyField.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        // Format the bundleCourseId to match schema requirements
        if (bundleCourseIds) {
            if (typeof bundleCourseIds === 'string') {
                formattedBundleCourseId = [{ id: bundleCourseIds }];
            } else if (Array.isArray(bundleCourseIds)) {
                formattedBundleCourseId = bundleCourseIds.map(courseId => ({ id: courseId }));
            } else {
                return res.status(400).json({ message: "Invalid data type for bundleCourseId" });
            }
        }

        let newBundle = new Bundle({
            bundleName,
            bundleStartingPrice,
            bundleEndingPrice,
            bundleCourseId: formattedBundleCourseId,
            bundleMode: mode,
            categoryId,
            tag,
            bundleDescription,
            feature
        });

        // Handle image upload
        if (req.file) {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            newBundle.bundleImage = { url: image, public_id };

            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error("Error deleting file from local storage", error);
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Image is required."
            });
        }

        // Save the new bundle to the database
        const newBundleSave = await newBundle.save();

        if (newBundleSave) {
            return res.status(200).json({
                success: true,
                message: 'Bundle created successfully',
                data: newBundleSave
            });
        } else {
            await deleteImageFromCloudinary(newBundleSave.bundleImage.public_id);
            return res.status(400).json({
                success: false,
                message: 'Failed to create bundle'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getAllBundles = async (req, res) => {
    try {
        const allBundles = await Bundle.find()
        if (!allBundles) {
            return res.status(404).json({
                success: false,
                message: 'No bundles found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'All Bundle Founded',
            data: allBundles
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.deleteSingleBundle = async (req, res) => {
    try {
        const id = req.params._id;

        // Find the bundle by ID
        const bundle = await Bundle.findByIdAndDelete(id);
        if (!bundle) {
            return res.status(404).json({
                success: false,
                message: 'Bundle not found',
            });
        }

        // Delete the associated image from Cloudinary
        if (bundle.bundleImage && bundle.bundleImage.public_id) {
            try {
                await deleteImageFromCloudinary(bundle.bundleImage.public_id);
            } catch (error) {
                console.error("Error deleting image from Cloudinary", error);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Bundle deleted successfully',
            data: bundle
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.updateBundle = async (req, res) => {
    try {

        const bundle = await Bundle.findById(req.params._id);
        if (!bundle) {
            return res.status(404).json({
                success: false,
                message: "Bundle not found"
            });
        }
        let mode;
        const updateFields = ['bundleName', 'bundleTotalPrice', 'bundleDiscountPrice', 'bundleDisCountPercenatgae', 'bundleCourseId', 'bundleMode'];
        updateFields.forEach(field => {
          if (req.body[field] !== undefined) {
            // Parse JSON for array fields
            if (field === 'bundleMode' || field === 'tags' || field === 'courses') {
              bundle[field] = JSON.parse(req.body[field]);
            } else {
              bundle[field] = req.body[field];
            }
          }
        });
        // Handle image update
        if (req.file) {
            const oldImagePublicId = bundle.bundleImage.public_id;
            if (oldImagePublicId) {
                try {
                    await deleteImageFromCloudinary(oldImagePublicId);
                } catch (error) {
                    console.error("Error deleting old image from Cloudinary:", error);
                }
            }

            // Upload new image to Cloudinary
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            bundle.bundleImage = { url: image, public_id };

            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error("Error deleting local image file:", error);
            }
        }

        // Save the updated bundle
        await bundle.save();

        res.status(200).json({
            success: true,
            message: "Bundle updated successfully",
            data: bundle
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getSingleBundle = async (req, res) => {
    try {
        const id = req.params._id
        console.log(id)
        const singleBundle = await Bundle.findById(id)
        if (!singleBundle) {
            return res.status(404).json({
                success: false,
                message: "Bundle not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Bundle found",
            data: singleBundle
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}