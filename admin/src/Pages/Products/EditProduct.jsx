import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';

const EditProduct = () => {
    const { id } = useParams();
    const editor = useRef(null);
    const [categories, setCategories] = useState([]);
    const [allTags, setTags] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        courseName: '',
        courseDescription: '',
        courseTagName: '',
        courseCategory: '',
        courseSubCategory: '',
        courseImage: null,
        courseMode: [],
        feature: false,
        startingPrice: '',
        endingPrice: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Predefined course modes
    const courseModes = ['Live', 'Offline', 'Pen Drive', 'Google Drive'];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);

        setFormData((prevFormData) => ({
            ...prevFormData,
            courseImage: file
        }));

        setImagePreview(preview);
    };

    const handleCategoryChange = async (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            courseCategory: value,
            courseSubCategory: ''
        }));

        if (value) {
            try {
                const response = await axios.get(`https://www.api.panandacademy.com/api/v1/single-category/${value}`);
                setSubcategories(response.data.data.subcategoryName);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const calculateDiscountedPrice = (price, discountPercent) => {
        const discount = (price * discountPercent) / 100;
        return price - discount;
    };

    const handleCourseModeChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCourseMode = [...formData.courseMode];
        updatedCourseMode[index] = {
            ...updatedCourseMode[index],
            [name]: value
        };

        if (name === 'coursePrice' || name === 'courseDiscountPercent') {
            const price = parseFloat(updatedCourseMode[index].coursePrice) || 0;
            const discountPercent = parseFloat(updatedCourseMode[index].courseDiscountPercent) || 0;
            updatedCourseMode[index].coursePriceAfterDiscount = calculateDiscountedPrice(price, discountPercent);
        }

        if (name === 'modeType' && value !== 'Google Drive') {
            updatedCourseMode[index].courseLink = '';
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            courseMode: updatedCourseMode
        }));
    };

    const addCourseMode = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            courseMode: [
                ...prevFormData.courseMode,
                { modeType: 'Live', coursePrice: '', coursePriceAfterDiscount: '', courseDiscountPercent: '', courseLink: '' }
            ]
        }));
    };

    const removeCourseMode = (index) => {
        const updatedCourseMode = [...formData.courseMode];
        updatedCourseMode.splice(index, 1);
        setFormData((prevFormData) => ({
            ...prevFormData,
            courseMode: updatedCourseMode
        }));
    };

    const fetchCategories = useCallback(async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-category');
            setCategories(res.data.data);
        } catch (error) {
            console.error('There was an error fetching the categories!', error);
        }
    }, []);

    const fetchTags = useCallback(async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-tag');
            setTags(res.data.data);
        } catch (error) {
            console.error('There was an error fetching the tags!', error);
        }
    }, []);

    const fetchSingleProduct = useCallback(async () => {
        try {
            const res = await axios.get(`https://www.api.panandacademy.com/api/v1/single-course/${id}`);
            const data = res.data.data;

            setFormData({
                courseName: data.courseName,
                courseDescription: data.courseDescription,
                courseTagName: data.courseTagName,
                courseCategory: data.courseCategory,
                courseSubCategory: data.courseSubCategory,
                courseImage: null, // Will handle image separately
                courseMode: data.courseMode || [],
                feature: data.feature || false,
                startingPrice: data.startingPrice || '',
                endingPrice: data.endingPrice || ''
            });

            if (data.courseImage) {
                setImagePreview(data.courseImage.url);
            }
        } catch (error) {
            console.error('There was an error fetching the product!', error);
        }
    }, [id]);

    useEffect(() => {
        fetchCategories();
        fetchTags();
        fetchSingleProduct();
    }, [fetchCategories, fetchTags, fetchSingleProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (key === 'courseMode') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (key === 'courseImage' && formData.courseImage) {
                    formDataToSend.append('courseImage', formData.courseImage);
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }

            const response = await axios.put(`https://www.api.panandacademy.com/api/v1/update-course/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Course Updated Successfully');
            setIsLoading(false);
            window.location.href = "/all-courses";
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

    const handleEditorChange = useCallback((newContent) => {
        setFormData(prevFormData => ({ ...prevFormData, courseDescription: newContent }));
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Edit Course</h4>
                    <Link to="/all-courses" className="btn btn-secondary">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>

                <div className="card p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="courseCategory" className="form-label">Category</label>
                                <select onChange={handleCategoryChange} name='courseCategory' value={formData.courseCategory} className="form-select" id="courseCategory">
                                    <option value="">Choose Category</option>
                                    {categories && categories.map((category) => (
                                        <option key={category._id} value={category._id}>{category.categoryName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="courseSubCategory" className="form-label">Sub Category</label>
                                <select onChange={handleChange} name='courseSubCategory' value={formData.courseSubCategory} className="form-select" id="courseSubCategory">
                                    <option value="">Choose Sub Category</option>
                                    {subcategories && subcategories.map((subcategory) => (
                                        <option key={subcategory} value={subcategory}>{subcategory}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="courseName" className="form-label">Course Name</label>
                                <input
                                    type="text"
                                    name="courseName"
                                    value={formData.courseName}
                                    onChange={handleChange}
                                    className="form-control"
                                    id="courseName"
                                    required
                                />
                            </div>

                            

                            <div className="col-md-6">
                                <label htmlFor="courseTagName" className="form-label">Course Tag</label>
                                <select onChange={handleChange} name='courseTagName' value={formData.courseTagName} className="form-select" id="courseTagName">
                                    <option value="">Choose Tag</option>
                                    {allTags && allTags.map((tag) => (
                                        <option key={tag._id} value={tag.tagName}>{tag.tagName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="courseImage" className="form-label">Course Image</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="form-control"
                                    id="courseImage"
                                    accept="image/*"
                                />
                                {imagePreview && <img src={imagePreview} style={{width:'140px'}} alt="Preview" className="img-fluid mt-2" />}
                            </div>

                            {formData.courseMode.map((mode, index) => (
                                <div className="row g-3" key={index}>
                                    <div className="col-md-3">
                                        <label htmlFor={`courseMode[${index}].modeType`} className="form-label">Mode Type</label>
                                        <select
                                            name="modeType"
                                            value={mode.modeType}
                                            onChange={(e) => handleCourseModeChange(index, e)}
                                            className="form-select"
                                            id={`courseMode[${index}].modeType`}
                                        >
                                            <option value="Live">Live</option>
                                            <option value="Offline">Offline</option>
                                            <option value="Pen Drive">Pen Drive</option>
                                            <option value="Google Drive">Google Drive</option>
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor={`courseMode[${index}].coursePrice`} className="form-label">Course Price</label>
                                        <input
                                            type="number"
                                            name="coursePrice"
                                            value={mode.coursePrice}
                                            onChange={(e) => handleCourseModeChange(index, e)}
                                            className="form-control"
                                            id={`courseMode[${index}].coursePrice`}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor={`courseMode[${index}].courseDiscountPercent`} className="form-label">Discount (%)</label>
                                        <input
                                            type="number"
                                            name="courseDiscountPercent"
                                            value={mode.courseDiscountPercent}
                                            onChange={(e) => handleCourseModeChange(index, e)}
                                            className="form-control"
                                            id={`courseMode[${index}].courseDiscountPercent`}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor={`courseMode[${index}].coursePriceAfterDiscount`} className="form-label">Price After Discount</label>
                                        <input
                                            type="text"
                                            name="coursePriceAfterDiscount"
                                            value={mode.coursePriceAfterDiscount}
                                            readOnly
                                            className="form-control"
                                            id={`courseMode[${index}].coursePriceAfterDiscount`}
                                        />
                                    </div>

                                    {mode.modeType === 'Google Drive' && (
                                        <div className="col-md-12">
                                            <label htmlFor={`courseMode[${index}].courseLink`} className="form-label">Course Link</label>
                                            <input
                                                type="text"
                                                name="courseLink"
                                                value={mode.courseLink}
                                                onChange={(e) => handleCourseModeChange(index, e)}
                                                className="form-control"
                                                id={`courseMode[${index}].courseLink`}
                                            />
                                        </div>
                                    )}

                                    <div className="col-md-12">
                                        <button type="button" onClick={() => removeCourseMode(index)} className="btn btn-danger mt-2">
                                            Remove Mode
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="col-md-12">
                                <button type="button" onClick={addCourseMode} className="btn btn-primary mt-2">
                                    Add Course Mode
                                </button>
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="feature" className="form-check-label">Feature</label>
                                <input
                                    type="checkbox"
                                    name="feature"
                                    checked={formData.feature}
                                    onChange={handleChange}
                                    className="form-check-input"
                                    id="feature"
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="startingPrice" className="form-label">Starting Price</label>
                                <input
                                    type="text"
                                    name="startingPrice"
                                    value={formData.startingPrice}
                                    onChange={handleChange}
                                    className="form-control"
                                    id="startingPrice"
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="endingPrice" className="form-label">Ending Price</label>
                                <input
                                    type="text"
                                    name="endingPrice"
                                    value={formData.endingPrice}
                                    onChange={handleChange}
                                    className="form-control"
                                    id="endingPrice"
                                />
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="courseDescription" className="form-label">Course Description</label>
                                <JoditEditor
                                    ref={editor}
                                    value={formData.courseDescription}
                                    config={editorConfig}
                                    tabIndex={1}
                                    onChange={handleEditorChange}
                                />
                            </div>

                            <div className="col-md-12 text-center mt-4">
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update Product'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProduct;
