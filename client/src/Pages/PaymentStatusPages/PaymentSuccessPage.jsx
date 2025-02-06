import React from 'react';

const PaymentSuccessPage = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg text-center p-4" style={{ maxWidth: '400px', borderRadius: '15px' }}>
        <div className="card-body">
          <div className="text-success display-1 mb-3">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h2 className="card-title fw-bold">Payment Successful!</h2>
          <p className="card-text text-muted">Your transaction has been completed successfully.</p>
          <div className="alert alert-success mt-3" role="alert">
            Thank you for your purchase!
          </div>
          <a href="/" style={{backgroundColor:'#A56122', color:'white'}} className="btn w-100 mt-3">Return to Home</a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
