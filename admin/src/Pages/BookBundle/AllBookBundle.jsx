import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

function AllBookBundle() {
    const [bundle, setBundle] = useState([]);
    const [course, setCourse] = useState([]);
    const [category, setCategory] = useState([]);
    const [tag,setTag] = useState([])
    const [selectedModes, setSelectedModes] = useState({}); // State to keep track of selected modes

    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 8;

    const handleFetchBundle = async () => {
        try {
            const res = await axios.get(`https://api.panandacademy.com/api/v1/get-all-book-bundle`);
            const reverseData = res.data.data.reverse();
            setBundle(reverseData);
        } catch (error) {
            console.error('There was an error fetching the bundles!', error);
        }
    };

    const handleFechCourse = async () => {
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

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(bundle.length / itemPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const indexOfLastItem = Math.min(currentPage * itemPerPage, bundle.length);
    const indexOfFirstItem = Math.max(indexOfLastItem - itemPerPage, 0);
    const currentItems = bundle.slice(indexOfFirstItem, indexOfLastItem);

    const getCourseNamesByIds = (courseIds) => {
        const courseIdArray = Array.isArray(courseIds) ? courseIds : [courseIds];
        const courseNames = courseIdArray
            .map((courseId) => {
                const foundCourse = course.find((c) => c._id === courseId.id);
                return foundCourse ? foundCourse.bookName : null;
            })
            .filter(courseName => courseName !== null);

        return courseNames.length > 0 ? courseNames.join(', ') : 'No Book Available';
    };

    const getCategoryNameById = (categoryId) => {
        const foundCategory = category.find(categorie => categorie._id === categoryId);
        return foundCategory ? foundCategory.categoryName : "Unknown Category";
    };

    const getTagNameById = (tagId) => {
        const foundtag = tag.find(tags => tags._id === tagId);
        return foundtag ? foundtag.tagName : "Unknown Tag";
    };

    const handleFetchTag = async () => {
        try {
            const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-book-tag')
            setTag(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    // const handleModeChange = (bundleId, selectedModeId) => {
    //     setSelectedModes(prevState => ({
    //         ...prevState,
    //         [bundleId]: selectedModeId
    //     }));
    // };

    useEffect(() => {
        handleFetchTag()
        handleFetchCategory();
        handleFechCourse();
        handleFetchBundle();
    }, []);

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://api.panandacademy.com/api/v1/delete-book-bundle/${id}`);
                    toast.success("Bundle Deleted Successfully");
                    handleFetchBundle();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    return (
        <>
            {/* <ToastContainer /> */}
            <Toaster />
            <div className="bread">
                <div className="head">
                    <h4>All Book Bundle List </h4>
                </div>
                <div className="links">
                    <Link to="/add-book-bundle" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="selects"></div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="d-table-h">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Sr.No.</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Bundle Name</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Tag</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Category</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Books</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Image</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Bundle Description</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Price</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Discount(%)</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Final Price</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Edit</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((bundle, index) => {
                            return (
                                <tr key={bundle._id}>
                                    <th scope="row">{indexOfFirstItem + index + 1}</th>
                                    <td>{bundle.bundleName}</td>
                                    <td>{getTagNameById(bundle.tag)}</td>
                                    <td>{getCategoryNameById(bundle.categoryId)}</td>
                                    <td>{getCourseNamesByIds(bundle.bundleBookId).substring(0, 14) + '....'}</td>
                                    <td><img src={bundle.bundleImage.url} alt={bundle.bundleName} style={{ maxWidth: '100px' }} /></td>
                                    <td>{bundle.bundleDescription.substring(0, 14) + '....'}</td>
                                    <td>{bundle.bundlePrice}</td>
                                    <td>{bundle.bundleDiscountPercent}</td>
                                    <td>{bundle.bundlePriceAfterDiscount}</td>
                                    <td>
                                        <Link style={{whiteSpace:'nowrap'}} to={`/edit-book-bundle/${bundle._id}`} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></Link>
                                    </td>
                                    <td>
                                        <button style={{whiteSpace:'nowrap'}} onClick={() => handleDelete(bundle._id)} className="bt delete">Delete <i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(bundle.length / itemPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>
        </>
    );
}

export default AllBookBundle
