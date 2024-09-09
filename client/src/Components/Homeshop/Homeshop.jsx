import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Homeshop() {
  const [book, setBook] = useState([])
  const [tag, setTag] = useState([])
  const [category,setCategory] = useState([])

  const handleFetchBook = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-book')
      // console.log(res.data.data)
      setBook(res.data.data)
    } catch (error) {
      console.log('error in fetching book', error)
    }
  }

  const handleFetchCategory = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-book-category')
      setCategory(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchTag = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-book-tag')
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

  

  useEffect(() => {
    handleFetchCategory();
    handleFetchTag();
    handleFetchBook();
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
          <div className="book-shop-wrapper">
            {
              book && book.slice(0,4).map((item, index) => (
                <div key={index} className="shop-box-items style-2">
                  <div className="book-thumb center">
                    <Link to={`/Book-detail/${item._id}`}><img src={item.bookImage.url} alt={item.bookName} /></Link>
                    <ul className="post-box">
                      <li>{getTagNameById(item.bookTagName)}</li>
                    {/* <li>-{item.bookDiscountPresent}%</li> */}
                    </ul>
                  </div>
                  <div className="shop-content">
                    <h5>{getCategoryNameById(item.bookCategory)}</h5>
                    <h3><Link to={`/Book-detail/${item._id}`}>{item.bookName}</Link></h3>
                    <ul className="price-list">
                      <li>Rs.{item.bookAfterDiscount}</li>
                      <li><del>Rs.{item.bookPrice}</del></li>
                    </ul>
                  </div>
                  <div className="shop-button">
                    <Link to={`/Book-detail/${item._id}`} className="theme-btn">View Detail</Link>
                  </div>
                </div>
              ))
            }


            {/* <div className="shop-box-items style-2">
              <div className="book-thumb center">
                <a href="Book-detail"><img src="assets/img/book/04.png" alt="12th CBSE" /></a>
                <ul className="post-box">
                  <li>Hot</li>
                </ul>
              </div>
              <div className="shop-content">
                <h5>Category</h5>
                <h3><a href="course-details.php">12th CBSE</a></h3>
                <ul className="price-list">
                  <li>$30.00</li>
                  <li><del>$39.99</del></li>
                </ul>
                <ul className="author-post forauthnone">
                  <li className="authot-list">
                    <span className="thumb"><img src="assets/img/testimonial/client-2.png" alt="Author Wilson" /></span>
                    <span className="content">Wilson</span>
                  </li>
                </ul>
              </div>
              <div className="shop-button">
                <a href="course-details.php" className="theme-btn"><i className="fa-solid fa-basket-shopping"></i> Add To Cart</a>
              </div>
            </div>

            <div className="shop-box-items style-2">
              <div className="book-thumb center">
                <a href="shop-details"><img src="assets/img/book/03.png" alt="English" /></a>
                
              </div>
              <div className="shop-content">
                <h5>Category</h5>
                <h3><a href="course-details.php">English</a></h3>
                <ul className="price-list">
                  <li>$30.00</li>
                  <li><del>$39.99</del></li>
                </ul>
                <ul className="author-post forauthnone">
                  <li className="authot-list">
                    <span className="thumb"><img src="assets/img/testimonial/client-3.png" alt="Author Wilson" /></span>
                    <span className="content">Wilson</span>
                  </li>
                </ul>
              </div>
              <div className="shop-button">
                <a href="course-details.php" className="theme-btn"><i className="fa-solid fa-basket-shopping"></i> Add To Cart</a>
              </div>
            </div> */}

            {/* <div className="cta-shop-box">
              <h2 className="wow fadeInUp" data-wow-delay=".2s">Find Your Best Course!</h2>
              <h6 className="wow fadeInUp" data-wow-delay=".4s">And get your 25% discount now!</h6>
              <a href="shop.html" className="theme-btn white-bg wow fadeInUp" data-wow-delay=".6s">
                Shop Now <i className="fa-solid fa-arrow-right-long"></i>
              </a>
              <div className="girl-shape">
                <img src="assets/img/girl-shape.png" alt="Girl Shape" />
              </div>
              <div className="circle-shape">
                <img src="assets/img/circle-shape.png" alt="Circle Shape" />
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default Homeshop;
