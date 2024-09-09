const BookSchema = require('../Models/Book.Model');
const { deleteImageFromCloudinary, uploadImage, uploadPDF, deletePdfFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs');

exports.createBook = async (req, res) => {
    try {
        console.log(req.body);
        const { bookName, bookCategory, bookSubCategory, bookDescription, bookTagName, bookAuthor, feature, bookPrice, bookAfterDiscount, bookDiscountPresent, BookHSNCode } = req.body;
        const emptyField = [];

        if (!bookName) emptyField.push('Book Name');
        if (!bookCategory) emptyField.push('Book Category');
        if (!bookDescription) emptyField.push('Book Description');
        if (!bookTagName) emptyField.push('Book TagName');
        if (!feature) emptyField.push('Feature');
        if (!bookPrice) emptyField.push('Book Price');
        if (!bookAfterDiscount) emptyField.push('Book After Discount');
        if (!bookDiscountPresent) emptyField.push('Book Discount Present');
        if (!BookHSNCode) emptyField.push('Book HSN Code');

        if (emptyField.length > 0) {
            return res.status(400).json({ message: "Please fill all the fields", emptyField });
        }

        const newBook = new BookSchema({
            bookName,
            bookCategory,
            bookSubCategory,
            bookDescription,
            bookTagName,
            bookAuthor,
            feature,
            bookPrice,
            bookAfterDiscount,
            bookDiscountPresent,
            BookHSNCode,
        });

        if (req.files) {
            const { bookImage, bookPdf } = req.files;

            if (bookImage) {
                const imgUrl = await uploadImage(bookImage[0].path);
                newBook.bookImage.url = imgUrl.image;
                newBook.bookImage.public_id = imgUrl.public_id;
                fs.unlinkSync(bookImage[0].path);
            } else {
                return res.status(400).json({ success: false, message: 'Please upload a Book image' });
            }

            if (bookPdf) {
                const pdfUrl = await uploadPDF(bookPdf[0].path);
                newBook.bookPdf.url = pdfUrl.pdf;
                newBook.bookPdf.public_id = pdfUrl.public_id;
                fs.unlinkSync(bookPdf[0].path);
            } else {
                return res.status(400).json({ success: false, message: 'Please upload a Book PDF' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Please upload both Book image and PDF' });
        }

        const newBookSave = await newBook.save();
        if (!newBookSave) {
            if (newBook.bookImage.public_id) await deleteImageFromCloudinary(newBook.bookImage.public_id);
            if (newBook.bookPdf.public_id) await deletePdfFromCloudinary(newBook.bookPdf.public_id);
            return res.status(400).json({ success: false, message: 'Failed to save Book' });
        }

        res.status(200).json({ success: true, message: 'Book Added Successfully', data: newBookSave });

    } catch (error) {
        console.error('Internal server error in creating book:', error);
        res.status(500).json({ success: false, message: 'Internal server error in creating book', error: error.message });
    }
};


exports.getAllBook = async (req, res) => {
    try {
        const allBook = await BookSchema.find();
        if (!allBook || allBook.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Books found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'All Books',
            data: allBook
        });
    } catch (error) {
        console.error('Internal server error in getting books:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting books',
            error: error
        });
    }
};

exports.getSingleBook = async (req, res) => {
    try {
        const id = req.params._id;
        const book = await BookSchema.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'No Book found for this ID'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book found',
            data: book
        });
    } catch (error) {
        console.error('Internal server error in getting single book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting single book',
            error: error
        });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const id = req.params._id;

        // Step 1: Find the book record
        const book = await BookSchema.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'No book found for this ID'
            });
        }

        // Step 2: Delete image and PDF from Cloudinary
        await Promise.all([
            deleteImageFromCloudinary(book.bookImage.public_id),
            deletePdfFromCloudinary(book.bookPdf.public_id),
        ]);

        // Step 3: Delete the book record
        const deleteBook = await BookSchema.findByIdAndDelete(id);
        if (!deleteBook) {
            return res.status(404).json({
                success: false,
                message: 'No book found for this ID'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: deleteBook
        });
    } catch (error) {
        console.error('Internal server error in deleting book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting book',
            error: error
        });
    }
};


exports.updateBook = async (req, res) => {
    try {
        const id = req.params._id;
        const {
            bookName,
            bookCategory,
            bookSubCategory,
            bookDescription,
            bookTagName,
            bookAuthor,
            feature,
            bookPrice,
            bookAfterDiscount,
            bookDiscountPresent,
            BookHSNCode
        } = req.body;

        // Find the book by ID
        const book = await BookSchema.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'No book found with this ID'
            });
        }

        // If a new image is uploaded, handle image replacement
        if (req.file) {
            // Delete the old image from Cloudinary
            await deleteImageFromCloudinary(book.bookImage.public_id);

            // Upload the new image to Cloudinary
            const imgUrl = await uploadImage(req.file.path);
            const { url, public_id } = imgUrl;

            // Set the new image details in the book document
            book.bookImage.url = url;
            book.bookImage.public_id = public_id;

            // Remove the uploaded file from the local server
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Error deleting file from local storage:', error);
            }
        }

        // Update the book details with the data from the request body
        if (bookName) book.bookName = bookName;
        if (bookCategory) book.bookCategory = bookCategory;
        if (bookSubCategory) book.bookSubCategory = bookSubCategory;
        if (bookDescription) book.bookDescription = bookDescription;
        if (bookTagName) book.bookTagName = bookTagName;
        if (bookAuthor) book.bookAuthor = bookAuthor;
        if (feature !== undefined) book.feature = feature;
        if (bookPrice) book.bookPrice = bookPrice;
        if (bookAfterDiscount) book.bookAfterDiscount = bookAfterDiscount;
        if (bookDiscountPresent) book.bookDiscountPresent = bookDiscountPresent;
        if (BookHSNCode) book.BookHSNCode = BookHSNCode;

        // Save the updated book document
        const updatedBook = await book.save();

        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });

    } catch (error) {
        console.error('Internal server error in updating book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating book',
            error: error
        });
    }
};

exports.updateBookFeature = async (req,res) => {
    try {
        const {feature} = req.body;
        const Book = await BookSchema.findByIdAndUpdate(req.params.id, {feature}, {new:true});
        if(!Book){
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Book Feature status updated successfully',
            data: Book
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

exports.getBookByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const books = await BookSchema.find({ bookCategory: categoryId });

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books found for this category.'
            });
        }

        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error('Error fetching books by category:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Unable to fetch courses.'
        });
    }
};