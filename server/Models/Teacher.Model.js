const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    teacherName: {
        type: String,
        required: true 
    },
    teacherImage: {
        url: {
            type: String,
            // required: true
        },
        public_id: {
            type: String,
            // required: true
        }
    },
    categoryId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    currentlyGivingcourse: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            id: false
        }
    ],
    teacherEmail: {
        type: String,
        // required: true 
    },
    teacherQualification: {
        type: String
    },
    teacherExperience: {
        type: Number,
        // required: true  
    },
    teacherAbout: {
        type: String
    },
    teacherRating: {
        type: Number
    },
    teacherRatingCount: {
        type: Number
    },
    teacherExpertise: [
        {
            type: String
        }
    ]
})

const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher
