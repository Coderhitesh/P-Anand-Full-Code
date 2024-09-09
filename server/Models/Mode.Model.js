const mongoose = require('mongoose')

const courseModeSchema = new mongoose.Schema({
    name:{
        type: String
    },
    howManyCourseInclude:{
        type: Number
    },
    isModeActive:{
        type: Boolean
    },
})

const CourseMode = mongoose.model('CourseMode',courseModeSchema)
module.exports = CourseMode