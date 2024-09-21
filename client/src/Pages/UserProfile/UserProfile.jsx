import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('activeCourse');
    const [user, setUser] = useState({});
    const [courses, setCourses] = useState([]);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    // Fetch user profile data
    const handleFetchUserProfile = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/user-details', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch course data
    const handleFetchCourseData = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/show-course', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch order data
    const handleFetchOrderData = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/book-order', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Logout function
    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    useEffect(() => {
        handleFetchUserProfile();
        handleFetchCourseData();
        handleFetchOrderData();
    }, [token]);

    // Function to change active tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Data fetching is managed in useEffect based on token and tab changes
    };

    return (
        <div className="container py-5">
            <div className="card mb-4">
                <div className="row g-0">
                    <div className="col-md-4 bg-light d-flex justify-content-center align-items-center">
                        <img
                            src={user.img || "https://i.postimg.cc/1zyfWn9Y/users.png"}
                            alt="User"
                            className="img-fluid rounded-circle"
                            style={{ width: '150px', height: '150px' }}
                        />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h2 className="card-title">Profile Information</h2>
                            <hr />
                            <ul className="list-unstyled">
                                <li className="mb-3"><strong>Name:</strong> {user.FullName}</li>
                                <li className="mb-3"><strong>Email:</strong> {user.Email}</li>
                                <li className="mb-3"><strong>Contact Number:</strong> {user.ContactNumber}</li>
                                {/* <li className="mb-3"><strong>Orders Delivered:</strong> 25</li>
                                <li className="mb-3"><strong>Active Course:</strong> 12</li> */}
                            </ul>
                            <div className='d-flex gap-2'>
                                <button onClick={handleLogout} className="theme-btn p-3">Logout</button>
                                <button className="theme-btn p-3">Shop</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'activeCourse' ? 'active' : ''}`}
                        onClick={() => handleTabChange('activeCourse')}
                    >
                        Active Course
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'bookOrder' ? 'active' : ''}`}
                        onClick={() => handleTabChange('bookOrder')}
                    >
                        Book Order
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'orderStatus' ? 'active' : ''}`}
                        onClick={() => handleTabChange('orderStatus')}
                    >
                        Order Status
                    </button>
                </li>
                {/* <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'passwordChange' ? 'active' : ''}`}
                        onClick={() => handleTabChange('passwordChange')}
                    >
                        Password Change
                    </button>
                </li> */}
            </ul>

            {/* Tab Content Section */}
            <div className="tab-content mt-4">
                {activeTab === 'activeCourse' && (
                    <div className="tab-pane fade show active">
                        <h3 className="mb-4">Active Courses</h3>
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th style={{ whiteSpace: 'nowrap' }}>Sr.No.</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Image</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Course Name</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Course Mode</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Course Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length > 0 ? (
                                        courses.map((course, index) => (
                                            <tr key={course.productId}>
                                                <td>{index + 1}</td>
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
                                                <td>₹{course.productPrice}</td>
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
                    </div>
                )}

                {activeTab === 'bookOrder' && (
                    <div className="tab-pane fade show active">
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
                                    {orders.length > 0 ? (
                                        orders.map((order, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <img
                                                        src={order.productImage}
                                                        alt={order.productName}
                                                        className="img-thumbnail"
                                                        style={{ width: '100px', height: 'auto' }}
                                                    />
                                                </td>
                                                <td>{order.productName}</td>
                                                <td>₹{order.productPrice}</td>
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
                    </div>
                )}

                {/* Other tab contents like Order Status and Password Change can go here */}
            </div>
        </div>
    );
};

export default UserProfile;
