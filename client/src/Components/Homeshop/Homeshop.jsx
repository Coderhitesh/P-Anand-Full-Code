import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

function Homeshop() {
  const [book, setBook] = useState([])
  const [tag, setTag] = useState([])
  const [category, setCategory] = useState([])
  const [slidesPerView, setSlidesPerView] = useState('4');

  const handleFetchBook = async () => {
    try {
      const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book')
      // console.log(res.data.data)
      setBook(res.data.data)
    } catch (error) {
      console.log('error in fetching book', error)
    }
  }

  const handleFetchCategory = async () => {
    try {
      const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book-category')
      setCategory(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return parseFloat(amount)
        .toFixed(2) // Ensure two decimal places
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format with commas
};


  const handleFetchTag = async () => {
    try {
      const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book-tag')
      setTag(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getTagNameById = (tagId) => {
    const foundTag = tag.find(tag => tag._id === tagId);
    return foundTag ? foundTag.tagName : "No Tag";
  };

  const getCategoryNameById = (categoryId) => {
    const foundCategory = category.find(cat => cat._id === categoryId);
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
    handleFetchCategory();
    handleFetchTag();
    handleFetchBook();
    handleResize(); // Set initial slidesPerView value
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
  }, [])

  return (
    <>
      <section className="shop-section section-padding fix">
        <div className="container">
          <div className="section-title-area">
            <div className="section-title mb- wow fadeInUp" data-wow-delay=".3s">
              <h2 className="mobile-title">Books</h2>
            </div>
            <Link to="/Book" className="theme-btn transparent-btn wow fadeInUp" data-wow-delay=".5s">
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
              book && book.slice(0, 8).map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="shop-box-items style-2">
                    <div className="book-thumb center">
                      <Link to={`/Book-detail/${item._id}`}>
                        <img src={item.bookImage.url} alt={item.bookName} />
                      </Link>
                      <ul className="post-box">
                        <li>{getTagNameById(item.bookTagName)}</li>
                        {/* <li>-{item.bundleDisCountPercenatgae}%</li> */}
                      </ul>
                    </div>
                    <div className="shop-content">
                      <h5>{getCategoryNameById(item.bookCategory)}</h5>
                      <h3><Link to={`/Book-detail/${item._id}`}>{item.bookName}</Link></h3>
                      <ul className="price-list">
                        <li>₹{formatCurrency(item.bookAfterDiscount)}</li>
                        <li>
                          <del>₹{formatCurrency(item.bookPrice)}</del>
                        </li>
                      </ul>
                    </div>
                    <div className="shop-button">
                      <Link to={`/Book-detail/${item._id}`} className="theme-btn"> View Detail</Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </section>
    </>
  );
}

export default Homeshop;
