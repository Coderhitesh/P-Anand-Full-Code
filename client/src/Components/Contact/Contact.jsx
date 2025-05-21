import React, { useEffect, useState } from 'react';
import './contact.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading/Loading';

function Contact() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: '',
    number: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://www.api.panandacademy.com/api/v1/create-enquiry', data);
      setSubmitted(true);
      setData({
        name: '',
        number: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="contact-section">
          <div className="contact-container">
            {/* Breadcrumb Section */}
            <div className="breadcrumb-wrapper">
              <div className="container">
                <div className="page-heading">
                  <h1>Contact Us</h1>
                  <div className="page-header">
                    <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".3s">
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <i className="fa-solid fa-chevron-right"></i>
                      </li>
                      <li>Contact Us</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="main-container">
              <div className="form-parent">
                <form onSubmit={handleSubmit}>
                  <div className="form-heading">
                    <h2>Get in Touch</h2>
                    <p>Please raise a query & we will get back to you.</p>
                    {submitted && <p style={{ color: 'green' }}>Enquiry submitted successfully!</p>}
                  </div>
                  <div className="main-field">
                    <div className="two-field">
                      <input
                      style={{color:'black'}}
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={data.name}
                        onChange={handleChange}
                        required
                      />
                      <input
                      style={{color:'black'}}
                        type="text"
                        name="number"
                        placeholder="Mobile Number"
                        value={data.number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="two-field">
                      <input
                      style={{color:'black'}}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={handleChange}
                        required
                      />
                      <input
                      style={{color:'black'}}
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={data.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="message-box">
                      <textarea
                      style={{color:'black'}}
                        name="message"
                        placeholder="Message"
                        value={data.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </div>

              {/* Social Links */}
              <div className="social-parent">
                <div className="social-container">
                  <a href="#"><i className="ri-instagram-fill"></i></a>
                  <a href="#"><i className="ri-facebook-box-fill"></i></a>
                  <a href="#"><i className="ri-linkedin-box-fill"></i></a>
                  <a href="#"><i className="ri-twitter-x-fill"></i></a>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3501.5281125749134!2d77.3398054!3d28.6439018!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb429faa566b%3A0x3e25c0e72d49aa5a!2sP%20Anand%20Academy!5e0!3m2!1sen!2sin!4v1727518237431!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Contact;
