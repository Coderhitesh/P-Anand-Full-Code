import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import JoditEditor from 'jodit-react';

function EditBook() {
    const { id } = useParams();
    const editor = useRef(null); // Reference to the editor instance
    const additionalInfoEditor = useRef(null); // Reference to the aditionalInfo editor instance
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
        aditionalInfo: '' // Added aditionalInfo field
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch existing book details
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await axios.get(`https://api.panandacademy.com/api/v1/get-single-book/${id}`);
                const book = res.data.data;
                setFormData({
                    bookName: book.bookName,
                    bookDescription: book.bookDescription,
                    bookTagName: book.bookTagName,
                    bookCategory: book.bookCategory,
                    bookSubCategory: book.bookSubCategory,
                    bookImage: null,
                    bookPdf: null,
                    feature: book.feature,
                    bookPrice: book.bookPrice,
                    bookAfterDiscount: book.bookAfterDiscount,
                    bookDiscountPresent: book.bookDiscountPresent,
                    BookHSNCode: book.BookHSNCode,
                    aditionalInfo: book.aditionalInfo || '' // Fetch aditionalInfo data
                });
                setImagePreview(book.bookImage.url);
                // console.log('bookpdf',book.bookPdf)
                // setPdfPreview(book.bookPdf);
            } catch (error) {
                console.error('Error fetching book details:', error);
                toast.error('Failed to fetch book details.');
            }
        };

        fetchBookDetails();
    }, [id]);

    // Fetch categories and tags
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book-category');
                setCategories(res.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories.');
            }
        };

        const fetchTags = async () => {
            try {
                const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book-tag');
                setTags(res.data.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
                toast.error('Failed to fetch tags.');
            }
        };

        fetchCategories();
        fetchTags();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFormData((prevFormData) => ({
                ...prevFormData,
                bookImage: file
            }));
            setImagePreview(preview);
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFormData((prevFormData) => ({
                ...prevFormData,
                bookPdf: file
            }));
            setPdfPreview(preview);
        }
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
                const response = await axios.get(`https://api.panandacademy.com/api/v1/single-book-category/${value}`);
                setSubcategories(response.data.data.subcategoryName);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
                toast.error('Failed to fetch subcategories.');
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

    const handleAdditionalInfoEditorChange = useCallback((newContent) => {
        setFormData(prevFormData => ({ ...prevFormData, aditionalInfo: newContent }));
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

            const response = await axios.put(`https://api.panandacademy.com/api/v1/update-book/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            toast.success('Book Updated Successfully');
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('An Error Occurred');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (editor.current) {
            editor.current?.focus();
        }
    }, []);

    const editorConfig = useMemo(() => ({
        readonly: false,
        height: 400
    }), []);


    return (
        <>
            <Toaster />
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
                    {/* Book Name */}
                    <div className="col-md-6">
                        <label htmlFor="bookName" className="form-label">Book Name</label>
                        <input
                            type="text"
                            id="bookName"
                            name="bookName"
                            value={formData.bookName}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                        <label htmlFor="bookCategory" className="form-label">Category</label>
                        <select
                            onChange={handleCategoryChange}
                            name='bookCategory'
                            value={formData.bookCategory}
                            className="form-select"
                            id="bookCategory"
                          
                        >
                            <option value="">Choose Category</option>
                            {categories && categories.map((category, index) => (
                                <option key={index} value={category._id}>{category.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sub Category */}
                    <div className="col-md-6">
                        <label htmlFor="bookSubCategory" className="form-label">Sub Category</label>
                        <select
                            onChange={handleChange}
                            name='bookSubCategory'
                            value={formData.bookSubCategory}
                            className="form-select"
                            id="bookSubCategory"
                            
                        >
                            <option value="">Choose Sub Category</option>
                            {subcategories && subcategories.map((subcategory, index) => (
                                <option key={index} value={subcategory}>{subcategory}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tag */}
                    <div className="col-md-6">
                        <label htmlFor="Tag" className="form-label">Tag</label>
                        <select
                            onChange={handleChange}
                            name='bookTagName'
                            value={formData.bookTagName}
                            className="form-select"
                            id="Tag"
                           
                        >
                            <option value="">Choose Tag</option>
                            {allTags && allTags.map((tag, index) => (
                                <option key={index} value={tag._id}>{tag.tagName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Book Image */}
                    <div className="col-md-6">
                        <label htmlFor="bookImage" className="form-label">Book Image(800 x 800)</label>
                        <input
                            type="file"
                            id="bookImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Image preview"
                                style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                            />
                        )}
                    </div>

                    {/* Book PDF */}
                    <div className="col-md-6">
                        <label htmlFor="bookPdf" className="form-label">Book PDF</label>
                        <input
                            type="file"
                            id="bookPdf"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            className="form-control"
                            // value={formData.bookPdf}
                        />
                        {/* Uncomment if you want to display PDF preview */}
                        {pdfPreview && (
                            <iframe
                                src={pdfPreview}
                                type="application/pdf"
                                width="200px"
                                height="p00px"
                                style={{ marginTop: '10px' }}
                            />
                        )}
                    </div>

                    {/* Book Price */}
                    <div className="col-md-6">
                        <label htmlFor="bookPrice" className="form-label">Book Price</label>
                        <input
                            type="number"
                            id="bookPrice"
                            name="bookPrice"
                            value={formData.bookPrice}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    {/* Book Discount */}
                    <div className="col-md-6">
                        <label htmlFor="bookDiscountPresent" className="form-label">Book Discount (%)</label>
                        <input
                            type="number"
                            id="bookDiscountPresent"
                            name="bookDiscountPresent"
                            value={formData.bookDiscountPresent}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    {/* Book Price After Discount */}
                    <div className="col-md-6">
                        <label htmlFor="bookAfterDiscount" className="form-label">Book Price After Discount</label>
                        <input
                            type="text"
                            id="bookAfterDiscount"
                            name="bookAfterDiscount"
                            value={formData.bookAfterDiscount}
                            readOnly
                            className="form-control"
                        />
                    </div>

                    {/* Book HSN Code */}
                    <div className="col-md-6">
                        <label htmlFor="BookHSNCode" className="form-label">Book HSN Code</label>
                        <input
                            type="text"
                            id="BookHSNCode"
                            name="BookHSNCode"
                            value={formData.BookHSNCode}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    {/* Feature Book */}
                    <div className="col-md-6">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="feature"
                                name="feature"
                                checked={formData.feature}
                                onChange={handleChange}
                                className="form-check-input"
                            />
                            <label htmlFor="feature" className="form-check-label">Feature Book</label>
                        </div>
                    </div>

                    {/* Book Description */}
                    <div className="col-md-12">
                        <label htmlFor="bookDescription" className="form-label">Book Description</label>
                        <JoditEditor
                            ref={editor}
                            value={formData.bookDescription}
                            config={editorConfig}
                            onChange={handleEditorChange}
                        />
                    </div>

                    {/* Additional Info Editor */}
                    <div className="col-md-12">
                        <label htmlFor="aditionalInfo" className="form-label">Additional Information</label>
                        <JoditEditor
                            ref={additionalInfoEditor}
                            value={formData.aditionalInfo}
                            config={editorConfig}
                            onChange={handleAdditionalInfoEditorChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Book'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );

}

export default EditBook;
