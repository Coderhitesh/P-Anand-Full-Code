import React, { useState } from 'react';

const ActiveCourse = ({ courses }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    console.log("courses", courses)

    const totalItems = courses.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = courses.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-warning';
            case 'completed':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col">
                    <h3 style={{ color: '#A06A29' }} className="fw-bold ">My Courses & Orders</h3>
                </div>
            </div>

            {currentData.map((order, index) => (
                <div key={startIndex + index} className="card shadow-sm mb-4">
                    <div className="card-header bg-light">
                        <div className="row align-items-center">
                            <div className="col">
                                <span className="badge bg-primary me-2">Order #{order._id.slice(-8)}</span>
                                <small className="text-muted">Ordered on {formatDate(order.createdAt)}</small>
                            </div>
                            <div className="col-auto">
                                <span className={`badge ${getStatusBadgeClass(order.OrderStatus)}`}>
                                    {order.OrderStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        {order.CartItems.map((item, itemIndex) => (
                            <div key={itemIndex} className="row align-items-center mb-3 pb-3 border-bottom">
                                <div className="col-md-2">
                                    <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '100px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h5 className="mb-1">{item.productName}</h5>
                                    <div className="text-muted small">
                                        <span className="me-3">Type: {item.productType}</span>
                                        <span className="me-3">Mode: {item.productLearningMode}</span>
                                        {item.selectedMode && (
                                            <span className="me-3">Selected: {item.selectedMode.name}</span>
                                        )}
                                    </div>
                                    {order.paymentStatus === 'Completed' && (
                                        <div className="mt-2">
                                            {item.productLearningMode === 'Pdf' ? (
                                                <a
                                                    href={`https://www.api.panandacademy.com/${item.link}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Access Course
                                                </a>
                                            ) : (
                                                <a
                                                    href={item.link}
                                                    className="btn btn-sm btn-outline-primary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Access Course
                                                </a>
                                            )}
                                        </div>
                                    )}

                                </div>
                                <div className="col-md-2">
                                    <div className="d-flex flex-column align-items-end">
                                        <span className="fw-bold">₹{parseFloat(item.productPrice).toLocaleString('en-IN')}</span>
                                        <small className="text-muted">Qty: {item.quantity}</small>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="d-flex flex-column align-items-end">
                                        <span className="badge bg-info mb-1">HSN: {item.productHsnCode}</span>
                                        <small className="text-muted">{item.currency}</small>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6 className="card-title">Payment Details</h6>
                                        <div className="small">
                                            <div className="mb-1">
                                                <span className="text-muted">Status:</span>
                                                <span className={`badge ms-2 ${getStatusBadgeClass(order.paymentStatus)}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                            <div className="mb-1">
                                                <span className="text-muted">Order ID:</span>
                                                <span className="ms-2">{order.PhonePeOrderId || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted">Total Amount:</span>
                                                <span className="ms-2 fw-bold">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {order.CourseStartData && (
                                <div className="col-md-6">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h6 className="card-title">Course Timeline</h6>
                                            <div className="small">
                                                <div className="mb-1">
                                                    <span className="text-muted">Start Date:</span>
                                                    <span className="ms-2">{formatDate(order.CourseStartData)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted">Expiry Date:</span>
                                                    <span className="ms-2">{formatDate(order.CourseExpireData)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default ActiveCourse;