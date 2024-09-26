const BookSchema = require('../Models/Book.Model');
const { deleteImageFromCloudinary, uploadImage, uploadPDF, deletePdfFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs');

exports.createBook = async (req, res) => {
    try {
        console.log(req.body);
        const { bookName, bookCategory, bookSubCategory, bookDescription, bookTagName, bookAuthor, feature, bookPrice, bookAfterDiscount, bookDiscountPresent, BookHSNCode, aditionalInfo } = req.body;
        const emptyField = [];

        if (!bookName) emptyField.push('Book Name');
        if (!bookCategory) emptyField.push('Book Category');
        // if (!bookDescription) emptyField.push('Book Description');
        if (!bookTagName) emptyField.push('Book TagName');
        if (!feature) emptyField.push('Feature');
        if (!bookPrice) emptyField.push('Book Price');
        if (!bookAfterDiscount) emptyField.push('Book After Discount');
        if (!bookDiscountPresent) emptyField.push('Book Discount Present');
        // if (!BookHSNCode) emptyField.push('Book HSN Code');
        // if (!aditionalInfo) emptyField.push('Aditional Info');

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
            aditionalInfo
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
                const pdfUrl = bookPdf[0].path;
                newBook.bookPdf = pdfUrl;
                // newBook.bookPdf.public_id = pdfUrl.public_id;
                // fs.unlinkSync(bookPdf[0].path);
            } else {
                return res.status(400).json({ success: false, message: 'Please upload a Book PDF' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Please upload both Book image and PDF' });
        }

        const newBookSave = await newBook.save();
        if (!newBookSave) {
            if (newBook.bookImage.public_id) await deleteImageFromCloudinary(newBook.bookImage.public_id);
            // if (newBook.bookPdf.public_id) await deletePdfFromCloudinary(newBook.bookPdf.public_id);
            if(newBook.bookPdf) fs.promises.unlink(newBook.bookPdf)
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
            // deletePdfFromCloudinary(book.bookPdf.public_id),
            fs.promises.unlink(book.bookPdf)
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
        const id = req.params._id; // Assuming book ID is provided in the route parameters
        console.log(req.body);
        const {
            bookName, bookCategory, bookSubCategory, bookDescription, bookTagName, bookAuthor,
            feature, bookPrice, bookAfterDiscount, bookDiscountPresent, BookHSNCode, aditionalInfo
        } = req.body;

        // Check for empty required fields
        // const emptyField = [];
        // if (!bookName) emptyField.push('Book Name');
        // if (!bookCategory) emptyField.push('Book Category');
        // if (!bookDescription) emptyField.push('Book Description');
        // if (!bookTagName) emptyField.push('Book TagName');
        // if (!feature) emptyField.push('Feature');
        // if (!bookPrice) emptyField.push('Book Price');
        // if (!bookAfterDiscount) emptyField.push('Book After Discount');
        // if (!bookDiscountPresent) emptyField.push('Book Discount Present');
        // if (!BookHSNCode) emptyField.push('Book HSN Code');
        // if (!aditionalInfo) emptyField.push('addition Info');

        // if (emptyField.length > 0) {
        //     return res.status(400).json({ message: "Please fill all the fields", emptyField });
        // }

        // Find the existing book by ID
        const existingBook = await BookSchema.findById(id);
        if (!existingBook) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        // Update book details
        existingBook.bookName = bookName || existingBook.bookName;
        existingBook.bookCategory = bookCategory || existingBook.bookCategory;
        existingBook.bookSubCategory = bookSubCategory || existingBook.bookSubCategory;
        existingBook.bookDescription = bookDescription || existingBook.bookDescription;
        existingBook.bookTagName = bookTagName || existingBook.bookTagName;
        existingBook.bookAuthor = bookAuthor || existingBook.bookAuthor;
        existingBook.feature = feature !== undefined ? feature : existingBook.feature;
        existingBook.bookPrice = bookPrice || existingBook.bookPrice;
        existingBook.bookAfterDiscount = bookAfterDiscount || existingBook.bookAfterDiscount;
        existingBook.bookDiscountPresent = bookDiscountPresent || existingBook.bookDiscountPresent;
        existingBook.BookHSNCode = BookHSNCode || existingBook.BookHSNCode;
        existingBook.aditionalInfo = aditionalInfo || existingBook.aditionalInfo;

        if (req.files) {
            const { bookImage, bookPdf } = req.files;

            // Update the book image if a new one is uploaded
            if (bookImage) {
                if (existingBook.bookImage.public_id) {
                    await deleteImageFromCloudinary(existingBook.bookImage.public_id); // Delete old image
                }
                const imgUrl = await uploadImage(bookImage[0].path);
                existingBook.bookImage.url = imgUrl.image;
                existingBook.bookImage.public_id = imgUrl.public_id;
                fs.unlinkSync(bookImage[0].path); // Delete local file after upload
            }

            // Update the book PDF if a new one is uploaded
            if (bookPdf) {
                if (existingBook.bookPdf) {
                    try {
                        await fs.promises.unlink(existingBook.bookPdf)
                    } catch (error) {
                        console.log('Error in deleting previous book pdf')
                    }
                    // await deletePdfFromCloudinary(existingBook.bookPdf.public_id); // Delete old PDF
                }
                const pdfUrl = bookPdf[0].path;
                existingBook.bookPdf = pdfUrl;
                // existingBook.bookPdf.public_id = pdfUrl.public_id;
                // fs.unlinkSync(bookPdf[0].path); 
            }
        }

        // Save the updated book
        const updatedBook = await existingBook.save();
        if (!updatedBook) {
            return res.status(400).json({ success: false, message: 'Failed to update Book' });
        }

        res.status(200).json({ success: true, message: 'Book Updated Successfully', data: updatedBook });

    } catch (error) {
        console.error('Internal server error in updating book:', error);
        res.status(500).json({ success: false, message: 'Internal server error in updating book', error: error.message });
    }
};


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

exports.updateBookFeatureById = async (req,res) => {
    const id = req.params._id;
    const { feature } = req.body;

    try {
        const updatedBook = await BookSchema.findByIdAndUpdate(id, { feature }, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).json({ message: 'Book feature status updated', updatedBook });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error in update book feature by id "
        })
    }
}