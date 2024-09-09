const mongoose = require('mongoose')

const courseTitleSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
        unique: true
    }
})

const CourseTitle = mongoose.model('CourseTitle',courseTitleSchema)
module.exports = CourseTitle