const CourseTitle = require('../Models/CourseTitle.Model')

exports.createCourseTitle = async (req,res) => {
    try {
        const {courseTitle} = req.body        
        if(!courseTitle){
            return res.status(400).json({
                success: false,
                message: 'Please provide a tag name'
            })
        }
        const newCourse = new CourseTitle({
            courseTitle
        })

        await newCourse.save()

        res.status(201).json({
            success: true,
            message: 'Course Title created successfully',
            data: newCourse
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error in creating Course Title'
        })
    }
}

exports.getAllCourseTitle = async (req,res) => {
    try {
        const allCourseTitle = await CourseTitle.find()
        if(!allCourseTitle){
            return res.status(404).json({
                success: false,
                message: 'No Course Title found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All Course Title is found',
            data: allCourseTitle
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error in fetching Course Title'
        })
    }
}

exports.getSingleCourseTitle = async (req,res) => {
    try {
        const id = req.params._id
        const singleCourseTitle = await CourseTitle.findById(id)
        if(!singleCourseTitle){
            return res.status(400).json({
                success: false,
                message: 'Course Title not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Course Title name founded',
            data: singleCourseTitle
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message:'course title is not found'
        })
    }
}

exports.deleteCourseTitle = async (req,res) => {
    try {
        const id = req.params._id
        const deleteTag = await CourseTitle.findByIdAndDelete(id)
        if(!deleteTag){
            return res.status(400).json({
                success: false,
                message: 'Course title not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'course title deleted successfully',
            data: deleteTag
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error in deleting course title'
        })
    }
}

exports.updateCourseTitle = async (req,res) => {
    try {
        const id = req.params._id
        const {courseTitle} = req.body
        const courseTitleID = await CourseTitle.findById(id)
        if(!courseTitleID){
            return res.status(400).json({
                success: false,
                message: 'Tag not found'
            })
        }
        if(courseTitle){
            courseTitleID.courseTitle = courseTitle
        }

        await courseTitleID.save()

        res.status(200).json({
            success: true,
            message: 'Tag Name updated successfully',
            data: courseTitleID
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error in updating tag'
        })
    }
}