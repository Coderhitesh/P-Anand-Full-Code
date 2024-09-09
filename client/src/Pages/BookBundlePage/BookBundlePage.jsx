import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './bundle.css';
import axios from 'axios';

function BookBundlePage() {
  // const { id } = useParams();
  const [category, setCategory] = useState([]);
  const [bundle, setBundle] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  const handleFetchCategory = async () => {
      try {
          const res = await axios.get(`http://localhost:9000/api/v1/get-all-book-category`);
        //   console.log(res.data.data);
          setCategory(res.data.data);
      } catch (error) {
          console.log(error);
      }
  };

  const handleFetchBundle = async () => {
      try {
          const res = await axios.get('http://localhost:9000/api/v1/get-all-book-bundle');
          setBundle(res.data.data)
      } catch (error) {
          console.log(error);
      }
  };

  const findCategoryNameById = (categoryid) => {
    const foundCategory = category.find(category => category._id === categoryid)
    return foundCategory ? foundCategory.categoryName : 'No Category'
  }

  useEffect(() => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth',
      });
      handleFetchCategory();
      handleFetchBundle();
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(bundle.length / itemsPerPage);

  // Get current items based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bundle.slice(indexOfFirstItem, indexOfLastItem);

  // Event handlers for pagination
  const handleNextPage = () => {
      if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
      }
  };

  const handlePreviousPage = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
  };

  return (
      <>
          <div className="studymaterial-section">
              <div className="studymaterial-container">
                  <div className="breadcrumb-wrapper forfullwidthbread">
                      <div className="container">
                          <div className="page-heading">
                              <h1>Books Bundles</h1>
                              <div className="page-header">
                                  <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".3s">
                                      <li>
                                          <Link to={"/"}>Home</Link>
                                      </li>
                                      <li>
                                          <i className="fa-solid fa-chevron-right"></i>
                                      </li>
                                      <li>Books Bundles</li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="row main-container">
                      {currentItems.map((item, index) => (
                          <div key={index} className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
                              <div className="shop-box-items">
                                  <div className="book-thumb center">
                                      <Link to={`/book-bundle-detail/${item._id}`}>
                                          <img src={item.bundleImage.url} alt={item.bundleName} />
                                      </Link>
                                  </div>
                                  <div className="shop-content">
                                    <p>{findCategoryNameById(item.categoryId)}</p>
                                      <h3>
                                          <Link to={`/book-bundle-detail/${item._id}`}>{item.bundleName}</Link>
                                      </h3>
                                      <ul className="price-list">
                                          <li>Rs.{item.bundlePriceAfterDiscount}</li>
                                          <li><del>Rs.{item.bundlePrice}</del></li>
                                          {/* <li>
                                              <i className="fa-solid fa-star"></i> ({item.courseRating})
                                          </li> */}
                                      </ul>
                                      <div className="shop-button">
                                          <Link to={`/book-bundle-detail/${item._id}`} className="theme-btn">View Detail</Link>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="page-nav-wrap pagination-box text-center">
                      <ul>
                          <li>
                              <button onClick={handlePreviousPage} disabled={currentPage === 1} className="previous">
                                  Previous
                              </button>
                          </li>
                          {[...Array(totalPages)].map((_, pageIndex) => (
                              <li key={pageIndex}>
                                  <button
                                      onClick={() => handlePageChange(pageIndex + 1)}
                                      className={currentPage === pageIndex + 1 ? 'page-numbers active' : 'page-numbers'}
                                  >
                                      {pageIndex + 1}
                                  </button>
                              </li>
                          ))}
                          <li>
                              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="next">
                                  Next
                              </button>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </>
  );
}


export default BookBundlePage
