import React, { useEffect } from 'react'
import './contact.css'
// import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Loading from '../Loading/Loading';
// import HaveQuestion from '../../Components/HaveQuestion/HaveQuestion';

function Contact() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Simulate loading time (2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {
        loading ? (
          <Loading />
        ) : (
          <section className='contact-section'>
            <div className="contact-container">
              {/* Breadcumb Section Start */}
              <div className="breadcrumb-wrapper">
                {/* <div className="book1">
            <img src="assets/img/hero/book1.png" alt="book" />
        </div>
        <div className="book2">
            <img src="assets/img/hero/book2.png" alt="book" />
        </div> */}
                <div className="container">
                  <div className="page-heading">
                    <h1>Contact Us</h1>
                    <div className="page-header">
                      <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".3s">
                        <li>
                          <Link to={"/"}>
                            Home
                          </Link>
                        </li>
                        <li>
                          <i className="fa-solid fa-chevron-right"></i>
                        </li>
                        <li>
                          Contact Us
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="main-container">
                <div className="form-parent">
                  <form action="">
                    <div className="form-heading">
                      <h2>Get in Touch</h2>
                      <p>Please raise a query & we will get back to you.</p>
                    </div>
                    <div className="main-field">
                      <div className="two-field">
                        <input type="text" name="" placeholder='Full Name' />
                        <input type="text" name="" placeholder='Mobile Number' />
                      </div>
                      <div className="two-field">
                        <input type="text" name="" placeholder='Email' />
                        <input type="text" name="" placeholder='Subject' />
                      </div>
                      <div className="message-box">
                        <textarea name="" id="" placeholder='Message'></textarea>
                      </div>
                      <button type='submit'>Submit</button>
                    </div>
                  </form>
                </div>
                <div className="social-parent">
                  <div className="social-container">
                    <a href=""><i className="ri-instagram-fill"></i></a>
                    <a href=""><i className="ri-facebook-box-fill"></i></a>
                    <a href=""><i className="ri-linkedin-box-fill"></i></a>
                    <a href=""><i className="ri-twitter-x-fill"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }
    </>
  )
}

export default Contact
