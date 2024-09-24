const mongoose = require('mongoose')

const freeResourceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
})

const FreeResourceCategory = mongoose.model('FreeResourceCategory',freeResourceCategorySchema)
module.exports = FreeResourceCategory