const CourseRating = require('../Models/CourseRating.Model')
const Course = require('../Models/Course.Model')
const Category = require('../Models/Category.Model')

exports.createCourseRating = async (req, res) => {
    try {
        const { courseId, rating, categoryId} = req.body
        console.log(req.body)
        const emptyField = []
        if (!courseId) emptyField.push('Course id')
        if (!rating) emptyField.push('Rating')
        if (!categoryId) emptyField.push('Category Id')
        if (emptyField.length > 0) {
            return res.status(400).json({ message: `Please fill in the following fields: ${emptyField}` })
        }
        const courseRating = new CourseRating({
            courseId,
            rating,
            categoryId
        })

        await courseRating.save()

        // Calculate the updated rating
        const ratings = await CourseRating.find({ courseId });
        const totalRatings = ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = totalRatings / ratings.length;

        // Update the course with new rating data
        await Course.findByIdAndUpdate(courseId, {
            courseRating: averageRating,
            courseCountRating: ratings.length
        });

        res.status(200).json({
            success: true,
            message: 'Course rating created',
            data: courseRating
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in creating Course Rating'
        })
    }
}

exports.getAllCourseRating = async (req, res) => {
    try {
        const allCourseRating = await CourseRating.find()
        if (!allCourseRating) {
            return res.status(404).json({
                success: false,
                message: 'No Course Rating found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All Course Rating',
            data: allCourseRating
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in getting all course Rating'
        })
    }
}

exports.deleteCourseRating = async (req, res) => {
    try {
        const id = req.params._id
        const singleCourseRating = await CourseRating.findById(id)
        if (!singleCourseRating) {
            return res.status(404).json({
                success: false,
                message: 'Course Rating not found'
            })
        }
        await singleCourseRating.deleteOne()
        res.status(200).json({
            success: true,
            message: 'Course Rating deleted',
            data: singleCourseRating
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in deleting single Course Rating'
        })
    }
}

exports.singleCourseRating = async (req, res) => {
    try {
        const id = req.params._id
        const courseRating = await CourseRating.findById(id)
        if (!courseRating) {
            return res.status(404).json({
                success: false,
                message: 'Course Rating not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Course Rating found',
            data: courseRating
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in fetching single course rating'
        })
    }
}


exports.updateCourseRating = async (req, res) => {
    try {
        const { courseId, rating, categoryId } = req.body;
        const { id } = req.params;

        // Validate input
        if (!courseId || !categoryId) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        // Check if the course and category exist
        const course = await Course.findById(courseId);
        const category = await Category.findById(categoryId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Update the rating
        const updatedRating = await CourseRating.findByIdAndUpdate(
            id,
            { courseId, rating, categoryId },
            { new: true }
        );

        if (!updatedRating) {
            return res.status(404).json({ message: 'Rating not found.' });
        }

        res.status(200).json({ message: 'Rating updated successfully!', data: updatedRating });
    } catch (error) {
        console.error('Error updating course rating:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


// exports.updateCourseRating = async (req, res) => {
//     try {
//         const id = req.params._id
//         const { courseId, rating } = req.body
//         const data = await CourseRating.findById(id)

//         if (!data) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Course Rating not found'
//             })
//         }

//         if (courseId) data.courseId = courseId
//         if (rating) data.rating = rating

//         await data.save()
//         res.status(200).json({
//             success: true,
//             message: 'course Rating updated',
//             data: data
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: 'Error in updating course rating'
//         })
//     }
// }