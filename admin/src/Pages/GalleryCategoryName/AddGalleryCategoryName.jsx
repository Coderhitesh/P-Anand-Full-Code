import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

function AddGalleryCategoryName() {
    const [formData, setFormData] = useState({
        name: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     fetchCategories();
    // }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        if (!formData.name) {
            toast.error('Please enter a category name');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('https://www.api.panandacademy.com/api/v1/create-gallery-category-name', formData);
            setIsLoading(false);
            toast.success('Gallery Category Added Successfully !!');
            // Optionally, reset the form or fetch categories again
            setFormData({ name: '' });
            // fetchCategories(); // Refresh the list of categories
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            <Toaster />
            <div className="bread">
                <div className="head">
                    <h4>Add Gallery Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-gallery-name" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="name"
                            value={formData.name}
                            className="form-control"
                            id="categoryName"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`btn btn-primary ${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? 'Please Wait...' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddGalleryCategoryName;
