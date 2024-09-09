import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Virtual, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Topcategory() {
  const [allCategory, setCategory] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1); // Page or offset for loading more data

  const handleFetchCategory = async (pageNumber) => {
    try {
      const res = await axios.get(`http://localhost:9000/api/v1/get-all-category?page=${pageNumber}`);
      setCategory((prevCategories) => [...prevCategories, ...res.data.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreCategories = () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    handleFetchCategory(nextPage).finally(() => {
      setPage(nextPage);
      setLoadingMore(false);
    });
  };

  useEffect(() => {
    handleFetchCategory(page);
  }, []);

  return (
    <>
      <section className="book-catagories-section fix section-padding">
        <div className="container">
          <div className="book-catagories-wrapper">
            <div className="section-title text-center">
              <h2 className="wow fadeInUp mobile-title" data-wow-delay=".3s">Top Categories</h2>
            </div>
            <div className="array-button">
              <button className="array-prev"><i className="fal fa-arrow-left"></i></button>
              <button className="array-next"><i className="fal fa-arrow-right"></i></button>
            </div>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
              navigation={{ prevEl: '.array-prev', nextEl: '.array-next' }}
              modules={[Navigation, Virtual, Autoplay]}
              className="swiper book-catagories-slider"
              autoplay={{
                delay: 3000, // Auto-scroll delay in milliseconds (e.g., 3000ms = 3 seconds)
                disableOnInteraction: false, // Keeps autoplay active even after user interaction
              }}
              breakpoints={{
                // When the screen is >= 320px
                320: {
                  slidesPerView: 1, // Show 1 slide
                  spaceBetween: 10, // Smaller space between slides
                },
                // When the screen is >= 480px
                480: {
                  slidesPerView: 2, // Show 2 slides
                  spaceBetween: 20, // Adjust space between slides
                },
                // When the screen is >= 768px
                768: {
                  slidesPerView: 3, // Show 3 slides
                  spaceBetween: 30, // Adjust space between slides
                },
                // When the screen is >= 1024px
                1024: {
                  slidesPerView: 4, // Show 4 slides
                  spaceBetween: 30, // Adjust space between slides
                },
              }}
              onReachEnd={() => {
                if (!loadingMore) {
                  loadMoreCategories(); // Load more categories when reaching the end
                }
              }}
            >
              {allCategory && allCategory.map((item, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  <Link to={`/category/${item._id}`} className="book-catagories-items">
                    <div className="book-thumb">
                      <img src="assets/img/book-categori/online-record-class.webp" className="w-50" alt={item.categoryName} />
                      <div className="circle-shape">
                        <img src="assets/img/book-categori/circle-shape.png" alt="shape-img" />
                      </div>
                    </div>
                    {/* <div className="number">{index + 1}</div> */}
                    <h3><Link to={`/category/${item._id}`}>{item.categoryName}</Link></h3>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            {loadingMore && <div>Loading more categories...</div>}
          </div>
        </div>
      </section>
    </>
  );
}

export default Topcategory;
