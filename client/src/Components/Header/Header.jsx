import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.webp'
import menu from './icon-13.svg'
import axios from 'axios'
// import { toast } from 'react-toastify'
import toast, { Toaster } from 'react-hot-toast';
import './header.css'
import { CartContext } from '../../Context/CartContext'
import insta from './insta.png'

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
    const [isActiveDropDownAbout, setIsActiveDropDownAbout] = useState(false)
    const [isActiveDropDownUsefull, setIsActiveDropDownUsefull] = useState(false)
    const [amount, setAmount] = useState("");
    const [showModal, setShowModal] = useState(false);
    const handlePayment = async () => {
        try {
            const response = await axios.post("https://www.api.panandacademy.com/api/v1/create-instant-payment", { amount });
            if (response.data.success) {

                window.location.href = response.data.url;
            } else {
                console.error('Error initiating payment:', response.data.message);
            }
            toast.success("Payment successful!");
            setAmount('');
            setShowModal(false); // Close modal after successful payment
        } catch (error) {
            console.log("Internal server error", error);
            toast.error(error?.response?.data?.message || "Payment failed!");
        }
    };
    const handleMobActive = () => {
        setIsMobActive(!isMobActive)
    }
    const handleMobDeActive = () => {
        setIsMobActive(false)
    }
    const handleDropActive = () => {
        setIsActiveDropDown(!isActiveDropDown)
    }
    const handleAboutDropActive = () => {
        setIsActiveDropDownAbout(!isActiveDropDownAbout)
    }
    const handleUsefullDropActive = () => {
        setIsActiveDropDownUsefull(!isActiveDropDownUsefull)
    }
    const handleDropDeActive = () => {
        setIsActiveDropDown(false)
    }

    useEffect(() => {
        const header = document.querySelector('.header-1');

        const handleScroll = () => {
            if (window.scrollY > 0) {
                header.classList.add('stuck');  // Add the 'stuck' class when scrolling down
            } else {
                header.classList.remove('stuck');  // Remove it when at the top
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const token = sessionStorage.getItem('token')
    // console.log(token)
    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-category')

            // setCategory(res.data.data)
            const category = res.data.data
            const filterData = category.filter((item) => item.isActive === true);
            // Sort categories by their 'position' field in ascending order
            const sortedCategories = filterData.sort((a, b) => a.position - b.position);
            setCategory(sortedCategories);
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
            <Toaster />
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
                                            <a href=" mailto:p.anandacademy@gmail.com"><span
                                                className="canva-email">p.anandacademy@gmail.com</span></a>
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
                                    <a href="https://www.facebook.com/p.anandacademy/" target="_blank"><i style={{ color: 'white' }} className="fab fa-facebook-f"></i></a>
                                    {/* <a href="https://www.instagram.com/p.anandacademy/" target="_blank"><i style={{ color: 'white' }} className="fab fa-instagram"></i></a> */}
                                    <a href="https://www.instagram.com/p.anandacademy/" target="_blank">
                                        <img src={insta} alt="" />
                                    </a>
                                    {/* <!-- <a href="https://x.com/"><i className="fab fa-twitter"></i></a> --> */}
                                    <a href="https://www.youtube.com/channel/UCk2FPN1Rbugxai5koCMUXzw" target="_blank"><i style={{ color: 'white' }} className="fab fa-youtube"></i></a>
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
                                <a href="mailto:p.anandacademy@gmail.com">p.anandacademy@gmail.com</a>
                            </li>
                            <li>
                                <i className="far fa-clock"></i>
                                <span>Mon - Sun: 10:00AM - 7:30PM</span>
                            </li>
                        </ul>
                        <div className="social-icon topheader-social-icon d-flex align-items-center">
                            <a href="https://www.facebook.com/p.anandacademy/" target="_blank"><i style={{ color: 'white' }} className="fab fa-facebook-f"></i></a>
                            {/* <a href="https://www.instagram.com/p.anandacademy/" target="_blank"><i style={{ color: 'white' }} className="fab fa-instagram"></i></a> */}
                            <a href="https://www.instagram.com/p.anandacademy/" target="_blank">
                                <img style={{ widows: '100%', objectFit: 'cover' }} src={insta} alt="" /></a>
                            {/* <!-- <a href="https://x.com/"><i className="fab fa-twitter"></i></a> --> */}
                            <a href="https://www.youtube.com/channel/UCk2FPN1Rbugxai5koCMUXzw" target="_blank"><i style={{ color: 'white' }} className="fab fa-youtube"></i></a>
                        </div>
                        <ul className="list">
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
            <header className="header-1 forstickyheader">
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
                                                        <li>
                                                            <Link>About Us<i className="fas fa-angle-down"></i></Link>
                                                            <ul className="submenu">
                                                                <li><Link to={'/about'}>About P Anand</Link></li>
                                                                <li><Link to={'/founder-page'}>Co-Founder & Teams</Link></li>
                                                            </ul>
                                                        </li>
                                                        {/* <li>
                                                            <Link>Usefull Links<i className="fas fa-angle-down"></i></Link>
                                                            <ul className="submenu">
                                                                <li><Link target='_blank' to={'https://www.cbse.gov.in/'}>CBSE</Link></li>
                                                                <li><Link target='_blank' to={'https://ncert.nic.in/'}>NCERT</Link></li>
                                                                <li><Link target='_blank' to={'https://www.icai.org/'}>ICAI</Link></li>
                                                            </ul>
                                                        </li> */}
                                                        <li>
                                                            <Link to={'/shop'}>Course<i className="fas fa-angle-down"></i></Link>
                                                            <ul className="submenu">
                                                                {
                                                                    category && category.map((item, index) => (
                                                                        <li key={index}><Link to={`/category/${item._id}`}>{item.categoryName}</Link></li>

                                                                    ))
                                                                }
                                                            </ul>
                                                        </li>
                                                        <li><Link to={'/Book'}> Books</Link></li>
                                                        <li><Link to={'/free-resource'}>Free Resources</Link></li>
                                                        <li><Link to={'/gallery'}> Gallery</Link></li>
                                                        <li>
                                                            <Link to={'/contact'}>Contact us</Link>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => setShowModal(true)}
                                                                style={{
                                                                    backgroundColor: "#B05F22",
                                                                    padding: "5px 14px",
                                                                    color: "white",
                                                                    borderRadius: "5px",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Pay Now
                                                            </button>
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
                                            <li>
                                                <Link onClick={handleAboutDropActive}>About Us  <i class="ri-add-line"></i></Link>
                                                <ul className={`drop-down ${isActiveDropDownAbout ? 'active-drop-down-about' : ''}`}>
                                                    <li>
                                                        <Link onClick={handleMobDeActive} to={`/about`}>About P Anand</Link>
                                                    </li>
                                                    <li>
                                                        <Link onClick={handleMobDeActive} to={`/founder-page`}>Co-Founder & Teams</Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            {/* <li>
                                                <Link onClick={handleUsefullDropActive}>Usefull Links<i class="ri-add-line"></i></Link>
                                                <ul className={`drop-down ${isActiveDropDownUsefull ? 'active-drop-down-usefull' : ''}`}>


                                                    <li><Link onClick={handleMobDeActive} target='_blank' to={'https://www.cbse.gov.in/'}>CBSE</Link></li>
                                                    <li><Link onClick={handleMobDeActive} target='_blank' to={'https://ncert.nic.in/'}>NCERT</Link></li>
                                                    <li><Link onClick={handleMobDeActive} target='_blank' to={'https://www.icai.org/'}>ICAI</Link></li>
                                                </ul>
                                            </li> */}
                                            <li>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="">
                                                    <Link to={'/shop'}>Shop </Link>
                                                    <i style={{ fontWeight: '700', fontSize: '25px', paddingRight: '5px' }} onClick={handleDropActive} class="ri-add-line"></i>
                                                </div>
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
                                            <li><Link onClick={handleMobDeActive} to={'/founder-page'}>Founder</Link></li>
                                            <li><Link onClick={handleMobDeActive} to={'/free-resource'}>Free Resources</Link></li>
                                            <li><Link onClick={handleMobDeActive} to={'/gallery'}>Gallery</Link></li>
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

                                            <Link to={'/cart'} onClick={handleMobDeActive} className="theme-btn text-center">
                                                Cart <i className="fa-solid fa-arrow-right-long"></i>
                                            </Link>

                                            <Link onClick={() => { handleMobDeActive(); setShowModal(true); }} className="theme-btn text-center">
                                                Pay Now <i className="fa-solid fa-arrow-right-long"></i>
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

            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Enter Payment Amount</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div style={{padding:'10px'}} className="modal-body">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="btn"
                                    style={{ backgroundColor: '#B05F22', color: 'white' }}
                                    onClick={handlePayment}
                                    disabled={!amount}
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Backdrop */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    )
}

export default Header
