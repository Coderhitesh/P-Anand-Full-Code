import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const EditFreeResource = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the resource ID from the URL parameters

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

    // Fetch the current free resource details
    const fetchFreeResourceDetails = async () => {
        try {
            const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-single-free-resource/${id}`); // Adjust endpoint as necessary
            setFormData({
                FreePDF: null, // Keep this null until a new file is uploaded
                categoryId: res.data.data.categoryId,
                name: res.data.data.name
            });
        } catch (error) {
            console.error('Error fetching free resource details:', error);
            toast.error('Failed to load free resource details.');
        }
    };

    useEffect(() => {
        fetchFreeResourceCategories();
        fetchFreeResourceDetails(); // Fetch the details when the component mounts
    }, [id]);

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

        const formDataToSend = new FormData();
        if (formData.FreePDF) {
            formDataToSend.append('FreePDF', formData.FreePDF); // Append the new PDF if provided
        }
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('name', formData.name);

        try {
            await axios.put(`https://www.api.panandacademy.com/api/v1/update-free-resource/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set correct content-type
                },
            });
            toast.success('Free resource updated successfully!');
            setBtnLoading(false);
            navigate('/all-free-resource'); // Navigate to the list of free resources
        } catch (error) {
            console.error('Error updating free resource:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
            setBtnLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            <div className="bread">
                <div className="head">
                    <h4>Edit Free Resource</h4>
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
                        <label htmlFor="name" className="form-label">Resource Name</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="name"
                            value={formData.name}
                            className="form-control"
                            id="name"
                            placeholder="Enter resource name"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="FreePDF" className="form-label">Select PDF (optional)</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            name="FreePDF"
                            accept="application/pdf"
                            className="form-control"
                            id="FreePDF"
                        />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" className={`btn btn-primary ${btnLoading ? 'not-allowed' : 'allowed'}`}>
                            {btnLoading ? 'Please Wait...' : 'Update Free Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditFreeResource;
