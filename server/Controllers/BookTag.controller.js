const BookTag = require('../Models/BookTag.Model');

exports.createBookTag = async (req,res) => {
    try {
        const {tagName} = req.body;
        // console.log(req.body)
        if(!tagName){
            return res.status(400).json({
                success: false,
                message: 'Please provide a tag name'
            })
        }
        const bookTag = new BookTag({
            tagName
        });

        await bookTag.save()

        res.status(201).json({
            success: true,
            message: 'Book tag created successfully',
            data: bookTag
        })

    } catch (error) {
        console.log(error)
    }
}

exports.getAllBookTags = async (req, res) => {
    try {
        const allTags = await BookTag.find();

        if (!allTags) {
            return res.status(404).json({
                success: false,
                message: 'No Book Tags found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'All Book Tags retrieved successfully',
            data: allTags,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server error in fetching all book tags',
        });
    }
};

exports.getSingleBookTag = async (req, res) => {
    try {
        const id = req.params._id;
        const bookTag = await BookTag.findById(id);

        if (!bookTag) {
            return res.status(404).json({
                success: false,
                message: 'Book Tag not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Book Tag retrieved successfully',
            data: bookTag,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server error in fetching the book tag',
        });
    }
};

exports.deleteBookTag = async (req, res) => {
    try {
        const id = req.params._id;
        const deletedTag = await BookTag.findByIdAndDelete(id);

        if (!deletedTag) {
            return res.status(404).json({
                success: false,
                message: 'Book Tag not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Book Tag deleted successfully',
            data: deletedTag,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server error in deleting the book tag',
        });
    }
};

exports.updateBookTag = async (req, res) => {
    try {
        const id = req.params._id;
        const { tagName } = req.body;

        const bookTag = await BookTag.findById(id);

        if (!bookTag) {
            return res.status(404).json({
                success: false,
                message: 'Book Tag not found',
            });
        }

        if (tagName) {
            bookTag.tagName = tagName;
        }

        await bookTag.save();

        res.status(200).json({
            success: true,
            message: 'Book Tag updated successfully',
            data: bookTag,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server error in updating the book tag',
        });
    }
};
