import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { Pagination } from 'swiper/modules';
import axios from 'axios';

// import './styles.css'; // Make sure to import your CSS for styling

export default function OurTeam() {
  const [slidesPerView, setSlidesPerView] = useState('4');
  const [teacher, setTeacher] = useState([])
  const handleFetchTeacher = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-teacher')
      setTeacher(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleResize = () => {
    const windowWidth = window.innerWidth;

    // Adjust slidesPerView based on window width
    if (windowWidth < 500) {
      setSlidesPerView(1);
    } else if (windowWidth >= 500 && windowWidth < 768) {
      setSlidesPerView(2);
    } else if (windowWidth >= 768 && windowWidth < 1200) {
      setSlidesPerView(4);
    } else {
      setSlidesPerView(4);
    }
  };
  useEffect(() => {
    handleFetchTeacher();
    handleResize(); // Set initial slidesPerView value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    handleFetchTeacher();
  }, [])
  return (
    <section className="team-section fix section-padding pt-0 margin-bottom-30">
      <div className="container">
        <div className="section-title text-center">
          <h2 className="mb-3 wow fadeInUp" data-wow-delay=".3s">Our Team</h2>
          <p className="wow fadeInUp" data-wow-delay=".5s">
            P Anand Academy excels in personalized education, fostering academic excellence and <br />
            holistic development through expert guidance and innovative teaching
          </p>
        </div>
        <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={30}
          pagination={false}
          //   navigation={false}
          modules={[Pagination]}
          loop={true} // Enable infinite scroll
          className="team-slider"
        >
          {
            teacher && teacher.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="team-box-items">
                  <div className="team-image">
                    <div className="thumb">
                      <img src={item.teacherImage.url} alt="img" />
                    </div>
                    {/* <div className="shape-img">
                      <img src="assets/img/team/shape-img.png" alt="img" />
                    </div> */}
                  </div>
                  <div className="team-content text-center">
                    <h6 style={{ marginBottom: '0%' }}><a>{item.teacherName}</a></h6>
                    {/* <p>{item.teacherExpertise[0]}</p> */}
                  </div>
                </div>
              </SwiperSlide>
            ))
          }

          
        </Swiper>
      </div>
    </section>
  );
}
