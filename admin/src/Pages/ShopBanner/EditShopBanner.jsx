import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

function EditShopBanner() {
    const { id } = useParams(); // Get banner ID from URL parameters
    const [formData, setFormData] = useState({
        homeBannerImage: null,
        active: false
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch the existing banner data
        const fetchBanner = async () => {
            try {
                const response = await axios.get(`https://api.panandacademy.com/api/v1/single-home-banner/${id}`);
                const banner = response.data.data;

                // Set the form data with existing banner data
                setFormData({
                    active: banner.active,
                    homeBannerImage: null // We will handle the image separately
                });

                setImagePreview(banner.homeBannerImage.url);
            } catch (error) {
                console.error('Error fetching banner:', error);
                toast.error('Error fetching banner data.');
            }
        };

        fetchBanner();
    }, [id]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                active: checked
            }));
        } else if (type === 'file') {
            setFormData(prevData => ({
                ...prevData,
                homeBannerImage: event.target.files[0]
            }));
            // Set image preview
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append('homeBannerImage', formData.homeBannerImage);
        data.append('active', formData.active);

        try {
            await axios.put(`https://api.panandacademy.com/api/v1/update-home-banner/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsLoading(false);
            toast.success("Shop Banner Updated Successfully!");
            window.location.href = '/all-shop-banners';
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
                    <h4>Edit Shop Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-shop-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="homeBannerImage" className="form-label">Shop Banner Image(800 x 472)</label>
                        <input
                            type="file"
                            onChange={handleChange}
                            name='homeBannerImage'
                            className="form-control"
                            id="homeBannerImage"
                        />
                        {imagePreview && <img style={{ width: '140px', marginTop: '20px' }} src={imagePreview} alt="Image Preview" className="image-preview" />}
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                onChange={handleChange}
                                type="checkbox"
                                name="active"
                                id="active"
                                checked={formData.active}
                            />
                            <label className="form-check-label" htmlFor="active">
                                Active
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Update Shop Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditShopBanner;
