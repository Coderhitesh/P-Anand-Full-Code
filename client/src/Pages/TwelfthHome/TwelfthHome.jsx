import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TwelfthHome = () => {
    const [teacher, setTeacher] = useState([]);
    const [allCourse, setCourse] = useState([]);
    const [allTag, setTag] = useState([]);
    const [allCategory, setCategory] = useState([]);
    const [slidesPerView, setSlidesPerView] = useState('4');
  
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    };
  
    const handleFetchCourse = async () => {
      try {
        const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-course');
        const allData = res.data.data;
        const activeCourse = allData.filter((item) => item.status === true);
        const filterdata = activeCourse.filter((item) => item.courseCategory === '66cc4b3ca51f73c4c01f0a5a');
        setCourse(shuffleArray(filterdata)); // Shuffle the filtered data
      } catch (error) {
        console.log(error);
      }
    };
  
    // const handleFetchCourse = async () => {
    //   try {
    //     const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-course');
    //     const allData = res.data.data;
    //     const filterdata = allData.filter((item) => item.feature === true);
    //     setCourse(shuffleArray(filterdata)); // Shuffle the filtered data
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
  
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
      handleFetchCourse();
      handleResize(); // Set initial slidesPerView value
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    const formatCurrency = (amount) => {
      if (!amount) return '0.00';
      return parseFloat(amount)
          .toFixed(2) // Ensure two decimal places
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format with commas
  };
  
    const handleFetchTeacher = async () => {
      try {
        const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-teacher');
        setTeacher(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleFetchTag = async () => {
      try {
        const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-tag');
        setTag(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleFetchCategory = async () => {
      try {
        const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-category');
        setCategory(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    const getTagNameById = (tagId) => {
      const foundTag = allTag.find((tag) => tag._id === tagId);
      return foundTag ? foundTag.tagName : 'No Tag';
    };
  
    const getCategorygNameById = (CategoryId) => {
      const foundCategory = allCategory.find((category) => category._id === CategoryId);
      return foundCategory ? foundCategory.categoryName : 'No Category';
    };
  
    const getTeacherNameById = (teacherId) => {
      const foundTeacher = teacher.find((teacher) => teacher._id === teacherId);
      return foundTeacher ? foundTeacher.teacherName : 'No Teacher';
    };
  
    useEffect(() => {
      handleFetchTeacher();
      handleFetchCategory();
      handleFetchTag();
      handleFetchCourse();
    }, []);
  
    return (
      <>
        <section style={{paddingTop: '50px'}} className="shop-section section-padding fix">
          <div className="container">
            <div className="section-title-area">
              <div className="section-title">
                <h2 className="wow fadeInUp mobile-title" data-wow-delay=".3s">12th Regular Batch</h2>
              </div>
              <Link to={'/shop'} className="theme-btn transparent-btn wow fadeInUp mobile-title" data-wow-delay=".5s">
                Explore More <i className="fa-solid fa-arrow-right-long"></i>
              </Link>
            </div>
            <Swiper
              slidesPerView={slidesPerView}
              spaceBetween={30}
              navigation={false}
              modules={[Navigation]}
              className="book-slider"
            >
              {allCourse && allCourse.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="shop-box-items style-2">
                    <div className="book-thumb center">
                      <Link to={`/course-detail/${item._id}`}>
                        <img src={item.courseImage.url} alt={item.courseName} />
                      </Link>
                      <ul className="post-box">
                        <li>{getTagNameById(item.courseTagName)}</li>
                      </ul>
                    </div>
                    <div className="shop-content">
                      <h5>{getCategorygNameById(item.courseCategory)}</h5>
                      <h3><Link to={`/course-detail/${item._id}`}>{item.courseName}</Link></h3>
                      {/* <span>By {getTeacherNameById(item.courseTeacherName)}</span> */}
                      <ul className="price-list">
                        <li>₹{formatCurrency(item.startingPrice)} - ₹{formatCurrency(item.endingPrice)}</li>
                      </ul>
                    </div>
                    <div className="shop-button">
                      <Link to={`/course-detail/${item._id}`} className="theme-btn"> View Detail</Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </>
    );
  }
  
export default TwelfthHome
