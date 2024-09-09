const mainBookCategory = require('../Models/BookCategory.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs')

exports.createBookCategory = async (req, res) => {
    try {
        const { categoryName, subcategoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields'
            });
        }

        const category = new mainBookCategory({
            categoryName,
            subcategoryName: subcategoryName || []
        })

        if (req.file) {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            category.categoryImage.url = image;
            category.categoryImage.public_id = public_id;
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.log('Error deleting file from local storage', error)
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            })
        }

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Book Category created successfully',
            data: category
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error creating book category',
        });
    }
};


exports.getAllBookCategory = async (req, res) => {
    try {
        const allCategory = await mainBookCategory.find()
        if (!allCategory) {
            return res.status(400).json({
                success: false,
                message: 'No book category found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All book categories found',
            data: allCategory
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(500).json({
            success: false,
            message: 'Error fetching book categories',
        })
    }
}

exports.singleBookCategory = async (req, res) => {
    try {
        const id = req.params._id
        const category = await mainBookCategory.findById(id)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'book Category not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'single book category founded',
            data: category
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error fetching single book category',
        })
    }
}

exports.deleteBookCategory = async (req, res) => {
    try {
        const id = req.params._id;
        const category = await mainBookCategory.findByIdAndDelete(id)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'book Category not found'
            })
        }

        await deleteImageFromCloudinary(category.categoryImage.public_id)

        res.status(200).json({
            success: true,
            message: 'book Category Delete Successfully',
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

exports.updateBookCategory = async (req, res) => {
    try {
        const { _id } = req.params;
        const { categoryName, subcategoryName } = req.body;
        console.log(req.body)

        let category = await mainBookCategory.findById(_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'book Category not found',
            });
        }

        // Update the category name and subcategory name if provided
        if (categoryName) category.categoryName = categoryName;
        if (subcategoryName) category.subcategoryName = subcategoryName;

        // Handle image update
        if (req.file) {
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
                console.log('Error deleting file from local storage', error);
            }
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: 'book Category updated successfully',
            data: category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
