import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';
import Select from 'react-select'; // Importing react-select

function EditBookBundle() {
    const { id } = useParams(); // Getting the bundle ID from the URL params
    const editor = useRef(null);
    const [allTag, setAllTag] = useState([]);
    const [categories, setCategories] = useState([]);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        bundleName: '',
        bundlePrice: '',
        bundleDiscountPercent: '',
        bundlePriceAfterDiscount: '',
        categoryId: null,
        bundleBookId: [], // Array of selected book IDs
        tag: '',
        bundleDescription: '',
        bundleImage: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    console.log('filteredBooks', filteredBooks);
    console.log('formData.bundleBookId', formData.bundleBookId);

    // Fetch the existing bundle data
    useEffect(() => {
        const fetchBundle = async () => {
            try {
                const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-single-book-bundle/${id}`);
                const data = res.data.data;

                // Convert bundleBookId to array of IDs
                const bookIds = data.bundleBookId.map(book => book.id); // Assuming bundleBookId is an array of objects with `id` property

                setFormData({
                    ...data,
                    bundleBookId: bookIds, // Set it as an array of IDs
                    bundleImage: data.bundleImage ? { url: data.bundleImage.url } : null
                });
                setImagePreview(data.bundleImage ? data.bundleImage.url : null);

                if (data.categoryId) {
                    const bookRes = await axios.get(`https://www.api.panandacademy.com/api/v1/get-book-by-category/${data.categoryId}`);
                    setFilteredBooks(bookRes.data.data);
                }

                handleFetchCategories();
                handleFetchTags();
            } catch (error) {
                console.error('Error fetching bundle:', error);
                toast.error('Failed to fetch bundle details.');
            }
        };

        fetchBundle();
    }, [id]);

    // Fetch categories for the dropdown
    const handleFetchCategories = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-category');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories.');
        }
    };

    // Fetch books
    useEffect(() => {
        const handleFetchBooks = async () => {
            try {
                const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book');
                setBooks(res.data.data);
                setFilteredBooks(res.data.data);
            } catch (error) {
                console.error('Error fetching books:', error);
                toast.error('Failed to fetch books.');
            }
        };

        handleFetchBooks();
    }, []);

    // Fetch tags
    const handleFetchTags = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-tag');
            setAllTag(res.data.data);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch tags.');
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);

        setFormData((prevFormData) => ({
            ...prevFormData,
            bundleImage: file
        }));

        setImagePreview(preview);
    };

    // Handle multi-select for books
    const handleBookChange = (selectedOptions) => {
        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData({
            ...formData,
            bundleBookId: selectedIds // Set as an array of IDs
        });
    };


    // Handle category change to filter books
    const handleCategoryChange = async (e) => {
        const selectedCategoryId = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            categoryId: selectedCategoryId
        }));

        try {
            const filtered = await axios.get(`https://www.api.panandacademy.com/api/v1/get-book-by-category/${selectedCategoryId}`);
            setFilteredBooks(filtered.data.data);
        } catch (error) {
            console.error('Error fetching filtered books:', error);
            toast.error('Failed to fetch filtered books.');
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = {
                ...prevFormData,
                [name]: type === 'checkbox' ? checked : value
            };

            // Calculate the discount price whenever price or discount changes
            if (name === 'bundlePrice' || name === 'bundleDiscountPercent') {
                const discountPercent = name === 'bundleDiscountPercent' ? value : prevFormData.bundleDiscountPercent;
                const price = name === 'bundlePrice' ? value : prevFormData.bundlePrice;

                updatedFormData.bundlePriceAfterDiscount = calculateDiscountedPrice(price, discountPercent);
            }

            return updatedFormData;
        });
    };

    const calculateDiscountedPrice = (price, discountPercent) => {
        const discount = (price * discountPercent) / 100;
        return price - discount;
    };

    // Handle changes in the JoditEditor
    const handleEditorChange = useCallback((newContent) => {
        setFormData(prevFormData => ({ ...prevFormData, bundleDescription: newContent }));
        // console.log(newContent)
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            for (const key in formData) {
                if (key === 'bundleImage') {
                    if (formData.bundleImage && formData.bundleImage instanceof File) {
                        formDataToSend.append('bundleImage', formData.bundleImage);
                    }
                } else {
                    formDataToSend.append(key, key === 'bundleBookId' ? JSON.stringify(formData[key]) : formData[key]);
                }
            }

            await axios.put(`https://www.api.panandacademy.com/api/v1/update-book-bundle/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Bundle Updated Successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('An Error Occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Memoize editorConfig to prevent re-creation on every render
    const editorConfig = useMemo(() => ({
        readonly: false,
        height: 400
    }), []);

    // Convert filteredBooks to options for react-select
    const options = filteredBooks.map(book => ({
        value: book._id,
        label: book.bookName
    }));

    // Convert selected book IDs to react-select format
    const selectedOptions = options.filter(option => formData.bundleBookId.includes(option.value));

    return (
        <>
            {/* <ToastContainer /> */}

            <Toaster />
            <div className="bread">
                <div className="head">
                    <h4>Edit Book Bundle</h4>
                </div>
                <div className="links">
                    <Link to="/all-book-bundle" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="categoryId" className="form-label">Category</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            className="form-select"
                            onChange={handleCategoryChange}
                            value={formData.categoryId || ''}
                            
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <select
                            className="form-select"
                            id="tag"
                            name="tag"
                            value={formData.tag}
                            onChange={handleChange}
                            
                        >
                            <option value="">Select Tag</option>
                            {allTag.map((item, index) => (
                                <option key={index} value={item._id}>{item.tagName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bundleName" className="form-label">Bundle Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="bundleName"
                            name="bundleName"
                            value={formData.bundleName}
                            onChange={handleChange}
                            
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bundlePrice" className="form-label">Bundle Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="bundlePrice"
                            name="bundlePrice"
                            value={formData.bundlePrice}
                            onChange={handleChange}
                            
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bundleDiscountPercent" className="form-label">Bundle Discount(%)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="bundleDiscountPercent"
                            name="bundleDiscountPercent"
                            value={formData.bundleDiscountPercent}
                            onChange={handleChange}
                            
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bundlePriceAfterDiscount" className="form-label">Bundle Final Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="bundlePriceAfterDiscount"
                            name="bundlePriceAfterDiscount"
                            value={formData.bundlePriceAfterDiscount}
                            onChange={handleChange}
                            readOnly
                            
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bundleImage" className="form-label">Bundle Image(800 x 800)</label>
                        <input
                            type="file"
                            className="form-control"
                            id="bundleImage"
                            name="bundleImage"
                            onChange={handleFileChange}
                            accept="image/*"
                            
                        />
                        {imagePreview && <img style={{ width: '140px', marginTop: '20px' }} src={imagePreview} alt="Image Preview" className="image-preview" />}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bundleBookId" className="form-label">Books</label>
                        <Select
                            isMulti
                            className="basic-multi-select"
                            classNamePrefix="select"
                            name="bundleBookId"
                            options={options}
                            value={selectedOptions}
                            onChange={handleBookChange}
                            
                        />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="bundleDescription" className="form-label">Bundle Description</label>
                        <JoditEditor
                            ref={editor}
                            value={formData.bundleDescription}
                            config={editorConfig}
                            onFocus={() => editor.current && editor.current.focus()}
                            onChange={(newContent) => handleEditorChange(newContent)}
                            tabIndex={1} // Ensure the editor is focusable
                        />
                    </div>

                    <div className="col-md-12">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Bundle'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )}

    export default EditBookBundle;
