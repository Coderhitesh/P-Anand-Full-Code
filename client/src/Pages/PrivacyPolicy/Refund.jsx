import React from 'react';
import { useEffect } from 'react';

function Refund() {
  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },[])
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-12">
          <div className="card shadow-sm">
            <div className="card-body p-3">
              <h2 className="text-center mb-4">Refund Policy</h2>
              <p className="mb-4">
                Please read the terms and conditions carefully before selecting any of the courses, as once you have purchased a course you cannot change or cancel it. Once you purchase and make the required payment, it shall be final, and no changes, modifications, or refunds will be permitted.
              </p>

              <h3 className="text-center mb-3">Need help?</h3>
              <p className="text-center">
                Contact us at <strong>p.anandacademy@gmail.com</strong> for any questions related to refunds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Refund;
