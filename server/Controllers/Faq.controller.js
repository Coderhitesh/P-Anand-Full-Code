const FAQSchema = require('../Models/Faq.model')

exports.createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = new FAQSchema({ question, answer });
        const savedFaq = await faq.save();
        res.status(201).json({ success: true, message: 'Faq created successfully', savedFaq });
    } catch (error) {
        console.log("Internal server error",error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getAllFaq = async (req, res) => {
    try {
        const allFaqData = await FAQSchema.find();
        if(!allFaqData){
            return res.status(404).json({ success: false, message: 'No faq found' });
        }
        res.status(200).json({ success: true, message: 'All faq found', data: allFaqData });
    } catch (error) {
        console.log("Internal server error",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getSingleFaq = async (req,res) => {
    try {
        const id = req.params.id;
        const faq = await FAQSchema.findById(id);
        if(!faq){
            return res.status(404).json({ success: false, message: 'No faq found for this ID' });
        }
        res.status(200).json({ success: true, message: 'Single faq found', data: faq });
    } catch (error) {
        console.log("Internal server error",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteFaq = async (req, res) => {
    try {
        const {id} = req.params;
        const faq = await FAQSchema.findByIdAndDelete(id);
        if(!faq){
            return res.status(404).json({ success: false, message: 'No faq found for this ID' });
        }
        res.status(200).json({ success: true, message: 'Faq deleted successfully' });
    } catch (error) {
        console.log("Internal server error",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FAQSchema.findByIdAndUpdate(id, req.body, { new: true });
        if(!faq){
            return res.status(404).json({ success: false, message: 'No faq found for this ID' });
        }
        res.status(200).json({ success: true, message: 'Faq updated successfully', data: faq });
    } catch (error) {
        console.log("Internal server error",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}