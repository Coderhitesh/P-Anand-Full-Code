import React, { useState } from 'react';

const AddressForOrder = ({ isOpen, onClose, OrderData, UserToken }) => {
  const [formData, setFormData] = useState({
    streetAddress: '',
    houseNumber: '',
    pincode: '',
    landmark: '',
    addressType: 'Home',    
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('Address-Details',JSON.stringify(formData))
    setFormData({
        streetAddress: '',
        houseNumber: '',
        pincode: '',
        landmark: '',
        addressType: 'Home', 
        confirm: false,
      });
    onClose();
  };

  return (
    <div
    className={`modal fade ${isOpen ? 'show' : ''}`}
    tabIndex="-1"
    role="dialog"
    style={{
      display: isOpen ? 'block' : 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    }}
  >
    <div
      className="modal-dialog"
      role="document"
      style={{
        maxWidth: '600px',
        margin: '1.75rem auto',
      }}
    >
      <div
        className="modal-content"
        style={{
          borderRadius: '8px',
          border: 'none',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div
          className="modal-header bg-danger"
          style={{
           
            color: '#fff',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h5 className="modal-title" style={{ fontWeight: 'bold' }}>
            Enter Address Details
          </h5>
          <button
            type="button"
            className=" text-muted bg-white p-2 fs-5 rounded pill close"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
            }}
          >
            &times;
          </button>
        </div>
        <div className="modal-body" style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
              <label className='mb-2' htmlFor="streetAddress">Street Address</label>
              <input
                type="text"
                className="form-control"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                required
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>
            <div className="form-group mb-2">
              <label className='mb-2' htmlFor="houseNumber">House Number</label>
              <input
                type="text"
                className="form-control"
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                required
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>
            <div className="form-group mb-2">
              <label className='mb-2' htmlFor="pincode">Pincode</label>
              <input
                type="text"
                className="form-control"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>
            <div className="form-group mb-2">
              <label className='mb-2' htmlFor="landmark">Landmark</label>
              <input
                type="text"
                className="form-control"
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              />
            </div>
            <div className="form-group mb-2">
              <label>Address Type</label>
              <select
                className="form-control"
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
                required
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="confirm"
                name="confirm"
                checked={formData.confirm}
                onChange={handleChange}
                required
              />
              <label
                className="form-check-label"
                htmlFor="confirm"
                style={{ marginLeft: '5px' }}
              >
                Confirm address details
              </label>
            </div>
            <button
              type="submit"
              className="w-100 p-3 bg-success theme-btn mt-3 "
              
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default AddressForOrder;
