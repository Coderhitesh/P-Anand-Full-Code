import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading/Loading';

function Shop() {
    const [course, setCourse] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All Courses');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRating, setSelectedRating] = useState(''); // Initial value set to empty string
    const itemsPerPage = 6;

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

    const shuffleArray = (array) => {
        let shuffledArray = array.slice(); // Create a copy of the array
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
        }
        return shuffledArray;
    };


    const handleCourseFetching = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-course');
            // setCourse(res.data.data);
            const shuffledCourses = shuffleArray(res.data.data);
            setCourse(shuffledCourses);
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

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        setCurrentPage(1); // Reset to the first page when category changes
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page when search term changes
    };

    const handleRatingChange = (event) => {
        setSelectedRating(event.target.value); // Set selectedRating to the value of the selected radio button
        setCurrentPage(1); // Reset to the first page when rating changes
    };

    const getCategorygNameById = (CategoryId) => {
        const foundCategory = category.find(category => category._id === CategoryId);
        return foundCategory ? foundCategory.categoryName : "No Category";
    };

    // Filter courses based on selected category ID, search term, and selected rating
    const filteredCourses = course.filter((item) => {
        const matchesCategory = selectedCategory === 'All Courses' || item.courseCategory === category.find(cat => cat.categoryName === selectedCategory)?._id;
        const matchesSearch = item.courseName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = selectedRating === '' || (item.courseRating && item.courseRating >= parseInt(selectedRating)); // Ignore rating filter if selectedRating is empty
        return matchesCategory && matchesSearch && matchesRating;
    });

    const formatCurrency = (amount) => {
        if (!amount) return '0.00';
        return parseFloat(amount)
            .toFixed(2) // Ensure two decimal places
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format with commas
    };
    

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    // Get the courses for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        handleFetchCategory();
        handleCourseFetching();
    }, []);

    return (
        <>
            {
                loading ? (
                    <>
                        <Loading />
                    </>
                ) : (
                    <>
                        <>
                            <div className="breadcrumb-wrapper">
                                <div className="container">
                                    <div className="page-heading">
                                        <h1>Shop</h1>
                                        <div className="page-header">
                                            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".3s">
                                                <li>
                                                    <Link to={"/"}>
                                                        Home
                                                    </Link>
                                                </li>
                                                <li>
                                                    <i className="fa-solid fa-chevron-right"></i>
                                                </li>
                                                <li>
                                                    Shop
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <section className="shop-section fix section-padding">
                                <div className="container">
                                    <div className="shop-default-wrapper">
                                        <div className="row">
                                            <div className="col-xl-3 col-lg-4 order-2 order-md-1 wow fadeInUp" data-wow-delay=".3s">
                                                <div className="main-sidebar">
                                                    <div className="single-sidebar-widget">
                                                        <div className="wid-title">
                                                            <h5>Search Courses</h5>
                                                        </div>
                                                        <form action="#" class="search-toggle-box">
                                                            <div class="input-area search-container">
                                                                <input class="search-input" type="text" value={searchTerm}
                                                                    onChange={handleSearchChange} placeholder="Search here" />
                                                                <button class="cmn-btn search-icon">
                                                                    <i class="far fa-search"></i>
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="single-sidebar-widget">
                                                        <div className="wid-title">
                                                            <h5>Categories</h5>
                                                        </div>
                                                        <div className="categories-list">
                                                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                                <li className="nav-item" role="presentation">
                                                                    <button
                                                                        className={`nav-link ${selectedCategory === 'All Courses' ? 'active' : ''}`}
                                                                        onClick={() => handleCategoryClick('All Courses')}
                                                                    >
                                                                        All Courses
                                                                    </button>
                                                                </li>
                                                                {category.map((item, index) => (
                                                                    <li key={index} className="nav-item" role="presentation">
                                                                        <button
                                                                            className={`nav-link ${selectedCategory === item.categoryName ? 'active' : ''}`}
                                                                            onClick={() => handleCategoryClick(item.categoryName)}
                                                                        >
                                                                            {item.categoryName}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="single-sidebar-widget mb-0">
                                                        <div className="wid-title">
                                                            <h5>Filter By Review</h5>
                                                        </div>
                                                        <div className="categories-list">
                                                            <label class="checkbox-single d-flex align-items-center">
                                                                <span class="d-flex gap-xl-3 gap-2 align-items-center">
                                                                    <span class="checkbox-area d-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="review"
                                                                            value="5"
                                                                            checked={selectedRating === '5'}
                                                                            onChange={handleRatingChange}
                                                                        />
                                                                        <span class="checkmark d-center"></span>
                                                                    </span>
                                                                    <span class="text-color">
                                                                        <span class="star">
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                        </span>
                                                                        5
                                                                    </span>
                                                                </span>
                                                            </label>
                                                            <label class="checkbox-single d-flex align-items-center">
                                                                <span class="d-flex gap-xl-3 gap-2 align-items-center">
                                                                    <span class="checkbox-area d-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="review"
                                                                            value="4"
                                                                            checked={selectedRating === '4'}
                                                                            onChange={handleRatingChange}
                                                                        />
                                                                        <span class="checkmark d-center"></span>
                                                                    </span>
                                                                    <span class="text-color">
                                                                        <span class="star">
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                        </span>
                                                                        4
                                                                    </span>
                                                                </span>
                                                            </label>
                                                            <label class="checkbox-single d-flex align-items-center">
                                                                <span class="d-flex gap-xl-3 gap-2 align-items-center">
                                                                    <span class="checkbox-area d-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="review"
                                                                            value="3"
                                                                            checked={selectedRating === '3'}
                                                                            onChange={handleRatingChange}
                                                                        />
                                                                        <span class="checkmark d-center"></span>
                                                                    </span>
                                                                    <span class="text-color">
                                                                        <span class="star">
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                        </span>
                                                                        3
                                                                    </span>
                                                                </span>
                                                            </label>
                                                            <label class="checkbox-single d-flex align-items-center">
                                                                <span class="d-flex gap-xl-3 gap-2 align-items-center">
                                                                    <span class="checkbox-area d-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="review"
                                                                            value="2"
                                                                            checked={selectedRating === '2'}
                                                                            onChange={handleRatingChange}
                                                                        />
                                                                        <span class="checkmark d-center"></span>
                                                                    </span>
                                                                    <span class="text-color">
                                                                        <span class="star">
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                        </span>
                                                                        2
                                                                    </span>
                                                                </span>
                                                            </label>
                                                            <label class="checkbox-single d-flex align-items-center">
                                                                <span class="d-flex gap-xl-3 gap-2 align-items-center">
                                                                    <span class="checkbox-area d-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="review"
                                                                            value="1"
                                                                            checked={selectedRating === '1'}
                                                                            onChange={handleRatingChange}
                                                                        />
                                                                        <span class="checkmark d-center"></span>
                                                                    </span>
                                                                    <span class="text-color">
                                                                        <span class="star">
                                                                            <i class="fa-solid fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                            <i class="fa-sharp fa-light fa-star"></i>
                                                                        </span>
                                                                        1
                                                                    </span>
                                                                </span>
                                                            </label>
                                                            <label class="checkbox-single d-flex align-items-center">
                                                                <span class="d-flex gap-xl-3 gap-2 align-items-center">
                                                                    <span class="checkbox-area d-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="review"
                                                                            value=""
                                                                            checked={selectedRating === ''}
                                                                            onChange={handleRatingChange}
                                                                        />
                                                                        <span class="checkmark d-center"></span>
                                                                    </span>
                                                                    <span class="text-color">
                                                                        All Ratings
                                                                    </span>
                                                                </span>
                                                            </label>
                                                            {/* </form> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-9 col-lg-8 order-1 order-md-2">
                                                <div className="row">
                                                    {currentItems.length > 0 ? (
                                                        currentItems.map((item, index) => (
                                                            <div key={index} className="col-xl-4 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
                                                                <div className="shop-box-items">
                                                                    <div className="book-thumb center">
                                                                        <Link to={`/course-detail/${item._id}`}>
                                                                            <img src={item.courseImage.url} alt={item.courseName} />
                                                                        </Link>
                                                                    </div>
                                                                    <div className="shop-content">
                                                                        <h3><Link to={`/course-detail/${item._id}`}>{item.courseName}</Link></h3>
                                                                        <p>{getCategorygNameById(item.courseCategory)}</p>
                                                                        <ul className="price-list">
                                                                            <li>
                                                                                ₹{formatCurrency(item.startingPrice)} - ₹{formatCurrency(item.endingPrice)}
                                                                            </li>
                                                                            <li>
                                                                                <i className="fa-solid fa-star"></i>
                                                                                {item.courseRating || 'No Rating'}
                                                                            </li>
                                                                        </ul>
                                                                        <div className="shop-button">
                                                                            <Link to={`/course-detail/${item._id}`} className="theme-btn"><i className="fa-solid fa-basket-shopping"></i> Add To Cart</Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="col-12">
                                                            <p>No courses found matching your criteria.</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="page-nav-wrap text-center">
                                                    <ul>
                                                        <li>
                                                            <button
                                                                className="previous"
                                                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                                                disabled={currentPage === 1}
                                                            >
                                                                Previous
                                                            </button>
                                                        </li>
                                                        {Array.from({ length: totalPages }, (_, index) => (
                                                            <li key={index}>
                                                                <button
                                                                    className={`${currentPage === index + 1 ? 'active' : ''} page-numbers`}
                                                                    onClick={() => paginate(index + 1)}
                                                                >
                                                                    {index + 1}
                                                                </button>
                                                            </li>
                                                        ))}
                                                        <li>
                                                            <button
                                                                className="next"
                                                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                                                disabled={currentPage === totalPages}
                                                            >
                                                                Next
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    </>
                )
            }
        </>
    );
}

export default Shop;
