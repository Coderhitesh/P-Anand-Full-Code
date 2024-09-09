const BookBundle = require('../Models/BookBundle.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs');

exports.createBookBundle = async (req, res) => {
    try {
        const { bundleName, bundleDescription, bundlePrice, bundleDiscountPercent, bundlePriceAfterDiscount, categoryId, tag, bundleBookId } = req.body;
        const emptyField = [];
        let formattedBundleBookId = [];
        const bundleBookIds = JSON.parse(bundleBookId)

        // Validation
        if (!bundleName) emptyField.push('Bundle Name');
        if (!bundlePrice) emptyField.push('Bundle Price');
        if (!bundlePriceAfterDiscount) emptyField.push('Bundle After Discount Price');
        if (!bundleDiscountPercent) emptyField.push('Bundle Discount Percent');
        if (!categoryId) emptyField.push('Category ID');
        if (!tag) emptyField.push('Tag');
        if (!bundleDescription) emptyField.push('Bundle Description');
        if (!bundleBookId || bundleBookId.length === 0) emptyField.push('Bundle Book ID');
        if (emptyField.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        // Format the bundleCourseId to match schema requirements
        if (bundleBookIds) {
            if (typeof bundleBookIds === 'string') {
                formattedBundleBookId = [{ id: bundleBookIds }];
            } else if (Array.isArray(bundleBookIds)) {
                formattedBundleBookId = bundleBookIds.map(bookId => ({ id: bookId}));
            } else {
                return res.status(400).json({ message: "Invalid data type for bundleBookId" });
            }
        }

        let newBookBundle = new BookBundle({
            bundleName,
            bundleDescription,
            bundlePrice,
            bundleDiscountPercent,
            bundlePriceAfterDiscount,
            categoryId,
            tag,
            bundleBookId: formattedBundleBookId
        });

        // Handle image upload
        if (req.file) {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            newBookBundle.bundleImage = { url: image, public_id };

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

        const newBookBundleSave = await newBookBundle.save();

        if (!newBookBundleSave) {
            if (newBookBundleSave.bundleImage.public_id) await deleteImageFromCloudinary(newBookBundleSave.bundleImage.public_id);
            return res.status(400).json({ success: false, message: 'Failed to save Book bundle' });
        }

        res.status(200).json({
            success: true,
            message: 'Book Bundle Created Successfully',
            data: newBookBundleSave
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error creating book bundle',
        });
    }
};

exports.getBookBundle = async (req, res) => {
    try {
        const allBookBundle = await BookBundle.find()
        if (!allBookBundle) {
            return res.status(404).json({
                success: false, message: 'No book bundle found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Book Bundle Retrieved',
            data: allBookBundle
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Error fetching book bundle'
        })
    }
}

exports.getSingleBookBundle = async (req,res) => {
    try {
        const id = req.params._id
        const foundSingleBundle = await BookBundle.findById(id)
        if(!foundSingleBundle) {
            return res.status(400).json({
                success: false, message: 'Bundle not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Bundle Retrieved',
            data: foundSingleBundle
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Error fetching single book bundle'
        })
    }
}

exports.deleteBookBundle = async (req,res) => {
    try {
        const id = req.params._id

        const deleteBookBundle = await BookBundle.findById(id)
        if(!deleteBookBundle){
            return res.status(400).json({
                success: false, message: 'Bundle not found'
                })
        }
        if(deleteBookBundle.bundleImage.public_id) await deleteImageFromCloudinary(deleteBookBundle.bundleImage.public_id)
        await deleteBookBundle.deleteOne()

        res.status(200).json({
            success: true,
            message: 'Bundle deleted successfully',
            data: deleteBookBundle
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error deleting book bundle'
        })
    }
}

exports.updateBookBundle = async (req, res) => {
    try {
        const id = req.params._id;
        const { bundleName, bundleDescription, bundlePrice, bundleDiscountPercent, bundlePriceAfterDiscount, categoryId, tag, bundleBookId } = req.body;
        let formattedBundleCourseId = [];

        // Find the existing bundle
        const existingBookBundle = await BookBundle.findById(id);
        if (!existingBookBundle) {
            return res.status(404).json({
                success: false,
                message: 'Bundle not found'
            });
        }

        // Validation
        const emptyField = [];
        if (!bundleName) emptyField.push('Bundle Name');
        if (!bundlePrice) emptyField.push('Bundle Price');
        if (!bundlePriceAfterDiscount) emptyField.push('Bundle After Discount Price');
        if (!bundleDiscountPercent) emptyField.push('Bundle Discount Percent');
        if (!categoryId) emptyField.push('Category ID');
        if (!tag) emptyField.push('Tag');
        if (!bundleDescription) emptyField.push('Bundle Description');
        if (!bundleBookId || bundleBookId.length === 0) emptyField.push('Bundle Book ID');
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        // Format the bundleBookId to match schema requirements
        if (bundleBookId) {
            if (typeof bundleBookId === 'string') {
                formattedBundleCourseId = [{ id: bundleBookId }];
            } else if (Array.isArray(bundleBookId)) {
                formattedBundleCourseId = bundleBookId.map(bookId => ({ id: bookId }));
            } else {
                return res.status(400).json({ message: "Invalid data type for bundleBookId" });
            }
        }

        // Update the bundle fields
        existingBookBundle.bundleName = bundleName;
        existingBookBundle.bundleDescription = bundleDescription;
        existingBookBundle.bundlePrice = bundlePrice;
        existingBookBundle.bundleDiscountPercent = bundleDiscountPercent;
        existingBookBundle.bundlePriceAfterDiscount = bundlePriceAfterDiscount;
        existingBookBundle.categoryId = categoryId;
        existingBookBundle.tag = tag;
        existingBookBundle.bundleBookId = formattedBundleCourseId;

        // Handle image update
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (existingBookBundle.bundleImage && existingBookBundle.bundleImage.public_id) {
                await deleteImageFromCloudinary(existingBookBundle.bundleImage.public_id);
            }

            // Upload the new image
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            existingBookBundle.bundleImage = { url: image, public_id };

            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error("Error deleting file from local storage", error);
            }
        }

        // Save the updated bundle
        const updatedBookBundle = await existingBookBundle.save();

        res.status(200).json({
            success: true,
            message: 'Book Bundle updated successfully',
            data: updatedBookBundle
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating book bundle'
        });
    }
};
