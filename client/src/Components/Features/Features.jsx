import React from 'react';
import './feature.css'

function Features() {
  return (
    // <section className="feature-section fix mb-5 pb-4 mt-3">
    //   <div className="container">
    //     <div className="feature-wrapper">
    //       <div className="feature-box-items wow fadeInUp" data-wow-delay=".2s">
    //         <div className="icon">
    //           <i className="icon-icon-1"></i>
    //         </div>
    //         <div className="content">
    //           <h3>Return &amp; refund</h3>
    //           <p>Money back guarantee</p>
    //         </div>
    //       </div>
    //       <div className="feature-box-items wow fadeInUp" data-wow-delay=".4s">
    //         <div className="icon">
    //           <i className="icon-icon-2"></i>
    //         </div>
    //         <div className="content">
    //           <h3>Secure Payment</h3>
    //           <p>30% off by subscribing</p>
    //         </div>
    //       </div>
    //       <div className="feature-box-items wow fadeInUp" data-wow-delay=".6s">
    //         <div className="icon">
    //           <i className="icon-icon-3"></i>
    //         </div>
    //         <div className="content">
    //           <h3>Quality Support</h3>
    //           <p>Always online 24/7</p>
    //         </div>
    //       </div>
    //       <div className="feature-box-items wow fadeInUp" data-wow-delay=".8s">
    //         <div className="icon">
    //           <i className="icon-icon-4"></i>
    //         </div>
    //         <div className="content">
    //           <h3>Daily Offers</h3>
    //           <p>20% off by subscribing</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>

    <section className='feature-section'>
      <div className="feature-container">
        <div className="feature-row">
          <div className="feature-main-col wow fadeInUp" data-wow-delay=".2s">
            <div className="icon">
              <i className="icon-icon-1"></i>
            </div>
            <div className="content">
            <h3>Return &amp; refund</h3>
            <p>Money back guarantee</p>
            </div>
          </div>
          <div className="feature-main-col wow fadeInUp" data-wow-delay=".2s">
            <div className="icon">
              <i className="icon-icon-2"></i>
            </div>
            <div className="content">
            <h3>Secure Payment</h3>
            <p>30% off by subscribing</p>
            </div>
          </div>
          <div className="feature-main-col wow fadeInUp" data-wow-delay=".2s">
            <div className="icon">
              <i className="icon-icon-3"></i>
            </div>
            <div className="content">
            <h3>Quality Support</h3>
            <p>Always online 24/7</p>
            </div>
          </div>
          <div className="feature-main-col wow fadeInUp" data-wow-delay=".2s">
            <div className="icon">
            <i className="icon-icon-4"></i>
            </div>
            <div className="content">
            <h3>Daily Offers</h3>
            <p>20% off by subscribing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
