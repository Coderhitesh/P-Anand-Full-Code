import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <div className="alert alert-danger p-5">
        <div className="display-1">
          🎊✅
        </div>
        <h1 className="mt-4">Order Placed Successfully!</h1>
        <p className="lead">Thank you for your purchase. Your order has been placed and is being processed.</p>
        <hr />
        <p className="mb-0">You will receive an order confirmation email with details shortly.</p>
        <Link  to={'/'} className="theme-btn mt-4">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
