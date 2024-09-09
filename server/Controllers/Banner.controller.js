const mainBanner = require('../Models/Banner.Model')
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary')
const fs = require("fs")

exports.createBanner = async (req, res) => {
    try {
        const {active} = req.body
        if(!active){
            return res.status(400).json({
                success: false,
                message: 'Please Provide the active'
            })
        }
        let newBanner = new mainBanner({
            active
        });

        if (req.file) {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            newBanner.bannerImage.url = image;
            newBanner.bannerImage.public_id = public_id;
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.log('Error deleting file from local storage', error)
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please upload a course image',
            })
        }

        await newBanner.save();

        res.status(200).json({
            success: true,
            message: 'Banner created successfully',
            data: newBanner
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getAllBanner = async (req,res) => {
    try {
        const allBanner = await mainBanner.find()
        if(!allBanner) {
            return res.status(404).json({
                success: false,
                message: 'No banner found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All banner found',
            data: allBanner
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.deletebanner = async (req,res) => {
    try {
        const id = req.params._id
        const banner = await mainBanner.findByIdAndDelete(id)
        if(!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Banner deleted successfully',
            data: banner
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.updateBanner = async (req, res) => {
    try {
        const id = req.params._id;
        const banner = await mainBanner.findById(id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        // Update fields if provided
        if (req.body.active) {
            banner.active = req.body.active;
        }


        if (req.file) {
            const oldImagePublicId = banner.bannerImage.public_id;
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
            banner.bannerImage = { url: image, public_id };

            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error("Error deleting local image file:", error);
            }
        }

        // Save the updated banner
        await banner.save();

        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: banner
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
