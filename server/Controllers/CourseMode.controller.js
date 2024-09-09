const CourseMode = require('../Models/Mode.Model');

exports.createCourseMode = async(req,res) => {
    try {
        const {name, howManyCourseInclude, isModeActive} = req.body
        const empty = [];
        if(!name){
            empty.push('Name')
        }
  
        if (empty.length > 0) {
            return res.status(400).json({ message: "Please fill all the fields", empty });
        }

        const NewCourseMode = new CourseMode({name, howManyCourseInclude, isModeActive})

        await NewCourseMode.save();

        res.status(200).json({
            success: true,
            message: 'Course Mode Added Successfull'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error'
        })
    }
}

exports.getCourseMode = async(req,res)=>{
    try {
        const allCourseMode = await CourseMode.find()
        if(!allCourseMode){
            return res.status(404).json({
                success: false,
                message: 'No Course Mode Found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All Course Mode',
            data: allCourseMode
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.getSingleCourseMode = async (req,res)=>{
    try {
        const id = req.params._id
        const singleCourseMode = await CourseMode.findById(id);
        if(!singleCourseMode){
            return res.status(404).json({
                success: false,
                message: 'No course Mode found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Course Mode Founded'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message: 'Internal server error'
        })
    }
}

exports.deleteCourseMode = async (req,res)=>{
    try {
        const id = req.params._id
        const singleCourseMode = await CourseMode.findById(id);
        if(!singleCourseMode){
            return res.status(404).json({
                success: false,
                message: 'No course Mode found'
            })
        }
        await CourseMode.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Course Mode Deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message: 'Internal server error'
        })
    }
}

exports.updateCourseMode = async(req,res) => {
    try {
        const id = req.params._id;
        const {name,howManyCourseInclude,isModeActive} = req.body;
        const courseModes = await CourseMode.findById(id)
        if(courseModes){
            return res.status(404).json({
                success: false,
                message:'No couse mode'
            })
        }
        if(name) courseModes.name = name;
        if(howManyCourseInclude) courseModes.howManyCourseInclude = howManyCourseInclude;
        if(isModeActive) courseModes.isModeActive = isModeActive;

        const updatedCourseMode = await courseModes.save();

        res.status(200).json({
            success: true,
            message: 'Course Mode updated successfully',
            data: updatedCourseMode
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}