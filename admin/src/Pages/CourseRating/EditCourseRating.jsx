import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCourseRating() {
    const { id } = useParams();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [formData, setFormData] = useState({
        courseId: "",
        rating: "",
        categoryId: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch courses
    const handleFetchingCourses = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-course');
            setCourses(res.data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses.');
        }
    };

    // Fetch categories
    const handleFetchingCategories = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-category');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories.');
        }
    };

    // Fetch rating data for editing
    const handleFetchingRating = async () => {
        try {
            const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-single-course-rating/${id}`);
            setFormData({
                courseId: res.data.data.courseId,
                rating: res.data.data.rating,
                categoryId: res.data.data.categoryId
            });
            // Filter courses based on the fetched category
            const filtered = courses.filter(course => course.courseCategory === res.data.data.categoryId);
            setFilteredCourses(filtered);
        } catch (error) {
            console.error('Error fetching rating data:', error);
            toast.error('Failed to fetch rating data.');
        }
    };

    useEffect(() => {
        handleFetchingCategories();
        handleFetchingCourses();
    }, []);

    useEffect(() => {
        if (courses.length > 0) {
            handleFetchingRating();
        }
    }, [courses, id]);

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            categoryId: selectedCategoryId,
            courseId: ""
        }));

        const filtered = courses.filter(course => course.courseCategory === selectedCategoryId);
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
            await axios.put(`https://www.api.panandacademy.com/api/v1/update-course-rating/${id}`, {
                courseId: formData.courseId,
                rating: formData.rating,
                categoryId: formData.categoryId
            });

            setIsLoading(false);
            toast.success("Rating Updated Successfully!");
            navigate('/all-course-rating');
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            <ToastContainer />

            <div className="bread">
                <div className="head">
                    <h4>Edit Course Rating</h4>
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
                            {isLoading ? "Please Wait..." : "Update Rating"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditCourseRating;
