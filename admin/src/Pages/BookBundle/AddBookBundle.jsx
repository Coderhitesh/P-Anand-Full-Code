import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';
import Select from 'react-select'; // Importing react-select

function AddBookBundle() {
    const editor = useRef(null);
    const [allTag, setAllTag] = useState([])
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]); // State to hold courses
    // console.log('course',courses)
    // console.log('category',categories)
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        bundleName: '',
        bundlePrice: '',
        bundleDiscountPercent: '',
        bundlePriceAfterDiscount: '',
        categoryId: '',
        bundleBookId: [],
        tag: '',
        bundleDescription: '',
        bundleImage: null,
        bundleMode: [],
        feature: false
    });
    const [isLoading, setIsLoading] = useState(false);

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

    // Fetch courses based on the selected category
    const handleCategoryChange = async (e) => {
        const { value } = e.target;
        //   console.log(value)
        setFormData((prevFormData) => ({
            ...prevFormData,
            categoryId: value,
        }));

        if (value) {
            try {
                const res = await axios.get(`http://localhost:9000/api/v1/get-book-by-category/${value}`);
                // console.log(res.data.data)
                setCourses(res.data.data); // Update courses based on the selected category
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        } else {
            setCourses([]);
        }
    };

    // Handle multi-select for courses
    const handleCourseChange = (selectedOptions) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            bundleBookId: selectedOptions.map(option => option.value) // Update bundleBookId with selected course IDs
        }));
    };

    // Handle other input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // setFormData((prevFormData) => ({
        //     ...prevFormData,
        //     [name]: type === 'checkbox' ? checked : value
        // }));

        setFormData((prevFormData)=>{
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
        })

         
    };

    const calculateDiscountedPrice = (price, discountPercent) => {
        const discount = (price * discountPercent) / 100;
        return price - discount;
    };

    // Fetch categories for the dropdown
    const handleFetch = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-book-category');
            // console.log(res.data.data)
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleFetchTag = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-book-tag')
            setAllTag(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchTag();
        handleFetch();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            for (const key in formData) {
                if (key === 'bundleImage') {
                    if (formData.bundleImage) {
                        formDataToSend.append('bundleImage', formData.bundleImage);
                    }
                } else {
                    formDataToSend.append(key, key === 'bundleBookId' ? JSON.stringify(formData[key]) : formData[key]);
                }
            }

            const response = await axios.post('http://localhost:9000/api/v1/create-book-bundle', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Bundle Added Successfully');
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

    // Handle changes in the JoditEditor
    const handleEditorChange = useCallback((newContent) => {
        setFormData(prevFormData => ({ ...prevFormData, bundleDescription: newContent }));
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Book Bundle</h4>
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
                            value={formData.categoryId}
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
                            {
                                allTag && allTag.map((item, index) => (
                                    <option key={index} value={item._id}>{item.tagName}</option>
                                ))
                            }
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
                        <label htmlFor="bundlePriceAfterDiscount" className="form-label">Bundle Finale Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="bundlePriceAfterDiscount"
                            name="bundlePriceAfterDiscount"
                            value={formData.bundlePriceAfterDiscount}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bundleImage" className="form-label">Bundle Image</label>
                        <input
                            type="file"
                            className="form-control"
                            id="bundleImage"
                            name="bundleImage"
                            onChange={handleFileChange}
                        />
                        {imagePreview && <img style={{ width: '80px', height: '80px' }} src={imagePreview} alt="Bundle Preview" className="img-preview mt-2" />}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="bundleBookId" className="form-label">Select Courses</label>
                        <Select
                            id="bundleBookId"
                            name="bundleBookId"
                            options={courses.map(course => ({ value: course._id, label: course.bookName }))}
                            isMulti
                            onChange={handleCourseChange}
                            value={courses.filter(course => formData.bundleBookId.includes(course._id)).map(course => ({ value: course._id, label: course.bookName }))}
                        />
                    </div>

                    <div className="col-md-12 mt-3">
                        <label htmlFor="bundleDescription" className="form-label">Bundle Description</label>
                        <JoditEditor
                            ref={editor}
                            value={formData.bundleDescription}
                            config={editorConfig}
                            onBlur={(newContent) => handleEditorChange(newContent)}
                        />
                    </div>

                    <div className="col-md-12 mt-3">
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'Add Bundle'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddBookBundle
