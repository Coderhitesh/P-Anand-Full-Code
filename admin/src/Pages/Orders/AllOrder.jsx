import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllOrder = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(10);
    const [filterType, setFilterType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // State to store selected user details
    const token = sessionStorage.getItem('token');

    const handleFetch = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/all-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const reverseData = res.data.data.reverse();
            setOrders(reverseData);
            setFilteredOrders(reverseData);
        } catch (error) {
            console.error('There was an error fetching the Orders!', error);
        }
    };

    console.log("orders",orders)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://www.api.panandacademy.com/api/v1/delete-order/${id}`);
                    toast.success('Order Deleted Successfully');
                    handleFetch();
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your Order has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    useEffect(() => {
        handleFetch();
    }, []);

    useEffect(() => {
        if (filterType) {
            const filtered = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                const now = new Date();
                switch (filterType) {
                    case 'today':
                        return orderDate.getDate() === now.getDate() &&
                            orderDate.getMonth() === now.getMonth() &&
                            orderDate.getFullYear() === now.getFullYear();
                    case 'yesterday':
                        const yesterday = new Date(now);
                        yesterday.setDate(now.getDate() - 1);
                        return orderDate.getDate() === yesterday.getDate() &&
                            orderDate.getMonth() === yesterday.getMonth() &&
                            orderDate.getFullYear() === yesterday.getFullYear();
                    case 'thisWeek':
                        const startOfWeek = new Date(now);
                        startOfWeek.setDate(now.getDate() - now.getDay());
                        const endOfWeek = new Date(now);
                        endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
                        return orderDate >= startOfWeek && orderDate <= endOfWeek;
                    case 'thisMonth':
                        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                    case 'thisYear':
                        return orderDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
            setFilteredOrders(filtered);
            setCurrentPage(1);  // Reset to the first page when filter changes
        } else {
            setFilteredOrders(orders);
            setCurrentPage(1);  // Reset to the first page when filter is cleared
        }
    }, [filterType, orders]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = orders.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOrders(filtered);
            setCurrentPage(1);  // Reset to the first page when search term changes
        } else {
            setFilteredOrders(orders);
            setCurrentPage(1);  // Reset to the first page when search term is cleared
        }
    }, [searchTerm, orders]);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Function to update order status
    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`https://www.api.panandacademy.com/api/v1/update-penDrive-order-status/${orderId}`, {
                OrderStatus: status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Order status updated successfully');
            handleFetch(); // Refresh the orders list
        } catch (error) {
            toast.error('Failed to update order status');
            console.log(error);
        }
    };

    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    // Function to open modal and set the selected address
    const openAddressModal = (address) => {
        setSelectedAddress(address);
    };

    // Function to close modal
    const closeAddressModal = () => {
        setSelectedAddress(null);
    };

    // Handle open modal and fetch user details
    const openUserModal = (userId) => {
        setSelectedUser(userId);
    };

    // Function to close user modal
    const closeUserModal = () => {
        setSelectedUser(null);
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Orders</h4>
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    <select value={filterType} onChange={handleFilterChange}>
                        <option value="">All Orders</option>
                        <option value="today">Today's Orders</option>
                        <option value="yesterday">Yesterday's Orders</option>
                        <option value="thisWeek">This Week's Orders</option>
                        <option value="thisMonth">This Month's Orders</option>
                        <option value="thisYear">This Year's Orders</option>
                    </select>
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label>&nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <section className="d-table-h">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">User Details</th>
                            <th scope="col">Items</th>
                            <th scope="col">Final Price</th>
                            <th scope="col">Address</th>
                            <th scope="col">Order Status</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((order, index) => (
                            <tr key={order._id}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                    <button
                                        className="btn btn-success text-nowrap"
                                        onClick={() => openUserModal(order.userId)} // Open modal with userId
                                    >
                                        See User
                                    </button>
                                </td>
                                <td>
                                    {order.CartItems.map((item, index) => (
                                        <div key={index}>
                                            <strong>{item.productName}</strong><br />
                                            Mode: {item?.selectedMode?.name || 'Book(PDF)'}<br />
                                            Quantity: {item.quantity}<br />
                                            Price: {`${item.productPrice} * ${item.quantity} = ${item.totalPrice}`}
                                        </div>
                                    ))}
                                </td>
                                <td>{order.totalPrice}</td>
                                {order.Address ? (
                                    <td>
                                        <button
                                            className="btn btn-success text-nowrap"
                                            onClick={() => openAddressModal(order.Address)}
                                        >
                                            See Address
                                        </button>
                                    </td>
                                ) : (
                                    <td>No Address Available</td>
                                )}
                                <td>
                                    <select
                                        value={order.OrderStatus}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Order-Packed">Order-Packed</option>
                                        <option value="Ready To Ship">Ready To Ship</option>
                                        <option value="Dispatch">Dispatch</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>{order.paymentStatus}</td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td>
                                    <Link onClick={() => handleDelete(order._id)} className="bt delete text-nowrap">
                                        Delete <i className="fa-solid fa-trash"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(filteredOrders.length / itemPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>

            {/* Address Modal */}
            {selectedAddress && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Address Details</h5>
                                <button className="close" onClick={closeAddressModal}>×</button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Address Type:</strong> {selectedAddress.addressType}</p>
                                <p><strong>House Number:</strong> {selectedAddress.houseNumber}</p>
                                <p><strong>Landmark:</strong> {selectedAddress.landmark}</p>
                                <p><strong>Street Address:</strong> {selectedAddress.streetAddress}</p>
                                <p><strong>City:</strong> {selectedAddress.City}</p>
                                <p><strong>State:</strong> {selectedAddress.State}</p>
                                <p><strong>Pin Code:</strong> {selectedAddress.pincode}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeAddressModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

             {/* User Details Modal */}
             {selectedUser && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">User Details</h5>
                                <button className="close" onClick={closeUserModal}>×</button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Full Name:</strong> {selectedUser.FullName}</p>
                                <p><strong>Email:</strong> {selectedUser.Email}</p>
                                <p><strong>Contact Number:</strong> {selectedUser.ContactNumber}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeUserModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllOrder;
