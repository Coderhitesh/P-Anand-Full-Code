import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

function AddCourseRating() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [formData, setFormData] = useState({
        courseId: "",
        rating: "",
        categoryId: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchingCourses = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-course');
            setCourses(res.data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleFetchingCategories = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-category');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        handleFetchingCategories();
        handleFetchingCourses();
    }, []);

    const handleCategoryChange = (e) => {
        const selectedcategoryId = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            categoryId: selectedcategoryId,
            courseId: "" // Reset course selection when category changes
        }));

        // Filter courses based on the selected category
        const filtered = courses.filter(course => course.courseCategory === selectedcategoryId);
        setFilteredCourses(filtered);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.courseId) {
            toast.error('Please select a course.');
            return;
        }

        const ratingNumber = parseFloat(formData.rating);
        if (!formData.rating || isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
            toast.error('Please enter a valid rating between 1 and 5.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('https://www.api.panandacademy.com/api/v1/create-course-rating', {
                courseId: formData.courseId,
                rating: formData.rating,
                categoryId: formData.categoryId
            });

            setIsLoading(false);
            toast.success("Rating Added Successfully!");
            window.location.href = '/all-course-rating';
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            {/* <ToastContainer /> */}
            <Toaster />
            <div className="bread">
                <div className="head">
                    <h4>Add Course Rating</h4>
                </div>
                <div className="links">
                    <Link to="/all-course-rating" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="categoryId" className="form-label">Category</label>
                        <select
                            name="categoryId"
                            className="form-select"
                            id="categoryId"
                            value={formData.categoryId}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Choose Category</option>
                            {categories && categories.map((category, index) => (
                                <option key={index} value={category._id}>{category.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="courseId" className="form-label">Course Name</label>
                        <select
                            name="courseId"
                            className="form-select"
                            id="courseId"
                            value={formData.courseId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose Course</option>
                            {filteredCourses && filteredCourses.map((course, index) => (
                                <option key={index} value={course._id}>{course.courseName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="rating" className="form-label">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            className="form-control"
                            id="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            required
                            min="1"
                            max="5"
                        />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`btn ${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Add Rating"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddCourseRating;
