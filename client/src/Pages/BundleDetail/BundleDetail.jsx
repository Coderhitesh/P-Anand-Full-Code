import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Loading from '../../Components/Loading/Loading';

function BundleDetail({ handleAddToCart, loadingFromCart }) {
    const { id } = useParams();
    const [allTeacher, setTeacher] = useState([]);
    const [category, setCategory] = useState([]);
    const [course, setCourse] = useState([]); // Initialize course as an array
    const [bundle, setBundle] = useState(null);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMode, setSelectedMode] = useState({
        name: '',
        id: ''
    });

    const handleFetchCourse = async () => {
        try {
            const res = await axios.get(`https://www.api.panandacademy.com/api/v1/single-bundle/${id}`);
            setBundle(res.data.data);
            if (res.data.data.bundleMode.length > 0) {
                setSelectedMode(res.data.data.bundleMode[0]._id);
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

    const handleFetchAllBundle = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-bundles')
            setFilterData(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFetchAllCourse = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-course');
            setCourse(res.data.data);
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
        const foundCategory = category.find((category) => category._id === CategoryId);
        return foundCategory ? foundCategory.categoryName : 'No Category';
    };

    useEffect(() => {
        if (bundle && bundle.bundleMode && bundle.bundleMode.length > 0) {
            const defaultMode = bundle.bundleMode[0]; // Select the first mode as default
            setSelectedMode({
                name: defaultMode.modeType,
                id: defaultMode.modeId
            });
        }
    }, [bundle]);

    const handleModeChange = (event) => {
        const selectedOption = bundle.bundleMode.find(mode => mode.modeType === event.target.value);
        console.log(selectedOption);

        setSelectedMode({
            name: selectedOption.modeType,
            id: selectedOption.modeId
        });
    };

    const getPriceDetails = () => {
        if (!bundle || !selectedMode) return { price: 0, discountedPrice: 0 };

        const mode = bundle.bundleMode.find(mode => mode.modeId === selectedMode?.id);
        if (mode) {
            return {
                price: mode.coursePrice,
                discountedPrice: mode.coursePriceAfterDiscount
            };
        }

        return { price: bundle.startingPrice, discountedPrice: bundle.endingPrice };
    };

    const getTeacherNameById = (TeacherId) => {
        const foundTeacher = allTeacher.find((teacher) => teacher._id === TeacherId);
        return foundTeacher ? foundTeacher.teacherName : 'No Teacher assigned';
    };

    const getCourseNamesByIds = (courseIds) => {
        const courseIdArray = Array.isArray(courseIds) ? courseIds : [courseIds];

        const courseNames = courseIdArray
            .map((courseId) => {
                const foundCourse = course.find((c) => c._id === courseId.id);
                return foundCourse ? foundCourse.courseName : null;
            })
            .filter((courseName) => courseName !== null);

        return courseNames.length > 0 ? courseNames.join(', ') : 'No Courses Available';
    };





    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        handleFetchAllBundle();
        handleFetchTeacher();
        handleFetchCategory();
        handleFetchCourse();
        handleFetchAllCourse(); // Fetch all courses
    }, [id]);

    if (loading) {
        return <div><Loading /></div>;
    }

    if (!bundle) {
        return <div>No bundle data available</div>;
    }

    const { price, discountedPrice } = getPriceDetails();

    return (
        <>
            <ToastContainer />
            {/* content */}
            <section className="py-5">
                <div className="container">
                    <div className="row gx-5">
                        <aside className="col-lg-6">
                            <div className="border rounded-4 mb-3 d-flex justify-content-center">
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
                                <h4 style={{ fontSize: '30px' }} className="course-title text-dark">{bundle.bundleName}</h4>
                                <p><span style={{ fontWeight: '600' }}>Course Name:</span> {getCourseNamesByIds(bundle.bundleCourseId)}</p>
                                <p className="text-muted mb-4">
                                    <strong>Category:</strong> {getCategoryNameById(bundle.categoryId)}
                                </p>

                                {/* Add pricing and course mode selection if necessary */}
                                <p style={{ fontSize: '22px', fontWeight: "700", color: "#404040" }}>Rs.{bundle.bundleStartingPrice} - Rs.{bundle.bundleEndingPrice}</p>

                                <hr />

                                <div className="row">
                                    <div>
                                        <p><strong>How do you want it?</strong></p>
                                    </div>
                                    <div>
                                        <select className="form-select" aria-label="Default select example" onChange={handleModeChange} value={selectedMode?.name}>
                                            {bundle.bundleMode.map(mode => (
                                                <option key={mode.modeType} value={mode.modeType}>{mode.modeType}</option>
                                            ))}
                                        </select>

                                        {/* <select className="form-select" aria-label="Default select example" onChange={handleModeChange} value={selectedMode?.name}>
                                            {course.courseMode.map(mode => (
                                                <option key={mode.modeType} value={mode.modeType}>{mode.modeType}</option>
                                            ))}
                                        </select> */}
                                    </div>
                                    <div>
                                        <div className="mainprice mt-3">
                                            <p style={{ fontSize: '20px' }}><strong>Price :</strong> Rs:{price}</p>
                                        </div>
                                        {discountedPrice !== price && (
                                            <div className="discountPrice">
                                                <del>Rs:{discountedPrice}</del>
                                            </div>
                                        )}
                                    </div>
                                </div>



                                <div className="shop-button mt-3">
                                    <button type='button' onClick={() => handleAddToCart({ ...bundle, selectedMode })} disabled={loadingFromCart} className="theme-btn">{loadingFromCart ? 'Please Wait...' : 'Add To cart'}</button>
                                </div>

                                <p className=' mt-4'><strong>All Categories: </strong>{category && category.map((item, index) => (
                                    <Link to={`/category/${item._id}`} >{item.categoryName}, </Link>
                                ))}</p>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Course Description */}
                <div className=" container py-4 course-description">
                    <h4 className="title text-dark mb-4">Bundle Description</h4>
                    <div dangerouslySetInnerHTML={{ __html: bundle.bundleDescription }} />
                </div>



                {/* Similar Products */}
                <div className="container py-5">
                    <h4 className="title text-dark">Similar Bundle</h4>
                    <div className="row">
                        {filterData &&
                            filterData.slice(0, 4).map((item, index) => (
                                <div key={index} className="col-lg-3 col-sm-6 mb-4">
                                    <div className="card">
                                        <img src={item.bundleImage.url} className="card-img-top" alt={item.bundleName} />
                                        <div className="card-body">
                                            <h5 className="card-title">{item.bundleName}</h5>
                                            <p className="card-text">Rs.{item.bundleStartingPrice} - Rs.{item.bundleEndingPrice}</p>
                                            <div className="shop-button">
                                                <Link to={`/bundle-detail/${item._id}`} className="theme-btn">
                                                    View Details
                                                </Link>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                {/* Similar Products */}
            </section>
        </>
    );
}

export default BundleDetail;
