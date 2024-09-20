import React, { useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import './Header.css';
// import { toast, ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';

const Header = () => {
  const [sidetoggle, setSideToggle] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    toast.success('Log Out');
    window.location.href = '/';
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSideToggle(false); // Close sidebar on tab click if needed
  };

  return (
    <>
    <Toaster />
      <header>
        <div className="top-head">
          <div className="right">
            <h2>P Anand Admin</h2>
            <div className="bar" onClick={handletoggleBtn}>
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>
          <div className="left">
            <Link to={"https://panandacademy.com/"} target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-globe"></i>
              Go To Website
            </Link>

            <div onClick={handleLogout} className="logout">
              Log Out <i className="fa-solid fa-right-from-bracket"></i>
            </div>
          </div>
        </div>

        <div className={`rightNav ${sidetoggle ? 'active' : ''}`}>
          <ul>
            <li>
              <Link
                to="/dashboard"
                onClick={() => handleTabClick('dashboard')}
                className={activeTab === 'dashboard' ? 'active' : ''}
              >
                <i className="fa-solid fa-gauge me-1"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/all-tags"
                onClick={() => handleTabClick('all-tags')}
                className={activeTab === 'all-tags' ? 'active' : ''}
              >
                <i className="fa-solid fa-tag me-1"></i> Manage Course Tags
              </Link>
            </li>
            <li>
              <Link
                to="/all-category"
                onClick={() => handleTabClick('all-category')}
                className={activeTab === 'all-category' ? 'active' : ''}
              >
                <i className="fa-solid fa-tag me-1"></i> Manage Course Category
              </Link>
            </li>
            <li>
              <Link
                to="/all-courses"
                onClick={() => handleTabClick('all-courses')}
                className={activeTab === 'all-courses' ? 'active' : ''}
              >
                <i className="fa-solid fa-layer-group me-1"></i> Manage Course
              </Link>
            </li>
            <li>
              <Link
                to="/all-teacher"
                onClick={() => handleTabClick('all-teacher')}
                className={activeTab === 'all-teacher' ? 'active' : ''}
              >
                <i className="fa-regular fa-newspaper me-1"></i> Manage Teacher
              </Link>
            </li>
            <li>
              <Link
                to="/all-teacher-rating"
                onClick={() => handleTabClick('all-teacher-rating')}
                className={activeTab === 'all-teacher-rating' ? 'active' : ''}
              >
                <i className="fa-regular fa-newspaper me-1"></i> Manage Teacher Rating
              </Link>
            </li>
            <li>
              <Link
                to="/all-course-rating"
                onClick={() => handleTabClick('all-course-rating')}
                className={activeTab === 'all-course-rating' ? 'active' : ''}
              >
                <i className="fa-regular fa-newspaper me-1"></i> Manage Course Rating
              </Link>
            </li>
            <li>
              <Link
                to="/all-bundle"
                onClick={() => handleTabClick('all-bundle')}
                className={activeTab === 'all-bundle' ? 'active' : ''}
              >
                <i className="fa-solid fa-tag me-1"></i> Manage Course Bundle
              </Link>
            </li>
            <li>
              <Link
                to="/all-book-tags"
                onClick={() => handleTabClick('all-book-tags')}
                className={activeTab === 'all-book-tags' ? 'active' : ''}
              >
                <i className="fa-solid fa-tag me-1"></i> Manage Book Tags
              </Link>
            </li>
            <li>
              <Link
                to="/all-book-category"
                onClick={() => handleTabClick('all-book-category')}
                className={activeTab === 'all-book-category' ? 'active' : ''}
              >
                <i className="fa-solid fa-tag me-1"></i> Manage Book Category
              </Link>
            </li>
            <li>
              <Link
                to="/all-book"
                onClick={() => handleTabClick('all-book')}
                className={activeTab === 'all-book' ? 'active' : ''}
              >
                <i className="fa-solid fa-layer-group me-1"></i> Manage Book
              </Link>
            </li>
            <li>
              <Link
                to="/all-book-bundle"
                onClick={() => handleTabClick('all-book-bundle')}
                className={activeTab === 'all-book-bundle' ? 'active' : ''}
              >
                <i className="fa-solid fa-tag me-1"></i> Manage Book Bundle
              </Link>
            </li>
            <li>
              <Link
                to="/all-book-rating"
                onClick={() => handleTabClick('all-book-rating')}
                className={activeTab === 'all-book-rating' ? 'active' : ''}
              >
                <i className="fa-regular fa-newspaper me-1"></i> Manage Book Rating
              </Link>
            </li>
            <li>
              <Link
                to="/all-banners"
                onClick={() => handleTabClick('all-banners')}
                className={activeTab === 'all-banners' ? 'active' : ''}
              >
                <i className="fa-regular fa-images me-1"></i> Manage Banners
              </Link>
            </li>
            <li>
              <Link
                to="/all-shop-banners"
                onClick={() => handleTabClick('all-shop-banners')}
                className={activeTab === 'all-shop-banners' ? 'active' : ''}
              >
                <i className="fa-brands fa-unsplash me-1"></i> Manage Shop Banners
              </Link>
            </li>
            <li>
              <Link
                to="/all-gallery-name"
                onClick={() => handleTabClick('all-gallery-name')}
                className={activeTab === 'all-gallery-name' ? 'active' : ''}
              >
                <i className="fa-solid fa-truck-arrow-right me-1"></i> Gallery Name
              </Link>
            </li>
            <li>
              <Link
                to="/all-gallery-image"
                onClick={() => handleTabClick('all-gallery-image')}
                className={activeTab === 'all-gallery-image' ? 'active' : ''}
              >
                <i className="fa-solid fa-truck-arrow-right me-1"></i> Gallery Image
              </Link>
            </li>
            <li>
              <Link
                to="/all-users"
                onClick={() => handleTabClick('all-users')}
                className={activeTab === 'all-users' ? 'active' : ''}
              >
                <i className="fa-solid fa-user me-1"></i> All Users
              </Link>
            </li>
            
            <li>
              <Link
                to="/all-orders"
                onClick={() => handleTabClick('all-orders')}
                className={activeTab === 'all-orders' ? 'active' : ''}
              >
                <i className="fa-solid fa-truck-arrow-right me-1"></i> Manage Orders
              </Link>
            </li>
            <div className="mb-5">
              <button onClick={handleLogout} className='logout'>Log Out <i className="fa-solid fa-right-from-bracket me-1"></i></button>
            </div>
          </ul>
        </div>
      </header>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Header;
