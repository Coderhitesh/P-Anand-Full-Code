const FreeResourceCategory = require('../Models/FreeResourcesCategory.Model')

exports.createFreeResourceCategory = async (req,res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(400).json({
                success: false,
                message: "Please provide name"
            })
        }

        const freeResourceCategory = new FreeResourceCategory({
            name
        })
        await freeResourceCategory.save()
        res.status(201).json({
            success: true,
            message: "Free Resource Category created successfully",
            data: freeResourceCategory
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error in creating free resource category"
        })
    }
}

exports.updateFreeResourceCategory = async (req, res) => {
    try {
        const id = req.params._id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Please provide a name"
            });
        }

        const freeResourceCategory = await FreeResourceCategory.findById(id);
        if (!freeResourceCategory) {
            return res.status(404).json({
                success: false,
                message: "Free Resource Category not found"
            });
        }

        freeResourceCategory.name = name;
        await freeResourceCategory.save();

        res.status(200).json({
            success: true,
            message: "Free Resource Category updated successfully",
            data: freeResourceCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error in updating free resource category"
        });
    }
};

exports.deleteFreeResourceCategory = async (req, res) => {
    try {
        const id = req.params._id;

        const freeResourceCategory = await FreeResourceCategory.findByIdAndDelete(id);
        if (!freeResourceCategory) {
            return res.status(404).json({
                success: false,
                message: "Free Resource Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Free Resource Category deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error in deleting free resource category"
        });
    }
};

exports.getSingleFreeResourceCategory = async (req, res) => {
    try {
        const id = req.params._id;

        const freeResourceCategory = await FreeResourceCategory.findById(id);
        if (!freeResourceCategory) {
            return res.status(404).json({
                success: false,
                message: "Free Resource Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Free Resource Category fetched successfully",
            data: freeResourceCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error in fetching free resource category"
        });
    }
};

exports.getAllFreeResourceCategory = async (req, res) => {
    try {
        const freeResourceCategories = await FreeResourceCategory.find();

        res.status(200).json({
            success: true,
            message: "Free Resource Categories fetched successfully",
            data: freeResourceCategories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error in fetching free resource categories"
        });
    }
};