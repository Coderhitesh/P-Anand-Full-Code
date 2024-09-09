const mongoose = require('mongoose')

const BookCategoryModel = new mongoose.Schema({
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
    }

})

const BookCategory = mongoose.model('BookCategory', BookCategoryModel)
module.exports = BookCategory