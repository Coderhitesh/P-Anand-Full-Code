const mongoose = require('mongoose');

const bookRatingSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookCategory',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0, // Minimum rating value
        max: 5  // Maximum rating value
    }
}, {
    timestamps: true // Optionally add timestamps for createdAt and updatedAt
});

// Optional indexing for better query performance
bookRatingSchema.index({ bookId: 1, categoryId: 1 });

const BookRating = mongoose.model('BookRating', bookRatingSchema);

module.exports = BookRating;
