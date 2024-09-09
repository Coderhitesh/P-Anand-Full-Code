const Teacher = require('../Models/Teacher.Model')
const Course = require('../Models/Course.Model')
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary')
const fs = require('fs')

exports.createTeacher = async (req, res) => {
    try {
        const { teacherName, currentlyGivingcourse,categoryId, teacherEmail, teacherQualification, teacherExperience, teacherAbout, teacherRating, teacherRatingCount, teacherExpertise } = req.body
        const emptyField = []
        if (!teacherName) emptyField.push('Teacher Name')
        if (!categoryId) emptyField.push('Category Id')
        if (!currentlyGivingcourse) emptyField.push('Currently Giving Course')
        // if (!teacherEmail) emptyField.push('Teacher Email')
        // if (!teacherQualification) emptyField.push('Teacher Qualification')
        // if (!teacherExperience) emptyField.push('Teacher Experience')
        // if (!teacherAbout) emptyField.push('Teacher About')
        // if (!teacherExpertise) emptyField.push('Teacher Expertise')
        if (emptyField.length > 0) {
            return res.status(400).json({ message: `Please fill in the following fields: ${emptyField}` })
        }
        const newTeacher = new Teacher({
            teacherName,
            currentlyGivingcourse,
            teacherEmail,
            categoryId,
            teacherQualification,
            teacherExperience,
            teacherAbout,
            teacherRating,
            teacherRatingCount,
            teacherExpertise
        })

        if (req.file) {
            const ImgUrl = await uploadImage(req.file.path);
            const { image, public_id } = ImgUrl
            newTeacher.teacherImage.url = image;
            newTeacher.teacherImage.public_id = public_id
            try {
                fs.unlinkSync(req.file.path)
            } catch (error) {
                console.log('Error deleting file from local storage', error)
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please upload a Teacher image'
            })
        }

        const savedTeacher = await newTeacher.save()

        if (currentlyGivingcourse && currentlyGivingcourse.length > 0) {
            await Course.updateMany(
                { _id: { $in: currentlyGivingcourse } },
                { $set: { courseTeacherName: savedTeacher._id } } // Assuming courseTeacherName stores teacher ID
            );
        }

        res.status(200).json({
            success: true,
            message: 'Teacher added successfully',
            data: savedTeacher
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error creating teacher'
        })
    }
}

exports.getAllTeacher = async (req, res) => {
    try {
        const allTeacher = await Teacher.find()
        if (!allTeacher) {
            return res.status(404).json({
                success: false,
                message: 'No teacher found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Teacher founded successfully',
            data: allTeacher
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error fetching teachers'
        })
    }
}

exports.getSingleTeacher = async (req, res) => {
    try {
        const id = req.params._id
        const singleTeacher = await Teacher.findById(id)
        if(!singleTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Teacher found successfully',
            data: singleTeacher
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message: 'Error fetching teacher'
        })
    }
}

exports.deleteTeacher = async (req, res) => {
    try {
        const teacherId = req.params._id;
        // console.log(teacherId)

        // Find the teacher by ID
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Remove teacher's reference from courses
        await Course.updateMany(
            { courseTeacherName: teacherId },
            { $unset: { courseTeacherName: "" } } // Removes the courseTeacherName field from matching courses
        );

        // Delete the teacher
        await Teacher.findByIdAndDelete(teacherId);

        // Optionally, delete the teacher's image from Cloudinary
        if (teacher.teacherImage && teacher.teacherImage.public_id) {
            await deleteImageFromCloudinary(teacher.teacherImage.public_id);
        }

        res.status(200).json({
            success: true,
            message: 'Teacher deleted successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error deleting teacher'
        });
    }
};

// exports.updateTeacher = async (req,res) => {
//     try {
//         const id = req.params._id
//         const {
//             teacherName,
//             currentlyGivingcourse,
//             teacherEmail,
//             teacherQualification,
//             teacherExperience,
//             teacherAbout,
//             teacherRating,
//             // teacherRatingCount,
//             // teacherRatingAverage,
//             teacherExpertise
//         } = req.body
//         const data = await Teacher.findById(id)
//         if(!data){
//             return res.status(404).json({
//                 success: false,
//                 message: 'Teacher not found'
//             })
//         }
//         if(teacherName) data.teacherName = teacherName
//         if(currentlyGivingcourse) data.currentlyGivingcourse = currentlyGivingcourse
//         if(teacherEmail) data.teacherEmail = teacherEmail
//         if(teacherQualification) data.teacherQualification = teacherQualification
//         if(teacherExperience) data.teacherExperience = teacherExperience
//         if(teacherAbout) data.teacherAbout = teacherAbout
//         if(teacherRating) data.teacherRating = teacherRating
//         // if(teacherRatingCount) data.teacherRatingCount = teacherRatingCount
//         // if(teacherRatingAverage) data.teacherRatingAverage = teacherRatingAverage
//         if(teacherExpertise) data.teacherExpertise = teacherExpertise

//         if (req.file) {
//             const oldImagePublicId = data.teacherImage.public_id;
//             if (oldImagePublicId) {
//                 try {
//                     await deleteImageFromCloudinary(oldImagePublicId);
//                 } catch (error) {
//                     console.error("Error deleting old image from Cloudinary:", error);
//                 }
//             }

//             // Upload new image to Cloudinary
//             const imgUrl = await uploadImage(req.file.path);
//             const { image, public_id } = imgUrl;
//             data.teacherImage = { url: image, public_id };

//             try {
//                 fs.unlinkSync(req.file.path);
//             } catch (error) {
//                 console.error("Error deleting local image file:", error);
//             }
//         }
//         await data.save()
//         res.status(200).json({
//             success: true,
//             message: 'Teacher updated successfully',
//             data: data
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: 'Error updating teacher'
//         })
//     }
// }


exports.updateTeacher = async (req, res) => {
    try {
        const id = req.params._id;
        const {
            teacherName,
            currentlyGivingcourse,
            teacherEmail,
            teacherQualification,
            teacherExperience,
            teacherAbout,
            teacherRating,
            teacherExpertise
        } = req.body;

        const data = await Teacher.findById(id);
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Update teacher details
        if (teacherName) data.teacherName = teacherName;
        if (currentlyGivingcourse) data.currentlyGivingcourse = currentlyGivingcourse;
        if (teacherEmail) data.teacherEmail = teacherEmail;
        if (teacherQualification) data.teacherQualification = teacherQualification;
        if (teacherExperience) data.teacherExperience = teacherExperience;
        if (teacherAbout) data.teacherAbout = teacherAbout;
        if (teacherRating) data.teacherRating = teacherRating;
        if (teacherExpertise) data.teacherExpertise = teacherExpertise;

        // Handle image upload
        if (req.file) {
            const oldImagePublicId = data.teacherImage.public_id;
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
            data.teacherImage = { url: image, public_id };

            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error("Error deleting local image file:", error);
            }
        }

        // Save the updated teacher
        await data.save();

        // Update corresponding courses with the new teacher name
        if (teacherName) {
            await Course.updateMany(
                { courseTeacherName: id },
                { courseTeacherName: teacherName }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Teacher updated successfully',
            data: data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error updating teacher'
        });
    }
};
