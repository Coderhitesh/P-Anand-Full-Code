import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useEffect } from 'react';
import { useState } from 'react';

function OurClient() {
  const [slidesPerView, setSlidesPerView] = useState('4');
  const handleResize = () => {
    const windowWidth = window.innerWidth;

    // Adjust slidesPerView based on window width
    if (windowWidth < 500) {
      setSlidesPerView(1);
    } else if (windowWidth >= 500 && windowWidth < 768) {
      setSlidesPerView(1);
    } else if (windowWidth >= 768 && windowWidth < 1200) {
      setSlidesPerView(3);
    }else{
      setSlidesPerView(2);
    }
  };
  useEffect(() => {
    handleResize(); // Set initial slidesPerView value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div>
      <section className="testimonial-section fix section-padding pt-0 mt-5">
        <div className="container">
            <div className="section-title text-center">
                <h2 className="mb-3 wow fadeInUp" data-wow-delay=".3s">What our client say</h2>
                <p>Students at P Anand Academy praise the exceptional teaching, supportive environment, <br />and the academy's dedication to their academic success.</p>
            </div>
            <Swiper
              navigation={false}
              modules={[Navigation]}
              className="swiper mt-4"
              loop={true} // Enable infinite scroll
              spaceBetween={10} // Space between slides
              slidesPerView={slidesPerView} // Adjust based on how many slides you want visible at once
            >
              <SwiperSlide>
                <div className="testimonial-card-items">
                  <p>
                    The teachers are very frank and it is fun to study at a place like P Anand academy. I would recommend everyone who
                    are now beginning their life in the field of commerce to join P Anand academy and be successful.
                  </p>
                  <div className="client-info-wrapper d-flex align-items-center justify-content-between">
                    <div className="client-info">
                      <div className="client-img bg-cover"
                          style={{ backgroundImage: "url('assets/img/testimonial/poorvi-tayal.png')" }}>
                        <div className="icon">
                          <img className="shape" src="assets/img/testimonial/shape.svg" alt="img" />
                        </div>
                      </div>
                      <div className="content">
                        <h3>Poorvi Tayal</h3>
                        <span>Student</span>
                        <div className="star">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="testimonial-card-items">
                  <p>
                    P Anand Academy offers a wholesome educational experience that goes beyond academics too.
                    The education is top-notch, with dedicated teachers who are experts in their fields. They are always available for doubt solving, 
                    ensuring that students fully understand the material.
                  </p>
                  <div className="client-info-wrapper d-flex align-items-center justify-content-between">
                    <div className="client-info">
                      <div className="client-img bg-cover"
                          style={{ backgroundImage: "url('assets/img/testimonial/jhalak.png')" }}>
                        <div className="icon">
                          <img className="shape" src="assets/img/testimonial/shape.svg" alt="img" />
                        </div>
                      </div>
                      <div className="content">
                        <h3>Jhalak</h3>
                        <span>Student</span>
                        <div className="star">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="testimonial-card-items">
                  <p>
                    Hi all, I just wanted to share my experience. The coaching provided by Prasanjit Sir and his team has been absolutely phenomenal. 
                    Their expertise, dedication, and unwavering support makes a tremendous impact on the learning journey.
                  </p>
                  <div className="client-info-wrapper d-flex align-items-center justify-content-between">
                    <div className="client-info">
                      <div className="client-img bg-cover"
                          style={{ backgroundImage: "url('assets/img/testimonial/isha-jindal.png')" }}>
                        <div className="icon">
                          <img className="shape" src="assets/img/testimonial/shape.svg" alt="img" />
                        </div>
                      </div>
                      <div className="content">
                        <h3>Isha Jindal</h3>
                        <span>Student</span>
                        <div className="star">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="testimonial-card-items">
                  <p>
                    CA Prasanjeeet Sir and CA Vikas sir are the best teachers. Their pattern of making students learn the 
                    concepts is very fabulous. Concept clarity is offered from their way of teaching.
                  </p>
                  <div className="client-info-wrapper d-flex align-items-center justify-content-between">
                    <div className="client-info">
                      <div className="client-img bg-cover"
                          style={{ backgroundImage: "url('assets/img/testimonial/pranav.png')" }}>
                        <div className="icon">
                          <img className="shape" src="assets/img/testimonial/shape.svg" alt="img" />
                        </div>
                      </div>
                      <div className="content">
                        <h3>Pranav Solanki</h3>
                        <span>Student</span>
                        <div className="star">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                          <i className="fa-regular fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
        </div>
      </section>
    </div>
  );
}

export default OurClient;
