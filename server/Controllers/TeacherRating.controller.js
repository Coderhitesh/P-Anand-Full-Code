const TeacherRating = require('../Models/TeacherRating.Model')
const Teacher = require('../Models/Teacher.Model')

exports.createTeacherRating = async (req, res) => {
    try {
        const { teacherId, rating } = req.body
        const emptyField = []
        if (!teacherId) emptyField.push('Teacher id')
        if (!rating) emptyField.push('Rating')
        if (emptyField.length > 0) {
            return res.status(400).json({ message: `Please fill in the following fields: ${emptyField}` })
        }
        const teacherRating = new TeacherRating({
            teacherId,
            rating
        })

        await teacherRating.save()

        // Calculate the updated rating and rating count
        const ratings = await TeacherRating.find({ teacherId });
        const totalRatings = ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = totalRatings / ratings.length;

        // Update the teacher with new rating data
        await Teacher.findByIdAndUpdate(teacherId, {
            teacherRating: averageRating,
            teacherRatingCount: ratings.length
        });

        res.status(200).json({
            success: true,
            message: 'Teacher rating created',
            data: teacherRating
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in creating Teacher Rating'
        })
    }
}

exports.getAllTeacherRating = async (req, res) => {
    try {
        const allTeacherRating = await TeacherRating.find()
        if (!allTeacherRating) {
            return res.status(404).json({
                success: false,
                message: 'No Teacher Rating found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All Teacher Rating',
            data: allTeacherRating
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in getting all Teacher Rating'
        })
    }
}

exports.deleteTeacherRating = async (req, res) => {
    try {
        const id = req.params._id
        const singleTeacherRating = await TeacherRating.findById(id)
        if (!singleTeacherRating) {
            return res.status(404).json({
                success: false,
                message: 'Teacher Rating not found'
            })
        }
        await singleTeacherRating.deleteOne()
        res.status(200).json({
            success: true,
            message: 'Teacher Rating deleted',
            data: singleTeacherRating
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in deleting single Teacher Rating'
        })
    }
}

exports.singleTeacherRating = async (req, res) => {
    try {
        const id = req.params._id
        const teacherRating = await TeacherRating.findById(id)
        if (!teacherRating) {
            return res.status(404).json({
                success: false,
                message: 'Teacher Rating not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Teacher Rating found',
            data: teacherRating
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in fetching single teacher rating'
        })
    }
}

exports.updateTeacherRating = async (req, res) => {
    try {
        const id = req.params._id
        const { teacherId, rating } = req.body
        const data = await TeacherRating.findById(id)
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Teacher Rating not found'
            })
        }

        if (teacherId) data.teacherId = teacherId
        if (rating) data.rating = rating

        await data.save()
        res.status(200).json({
            success: true,
            message: 'Teacher Rating updated',
            data: data
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error in updating teacher rating'
        })
    }
}