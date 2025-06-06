const mongoose = require('mongoose')

const CategoryModel = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    subcategoryName:[{
        type: String,
        trim: true
    }],
    categoryImage:{
        url:{
            type:String,
        },
        public_id:{
            type:String,
        }
    },
    position:{
        type:Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const Category = mongoose.model('Category', CategoryModel)
module.exports = Category