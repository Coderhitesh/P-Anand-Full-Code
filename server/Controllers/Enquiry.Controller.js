const EnquirySchema = require('../Models/Enquiry.Model');

exports.createEnquiry = async (req, res) => {
    try {
        const { name, number, email, subject, message } = req.body;
        const enquiry = new EnquirySchema({
            name,
            number,
            email,
            subject,
            message
        });
        const savedEnquiry = await enquiry.save();
        res.status(201).json({ message: 'Enquiry created successfully', savedEnquiry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await EnquirySchema.find().sort({ createdAt: -1 });
        if(!enquiries){
            return res.status(404).json({ success: false, message: 'No enquiries found' });
        }
        res.status(200).json({ 
            success: true,
            message: 'Enquiries retrieved successfully',
            data: enquiries
         });
    } catch (error) {
        console.log("Internal server error",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteEnquiry = async (req, res) => {
    try {
        const id = req.params.id;
        const enquiry = await EnquirySchema.findByIdAndDelete(id);
        if(!enquiry){
            return res.status(404).json({ success: false, message: 'No enquiry found for this ID' });
        }
        res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
    } catch (error) {
        console.log("Internal server error",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}