import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const EditGalleryCategoryName = () => {
  const { id } = useParams();

  const [formData, setData] = useState({
    name: '', // This corresponds to the gallery category name
  });

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...formData,
      [name]: value,
    });
  };

  const handleFetch = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-gallery-category-name');
      const categories = res.data.data;
      const filteredData = categories.find((category) => category._id === id);

      if (filteredData) {
        setData({
          name: filteredData.name,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Gallery Category:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBtnLoading(true);

    try {
      await axios.put(`https://www.api.panandacademy.com/api/v1/update-gallery-category-name/${id}`, formData);
      toast.success('Gallery Category Updated Successfully!');
      setBtnLoading(false);
      window.location.href = '/all-gallery-name'; // Redirect after successful update
    } catch (error) {
      setBtnLoading(false);
      console.error('Error updating Gallery Category:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    handleFetch();
  }, [id]);

  return (
    <>
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>Edit Gallery Category</h4>
        </div>
        <div className="links">
          <Link to="/all-gallery-name" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label htmlFor="name" className="form-label">
                Gallery Category Name
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="name"
                value={formData.name}
                className="form-control"
                id="name"
              />
            </div>

            <div className="col-12 text-center">
              <button type="submit" className={`btn btn-primary ${btnLoading ? 'not-allowed' : 'allowed'}`}>
                {btnLoading ? 'Please Wait..' : 'Update Gallery Category'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditGalleryCategoryName;
