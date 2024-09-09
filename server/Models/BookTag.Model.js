const mongoose = require('mongoose')

const bookTagSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true,
        unique: true
    }
})

const BookTag = mongoose.model('BookTag',bookTagSchema)
module.exports = BookTag