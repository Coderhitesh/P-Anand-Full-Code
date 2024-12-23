import React from 'react';
import { useNavigate } from 'react-router-dom';

const FailurePage = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    navigate('/contact'); // Redirect to the support page
  };

  return (
    <div style={{height:'70vh', display:'flex',flexDirection:'column',alignItems:"center", justifyContent:'center'
    }} className="container text-center mt-5">
      <div className="alert alert-danger" role="alert">
        <h1 className="alert-heading">Payment Failed</h1>
        <p>Unfortunately, your payment was not successful.</p>
        <hr />
        <p className="mb-0">Please try again or contact support for assistance.</p>
      </div>
      <div className="mt-4">
        <button className="btn btn-primary me-3" onClick={handleRetryPayment}>
        Return to Home
        </button>
        <button className="btn btn-secondary" onClick={handleContactSupport}>
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default FailurePage;
