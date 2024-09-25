import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AddGalleryImage = () => {
  const navigate = useNavigate();

  // State to hold form data and categories
  const [formData, setFormData] = useState({
    image: null, // File object
    galleryCategoryId: '', // Gallery Category ID
  });
  const [galleryCategories, setGalleryCategories] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch Gallery Categories for Dropdown
  const fetchGalleryCategories = async () => {
    try {
      const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-gallery-category-name');
      setGalleryCategories(res.data.data); // Assuming categories come as `data.data`
    } catch (error) {
      console.error('Error fetching gallery categories:', error);
      toast.error('Failed to load gallery categories.');
    }
  };

  useEffect(() => {
    fetchGalleryCategories();
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
      image: file,
    });

    // Preview the selected image
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    // Ensure the image file is provided
    if (!formData.image) {
      toast.error("Please select an image.");
      setBtnLoading(false);
      return;
    }
    // console.log('formData',formData)
    const formDataToSend = new FormData();
    formDataToSend.append('image', formData.image); // Ensure 'image' key matches what backend expects
    formDataToSend.append('galleryCategoryId', formData.galleryCategoryId);

    try {
      await axios.post('https://api.panandacademy.com/api/v1/create-gallery-image', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set correct content-type
        },
      });
      toast.success('Gallery image added successfully!');
      setBtnLoading(false);
      navigate('/all-gallery-image');
    } catch (error) {
      console.error('Error creating gallery image:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
      setBtnLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>Add Gallery Image</h4>
        </div>
        <div className="links">
          <Link to="/all-gallery-image" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="col-md-6">
            <label htmlFor="image" className="form-label">Select Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              name="image"
              accept="image/*"
              className="form-control"
              id="image"
              required
            />
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="galleryCategoryId" className="form-label">Select Gallery Category</label>
            <select
              name="galleryCategoryId"
              id="galleryCategoryId"
              onChange={handleChange}
              value={formData.galleryCategoryId}
              className="form-control"
              required
            >
              <option value="">-- Select Category --</option>
              {galleryCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 text-center">
            <button type="submit" className={`btn btn-primary ${btnLoading ? 'not-allowed' : 'allowed'}`}>
              {btnLoading ? 'Please Wait...' : 'Add Gallery Image'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddGalleryImage;
