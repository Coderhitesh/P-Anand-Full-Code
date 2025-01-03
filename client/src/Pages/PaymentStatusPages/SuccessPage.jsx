import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const orderId = params.get('id');
  const rawData = params.get('data');
  let parsedData = {};

  try {
    parsedData = JSON.parse(rawData);
  } catch (error) {
    console.error("Error parsing order details:", error);
  }

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/Profile');
  };

  const { 
    Address, 
    CartItems = [], 
    totalPrice, 
    paymentStatus 
  } = parsedData;

  return (
    <div
      style={{
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="container text-center mt-5"
    >
      <div className="alert alert-success" role="alert">
        <h1 className="alert-heading">Payment Successful!</h1>
        <p>Your order has been successfully placed.</p>
        <hr />
        <p className="mb-0">Order ID: <strong>{orderId}</strong></p>
        <p>Payment Status: <strong>{paymentStatus}</strong></p>
        {/* <p>Address Type: <strong>{Address?.addressType}</strong></p> */}
        <p>Total Price: <strong>₹{totalPrice}</strong></p>
      </div>
      <div className="mt-4">
        <h4>Cart Items</h4>
        {CartItems.length > 0 ? (
          <ul className="list-group">
            {CartItems.map((item, index) => (
              <li key={index} className="list-group-item">
                <strong>{item.productName}</strong> - ₹{item.totalPrice} 
                ({item.productLearningMode})
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in the cart.</p>
        )}
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
