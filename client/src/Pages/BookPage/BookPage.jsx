import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './book.css';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading';

function BookPage() {
    const [category, setCategory] = useState([]);
    const [tag, setTag] = useState([])
    const [book, setBook] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of items per page

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Scroll to the top when the component mounts
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // Simulate loading time (2 seconds)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []);

    const handleFetchCategory = async () => {
        try {
            const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-all-book-category`);
            // console.log(res.data.data);
            setCategory(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFetchBook = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book');
            setBook(res.data.data)
        } catch (error) {
            console.log(error);
        }
    };

    const handleFetchTag = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-tag')
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        handleFetchTag();
        handleFetchCategory();
        handleFetchBook();
    }, []);

    // Calculate the total number of pages
    const totalPages = Math.ceil(book.length / itemsPerPage);

    // Get current items based on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = book.slice(indexOfFirstItem, indexOfLastItem);

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

    return (
        <>
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="studymaterial-section">
                            <div className="studymaterial-container">
                                <div className="breadcrumb-wrapper forfullwidthbread">
                                    <div className="container">
                                        <div className="page-heading">
                                            <h1>Books</h1>
                                            <div className="page-header">
                                                <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".3s">
                                                    <li>
                                                        <Link to={"/"}>Home</Link>
                                                    </li>
                                                    <li>
                                                        <i className="fa-solid fa-chevron-right"></i>
                                                    </li>
                                                    <li>Books</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row main-container">
                                    {currentItems && currentItems.map((item, index) => (
                                        <div key={index} className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
                                            <div className="shop-box-items">
                                                <div className="book-thumb center">
                                                    <Link to={`/Book-detail/${item._id}`}>
                                                        <img src={item.bookImage.url} alt={item.bookName} />
                                                        <ul className="post-box">
                                                            <li>{getTagNameById(item.bookTagName)}</li>
                                                        </ul>
                                                    </Link>
                                                </div>
                                                <div className="shop-content">

                                                    <h3>
                                                        <Link to={`/Book-detail/${item._id}`}>{item.bookName}</Link>
                                                    </h3>
                                                    <ul className="price-list">
                                                        <p className=' mb-0'>{getCategoryNameById(item.bookCategory)}</p>
                                                        <li style={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                            {/* {renderStars(item.bookRating)} */}
                                                            {/* ({item.bookCountRating}) */}
                                                        </li>
                                                    </ul>
                                                    <ul className="price-list">
                                                        <li>Rs.{item.bookAfterDiscount}</li>
                                                        <li><del>Rs.{item.bookPrice}</del></li>
                                                    </ul>

                                                    <div className="shop-button">
                                                        <Link to={`/Book-detail/${item._id}`} className="theme-btn">View Detail</Link>
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
                )
            }
        </>
    );
}

export default BookPage
