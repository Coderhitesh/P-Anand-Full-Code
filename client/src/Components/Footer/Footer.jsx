import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './footer.css'
import axios from 'axios'

function Footer() {
    const [category, setCategory] = useState([])
    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-category')
            setCategory(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        handleFetchCategory();
    },[])
    return (
        <div>
            {/* <!-- Footer Section start  --> */}
            <footer class="footer-section footer-bg">
                <div class="container">
                    <div class="contact-info-area">
                        <div class="contact-info-items wow fadeInUp" data-wow-delay=".2s">
                            <div class="icon">
                                <i class="icon-icon-5"></i>
                            </div>
                            <div class="content">
                                <p>Call Us 7/24</p>
                                <h3>
                                    <a href="tel:+919971262737">+91-9971262737</a>
                                </h3>
                            </div>
                        </div>

                        <div class="contact-info-items wow fadeInUp" data-wow-delay=".6s">
                            <div class="icon">
                                <i class="icon-icon-7"></i>
                            </div>
                            <div class="content">
                                <p>Opening Hour</p>
                                <h3>
                                    Mon - Sun: 10:00AM - 7:30PM
                                </h3>
                            </div>
                        </div>
                        <div class="contact-info-items wow fadeInUp" data-wow-delay=".8s">
                            <div class="icon">
                                <i class="icon-icon-8"></i>
                            </div>
                            <div class="content">
                                <p>Location</p>
                                <h3>
                                    <a href="https://maps.app.goo.gl/yA6bwvvVtdtsWevH6" target="_blank">Get Direction</a>
                                </h3>
                            </div>
                        </div>
                        <div class="contact-info-items wow fadeInUp" data-wow-delay=".4s">
                            <div class="icon">
                                <i class="icon-icon-6"></i>
                            </div>
                            <div class="content">
                                <p>Make a Quote</p>
                                <h3>
                                    <a href="mailto:">panandacademy@ gmail.com</a>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-widgets-wrapper">
                    <div class="plane-shape float-bob-y">
                        <img src="assets/img/plane-shape.png" alt="img" />
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                                <div class="single-footer-widget">
                                    <div class="widget-head">
                                        {/* <a href="index.html">
                                    <img src="assets/img/logo/white-logo.svg" alt="logo-img"/>
                                </a> */}
                                    </div>
                                    <div class="footer-content">
                                        <p>
                                            𝐏 𝐀𝐧𝐚𝐧𝐝 𝐀𝐜𝐚𝐝𝐞𝐦𝐲 - 𝐂𝐨𝐚𝐜𝐡𝐢𝐧𝐠 𝐜𝐥𝐚𝐬𝐬𝐞𝐬 𝐢𝐧 𝐕𝐚𝐢𝐬𝐡𝐚𝐥𝐢 offer comprehensive academic support for students from 10th to 12th grade. we understand the importance of a strong educational foundation for a bright future.
                                        </p>
                                        <div class="social-icon d-flex align-items-center">
                                            <a href="https://www.facebook.com/p.anandacademy/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                            <a href="https://www.instagram.com/p.anandacademy/" target="_blank"><i class="fab fa-instagram"></i></a>
                                            <a href="https://www.youtube.com/channel/UCk2FPN1Rbugxai5koCMUXzw" target="_blank"><i class="fab fa-youtube"></i></a>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp" data-wow-delay=".4s">
                                <div class="single-footer-widget">
                                    <div class="widget-head">
                                        <h3>Quick Links</h3>
                                    </div>
                                    <ul class="list-area">
                                        <li>
                                            <Link to="/">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/about">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                About us
                                            </Link>
                                        </li>
                                        
                                        {/* <li>
                                    <Link to="/">
                                        <i class="fa-solid fa-chevrons-right"></i>
                                        Blog
                                    </Link>
                                </li> */}
                                        <li>
                                            <Link to="/contact">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Contact us
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp" data-wow-delay=".6s">
                                <div class="single-footer-widget">
                                    <div class="widget-head">
                                        <h3>Support</h3>
                                    </div>
                                    <ul class="list-area">
                                        <li>
                                            <Link to="/about">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                About us
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/term">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Terms & Condition
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/privacy-policy">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Privacy Policy
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/refund">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Refund and Cancellation Policy
                                            </Link>
                                        </li>

                                        {/* <li>
                                            <Link to="/">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Free Study Materials
                                            </Link>
                                        </li> */}
                                    </ul>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp" data-wow-delay=".6s">
                                <div class="single-footer-widget">
                                    <div class="widget-head">
                                        <h3>Our Top Category</h3>
                                    </div>
                                    <ul class="list-area">
                                        {
                                            category && category.map((item, index) => (
                                                <li key={index}>
                                                    <Link to={`/category/${item._id}`}>
                                                        <i class="fa-solid fa-chevrons-right"></i>
                                                        {item.categoryName}
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                        <li>
                                            <Link to="/Book">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Books
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/Bundle">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Course Bundle
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/book-bundle">
                                                <i class="fa-solid fa-chevrons-right"></i>
                                                Book Bundle
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <div class="container">
                        <div class="footer-wrapper d-flex align-items-center justify-content-between">
                            <p class="wow fadeInLeft" data-wow-delay=".3s">
                                P Anand Academy © Copyright 2024. All Rights Reserved. Manage By <a href="#">Hover Business Servicess LLP</a>
                            </p>
                            <ul class="brand-logo wow fadeInRight" data-wow-delay=".5s">
                                <li>
                                    <Link to="contact.html">
                                        <img src="assets/img/visa-logo.png" alt="img" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="contact.html">
                                        <img src="assets/img/mastercard.png" alt="img" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="contact.html">
                                        <img src="assets/img/payoneer.png" alt="img" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="contact.html">
                                        <img src="assets/img/affirm.png" alt="img" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>

            {/* <!-- Back To Top start --> */}
            <button id="back-top" class="back-to-top">
                <i class="fa-solid fa-chevron-up"></i>
            </button>


            {/* <!--<< All JS Plugins >>--> */}

        </div>
    )
}

export default Footer
