import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Homepost() {
  const [banner,setBanner] = useState([])
  const handleFetchBanner = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-home-banner')
      setBanner(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    handleFetchBanner()
  },[])
  return (
    <div>
      <section className="book-banner-section fix mt-5 pt-md-3 mb-5 pb-3">
        <div className="container">
          <div className="row g-4">
            {
              banner && banner.slice(0, 3).map((item,index)=>(
                <div
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay=".3s"
                style={{ visibility: 'visible', animationDelay: '0.3s', animationName: 'fadeInUp' }}
                key={index}
              >
                <div className="hero-bellow-banner">
                  <img
                    src={item.homeBannerImage.url}
                    className="w-100"
                    alt="img"
                    style={{ borderRadius: '20px', border: '2px solid #e0e0e0' }}
                  />
                </div>
              </div>
              ))
            }
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepost;
