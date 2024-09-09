const mongoose = require('mongoose')

const BookBundleSchema = new mongoose.Schema({
    bundleName: {
        type: String,
        required: true
    },
    bundleDescription: {
        type: String,
        required: true
    },
    bundlePrice: {
        type: Number,
        required: true
    },
    bundleDiscountPercent: {
        type: Number,
        default: 0
    },
    bundlePriceAfterDiscount: {
        type: Number,
        default: 0
    },
    bundleImage: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookCategory',
    },
    tag: {
        type: String
    },
    bundleBookId: [{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        _id: false
    }]
}, { timestamps: true })

const BookBundle = mongoose.model('BookBundle', BookBundleSchema)
module.exports = BookBundle