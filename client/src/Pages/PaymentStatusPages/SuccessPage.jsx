import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const orderId = params.get('id');
  const data = params.get('data');

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/Profile');
  };

  return (
    <div style={{height:'70vh', display:'flex',flexDirection:'column',alignItems:"center", justifyContent:'center'
    }} className="container text-center mt-5">
      <div className="alert alert-success" role="alert">
        <h1 className="alert-heading">Payment Successful!</h1>
        <p>Your order has been successfully placed.</p>
        <hr />
        <p className="mb-0">Order ID: <strong>{orderId}</strong></p>
        <p>Details: {data}</p>
      </div>
      <div className="mt-4">
        <button className="btn btn-primary me-3" onClick={handleReturnHome}>
          Return to Home
        </button>
        <button className="btn btn-secondary" onClick={handleViewOrders}>
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
