const mainCategory = require('../Models/Category.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs')

exports.createCategory = async (req, res) => {
    try {
        const { categoryName, subcategoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: 'Category Name is required'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Category Image is required'
            });
        }

        const category = new mainCategory({
            categoryName,
            subcategoryName: subcategoryName || []
        });

        // Handle image upload
        try {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            category.categoryImage.url =  image;
            category.categoryImage.public_id = public_id;
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.log('Error deleting file from local storage', error)
            }
        } catch (error) {
            console.log('Image upload failed', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image'
            });
        }

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {
        console.log('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category',
        });
    }
};


exports.getAllCategory = async (req, res) => {
    try {
        const allCategory = await mainCategory.find()
        if (!allCategory) {
            return res.status(400).json({
                success: false,
                message: 'No category found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All categories found',
            data: allCategory
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(500).json({
            success: false,
            message: 'Error fetching categories',
        })
    }
}

exports.singleCategory = async (req, res) => {
    try {
        const id = req.params._id
        const category = await mainCategory.findById(id)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'single category founded',
            data: category
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error fetching single category',
        })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params._id;
        const category = await mainCategory.findByIdAndDelete(id)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }

        await deleteImageFromCloudinary(category.categoryImage.public_id)

        res.status(200).json({
            success: true,
            message: 'Category Delete Successfully',
            data: category
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const id = req.params._id;
        const { categoryName, subcategoryName } = req.body;

        // Find the category by ID
        let category = await mainCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Update the category name if provided
        if (categoryName) category.categoryName = categoryName;

        // Handle subcategoryName update
        if (subcategoryName) {
            const subcategoryArray = JSON.parse(subcategoryName);
            // Only update if subcategoryArray is valid
            if (Array.isArray(subcategoryArray)) {
                category.subcategoryName = subcategoryArray.length > 0 ? subcategoryArray : [];
            }
        }

        // Handle image update
        if (req.file) {
            try {
                // Delete the old image from Cloudinary if it exists
                if (category.categoryImage.public_id) {
                    await deleteImageFromCloudinary(category.categoryImage.public_id);
                }

                // Upload the new image to Cloudinary
                const imgUrl = await uploadImage(req.file.path);
                const { image, public_id } = imgUrl;

                // Update the category image
                category.categoryImage.url = image;
                category.categoryImage.public_id = public_id;

                // Delete the image from local storage
                try {
                    fs.unlinkSync(req.file.path);
                } catch (error) {
                    console.error("Error deleting local image file:", error);
                }
            } catch (error) {
                console.log('Image update failed', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update image',
                });
            }
        }

        // Save the updated category
        await category.save();

        // Return the updated category
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error) {
        console.log('Update failed', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
