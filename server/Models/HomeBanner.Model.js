const mongoose = require('mongoose')

const HomeBannerShema = new mongoose.Schema({
    homeBannerImage:{
        url:{
            type:String,
            required: true
        },
        public_id:{
            type:String,
            required: true
        }
    },
    active: {
        type: Boolean,
    }
})

const HomeBanner = mongoose.model('HomeBanner',HomeBannerShema)
module.exports = HomeBanner;