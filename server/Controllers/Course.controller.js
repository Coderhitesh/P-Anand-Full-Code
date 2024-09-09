const MainCourse = require('../Models/Course.Model')
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary')
const fs = require('fs');

exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, endingPrice, startingPrice, feature, courseCategory, courseSubCategory, courseTagName, courseRating, courseCountRating, courseTeacherName, courseMode } = req.body
        // console.log(req.body)
        // console.log(JSON.parse(req.body.courseMode))
        const mode  =JSON.parse(req.body.courseMode)
        const emptyField = []
        if (!courseName) emptyField.push('Course Name')
        if (!courseDescription) emptyField.push('Course Description')
        if (!mode) emptyField.push('Course Mode')
        if (!courseCategory) emptyField.push('Course Category')
        if (!startingPrice) emptyField.push('Starting PRice')
        if (!courseTagName) emptyField.push('Course Tag Name')
        if (!endingPrice) emptyField.push('Ending Price')
   
        if (emptyField.length > 0) {
            return res.status(400).json({ message: `Please fill in the following fields: ${emptyField.join(', ')}` })
        }
        const newCourse = new MainCourse({
            courseName,
            courseDescription,
            courseCategory,
            startingPrice,
            endingPrice,
            courseSubCategory,
            courseMode:mode,
            courseRating,
            courseCountRating,
            courseTeacherName,
            courseTagName,
            feature
        })

        if (req.file) {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            newCourse.courseImage.url = image;
            newCourse.courseImage.public_id = public_id;
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.log('Error deleting file from local storage', error)
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please upload a course image',
            })
        }

        const newCourseSave = await newCourse.save();

        if (!newCourseSave) {
            await deleteImageFromCloudinary(newCourseSave.courseImage.public_id)
            return res.status(400).json({
                success: false,
                message: 'Failed to save course',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Course saved successfully',
            data: newCourseSave
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error in Creating Course"
        })
    }
}

exports.getAllCourse = async (req, res) => {
    try {
        const allCourse = await MainCourse.find();
        if (!allCourse) {
            return res.status(400).json({
                success: false,
                message: 'No courses found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Courses founded successfully',
            data: allCourse
        })
    } catch (error) {
        console.log(error)
        res.stause(500).json({
            success: false,
            message: "Internal Server Error in Getting All Courses"
        })
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const id = req.params._id
        const course = await MainCourse.findById(id)
        if (!course) {
            return res.status(400).json({
                success: false,
                message: 'Course not found'
            })
        }
        await course.deleteOne()
        res.status(200).json({
            success: true,
            message: 'course deleted successfully',
            data: course
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server erron in course deleting'
        })
    }
}

exports.getSingleCourse = async (req, res) => {
    try {
        const id = req.params._id
        const singleCourse = await MainCourse.findById(id)
        if (!singleCourse) {
            return res.status(400).json({
                success: false,
                messsage: 'no course found'
            })
        }

        res.status(200).json({
            success: true,
            message: "Course founded successfully",
            data: singleCourse
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error in finding single course'
        })
    }
}

exports.updateCourse = async (req, res) => {
    try {
        const id = req.params._id
        const {
            courseName,
            courseDescription,
            coursePrice,
            coursePriceAfterDiscount,
            courseDiscountPercent,
            courseCategory,
            courseSubCategory,
            courseTagName,
            courseMode,
            feature
        } = req.body

        const data = await MainCourse.findById(id)
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Course not found'
            })
        }

        if (courseName) data.courseName = courseName
        if (courseDescription) data.courseDescription = courseDescription
        if (coursePrice) data.coursePrice = coursePrice
        if (coursePriceAfterDiscount) data.coursePriceAfterDiscount = coursePriceAfterDiscount
        if (courseDiscountPercent) data.courseDiscountPercent = courseDiscountPercent
        if (courseCategory) data.courseCategory = courseCategory
        if (courseSubCategory) data.courseSubCategory = courseSubCategory
        if (courseMode) data.courseMode = JSON.parse(courseMode)
        if (feature) data.feature = feature
        if (courseTagName) data.courseTagName = courseTagName

        // Handle image update
        if (req.file) {
            const oldImagePublicId = data.courseImage.public_id;
            if (oldImagePublicId) {
                try {
                    await deleteImageFromCloudinary(oldImagePublicId);
                } catch (error) {
                    console.error("Error deleting old image from Cloudinary:", error);
                }
            }

            // Upload new image to Cloudinary
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            data.courseImage = { url: image, public_id };

            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error("Error deleting local image file:", error);
            }
        }
        await data.save()
        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Seerver error in update course'
        })
    }
}
exports.updateCourseFeature = async (req, res) => {
    try {
        const { feature } = req.body;
        const course = await MainCourse.findByIdAndUpdate(req.params.id, { feature }, { new: true });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course feature status updated successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

exports.getCoursesByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const courses = await MainCourse.find({ courseCategory: categoryId });

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No courses found for this category.'
            });
        }

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching courses by category:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to fetch courses.'
        });
    }
};