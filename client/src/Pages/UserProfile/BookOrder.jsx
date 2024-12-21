import React, { useState } from 'react';

const BookOrder = ({ orders }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(orders.length / itemsPerPage);

    return (
        <div>
            <h3 className="mb-4">Book Orders</h3>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Sr.No.</th>
                            <th>Image</th>
                            <th>Course Name</th>
                            <th>Course Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>
                                        <img
                                            src={order.productImage}
                                            alt={order.productName}
                                            className="img-thumbnail"
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>{order.productName}</td>
                                    <td>₹{parseFloat(order.productPrice).toLocaleString('en-IN')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`btn mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BookOrder;
