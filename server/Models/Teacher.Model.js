const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    currentlyGivingcourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    teacherEmail: { type: String },
    teacherQualification: { type: String },
    teacherExperience: { type: Number, default: 0 }, // Default value set to 0
    teacherAbout: { type: String },
    teacherRating: { type: Number, default: 0 },
    teacherRatingCount: { type: Number, default: 0 },
    teacherExpertise: [{ type: String }],
    teacherImage: {
        url: { type: String },
        public_id: { type: String }
    }
});


const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher
