import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BookOrder = ({ user }) => {
  const [formData, setFormData] = useState({
    FullName: user?.FullName || '',
    Email: user?.Email || '',
    ContactNumber: user?.ContactNumber || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `https://www.api.panandacademy.com/api/v1/update-user-profile/${user._id}`,
        formData
      );

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        // Update local storage with new user data
        const updatedUser = { ...user, ...formData };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div style={{backgroundColor:'#040404'}} className="card-header text-white py-3">
              <h4 className="card-title mb-0">Update Profile</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="FullName" className="form-label">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="FullName"
                      name="FullName"
                      value={formData.FullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="Email" className="form-label">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="Email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="ContactNumber" className="form-label">
                    Contact Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-phone"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      id="ContactNumber"
                      name="ContactNumber"
                      value={formData.ContactNumber}
                      onChange={handleChange}
                      placeholder="Enter your contact number"
                      required
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                   style={{backgroundColor:'#A06A29', color:'white'}}
                    type="submit"
                    className="btn py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Current Profile Details */}
          <div className="card mt-4 shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">Current Profile Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-4">
                  <p className="text-muted mb-0">Name:</p>
                </div>
                <div className="col-sm-8">
                  <p className="mb-0">{user?.FullName}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <p className="text-muted mb-0">Email:</p>
                </div>
                <div className="col-sm-8">
                  <p className="mb-0">{user?.Email}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <p className="text-muted mb-0">Contact:</p>
                </div>
                <div className="col-sm-8">
                  <p className="mb-0">{user?.ContactNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOrder;