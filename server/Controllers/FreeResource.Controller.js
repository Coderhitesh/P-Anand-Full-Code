const FreeResource = require('../Models/FreeResource.Model');
const { uploadPDF, deletePdfFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs');
const path = require('path');

exports.createFreeResource = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Provide name field'
            })
        }

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Provide categoryId field'
            })
        }


        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Pdf is must required"
            })
        }

        let pdf = ''
        if (req.file) {
            pdf = req.file.path
        }

        const newFreeResource = new FreeResource({
            name,
            categoryId,
            FreePDF: pdf
        })

        await newFreeResource.save()


        res.status(200).json({
            success: true,
            message: 'Free resource created successfully',
            data: newFreeResource
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in creating Free Resources'
        })
    }
}

exports.getFreeResource = async (req, res) => {
    try {
        // Use await to fetch all free resources from the database
        const allFreeResources = await FreeResource.find();

        // Check if the array is empty
        if (!allFreeResources || allFreeResources.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No free resources found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Free resources retrieved successfully',
            data: allFreeResources,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in getting Free Resources',
        });
    }
};

exports.getSingleFreeResource = async (req, res) => {
    try {
        const id = req.params._id; // Assuming you're passing the ID in the request parameters

        // Find the resource by ID
        const freeResource = await FreeResource.findById(id);
        if (!freeResource) {
            return res.status(404).json({
                success: false,
                message: 'Free resource not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Free resource retrieved successfully',
            data: freeResource
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in getting Free Resources'
        });
    }
};

exports.updateFreeResource = async (req, res) => {
    try {
        const id = req.params._id; // Assuming you're passing resource ID as a URL parameter
        const { name, categoryId } = req.body;

        // Check if resource exists
        const existingResource = await FreeResource.findById(id);
        if (!existingResource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Provide name field'
            });
        }

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Provide categoryId field'
            });
        }

        let pdf = existingResource.FreePDF;

        // Check if a new file is uploaded
        if (req.file) {
            if (existingResource.FreePDF) {
                try {
                    await fs.promises.unlink(existingResource.FreePDF); // Async version to avoid blocking
                } catch (err) {
                    console.error("Error deleting previous PDF:", err);
                }
            }
            pdf = req.file.path;
        }

        // Update the resource with the new values
        existingResource.name = name;
        existingResource.categoryId = categoryId;
        existingResource.FreePDF = pdf;

        // Save the updated resource
        await existingResource.save();

        res.status(200).json({
            success: true,
            message: 'Free resource updated successfully',
            data: existingResource
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in updating Free Resource'
        });
    }
};

exports.deleteFreeResource = async (req, res) => {
    try {
        const id = req.params._id;  // Assuming you're passing resource ID as a URL parameter

        // Find the resource by ID
        const resource = await FreeResource.findById(id);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        if (resource.FreePDF) {
            try {
                await fs.promises.unlink(resource.FreePDF); // Async version
            } catch (err) {
                console.error("Error deleting PDF:", err);
            }
        }

        // Remove the resource from the database
        await FreeResource.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Free resource deleted successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in deleting Free Resource'
        });
    }
};