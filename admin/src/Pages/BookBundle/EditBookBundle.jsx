import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';
import Select from 'react-select'; // Importing react-select

function EditBookBundle() {
    const { id } = useParams(); // Getting the bundle ID from the URL params
    const editor = useRef(null);
    const [allTag, setAllTag] = useState([]);
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
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

    // Fetch the existing bundle data
    useEffect(() => {
        const fetchBundle = async () => {
            try {
                const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-single-book-bundle/${id}`);
                const data = res.data.data;
                setFormData({
                    ...data,
                    bundleImage: data.bundleImage ? { url: data.bundleImage.url } : null
                });
                setImagePreview(data.bundleImage ? data.bundleImage.url : null);

                // Fetch categories and courses
                handleFetch();
                handleFetchTag();
            } catch (error) {
                console.error('Error fetching bundle:', error);
            }
        };

        fetchBundle();
    }, [id]);

    useEffect(()=>{
        const handleFetchCourse = async () => {
            try {
                const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book')
                setCourses(res.data.data)
                setFilteredCourses(res.data.data);
            } catch (error) {
                console.log(error)
            }
        }
        handleFetchCourse()
    },[])

    // Fetch categories for the dropdown
    const handleFetch = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-category');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleFetchTag = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-tag');
            setAllTag(res.data.data);
        } catch (error) {
            console.log(error);
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

    // Handle multi-select for courses
    const handleCourseChange = (selectedOptions) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            bundleBookId: selectedOptions.map(option => option.value)
        }));
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

    // Handle category change to filter courses
    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            categoryId: selectedCategoryId
        }));

        const filtered = courses.filter(course => course.categoryId === selectedCategoryId);
        setFilteredCourses(filtered);
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
                            onChange={handleChange}
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
                        {imagePreview && <img style={{width:'140px',marginTop:'20px'}} src={imagePreview} alt="Image Preview" className="image-preview" />}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="bundleBookId" className="form-label">Courses</label>
                        <Select
                            isMulti
                            name="bundleBookId"
                            options={filteredCourses.map(course => ({
                                value: course._id,
                                label: course.bookName
                            }))}
                            value={formData.bundleBookId.map(id => ({
                                value: id,
                                label: courses.find(course => course._id === id)?.bookName
                            }))}
                            onChange={handleCourseChange}
                        />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="bundleDescription" className="form-label">Bundle Description</label>
                        <JoditEditor
                            ref={editor}
                            value={formData.bundleDescription}
                            config={editorConfig}
                            onChange={handleEditorChange}
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
    );
}

export default EditBookBundle;
