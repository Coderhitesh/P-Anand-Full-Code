const mongoose = require('mongoose');

const courseRatingSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
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
courseRatingSchema.index({ courseId: 1, categoryId: 1 });

const CourseRating = mongoose.model('CourseRating', courseRatingSchema);

module.exports = CourseRating;
