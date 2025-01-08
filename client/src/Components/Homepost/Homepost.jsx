import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Homepost() {
  const [banner, setBanner] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleFetchBanner = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-home-banner');
      setBanner(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchBanner();
  }, []);

  useEffect(() => {
    if (banner.length > 3) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 3 >= banner.length ? 0 : prev + 3));
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [banner]);

  return (
    <div className="py-5">
      <div className="container">
        <div className="position-relative">
          <div className="row g-4 mb-4">
            {banner.slice(currentSlide, currentSlide + 3).map((item, index) => (
              <div
                className="col-lg-4 col-md-6"
                key={index}
                style={{
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease forwards',
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                  <img
                    src={item.homeBannerImage.url}
                    className="card-img offer_banner_img"
                    alt="Banner"
                  />
                  {/* <div className="card-img-overlay d-flex align-items-end bg-gradient-dark bg-opacity-50">
                    <div className="p-3 text-white">
                      <h5 className="card-title mb-0">Banner {currentSlide + index + 1}</h5>
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="d-flex justify-content-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(banner.length / 3) }).map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm px-2 rounded-circle ${
                  Math.floor(currentSlide / 3) === index
                    ? 'offer_bg_color'
                    : 'offer_border_color'
                }`}
                onClick={() => setCurrentSlide(index * 3)}
                style={{ width: '30px', height: '30px' }}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className="btn offer_bg_color position-absolute top-50 start-0 translate-middle-y d-none d-md-block"
            onClick={() => setCurrentSlide(prev => (prev === 0 ? banner.length - 3 : prev - 3))}
            style={{ transform: 'translateX(-50%)', zIndex: 2 }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="btn offer_bg_color position-absolute top-50 end-0 translate-middle-y d-none d-md-block"
            onClick={() => setCurrentSlide(prev => (prev + 3 >= banner.length ? 0 : prev + 3))}
            style={{ transform: 'translateX(50%)', zIndex: 2 }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .bg-gradient-dark {
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          }

          .card:hover img {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
}

export default Homepost;