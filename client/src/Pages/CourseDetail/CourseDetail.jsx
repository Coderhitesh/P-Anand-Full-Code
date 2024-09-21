import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './courseDetail.css';
// import { toast, ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../../Components/Loading/Loading';

function CourseDetail({ handleAddToCart, loadingFromCart }) {
    const { id } = useParams();

    const [allTeacher, setTeacher] = useState([]);
    const [category, setCategory] = useState([]);
    const [course, setCourse] = useState(null);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageLoader, setPageLoader] = useState(true)
    const [selectedMode, setSelectedMode] = useState({
        name: '',
        id: ''
    });
    useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })

        const timer = setTimeout(() => {
            setPageLoader(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [id]);
    const [cartItems, setCartItem] = useState([{
        ProductId: '',
        PriceDetails: '',
        ProductType: ''
    }])
    const navigate = useNavigate()
    const handleFetchCourse = async () => {
        try {
            const res = await axios.get(`https://www.api.panandacademy.com/api/v1/single-course/${id}`);
            setCourse(res.data.data);
            if (res.data.data.courseMode.length > 0) {
                setSelectedMode(res.data.data.courseMode[0]._id);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchTeacher = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-teacher');
            setTeacher(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFetchAllCourse = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-course');
            if (course) {
                const category = course.courseCategory;
                const allData = res.data.data;
                const filter = allData.filter((item) => item.courseCategory === category);
                setFilterData(filter);
            }
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

    const getCategoryNameById = (CategoryId) => {
        const foundCategory = category.find(category => category._id === CategoryId);
        return foundCategory ? foundCategory.categoryName : "No Category";
    };

    useEffect(() => {
        if (course && course.courseMode && course.courseMode.length > 0) {
            const defaultMode = course.courseMode[0]; // First mode as default
            setSelectedMode({
                name: defaultMode.modeType,
                id: defaultMode.modeId
            });
        }
    }, [course]);

    const handleModeChange = (event) => {
        const selectedOption = course.courseMode.find(mode => mode.modeType === event.target.value);
        console.log(selectedOption);

        setSelectedMode({
            name: selectedOption.modeType,
            id: selectedOption.modeId
        });
    };

    const getPriceDetails = () => {

        if (!course || !selectedMode) return { price: 0, discountedPrice: 0 };

        const mode = course.courseMode.find(mode => mode.modeId === selectedMode.id);

        if (mode) {
            return {
                price: mode.coursePrice,
                discountedPrice: mode.coursePriceAfterDiscount
            };
        }

        return { price: course.startingPrice, discountedPrice: course.endingPrice };
    };

    const getTeacherNameById = (TeacherId) => {
        const foundTeacher = allTeacher.find(teacher => teacher._id === TeacherId);
        return foundTeacher ? foundTeacher.teacherName : "No Teacher assigned";
    };



    useEffect(() => {
        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth',
        // });
        handleFetchTeacher();
        handleFetchCategory();
        handleFetchCourse();
    }, [id]);

    useEffect(() => {
        if (course) {
            handleFetchAllCourse();
        }
    }, [course]);

    // useEffect(() => {

    //     const timer = setTimeout(() => {
    //         setPageLoader(false);
    //     }, 1000);

    //     return () => clearTimeout(timer);
    // }, [id]);

    if (loading) {
        return <div><Loading /></div>;
    }

    if (!course) {
        return <div>No course data available</div>;
    }

    const renderStars = (rating) => {
        if (typeof rating !== 'number' || rating < 0 || rating > 5) {
            rating = 0;
        }

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


    const { price, discountedPrice } = getPriceDetails();

    return (
        <>
            {
                pageLoader ? (
                    <Loading />
                ) : (
                    <>
                        {/* <ToastContainer /> */}
                        <Toaster />
                        <section className="py-5">
                            <div className="container">
                                <div className="row gx-5">
                                    <aside className="col-lg-6">
                                        <div style={{border:'none !important'}} className="border rounded-4 mb-3 d-flex justify-content-center">
                                            {course.courseImage && course.courseImage.url ? (
                                                <a data-fslightbox="mygalley" style={{display:'flex',alignItems:'center',justifyContent:'center'}} className="rounded-4" target="_blank" rel="noopener noreferrer" data-type="image" href={course.courseImage.url}>
                                                    <img style={{ maxWidth: '92%', maxHeight: '100vh', margin: 'auto' }} className="rounded-4 fit" src={course.courseImage.url} alt={course.courseName} />
                                                </a>
                                            ) : (
                                                <div>No image available</div>
                                            )}
                                        </div>
                                    </aside>
                                    <main className="col-lg-6">
                                        <div className="ps-lg-3">
                                            <h4 style={{ fontWeight: '700', fontSize: '30px' }} className="course-title text-dark">
                                                {course.courseName}
                                            </h4>
                                            <p>By: {getTeacherNameById(course.courseTeacherName)}</p>
                                            <p className="text-muted mb-4"><strong>Category:</strong> {getCategoryNameById(course.courseCategory)}</p>
                                            <div className="d-flex flex-row my-3">
                                                <div className="text-warning mb-1 me-2">
                                                    {renderStars(course.courseRating)}
                                                    <span style={{ color: '#A46023' }} className="ms-1">({course.courseCountRating ? course.courseCountRating : '0'} customer review)</span>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div>
                                                    <p><strong>How do you want it?</strong></p>
                                                </div>
                                                <div>
                                                    <select className="form-select" aria-label="Default select example" onChange={handleModeChange} value={selectedMode?.name}>
                                                        {course.courseMode.map(mode => (
                                                            <option key={mode.modeType} value={mode.modeType}>{mode.modeType}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <div className="mainprice mt-3">
                                                        <p style={{ fontSize: '20px' }}><strong>Price :</strong> ₹{price}</p>
                                                    </div>
                                                    {discountedPrice !== price && (
                                                        <div className="discountPrice">
                                                            <del>₹{discountedPrice}</del>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <hr />
                                            <div className="shop-button">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddToCart({ ...course, selectedMode })}
                                                    className="theme-btn"
                                                    disabled={loadingFromCart}
                                                >
                                                    {loadingFromCart ? 'Please Wait...' : 'Add To Cart'}
                                                </button>
                                            </div>

                                            <p className='mt-4'><strong>All Categories: </strong>{category && category.map((item, index) => (
                                                <Link key={index} to={`/category/${item._id}`} >{item.categoryName}, </Link>
                                            ))}</p>
                                        </div>
                                    </main>
                                </div>
                            </div>

                            {/* <div className="container py-5 course-description">
                                <div className="course-container">
                                    <h4 className="title text-dark">Course Description</h4>
                                    <div dangerouslySetInnerHTML={{ __html: course.courseDescription }} />
                                </div>
                            </div> */}

                            {/* Tabs Section */}
                            <div className="container py-5 course-description">
                                <div className="course-container">
                                    {/* <h4 className="title text-dark mb-4">Course Details</h4> */}
                                    {/* Nav Pills */}
                                    <ul style={{listStyle:'none'}} className="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
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
                                            <div dangerouslySetInnerHTML={{ __html: course.courseDescription || 'No description available.' }} />
                                        </div>

                                        {/* Additional Information Tab */}
                                        <div className="tab-pane fade" id="pills-additional-info" role="tabpanel" aria-labelledby="pills-additional-info-tab">
                                            {course.aditionalInfo ? (
                                                <div dangerouslySetInnerHTML={{ __html: course.aditionalInfo }} />
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
                                            <div className="row more-products">
                                                {filterData && filterData.length > 0 ? (
                                                    filterData.slice(0, 4).map((item, index) => (
                                                        <div key={index} className="col-lg-3 col-sm-6 mb-4">
                                                            <Link to={`/course-detail/${item._id}`} className="card h-100">
                                                                <img style={{ height: '283px' }} src={item.courseImage.url} className="card-img-top" alt={item.courseName} />
                                                                <div className="card-body d-flex flex-column">
                                                                    <h5 className="card-title">{item.courseName}</h5>
                                                                    <p className="card-text">
                                                                        <strong>Price:</strong> ₹ {item.startingPrice} - ₹ {item.endingPrice}
                                                                    </p>
                                                                    <div className="mt-auto">
                                                                        <Link to={`/course-detail/${item._id}`} className="btn btn-primary">
                                                                            View Details
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No similar courses available.</p>
                                                )}
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
                                                            <strong>Price:</strong> ₹ {item.startingPrice} - ₹ {item.endingPrice}
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
                        </section>
                    </>
                )
            }
        </>

    );
}

export default CourseDetail;
