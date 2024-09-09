const BookRating = require('../Models/BookRating.Model')
const Book = require('../Models/Book.Model')

// Create Book Rating
exports.createBookRating = async (req, res) => {
    try {
        const { bookId, rating, categoryId } = req.body;
        console.log(req.body);
        const emptyField = [];
        if (!bookId) emptyField.push('Book ID');
        if (!rating) emptyField.push('Rating');
        if (!categoryId) emptyField.push('Category ID');
        if (emptyField.length > 0) {
            return res.status(400).json({ message: `Please fill in the following fields: ${emptyField.join(', ')}` });
        }

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 0 and 5' });
        }

        const bookRating = new BookRating({
            bookId,
            rating,
            categoryId
        });

        await bookRating.save();

        // Calculate the updated rating
        const ratings = await BookRating.find({ bookId });
        const totalRatings = ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = totalRatings / ratings.length;

        // Update the book with new rating data
        await Book.findByIdAndUpdate(bookId, {
            bookRating: averageRating,
            bookCountRating: ratings.length
        });

        res.status(200).json({
            success: true,
            message: 'Book rating created',
            data: bookRating
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in creating Book Rating'
        });
    }
};

// Get All Book Ratings
exports.getAllBookRating = async (req, res) => {
    try {
        const allBookRatings = await BookRating.find();
        if (allBookRatings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Book Ratings found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'All Book Ratings',
            data: allBookRatings
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in getting all Book Ratings'
        });
    }
};

// Delete Book Rating
exports.deleteBookRating = async (req, res) => {
    try {
        const id = req.params._id;
        const singleBookRating = await BookRating.findById(id);
        if (!singleBookRating) {
            return res.status(404).json({
                success: false,
                message: 'Book Rating not found'
            });
        }
        await singleBookRating.deleteOne();

        // Update the book's rating and count after deletion
        const ratings = await BookRating.find({ bookId: singleBookRating.bookId });
        const totalRatings = ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = ratings.length > 0 ? totalRatings / ratings.length : 0;

        await Book.findByIdAndUpdate(singleBookRating.bookId, {
            bookRating: averageRating,
            bookCountRating: ratings.length
        });

        res.status(200).json({
            success: true,
            message: 'Book Rating deleted',
            data: singleBookRating
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in deleting single Book Rating'
        });
    }
};

// Get Single Book Rating
exports.singleBookRating = async (req, res) => {
    try {
        const id = req.params._id;
        const bookRating = await BookRating.findById(id);
        if (!bookRating) {
            return res.status(404).json({
                success: false,
                message: 'Book Rating not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book Rating found',
            data: bookRating
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in fetching single Book Rating'
        });
    }
};

// Update Book Rating
exports.updateBookRating = async (req, res) => {
    try {
        const id = req.params._id;
        const { bookId, rating } = req.body;
        const data = await BookRating.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Book Rating not found'
            });
        }

        if (bookId) data.bookId = bookId;
        if (rating) {
            if (rating < 0 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 0 and 5' });
            }
            data.rating = rating;
        }

        await data.save();

        // Recalculate the book's rating after update
        const ratings = await BookRating.find({ bookId: data.bookId });
        const totalRatings = ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = totalRatings / ratings.length;

        await Book.findByIdAndUpdate(data.bookId, {
            bookRating: averageRating,
            bookCountRating: ratings.length
        });

        res.status(200).json({
            success: true,
            message: 'Book Rating updated',
            data: data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in updating Book Rating'
        });
    }
};
