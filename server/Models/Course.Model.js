const mongoose = require('mongoose')

const courseModeSchema = new mongoose.Schema({
    
    modeType: { type: String, required: true },
    coursePrice: { type: Number, required: true },
    modeId:{type:mongoose.Schema.Types.ObjectId,ref:"CourseMode"},
    coursePriceAfterDiscount: { type: Number, required: true },
    courseDiscountPercent: { type: Number, required: true },
    courseLink:{type:String},
   
}, { _id: false });

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    courseDescription: {
        type: String,
        required: true
    },
    courseImage: {
        url:{
            type:String,
            required: true
        },
        public_id:{
            type:String,
            required: true
        }
    },
    courseCategory: {
        type: String,
        required: true
    },
    courseSubCategory: {
        type: String,
    },
    courseTagName: {
        type: String
    },
    courseRating:{
        type:Number
    },
    courseCountRating:{
        type:Number
    },
    courseTeacherName: {
        type: String,
    },
    courseMode: [courseModeSchema],
    feature: {
        type: Boolean,
        default: false
    },
    startingPrice:{
        type:Number
    },
    endingPrice:{
        type:Number
    }
})

const Course = mongoose.model('Course',courseSchema)
module.exports = Course