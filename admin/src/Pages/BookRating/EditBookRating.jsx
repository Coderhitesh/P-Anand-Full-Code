import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

function EditBookRating() {
    const { id } = useParams(); // Getting the rating ID from the URL params
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [formData, setFormData] = useState({
        bookId: "",
        rating: "",
        categoryId: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch the existing rating data
    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await axios.get(`https://api.panandacademy.com/api/v1/get-single-book-rating/${id}`);
                const data = res.data.data;
                setFormData({
                    bookId: data.bookId,
                    rating: data.rating,
                    categoryId: data.categoryId
                });

                // Fetch the categories and courses
                handleFetchingCategories();
                handleFetchingCourses();
            } catch (error) {
                console.error('Error fetching rating:', error);
                toast.error('Failed to fetch rating data');
            }
        };

        fetchRating();
    }, [id]);

    const handleFetchingCourses = async () => {
        try {
            const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book');
            setCourses(res.data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleFetchingCategories = async () => {
        try {
            const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book-category');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        // Filter courses based on the selected category
        const filtered = courses.filter(course => course.bookCategory === formData.categoryId);
        setFilteredCourses(filtered);
    }, [formData.categoryId, courses]);

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            categoryId: selectedCategoryId,
            bookId: "" // Reset course selection when category changes
        }));
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
        if (!formData.bookId) {
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
            await axios.put(`https://api.panandacademy.com/api/v1/update-book-rating/${id}`, {
                bookId: formData.bookId,
                rating: formData.rating,
                categoryId: formData.categoryId
            });

            setIsLoading(false);
            toast.success("Rating Updated Successfully!");
            window.location.href = '/all-book-rating';
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
                    <h4>Edit Book Rating</h4>
                </div>
                <div className="links">
                    <Link to="/all-book-rating" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
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
                        <label htmlFor="bookId" className="form-label">Book Name</label>
                        <select
                            name="bookId"
                            className="form-select"
                            id="bookId"
                            value={formData.bookId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose Book</option>
                            {filteredCourses && filteredCourses.map((course, index) => (
                                <option key={index} value={course._id}>{course.bookName}</option>
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

export default EditBookRating;
