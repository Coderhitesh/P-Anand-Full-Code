import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ActiveCourse from './ActiveCourse';
import BookOrder from './BookOrder';
import UserOrder from './UserOrder'

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
            const allData = res.data.data;
            setCourses([...allData].reverse());

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

    const formatCurrency = (amount) => {
        if (!amount) return '0.00';
        return parseFloat(amount)
            .toFixed(2) // Ensure two decimal places
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format with commas
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

            {/* Tabs */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'activeCourse' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activeCourse')}
                    >
                        Orders
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'bookOrder' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookOrder')}
                    >
                        Profile update
                    </button>
                </li>
                {/* <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'order' ? 'active' : ''}`}
                        onClick={() => setActiveTab('order')}
                    >
                        Order
                    </button>
                </li> */}
            </ul>

            {/* Tab Content */}
            <div className="tab-content mt-4">
                {activeTab === 'activeCourse' && <ActiveCourse courses={courses} />}
                {activeTab === 'bookOrder' && <BookOrder user={user} />}
                {/* {activeTab === 'order' && <UserOrder orders={orders} />} */}
            </div>
        </div>
    );
};

export default UserProfile;
