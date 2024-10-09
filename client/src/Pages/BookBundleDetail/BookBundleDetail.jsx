import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading';

function BookBundleDetail({ handleAddToCart, loadingFromCart }) {
    const { id } = useParams();
    const [allTeacher, setTeacher] = useState([]);
    const [category, setCategory] = useState([]);
    const [course, setCourse] = useState([]); // Initialize course as an array
    const [bundle, setBundle] = useState(null);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(true)
    const [selectedMode, setSelectedMode] = useState(null);
    // console.log(bund)

    const handleFetchCourse = async () => {
        try {
            const res = await axios.get(`https://api.panandacademy.com/api/v1/get-single-book-bundle/${id}`);
            setBundle(res.data.data);
            // if (res.data.data.bundleMode.length > 0) {
            //     setSelectedMode(res.data.data.bundleMode[0]._id);
            // }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };



    const handleFetchAllBundle = async () => {
        try {
            const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book-bundle')
            setFilterData(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFetchAllCourse = async () => {
        try {
            const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book');
            setCourse(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book-category');
            setCategory(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCategoryNameById = (CategoryId) => {
        const foundCategory = category.find((category) => category._id === CategoryId);
        return foundCategory ? foundCategory.categoryName : 'No Category';
    };

    const getBookNamesByIds = (bookIds) => {
        if (!Array.isArray(bookIds) || bookIds.length === 0) {
            return 'No Books Available';
        }

        const bookNames = bookIds
            .map(({ id }) => {
                const foundBook = course.find((b) => b._id === id);
                return foundBook ? foundBook.bookName : null;
            })
            .filter((bookName) => bookName !== null);

        return bookNames.length > 0 ? bookNames.join(', ') : 'No Books Available';
    };


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        handleFetchAllBundle();
        handleFetchCategory();
        handleFetchCourse();
        handleFetchAllCourse(); // Fetch all courses
    }, [id]);

    useEffect(() => {
        // Scroll to the top when the component mounts
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // Simulate loading time (2 seconds)
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 200);

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!bundle) {
        return <div>No bundle data available</div>;
    }

    return (
        <>
            {
                pageLoading ? (
                    <Loading />
                ) : (
                    <>
                        {/* content */}
                        <section className="py-5">
                            <div className="container">

                                <div className="row gx-5">
                                    <aside className="col-lg-6">
                                        <div className="rounded-4 mb-3 d-flex justify-content-center">
                                            {bundle.bundleImage && bundle.bundleImage.url ? (
                                                <a
                                                    data-fslightbox="mygalley"
                                                    className="rounded-4"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    data-type="image"
                                                    href={bundle.bundleImage.url}
                                                >
                                                    <img
                                                        style={{ maxWidth: '100%', maxHeight: '100vh', margin: 'auto' }}
                                                        className="rounded-4 fit"
                                                        src={bundle.bundleImage.url}
                                                        alt={bundle.bundleName}
                                                    />
                                                </a>
                                            ) : (
                                                <div>No image available</div>
                                            )}
                                        </div>
                                    </aside>
                                    <main className="col-lg-6">
                                        <div className="ps-lg-3">
                                            {/* <p><strong>HSN:</strong> {bundle}</p> */}
                                            <h4 style={{ fontSize: '30px' }} className="course-title text-dark">{bundle.bundleName}</h4>
                                            <p><span style={{ fontWeight: '600' }}>Book Name:</span> {getBookNamesByIds(bundle.bundleBookId)}</p>
                                            <p className="text-muted mb-4">
                                                <strong>Category:</strong> {getCategoryNameById(bundle.categoryId)}
                                            </p>

                                            {/* Add pricing and course mode selection if necessary */}
                                            <ul style={{ display: 'flex', padding: '0%', gap: '8px' }} className="price-list">
                                                <li style={{ fontWeight: '700', fontSize: '25px' }}>₹{bundle.bundlePriceAfterDiscount}</li>
                                                <li>
                                                    <del style={{ color: '#595C5F' }}>₹{bundle.bundlePrice}</del>
                                                </li>
                                            </ul>

                                            <hr />

                                            <div className="shop-button mt-3">
                                                <button type='button' onClick={() => handleAddToCart(bundle)} className="theme-btn">{loadingFromCart ? 'Please Wait...' : 'Add To Cart'}</button>
                                            </div>

                                            <p className=' mt-4'><strong>All Categories: </strong>{category && category.map((item, index) => (
                                                <Link key={index} to={`/category/${item._id}`} >{item.categoryName}, </Link>
                                            ))}</p>
                                        </div>
                                    </main>
                                </div>
                            </div>

                            {/* Course Description */}
                            <div className=" container py-4 course-description">
                                <h4 className="title text-dark mb-4">Description</h4>
                                <div dangerouslySetInnerHTML={{ __html: bundle.bundleDescription }} />
                            </div>



                            {/* Similar Products */}
                            <div className="container py-1">
                                <h4 style={{marginBottom:'10px', fontWeight:'600'}} className="title text-dark">Similar Book Bundle</h4>
                                <div className="row">
                                    {filterData &&
                                        filterData.slice(0, 4).map((item, index) => (
                                            <div key={index} className="col-lg-3 col-sm-6 mb-4">
                                                <Link to={`/book-bundle-detail/${item._id}`} className="card">
                                                    <img style={{height:'283px'}} src={item.bundleImage.url} className="card-img-top" alt={item.bundleName} />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item.bundleName}</h5>
                                                        <ul style={{ display: 'flex', padding: '0%', gap: '8px' }} className="price-list">
                                                            <li style={{ fontWeight: '700', fontSize: '20px' }}>₹{bundle.bundlePriceAfterDiscount}</li>
                                                            <li>
                                                                <del style={{ color: '#595C5F' }}>₹{bundle.bundlePrice}</del>
                                                            </li>
                                                        </ul>

                                                        <div style={{marginTop:'10px'}} className="shop-button">
                                                            <Link to={`/book-bundle-detail/${item._id}`} className="theme-btn">
                                                                View Details
                                                            </Link>

                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            {/* Similar Products */}
                        </section>
                    </>
                )
            }
        </>

    );
}

export default BookBundleDetail
