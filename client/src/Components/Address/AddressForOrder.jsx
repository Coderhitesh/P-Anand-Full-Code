import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import './address.css'

const AddressForOrder = ({ isOpen, onClose, OrderData, UserToken }) => {
  const [formData, setFormData] = useState({
    streetAddress: '',
    houseNumber: '',
    pincode: '',
    landmark: '',
    addressType: 'Home',
    confirm: false,
    City: '',
    State: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.confirm) {
        toast.error('Please confirm your address details');
        return;
      }

      sessionStorage.setItem('Address-Details', JSON.stringify(formData));
      toast.success('Address saved successfully!');
      setFormData({
        streetAddress: '',
        houseNumber: '',
        pincode: '',
        landmark: '',
        addressType: 'Home',
        confirm: false,
        City: '',
        State: ''
      });
      onClose();
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" 
      style={{ 
        display: 'block', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header bg-gradient-primary border-0">
            <div className="d-flex align-items-center">
              <i className="bi bi-geo-alt-fill text-white me-2 fs-4"></i>
              <h5 className="modal-title text-white mb-0 fw-bold">
                Delivery Address
              </h5>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close">
            </button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* City & State */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="City"
                      name="City"
                      placeholder="Enter city"
                      value={formData.City}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="City">City</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="State"
                      name="State"
                      placeholder="Enter state"
                      value={formData.State}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="State">State</label>
                  </div>
                </div>

                {/* Street Address */}
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="streetAddress"
                      name="streetAddress"
                      placeholder="Enter street address"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="streetAddress">Street Address</label>
                  </div>
                </div>

                {/* House Number & Pincode */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="houseNumber"
                      name="houseNumber"
                      placeholder="Enter house number"
                      value={formData.houseNumber}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="houseNumber">House Number</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="pincode"
                      name="pincode"
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="pincode">Pincode</label>
                  </div>
                </div>

                {/* Landmark */}
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="landmark"
                      name="landmark"
                      placeholder="Enter landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                    />
                    <label htmlFor="landmark">Landmark (Optional)</label>
                  </div>
                </div>

                {/* Address Type */}
                <div className="col-12">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="addressType"
                      name="addressType"
                      value={formData.addressType}
                      onChange={handleChange}
                      required
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                    <label htmlFor="addressType">Address Type</label>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="confirm"
                      name="confirm"
                      checked={formData.confirm}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="confirm">
                      I confirm that the delivery address provided is correct
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  type="submit"
                  className="btn w-100 py-3 fw-bold text-uppercase"
                  style={{backgroundColor:'#A46023', color:'white'}}
                >
                  Confirm & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForOrder;