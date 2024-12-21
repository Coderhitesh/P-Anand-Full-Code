import React, { useState } from 'react';

const ActiveCourse = ({ courses }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalItems = courses.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = courses.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <h3 className="mb-4">Active Courses</h3>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Sr.No.</th>
                            <th>Image</th>
                            <th>Course Name</th>
                            <th>Course Mode</th>
                            <th>Order Status</th>
                            <th>Link</th>
                            <th>Course Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((course, index) => (
                                
                                    <tr key={index}>
                                        {console.log("course",course)}
                                    <td>{startIndex + index + 1}</td>
                                    <td>
                                        <img
                                            src={course.productImage}
                                            alt={course.productName}
                                            className="img-thumbnail"
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>{course.productName}</td>
                                    <td>{course.selectedMode.name}</td>

                                    {course.selectedMode.name === 'Pen Drive' ? (<td>{course?.courseMode?.courseLink}</td>) : (<td></td>)}
                                    {course.selectedMode.name === 'Google Drive' ? (<td>{course?.courseMode?.courseLink}</td>) : (<td>No Link Available</td>)}
                                    <td>₹{parseFloat(course.productPrice).toLocaleString('en-IN')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No courses found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
                <button
                    className="btn btn-secondary mx-2"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`btn mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="btn btn-secondary mx-2"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ActiveCourse;
