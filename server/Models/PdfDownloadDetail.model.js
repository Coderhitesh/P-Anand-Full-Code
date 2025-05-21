const mongoose = require('mongoose')

const pdfDownloadDetailSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    number: {
        type: Number,
        required: true
    },
    studenClass: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
})

const PdfDownloadDetail = mongoose.model('PdfDownloadDetail',pdfDownloadDetailSchema)
module.exports = PdfDownloadDetail