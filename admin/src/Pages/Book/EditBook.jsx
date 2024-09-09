import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';

function EditBook() {
    const { id } = useParams();
    const editor = useRef(null);
    const [categories, setCategories] = useState([]);
    const [allTags, setTags] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null); // Single image preview
    const [pdfPreview, setPdfPreview] = useState(null); // Single PDF preview
    const [formData, setFormData] = useState({
        bookName: '',
        bookDescription: '',
        bookTagName: '',
        bookCategory: '',
        bookSubCategory: '',
        bookImage: null,
        bookPdf: null,
        feature: false,
        bookPrice: '',
        bookAfterDiscount: '',
        bookDiscountPresent: '',
        BookHSNCode: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch existing book details
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:9000/api/v1/get-single-book/${id}`);
                const book = res.data.data;
                setFormData({
                    bookName: book.bookName,
                    bookDescription: book.bookDescription,
                    bookTagName: book.bookTagName,
                    bookCategory: book.bookCategory,
                    bookSubCategory: book.bookSubCategory,
                    bookImage: null, // Initially null, to be handled in preview
                    bookPdf: null, // Initially null, to be handled in preview
                    feature: book.feature,
                    bookPrice: book.bookPrice,
                    bookAfterDiscount: book.bookAfterDiscount,
                    bookDiscountPresent: book.bookDiscountPresent,
                    BookHSNCode: book.BookHSNCode,
                });
                setImagePreview(book.bookImage.url); // Assuming bookImageUrl is the URL of the image
                setPdfPreview(book.bookPdf.url); // Assuming bookPdfUrl is the URL of the PDF
            } catch (error) {
                console.error('Error fetching book details:', error);
            }
        };

        fetchBookDetails();
    }, [id]);

    // Fetch categories and tags
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:9000/api/v1/get-all-book-category');
                setCategories(res.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchTags = async () => {
            try {
                const res = await axios.get('http://localhost:9000/api/v1/get-all-book-tag');
                setTags(res.data.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchCategories();
        fetchTags();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);

        setFormData((prevFormData) => ({
            ...prevFormData,
            bookImage: file
        }));

        setImagePreview(preview);
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);

        setFormData((prevFormData) => ({
            ...prevFormData,
            bookPdf: file
        }));

        setPdfPreview(preview);
    };

    const handleCategoryChange = async (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            bookCategory: value,
            bookSubCategory: ''
        }));

        if (value) {
            try {
                const response = await axios.get(`http://localhost:9000/api/v1/single-book-category/${value}`);
                setSubcategories(response.data.data.subcategoryName);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevFormData) => {
            const updatedFormData = {
                ...prevFormData,
                [name]: type === 'checkbox' ? checked : value
            };

            if (name === 'bookPrice' || name === 'bookDiscountPresent') {
                const discountPercent = name === 'bookDiscountPresent' ? value : prevFormData.bookDiscountPresent;
                const price = name === 'bookPrice' ? value : prevFormData.bookPrice;

                updatedFormData.bookAfterDiscount = calculateDiscountedPrice(price, discountPercent);
            }

            return updatedFormData;
        });
    };

    const calculateDiscountedPrice = (price, discountPercent) => {
        const discount = (price * discountPercent) / 100;
        return price - discount;
    };

    const handleEditorChange = useCallback((newContent) => {
        setFormData(prevFormData => ({ ...prevFormData, bookDescription: newContent }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            for (const key in formData) {
                if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            }

            const response = await axios.put(`http://localhost:9000/api/v1/update-book/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Book Updated Successfully');
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('An Error Occurred');
            setIsLoading(false);
        }
    };

    const editorConfig = {
        readonly: false,
        height: 400
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Book</h4>
                </div>
                <div className="links">
                    <Link to="/all-book" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="bookCategory" className="form-label">Category</label>
                        <select onChange={handleCategoryChange} name='bookCategory' value={formData.bookCategory} className="form-select" id="bookCategory">
                            <option value="">Choose Category</option>
                            {categories && categories.map((category, index) => (
                                <option key={index} value={category._id}>{category.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bookSubCategory" className="form-label">Sub Category</label>
                        <select onChange={handleChange} name='bookSubCategory' value={formData.bookSubCategory} className="form-select" id="bookSubCategory">
                            <option value="">Choose Sub Category</option>
                            {subcategories && subcategories.map((subcategory, index) => (
                                <option key={index} value={subcategory}>{subcategory}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="Tag" className="form-label">Tag</label>
                        <select onChange={handleChange} name='bookTagName' value={formData.bookTagName} className="form-select" id="Tag">
                            <option value="">Choose Tag</option>
                            {allTags && allTags.map((tag, index) => (
                                <option key={index} value={tag._id}>{tag.tagName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bookImage" className="form-label">Book Image</label>
                        <input type="file" id="bookImage" accept="image/*" onChange={handleFileChange} className="form-control" />
                        {imagePreview && <img src={imagePreview} alt="Image preview" style={{ width: '100px', height: 'auto' }} />}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bookPdf" className="form-label">Book PDF</label>
                        <input type="file" id="bookPdf" accept=".pdf" onChange={handlePdfChange} className="form-control" />
                        {/* {pdfPreview && <embed src={pdfPreview} type="application/pdf" width="100%" height="100px" />} */}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bookPrice" className="form-label">Book Price</label>
                        <input type="number" id="bookPrice" name="bookPrice" value={formData.bookPrice} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bookDiscountPresent" className="form-label">Book Discount (%)</label>
                        <input type="number" id="bookDiscountPresent" name="bookDiscountPresent" value={formData.bookDiscountPresent} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bookAfterDiscount" className="form-label">Book Price After Discount</label>
                        <input type="text" id="bookAfterDiscount" name="bookAfterDiscount" value={formData.bookAfterDiscount} readOnly className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="BookHSNCode" className="form-label">Book HSN Code</label>
                        <input type="text" id="BookHSNCode" name="BookHSNCode" value={formData.BookHSNCode} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <div className="form-check">
                            <input type="checkbox" id="feature" name="feature" checked={formData.feature} onChange={handleChange} className="form-check-input" />
                            <label htmlFor="feature" className="form-check-label">Feature Book</label>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="bookDescription" className="form-label">Book Description</label>
                        <JoditEditor
                            ref={editor}
                            value={formData.bookDescription}
                            config={editorConfig}
                            onChange={handleEditorChange}
                        />
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                            {isLoading ? 'Updating...' : 'Update Book'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditBook;
