import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Import required modules
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Import your styles
// import './styles.css';

function TopRatedBook() {
  const [allCategory, setCategory] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [TopRate, setTopRate] = useState([]);

  const handleFetchCourse = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-course');
      const allCourse = res.data.data;
      const filter = allCourse.filter((item) => item.courseRating >= 4.0);
      setTopRate(filter);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchCategory = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-category');
      setCategory(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchTeacher = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-teacher');
      setTeacher(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategorygNameById = (CategoryId) => {
    const foundCategory = allCategory.find(category => category._id === CategoryId);
    return foundCategory ? foundCategory.categoryName : "No Category";
  };

  const getTeacherNameById = (teacherId) => {
    const foundTeacher = teacher.find(teacher => teacher._id === teacherId);
    return foundTeacher ? foundTeacher.teacherName : "No Teacher";
  };

  // Function to generate star rating elements
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 >= 0.5; // Check if there is a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <i key={index} className="fa-solid fa-star"></i>
        ))}
        {halfStar && <i className="fa-solid fa-star-half-stroke"></i>}
        {[...Array(emptyStars)].map((_, index) => (
          <i key={index} className="fa-regular fa-star"></i>
        ))}
      </>
    );
  };

  useEffect(() => {
    handleFetchTeacher();
    handleFetchCategory();
    handleFetchCourse();
  }, []);

  return (
    <section className="featured-books-section pt-100 pb-145 fix section-bg">
      <div className="container">
        <div className="section-title-area justify-content-center">
          <div className="section-title wow fadeInUp" data-wow-delay=".3s">
            <h2 className="mobile-title">Top Rated Course</h2>
          </div>
        </div>

        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          navigation={false}
          modules={[Navigation, Pagination]}
          className="mySwiper"
          loop={true} // Enable infinite scroll
          spaceBetween={40} // Add space between slides
        >
          {TopRate && TopRate.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="shop-box-items style-4 wow fadeInUp" data-wow-delay=".2s">
                <div className="book-thumb center">
                  <Link to={`/course-detail/${item._id}`}>
                    <img src={item.courseImage.url} alt={item.courseName} />
                  </Link>
                </div>
                <div className="shop-content">
                  <ul className="book-category">
                    <li className="book-category-badge">{getCategorygNameById(item.courseCategory)}</li>
                    <li>
                      {renderStars(item.courseRating)}
                      ({item.courseRating})
                    </li>
                  </ul>
                  <h3><Link to={`/course-detail/${item._id}`}>{item.courseName}</Link></h3>
                  <ul className="author-post">
                    <li className="authot-list">
                      <span className="content">By {getTeacherNameById(item.courseTeacherName)}</span>
                    </li>
                  </ul>
                  <div className="book-availablity">
                    <div className="details">
                      <ul className="price-list">
                        <li style={{ fontSize: '16px' }}>Rs:{item.startingPrice} - Rs:{item.endingPrice}</li>
                      </ul>
                      <div className="progress-line"></div>
                    </div>
                    <div className="shop-btn">
                      <Link to={`/course-detail/${item._id}`}>
                        <i className="fa-regular fa-basket-shopping"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default TopRatedBook;
