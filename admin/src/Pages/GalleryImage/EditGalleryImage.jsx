import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const EditGalleryImage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: null,
    galleryCategoryId: '',
  });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the current gallery image details
  const fetchGalleryImage = async () => {
    try {
      const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-single-gallery-image/${id}`);
      setFormData({
        image: res.data.data.image,
        galleryCategoryId: res.data.data.galleryCategoryId,
      });
      setImagePreview(res.data.data.image.url); // Set the initial image preview
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery image:', error);
      toast.error('Failed to fetch gallery image.');
      setLoading(false);
    }
  };

  // Fetch all gallery categories for the dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-gallery-category-name');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories.');
    }
  };

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
    // Create a preview URL for the uploaded image
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null); // Reset preview if no file
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('galleryCategoryId', formData.galleryCategoryId);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.put(`https://www.api.panandacademy.com/api/v1/update-gallery-image/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsLoading(false);
      toast.success('Gallery image updated successfully!');
      navigate('/all-gallery-image');
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating gallery image:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchGalleryImage();
    fetchCategories();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>Edit Gallery Image</h4>
        </div>
        <div className="links">
          <Link to="/all-gallery-image" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label htmlFor="galleryCategoryId" className="form-label">Gallery Category</label>
            <select
              name="galleryCategoryId"
              value={formData.galleryCategoryId}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="image" className="form-label">Gallery Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="form-control"
              id="image"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100px', height: 'auto', marginTop: '10px' }}
              />
            )}
          </div>

          <div className="col-12 text-center">
            <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
              {isLoading ? "Please Wait..." : "Update Gallery Image"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditGalleryImage;
