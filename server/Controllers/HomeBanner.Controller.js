const HomeBanner = require('../Models/HomeBanner.Model');
const { uploadImage } = require('../utils/Cloudnary');
const fs = require('fs')

exports.createHomeBanner = async (req, res) => {
    try {
        const { active } = req.body
        if (!active) {
            return res.status(400).json({
                success: false,
                message: 'Please Provide the active'
            })
        }
        let newBanner = new HomeBanner({
            active
        });

        if (req.file) {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            newBanner.homeBannerImage.url = image;
            newBanner.homeBannerImage.public_id = public_id;
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
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.getAllHomeBanner = async (req, res) => {
    try {
        const allHomeBanner = await HomeBanner.find()
        if (!allHomeBanner) {
            return res.status(404).json({
                success: false,
                message: 'No banner found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'All banners',
            data: allHomeBanner
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.deleteHomeBanner = async (req, res) => {
    try {
        const id = req.params._id
        const deletedBanner = await HomeBanner.findByIdAndDelete(id)
        if (!deletedBanner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}