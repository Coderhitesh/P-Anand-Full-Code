import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AddFreeResource = () => {
    const navigate = useNavigate();

    // State to hold form data and categories
    const [formData, setFormData] = useState({
        FreePDF: null, // File object for PDF
        categoryId: '', // Free Resource Category ID
        name: ''
    });
    const [freeResourceCategories, setFreeResourceCategories] = useState([]);
    const [btnLoading, setBtnLoading] = useState(false);

    // Fetch Free Resource Categories for Dropdown
    const fetchFreeResourceCategories = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-free-resource-category');
            setFreeResourceCategories(res.data.data); // Assuming categories come as `data.data`
        } catch (error) {
            console.error('Error fetching free resource categories:', error);
            toast.error('Failed to load free resource categories.');
        }
    };

    useEffect(() => {
        fetchFreeResourceCategories();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            FreePDF: file,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);

        // Ensure the PDF file is provided
        if (!formData.FreePDF) {
            toast.error("Please select a PDF file.");
            setBtnLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('FreePDF', formData.FreePDF); // Ensure 'FreePDF' key matches what backend expects
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('name', formData.name);

        try {
            await axios.post('https://www.api.panandacademy.com/api/v1/create-free-resource', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set correct content-type
                },
            });
            toast.success('Free resource added successfully!');
            setBtnLoading(false);
            navigate('/all-free-resource'); // Navigate to the list of free resources
        } catch (error) {
            console.error('Error creating free resource:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
            setBtnLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            <div className="bread">
                <div className="head">
                    <h4>Add Free Resource</h4>
                </div>
                <div className="links">
                    <Link to="/all-free-resource" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit} encType="multipart/form-data">


                    <div className="col-md-6">
                        <label htmlFor="categoryId" className="form-label">Select Resource Category</label>
                        <select
                            name="categoryId"
                            id="categoryId"
                            onChange={handleChange}
                            value={formData.categoryId}
                            className="form-control"
                            required
                        >
                            <option value="">-- Select Category --</option>
                            {freeResourceCategories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Category Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="name"
                            value={formData.name}
                            className="form-control"
                            id="name"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="FreePDF" className="form-label">Select PDF</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            name="FreePDF"
                            accept="application/pdf"
                            className="form-control"
                            id="FreePDF"
                            required
                        />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" className={`btn btn-primary ${btnLoading ? 'not-allowed' : 'allowed'}`}>
                            {btnLoading ? 'Please Wait...' : 'Add Free Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddFreeResource;
