const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    bookImage: {
        url:{
            type:String,
            // required: true
        },
        public_id:{
            type:String,
            // required: true
        }
    },
    bookCategory: {
        type: String,
        required: true
    },
    bookSubCategory: {
        type: String,
    },
    bookDescription: {
        type: String,
    },
    bookTagName: {
        type: String
    },
    bookAuthor: {
        type: String
    },
    feature: {
        type: Boolean,
        default: false
    },
    bookPrice: {
        type: Number
    },
    bookAfterDiscount: {
        type: Number
    },
    bookDiscountPresent: {
        type: Number
    },
    BookHSNCode: {
        type: String
    },
    bookRating: {
        type: Number,
        default:0
    },
    bookCountRating: {
        type: Number,
        default:0
    },
    bookPdf: {
        url:{
            type:String,
        },
        public_id:{
            type:String,
        }
    }
})

const Book = mongoose.model('Book',BookSchema)
module.exports = Book