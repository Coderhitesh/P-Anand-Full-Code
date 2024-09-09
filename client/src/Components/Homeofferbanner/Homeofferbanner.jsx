import React from 'react';

function Homeofferbanner() {
  return (
    <>
      <section className="cta-banner-section fix section-padding pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="home-inner-banner">
                <img
                  src="assets/img/home-inner-banner.webp"
                  alt="Banner"
                  className="w-100"
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Homeofferbanner;
