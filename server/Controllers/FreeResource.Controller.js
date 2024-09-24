const FreeResource = require('../Models/FreeResource.Model');
const { uploadPDF, deletePdfFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs')

exports.createFreeResource = async (req,res) => {
    try {
        const {name,categoryId} = req.body;
        if(!name){
            return res.status(400).json({
                success: false,
                message: 'Provide name field'
            })
        }

        if(!categoryId){
            return res.status(400).json({
                success: false,
                message: 'Provide categoryId field'
            })
        }

        const newFreeResource = new FreeResource({
            name,
            categoryId
        })

        if(req.file){
            const pdfUrl = await uploadPDF(req.file.path);
            const {pdf,public_id} = pdfUrl
            newFreeResource.FreePDF.url = pdf;
            newFreeResource.FreePDF.public_id = public_id;
            try {
                fs.unlinkSync(req.file.path)
            } catch (error) {
                console.log('Error in deleting pdf from local storage', error)
            }
        }else{
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file'
            })
        }

        const newFreeResourceSave = await newFreeResource.save();

        if(!newFreeResourceSave){
            await deletePdfFromCloudinary(newFreeResourceSave.FreePDF.public_id)
            return res.status(400).json({
                success: false,
                message: 'Failed to save free resource'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Free resource created successfully',
            data: newFreeResourceSave
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
        const id = req.params._id; // Assuming you're passing the ID in the request parameters
        const { name, categoryId } = req.body;

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

        // Find the existing resource
        const existingResource = await FreeResource.findById(id);
        if (!existingResource) {
            return res.status(404).json({
                success: false,
                message: 'Free resource not found'
            });
        }

        // Update the name
        existingResource.name = name;
        existingResource.categoryId = categoryId;

        // If a new file is uploaded, handle the PDF upload
        if (req.file) {
            // Delete the old PDF from Cloudinary
            await deletePdfFromCloudinary(existingResource.FreePDF.public_id);

            // Upload the new PDF
            const pdfUrl = await uploadPDF(req.file.path);
            const { pdf, public_id } = pdfUrl;

            existingResource.FreePDF.url = pdf;
            existingResource.FreePDF.public_id = public_id;

            // Delete the local file after successful upload
            fs.unlinkSync(req.file.path);
        }

        // Save the updated resource
        const updatedResource = await existingResource.save();

        res.status(200).json({
            success: true,
            message: 'Free resource updated successfully',
            data: updatedResource
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in updating Free Resources'
        });
    }
};

exports.deleteFreeResource = async (req, res) => {
    try {
        const id = req.params._id; // Assuming you're passing the ID in the request parameters

        // Find the existing resource
        const existingResource = await FreeResource.findById(id);
        if (!existingResource) {
            return res.status(404).json({
                success: false,
                message: 'Free resource not found'
            });
        }

        // Delete the PDF from Cloudinary
        await deletePdfFromCloudinary(existingResource.FreePDF.public_id);

        // Delete the resource from the database
        await FreeResource.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Free resource deleted successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in deleting Free Resources'
        });
    }
};
