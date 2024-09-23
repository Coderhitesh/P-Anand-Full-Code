import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css';
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../../Components/Loading/Loading';

function BookDetail({ handleAddToCart, loadingFromCart }) {
    const { id } = useParams();
    const [category, setCategory] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [loadingPage, setLoadingPage] = useState(true);

    useEffect(() => {
        // Scroll to the top when the component mounts
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // Simulate loading time (2 seconds)
        const timer = setTimeout(() => {
            setLoadingPage(false);
        }, 200);

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []);

    const handleFetchCourse = async () => {
        try {
            const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-single-book/${id}`);
            setBook(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchAllBook = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book');
            setFilterData(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-book-category');
            setCategory(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCategoryNameById = (CategoryId) => {
        const foundCategory = category.find((category) => category._id === CategoryId);
        return foundCategory ? foundCategory.categoryName : 'No Category';
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0.00';
        return parseFloat(amount)
            .toFixed(2) // Ensure two decimal places
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format with commas
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

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
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        handleFetchAllBook();
        handleFetchCategory();
        handleFetchCourse();
    }, [id]);

    if (loading) {
        return <div><Loading /></div>;
    }

    if (!book) {
        return <div>No book data available</div>;
    }

    return (
        <>
            {
                loadingPage ? (
                    <Loading />
                ) : (
                    <>
                        {/* <ToastContainer /> */}
                        <Toaster />
                        <section className="py-5">
                            <div className="container">
                                <div className="row gx-5">
                                    <aside className="col-lg-6">
                                        <div style={{border:'none !important'}} className="rounded-4 mb-3 d-flex justify-content-center">
                                            {book.bookImage && book.bookImage.url ? (
                                                <a
                                                    data-fslightbox="mygalley"
                                                    className="rounded-4"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    data-type="image"
                                                    href={book.bookImage.url}
                                                    style={{display:'flex',alignItems:'center',justifyContent:'center'}}
                                                >
                                                    <img
                                                        style={{ maxWidth: '92%', maxHeight: '100vh', margin: 'auto' }}
                                                        className="rounded-4 fit"
                                                        src={book.bookImage.url}
                                                        alt={book.bookName}
                                                    />
                                                </a>
                                            ) : (
                                                <div>No image available</div>
                                            )}
                                        </div>
                                    </aside>
                                    <main className="col-lg-6">
                                        <div className="ps-lg-3">
                                            <p><strong>HSN:</strong> {book.BookHSNCode}</p>
                                            <h4 style={{ fontSize: '30px' }} className="course-title text-dark">{book.bookName}</h4>
                                            <ul className="price-list px-0">
                                                <li style={{ color: '#A46023' }}>
                                                    {renderStars(book.bookRating)}
                                                    ({book.bookCountRating} customer review)
                                                </li>
                                            </ul>
                                            <p className="text-muted my-4">
                                                <strong>Category:</strong> {getCategoryNameById(book.bookCategory)}
                                            </p>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
                                                <p style={{ fontSize: '22px', fontWeight: "700", color: "#404040" }}>₹{formatCurrency(book.bookAfterDiscount)}</p>
                                                <p><del>₹{formatCurrency(book.bookPrice)}</del></p>
                                            </div>

                                            <hr />

                                            <div className="shop-button mt-3">
                                                <button disabled={loadingFromCart} onClick={() => handleAddToCart(book)} className="theme-btn">{loadingFromCart ? 'Please Wait ....' : 'Add To cart'}</button>
                                            </div>

                                            <p className='mt-4'><strong>All Categories: </strong>{category && category.map((item, index) => (
                                                <Link key={index} to={`/category/${item._id}`}>{item.categoryName}, </Link>
                                            ))}</p>
                                        </div>
                                    </main>
                                </div>
                            </div>

                            {/* <div className="container py-4 course-description">
                        <h4 className="title text-dark mb-4">Course Description</h4>
                        <div dangerouslySetInnerHTML={{ __html: book.bookDescription }} />
                    </div> */}

                            {/* Tabs Section */}
                            <div className="container py-5 course-description">
                                <div className="course-container">
                                    {/* <h4 className="title text-dark mb-4">Course Details</h4> */}
                                    {/* Nav Pills */}
                                    <ul style={{ listStyle: 'none' }} className="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="pills-description-tab" data-bs-toggle="pill" data-bs-target="#pills-description" type="button" role="tab" aria-controls="pills-description" aria-selected="true">Description</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-additional-info-tab" data-bs-toggle="pill" data-bs-target="#pills-additional-info" type="button" role="tab" aria-controls="pills-additional-info" aria-selected="false">Additional Information</button>
                                        </li>
                                        {/* <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-reviews-tab" data-bs-toggle="pill" data-bs-target="#pills-reviews" type="button" role="tab" aria-controls="pills-reviews" aria-selected="false">Reviews</button>
                                        </li> */}
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-more-products-tab" data-bs-toggle="pill" data-bs-target="#pills-more-products" type="button" role="tab" aria-controls="pills-more-products" aria-selected="false">More Products</button>
                                        </li>
                                    </ul>

                                    {/* Tab Content */}
                                    <div className="tab-content" id="pills-tabContent">
                                        {/* Description Tab */}
                                        <div className="tab-pane fade show active" id="pills-description" role="tabpanel" aria-labelledby="pills-description-tab">
                                            <div dangerouslySetInnerHTML={{ __html: book.bookDescription || 'No description available.' }} />
                                        </div>

                                        {/* Additional Information Tab */}
                                        <div className="tab-pane fade" id="pills-additional-info" role="tabpanel" aria-labelledby="pills-additional-info-tab">
                                            {book.aditionalInfo ? (
                                                <div dangerouslySetInnerHTML={{ __html: book.aditionalInfo }} />
                                            ) : (
                                                <p>No additional information available.</p>
                                            )}
                                        </div>

                                        {/* Reviews Tab */}
                                        <div className="tab-pane fade" id="pills-reviews" role="tabpanel" aria-labelledby="pills-reviews-tab">
                                            {/* {reviews.length > 0 ? (
                                                <div className="reviews-section">
                                                    {reviews.map((review, index) => (
                                                        <div key={index} className="review">
                                                            <h5>{review.userName}</h5>
                                                            <div className="stars text-warning">
                                                                {renderStars(review.rating)}
                                                                <span className="ms-1">({review.rating})</span>
                                                            </div>
                                                            <p>{review.comment}</p>
                                                            <hr />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>No reviews available.</p>
                                            )} */}
                                            <p>No Rating</p>
                                        </div>

                                        {/* More Products Tab */}
                                        <div className="tab-pane fade" id="pills-more-products" role="tabpanel" aria-labelledby="pills-more-products-tab">
                                        <div className="row">
                            {filterData &&
                                filterData.slice(0, 4).map((item, index) => (
                                    <div key={index} className="col-lg-3 col-sm-6 mb-4">
                                        <div className="card">
                                            <img style={{height:'270px'}} src={item.bookImage.url} className="card-img-top" alt={item.bookName} />
                                            <div className="card-body">
                                                <h5 className="card-title" style={{textAlign:'center'}}>{item.bookName}</h5>
                                                <ul style={{width:'100%', justifyContent:'center', display: 'flex', alignItems:'center', padding: '0%', gap: '8px', listStyle:'none' }} className="price-list">
                                                    <li style={{ fontWeight: '700', fontSize: '20px' }}>₹{item.bookAfterDiscount}</li>
                                                    <li>
                                                        <del style={{ color: '#595C5F' }}>₹{item.bookPrice}</del>
                                                    </li>
                                                </ul>
                                                <div style={{marginTop:'10px'}} className="shop-button">
                                                    <Link to={`/Book-detail/${item._id}`} className="theme-btn">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="container py-1">
                                    <h4 className="title text-dark mb-4">Similar Courses</h4>
                                    <div className="row">
                                        {filterData && filterData.slice(0, 4).map((item, index) => (
                                            <div key={index} className="col-lg-3 col-sm-6 mb-4">
                                                <Link to={`/course-detail/${item._id}`} className="card">
                                                    <img style={{ height: '283px' }} src={item.courseImage.url} className="card-img-top" alt={item.courseName} />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item.courseName}</h5>
                                                        <p className="card-text">
                                                            <strong>Price:</strong> Rs: {item.startingPrice} - Rs: {item.endingPrice}
                                                        </p>
                                                        <div className="shop-button">
                                                            <Link to={`/course-detail/${item._id}`} className="theme-btn">
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                            </div>

                            {/* <div className="container py-1">
                        <h4 style={{marginBottom:'10px', fontWeight:'600'}} className="title text-dark">Similar Book</h4>
                        <div className="row">
                            {filterData &&
                                filterData.slice(0, 4).map((item, index) => (
                                    <div key={index} className="col-lg-3 col-sm-6 mb-4">
                                        <div className="card">
                                            <img style={{height:'283px'}} src={item.bookImage.url} className="card-img-top" alt={item.bookName} />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.bookName}</h5>
                                                <ul style={{ display: 'flex', padding: '0%', gap: '8px' }} className="price-list">
                                                    <li style={{ fontWeight: '700', fontSize: '20px' }}>₹{item.bookAfterDiscount}</li>
                                                    <li>
                                                        <del style={{ color: '#595C5F' }}>₹{item.bookPrice}</del>
                                                    </li>
                                                </ul>
                                                <div style={{marginTop:'10px'}} className="shop-button">
                                                    <Link to={`/Book-detail/${item._id}`} className="theme-btn">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div> */}
                        </section>
                    </>
                )
            }
        </>
    );
}

export default BookDetail;
