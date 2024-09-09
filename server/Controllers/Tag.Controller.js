const Tag = require('../Models/Tag.Model')

exports.createTag = async (req,res) => {
    try {
        const {tagName} = req.body        
        if(!tagName){
            return res.status(400).json({
                success: false,
                message: 'Please provide a tag name'
            })
        }
        const TagName = new Tag({
            tagName
        })

        await TagName.save()

        res.status(201).json({
            success: true,
            message: 'Tag created successfully',
            data: TagName
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error in creating tag name'
        })
    }
}

exports.getAllTag = async(req,res) => {
    try {
        const allTag = await Tag.find()
        if(!allTag){
            return res.status(404).json({
                success: false,
                message: 'No Tag name is found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All Tag name is found',
            data: allTag
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error in fetching all tags'
        })
    }
}

exports.getSingleTag = async (req,res) => {
    try {
        const id = req.params._id
        const singleTag = await Tag.findById(id)
        if(!singleTag){
            return res.status(400).json({
                success: false,
                message: 'Tag not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Tag name founded',
            data: singleTag
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'tag is not found'
        })
    }
}

exports.deleteTag = async (req,res) => {
    try {
        const id = req.params._id
        const deleteTag = await Tag.findByIdAndDelete(id)
        if(!deleteTag){
            return res.status(400).json({
                success: false,
                message: 'Tag not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Tag Name deleted successfully',
            data: deleteTag
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error in deleting tag'
        })
    }
}

exports.updateTag = async (req,res) => {
    try {
        const id = req.params._id
        const {tagName} = req.body
        const TagName = await Tag.findById(id)
        if(!TagName){
            return res.status(400).json({
                success: false,
                message: 'Tag not found'
            })
        }
        if(tagName){
            TagName.tagName = tagName
        }

        await TagName.save()

        res.status(200).json({
            success: true,
            message: 'Tag Name updated successfully',
            data: TagName
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server error in updating tag'
        })
    }
}