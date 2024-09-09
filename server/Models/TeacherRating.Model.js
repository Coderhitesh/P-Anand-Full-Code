const mongoose = require('mongoose')
const teacherRatingSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
})

const TeacherRating = mongoose.model('TeacherRating',teacherRatingSchema)
module.exports = TeacherRating