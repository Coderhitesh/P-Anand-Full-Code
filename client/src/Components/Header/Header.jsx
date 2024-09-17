import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.webp'
import menu from './icon-13.svg'
import axios from 'axios'
import { toast } from 'react-toastify'
import './header.css'
import { CartContext } from '../../Context/CartContext'

function Header() {
    const { productCount, fetchData } = useContext(CartContext);
    // const [productCount,setProductCount] = useState('0')
    const SESSION_KEY = 'user_session';
    let session = sessionStorage.getItem(SESSION_KEY);
    // console.log(session)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [category, setCategory] = useState([])
    const [isMobActive, setIsMobActive] = useState(false)
    const [isActiveDropDown, setIsActiveDropDown] = useState(false)
    const handleMobActive = () => {
        setIsMobActive(!isMobActive)
    }
    const handleMobDeActive = () => {
        setIsMobActive(false)
    }
    const handleDropActive = () => {
        setIsActiveDropDown(!isActiveDropDown)
    }
    const handleDropDeActive = () => {
        setIsActiveDropDown(false)
    }
    const token = sessionStorage.getItem('token')
    // console.log(token)
    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-category')
            // console.log(res.data.data)
            setCategory(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {

        // Check if the token exists in sessionStorage
        const token = sessionStorage.getItem('token');
        setIsLoggedIn(!!token); // Set isLoggedIn to true if the token exists
        
        handleFetchCategory()
    }, [isLoggedIn])
    const handleLogout = () => {
        // Remove the token from sessionStorage and update the state
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
        toast.success('Logout Successfully !!')
    };
    useEffect(() => {
        // Fetch cart data when the component is mounted to update the count
        fetchData();
    }, [fetchData]);
    return (
        <div>
            {/* <!-- Offcanvas Area start  --> */}
            <div className="fix-area">
                <div className="offcanvas__info">
                    <div className="offcanvas__wrapper">
                        <div className="offcanvas__content">
                            <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">

                                <div className="offcanvas__close">
                                    <button>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <p className="text d-none d-xl-block">
                                "𝐏 𝐀𝐧𝐚𝐧𝐝 𝐀𝐜𝐚𝐝𝐞𝐦𝐲 - 𝐂𝐨𝐚𝐜𝐡𝐢𝐧𝐠 𝐜𝐥𝐚𝐬𝐬𝐞𝐬 𝐢𝐧 𝐕𝐚𝐢𝐬𝐡𝐚𝐥𝐢 offer comprehensive academic support for students from 10th to 12th grade. we understand the importance of a strong educational foundation for a bright future.
                            </p>
                            <div className="mobile-menu fix mb-3"></div>
                            <div className="offcanvas__contact">
                                <h4>Contact Info</h4>
                                <ul>
                                    <li className="d-flex align-items-center">
                                        <div className="offcanvas__contact-icon">
                                            <i className="fal fa-map-marker-alt"></i>
                                        </div>
                                        <div className="offcanvas__contact-text">
                                            <a target="_blank" href="">SS Tower, Main Market, Sector 4, Vaishali, Ghaziabad, Uttar Pradesh 201010</a>
                                        </div>
                                    </li>
                                    <li className="d-flex align-items-center">
                                        <div className="offcanvas__contact-icon mr-15">
                                            <i className="fal fa-envelope"></i>
                                        </div>
                                        <div className="offcanvas__contact-text">
                                            <a href=" mailto:panandacademy@gmail.com"><span
                                                className="canva-email">panandacademy@gmail.com</span></a>
                                        </div>
                                    </li>
                                    <li className="d-flex align-items-center">
                                        <div className="offcanvas__contact-icon mr-15">
                                            <i className="fal fa-clock"></i>
                                        </div>
                                        <div className="offcanvas__contact-text">
                                            <a target="_blank" href="index.html">Mon-Sat, 09am -05pm</a>
                                        </div>
                                    </li>
                                    <li className="d-flex align-items-center">
                                        <div className="offcanvas__contact-icon mr-15">
                                            <i className="far fa-phone"></i>
                                        </div>
                                        <div className="offcanvas__contact-text">
                                            <a href="tel:099712 62737">+91-9971262737 / 8802202917</a>
                                        </div>

                                    </li>
                                </ul>
                                <div className="header-button mt-4">
                                    {
                                        isLoggedIn ? <Link to={'/Profile'} className="theme-btn mb-2 text-center">
                                            Profile <i className="fa-solid fa-arrow-right-long"></i>
                                        </Link> : <Link to={'/login'} className="theme-btn mb-2 text-center">
                                            Login <i className="fa-solid fa-arrow-right-long"></i>
                                        </Link>
                                    }

                                    <Link to={'/contact'} className="theme-btn text-center">
                                        Get A Quote <i className="fa-solid fa-arrow-right-long"></i>
                                    </Link>
                                </div>
                                <div className="social-icon d-flex align-items-center">
                                    <a href="https://www.facebook.com/p.anandacademy/" target="_blank"><i className="fab fa-facebook-f"></i></a>
                                    <a href="https://www.instagram.com/p.anandacademy/" target="_blank"><i className="fab fa-instagram"></i></a>
                                    {/* <!-- <a href="https://x.com/"><i className="fab fa-twitter"></i></a> --> */}
                                    <a href="https://www.youtube.com/channel/UCk2FPN1Rbugxai5koCMUXzw" target="_blank"><i className="fab fa-youtube"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="offcanvas__overlay"></div>

            <div className="header-top-1">
                <div className="container">
                    <div className="header-top-wrapper">
                        <ul className="contact-list">
                            <li>
                                <i className="fa-regular fa-phone"></i>
                                <a href="tel:+91-9971262737">+91-9971262737 / 8802202917</a>
                            </li>
                            <li>
                                <i className="far fa-envelope"></i>
                                <a href="mailto:panandacademy@gmail.com">panandacademy@gmail.com</a>
                            </li>
                            <li>
                                <i className="far fa-clock"></i>
                                <span>Mon - Sun: 10:00AM - 7:30PM</span>
                            </li>
                        </ul>
                        <div className="social-icon topheader-social-icon d-flex align-items-center">
                            <a href="https://www.facebook.com/p.anandacademy/" target="_blank"><i className="fab fa-facebook-f"></i></a>
                            <a href="https://www.instagram.com/p.anandacademy/" target="_blank"><i className="fab fa-instagram"></i></a>
                            {/* <!-- <a href="https://x.com/"><i className="fab fa-twitter"></i></a> --> */}
                            <a href="https://www.youtube.com/channel/UCk2FPN1Rbugxai5koCMUXzw" target="_blank"><i className="fab fa-youtube"></i></a>
                        </div>
                        <ul className="list">
                            {/* <!-- <li><i className="fa-light fa-comments"></i><a href="#">Live Chat</a></li> --> */}
                            {/* <li style={{color:'white'}}><i className="fa-light fa-user"></i>
                                <button data-bs-toggle="modal" data-bs-target="#loginModal">
                                    Login
                                </button>
                            </li> */}
                            <li style={{ color: 'white' }}><i className="fa-light fa-user"></i>
                                {
                                    isLoggedIn ? <Link to={'/Profile'}>
                                        Profile
                                    </Link> : <Link to={'/login'}>
                                        Login
                                    </Link>
                                }

                            </li>
                        </ul>
                    </div>
                </div>
            </div>


            {/* <!-- Main Header Section start  --> */}
            <header className="header-1 sticky-top">
                <div className="mega-menu-wrapper">
                    <div className="header-main">
                        <div className="container relativecontainer">
                            <div style={{ alignItems: 'center' }} className="row">
                                <div className="col-7 col-md-7 col-lg-10 col-xl-8 col-xxl-10">
                                    <div className="header-left">
                                        <div className="logo">
                                            <Link to="/" className="header-logo">
                                                <img src={logo} alt="logo-img" />
                                            </Link>
                                        </div>
                                        <div className="mean__menu-wrapper">
                                            <div className="main-menu">
                                                <nav id="mobile-menu">
                                                    <ul>
                                                        <li><Link to={'/'}> Home</Link></li>
                                                        <li><Link to={'/about'}> About us</Link></li>
                                                        <li>
                                                            <a> Shop Courses<i className="fas fa-angle-down"></i></a>
                                                            <ul className="submenu">
                                                                {
                                                                    category && category.map((item, index) => (
                                                                        <li key={index}><Link to={`/category/${item._id}`}>{item.categoryName}</Link></li>

                                                                    ))
                                                                }
                                                                {/* <li><Link to={'/shop'}>Offline Class</Link></li> */}
                                                            </ul>
                                                        </li>
                                                        <li><Link to={'/shop'}> Courses</Link></li>

                                                        {/* <li><Link to={''}>Blog</Link></li> */}
                                                        <li>
                                                            <Link to={'/contact'}>Contact us</Link>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* menu  */}
                                <div className={`menu-bar ${isMobActive ? 'menu-Active' : ''}`}>
                                    <div className='navigation-parent'>
                                        <div className="close-box">
                                            <i onClick={handleMobDeActive} className="fas fa-times"></i>
                                        </div>
                                        <ul>
                                            <li><Link onClick={handleMobDeActive} to={'/'}>Home</Link></li>
                                            <li><Link onClick={handleMobDeActive} to={'/about'}>About Us</Link></li>
                                            <li>
                                                <Link onClick={handleDropActive}>Shop <i class="ri-add-line"></i></Link>
                                                <ul className={`drop-down ${isActiveDropDown ? 'active-drop-down' : ''}`}>
                                                    {
                                                        category && category.map((item, index) => (
                                                            <li key={index}>
                                                                <Link onClick={handleMobDeActive} to={`/category/${item._id}`}>{item.categoryName}</Link>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </li>
                                            <li><Link onClick={handleMobDeActive} to={'/shop'}>Courses</Link></li>
                                            <li><Link onClick={handleMobDeActive} to={'/contact'}>Contact Us</Link></li>
                                        </ul>
                                        <div className="btn-box">
                                            {
                                                isLoggedIn ? <Link to={'/Profile'} onClick={handleMobDeActive} className="theme-btn mb-2 text-center">
                                                    Profile <i className="fa-solid fa-arrow-right-long"></i>
                                                </Link> : <Link onClick={handleMobDeActive} to={'/login'} className="theme-btn mb-2 text-center">
                                                    Login <i className="fa-solid fa-arrow-right-long"></i>
                                                </Link>
                                            }

                                            <Link to={'/cart'} className="theme-btn text-center">
                                                Cart <i className="fa-solid fa-arrow-right-long"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5 col-md-5 col-lg-2 col-xl-4 col-xxl-2">

                                    <div className="header-right">
                                        {/* <!-- end of search bar --> */}
                                        <div className="menu-cart">
                                            {/* <Link to={"/wishlist"} className="cart-icon">
                                                <i className="fa-regular fa-heart"></i>
                                            </Link> */}
                                            <Link to={'/cart'} className="cart-icon">
                                                <span>{productCount}</span>
                                                {/* {productCount > 0 && <span>{productCount}</span>} */}
                                                <i className="fa-regular fa-cart-shopping"></i>
                                            </Link>
                                            <div className="header-humbager ml-30">
                                                <a className="sidebar__toggle" href="javascript:void(0)">
                                                    <div className="bar-icon-2">
                                                        <img src={menu} alt="img" />
                                                    </div>
                                                </a>
                                            </div>
                                            {/* custom menu design   */}
                                            <div onClick={handleMobActive} className="togglemenu">
                                                <i class="ri-menu-2-line"></i>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* <!-- Login Modal --> */}
            <div className="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="close-btn">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="identityBox">
                                <div className="form-wrapper">
                                    <h1 id="loginModalLabel">welcome back!</h1>
                                    <input className="inputField" type="email" name="email" placeholder="Email Address" />
                                    <input className="inputField" type="password" name="password" placeholder="Enter Password" />
                                    <div className="input-check remember-me">
                                        <div className="checkbox-wrapper">
                                            <input type="checkbox" className="form-check-input" name="save-for-next"
                                                id="saveForNext" />
                                            <label for="saveForNext">Remember me</label>
                                        </div>
                                        <div className="text"> <a href="index-2.html">Forgot Your password?</a> </div>
                                    </div>
                                    <div className="loginBtn">
                                        <a href="index-2.html" className="theme-btn rounded-0"> Log in </a>
                                    </div>
                                    <div className="orting-badge">
                                        Or
                                    </div>
                                    <div>
                                        <a className="another-option" href="https://www.google.com/">
                                            <img src="assets/img/google.png" alt="google" />
                                            Continue With Google
                                        </a>
                                    </div>
                                    <div>
                                        <a className="another-option another-option-two" href="https://www.facebook.com/">
                                            <img src="assets/img/facebook.png" alt="google" />
                                            Continue With Facebook
                                        </a>
                                    </div>

                                    <div className="form-check-3 d-flex align-items-center from-customradio-2 mt-3">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" />
                                        <label className="form-check-label">
                                            I Accept Your Terms & Conditions
                                        </label>
                                    </div>
                                </div>

                                <div className="banner">
                                    <button type="button" className="rounded-0 login-btn" data-bs-toggle="modal"
                                        data-bs-target="#loginModal">Log in</button>
                                    <button type="button" className="theme-btn rounded-0 register-btn" data-bs-toggle="modal"
                                        data-bs-target="#registrationModal">Create
                                        Account</button>
                                    <div className="loginBg">
                                        <img src="assets/img/signUpbg.jpg" alt="signUpBg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Registration Modal --> */}
            <div className="modal fade" id="registrationModal" tabindex="-1" aria-labelledby="registrationModalLabel"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="close-btn">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="identityBox">
                                <div className="form-wrapper">
                                    <h1 id="registrationModalLabel">Create account!</h1>
                                    <input className="inputField" type="text" name="name" id="name" placeholder="User Name" />
                                    <input className="inputField" type="email" name="email" placeholder="Email Address" />
                                    <input className="inputField" type="password" name="password" placeholder="Enter Password" />
                                    <input className="inputField" type="password" name="password"
                                        placeholder="Enter Confirm Password" />
                                    <div className="input-check remember-me">
                                        <div className="checkbox-wrapper">
                                            <input type="checkbox" className="form-check-input" name="save-for-next"
                                                id="rememberMe" />
                                            <label for="rememberMe">Remember me</label>
                                        </div>
                                        <div className="text"> <a href="index-2.html">Forgot Your password?</a> </div>
                                    </div>
                                    <div className="loginBtn">
                                        <a href="index-2.html" className="theme-btn rounded-0"> Log in </a>
                                    </div>
                                    <div className="orting-badge">
                                        Or
                                    </div>
                                    <div>
                                        <a className="another-option" href="https://www.google.com/">
                                            <img src="assets/img/google.png" alt="google" />
                                            Continue With Google
                                        </a>
                                    </div>
                                    <div>
                                        <a className="another-option another-option-two" href="https://www.facebook.com/">
                                            <img src="assets/img/facebook.png" alt="google" />
                                            Continue With Facebook
                                        </a>
                                    </div>
                                    <div className="form-check-3 d-flex align-items-center from-customradio-2 mt-3">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" />
                                        <label className="form-check-label">
                                            I Accept Your Terms & Conditions
                                        </label>
                                    </div>
                                </div>

                                <div className="banner">
                                    <button type="button" className="rounded-0 login-btn" data-bs-toggle="modal"
                                        data-bs-target="#loginModal">Log in</button>
                                    <button type="button" className="theme-btn rounded-0 register-btn" data-bs-toggle="modal"
                                        data-bs-target="#registrationModal">Create
                                        Account</button>
                                    <div className="signUpBg">
                                        <img src="assets/img/registrationbg.jpg" alt="signUpBg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
