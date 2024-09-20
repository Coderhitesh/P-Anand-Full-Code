const mongoose = require('mongoose')

const GalleryImageSchema = new mongoose.Schema({
    image: {
        url: {
            type: String,
        },
        public_id: {
            type: String,
        }
    },
    galleryCategoryId: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'GalleryCategory'
        type: String
    }
})

const GalleryImage = mongoose.model('GalleryImage', GalleryImageSchema)
module.exports = GalleryImage