import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Import required modules
import { Navigation } from 'swiper/modules';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BookBundle() {
    const [allBundle, setAllBundle] = useState([])
    const [allTag,setTag] = useState([])
    const [category, setCategory] = useState([])
    const [slidesPerView, setSlidesPerView] = useState('4');
    const handleFetchCategory = async () => {
      try {
        const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-category')
        setCategory(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
  
    const handleFetchTag = async () => {
      try {
        const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-tag')
        setTag(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
  
    const handleFetchBundle = async () => {
      try {
        const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-bundle')
        setAllBundle(res.data.data)
      } catch (error) {
        console.log('Error in fetchin bundle', error)
      }
    }
  
    const getTagNameById = (tagId) => {
      const foundTag = allTag.find((tag) => tag._id === tagId);
      return foundTag ? foundTag.tagName : 'No Tag';
    };
  
    const getCategorygNameById = (CategoryId) => {
      const foundCategory = category.find(category => category._id === CategoryId);
      return foundCategory ? foundCategory.categoryName : "No Category";
    };

    const handleResize = () => {
      const windowWidth = window.innerWidth;
  
      // Adjust slidesPerView based on window width
      if (windowWidth < 500) {
        setSlidesPerView(1);
      } else if (windowWidth >= 500 && windowWidth < 768) {
        setSlidesPerView(2);
      } else if (windowWidth >= 768 && windowWidth < 1200) {
        setSlidesPerView(4);
      }else{
        setSlidesPerView(4);
      }
    };
    useEffect(() => {
      handleFetchBundle();
      handleResize(); // Set initial slidesPerView value
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
  
    useEffect(() => {
      handleFetchTag()
      handleFetchCategory();
      handleFetchBundle();
    }, [])
  
    return (
      <section className="shop-section section-padding fix pt-0">
        <div className="container">
          <div className="section-title-area">
            <div className="section-title">
              <h2 className="wow fadeInUp mobile-title" data-wow-delay=".3s">Book Bundle</h2>
            </div>
            <Link to={'/book-bundle'} className="theme-btn transparent-btn wow fadeInUp mobile-title" data-wow-delay=".5s">
              Explore More <i className="fa-solid fa-arrow-right-long"></i>
            </Link>
          </div>
          <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={30}
            navigation={false}
              // pagination={false}
            modules={[Navigation]}
            className="book-slider"
          >
            {
              allBundle && allBundle.slice(0, 6).map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="shop-box-items style-2">
                    <div className="book-thumb center">
                      <Link to={`/book-bundle-detail/${item._id}`}>
                        <img src={item.bundleImage.url} alt={item.bundleName} />
                      </Link>
                      <ul className="post-box">
                        <li>{getTagNameById(item.tag)}</li>
                        {/* <li>-{item.bundleDisCountPercenatgae}%</li> */}
                      </ul>
                    </div>
                    <div className="shop-content">
                      <h5>{getCategorygNameById(item.categoryId)}</h5>
                      <h3><Link to={`/book-bundle-detail/${item._id}`}>{item.bundleName}</Link></h3>
                      <ul className="price-list">
                        <li>₹{item.bundlePriceAfterDiscount}</li>
                        <li>
                          <del>₹{item.bundlePrice}</del>
                        </li>
                      </ul>
                    </div>
                    <div className="shop-button">
                      <Link to={`/book-bundle-detail/${item._id}`} className="theme-btn"> View Detail</Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </section>
    )
  }

export default BookBundle
