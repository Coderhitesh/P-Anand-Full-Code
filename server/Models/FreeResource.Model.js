const mongoose = require('mongoose')

const FreeResourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    FreePDF: {
        url:{
            type:String,
        },
        public_id:{
            type:String,
        }
    },
    categoryId: {
        type: String,
        required: true
    }
})

const FreeResource = mongoose.model('FreeResource',FreeResourceSchema)
module.exports = FreeResource