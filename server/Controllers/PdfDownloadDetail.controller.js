const PdfDownloadDetail = require('../Models/PdfDownloadDetail.model');


exports.createPdfDownloadDetail = async (req, res) => {
    try {
        const { name, number, studenClass, location } = req.body;
        const pdfDownloadDetail = new PdfDownloadDetail({ name, number, studenClass, location });
        await pdfDownloadDetail.save();
        res.status(201).json({
            success: true,
            message: 'PDF download detail created successfully',
            data: pdfDownloadDetail
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to create PDF download detail"
        });
    }
}

exports.getAllPdfDownloadDetails = async (req, res) => {
    try {
        const pdfDownloadDetails = await PdfDownloadDetail.find();
        if (!pdfDownloadDetails) {
            return res.status(404).json({
                success: false,
                message: 'No PDF download details found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'All PDF download details found',
            data: pdfDownloadDetails
        });
    } catch (error) {
        console.log("Internal server error",error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getSinglePdfDownloadDetail = async (req, res) => {
    try {
        const id = req.params._id;
        const pdfDownloadDetail = await PdfDownloadDetail.findById(id);
        if (!pdfDownloadDetail) {
            return res.status(404).json({
                success: false,
                message: 'No PDF download detail found for this ID'
            });
        }
        res.status(200).json({
            success: true,
            message: 'PDF download detail found',
            data: pdfDownloadDetail
        });
    } catch (error) {
        console.log("Internal server error",error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deletePdfDownloadDetail = async (req, res) => {
    try {
        const id = req.params._id;
        const pdfDownloadDetail = await PdfDownloadDetail.findByIdAndDelete(id);
        if (!pdfDownloadDetail) {
            return res.status(404).json({
                success: false,
                message: 'No detail found for this ID'
            });
        }
        res.status(200).json({
            success: true,
            message: 'PDF download detail deleted successfully'
        });
    } catch (error) {
        console.log("Internal server error",error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}