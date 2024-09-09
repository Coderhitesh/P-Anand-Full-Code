import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { useState } from 'react';

function About() {
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
          <>
            {/* Breadcumb Section Start */}
            <div className="breadcrumb-wrapper">
              <div className="container">
                <div className="page-heading">
                  <h1>About Us</h1>
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
                        About Us
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section Start */}
            <section className="about-section fix section-padding">
              <div className="container">
                <div className="about-wrapper">
                  <div className="row g-4 align-items-center">
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
                      <div className="about-image">
                        <img src="assets/img/about-us.webp" alt="img" />
                        <div className="video-box">
                          <a href="https://www.youtube.com/watch?v=gpwkIQX0KmQ" className="video-btn ripple video-popup">
                            <i className="fa-solid fa-play"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="about-content">
                        <div className="section-title">
                          <h2 className="wow fadeInUp" data-wow-delay=".3s">About The <br /> P Anand Academy</h2>
                        </div>
                        <p className="mt-5 mt-md-4 wow fadeInUp text-justify" data-wow-delay=".5s">
                          𝐏 𝐀𝐧𝐚𝐧𝐝 𝐀𝐜𝐚𝐝𝐞𝐦𝐲 - 𝐂𝐨𝐚𝐜𝐡𝐢𝐧𝐠 𝐜𝐥𝐚𝐬𝐬𝐞𝐬 𝐢𝐧 𝐕𝐚𝐢𝐬𝐡𝐚𝐥𝐢 offer comprehensive academic support for students from 10th to 12th grade. We understand the importance of a strong educational foundation for a bright future. Our expert faculty provides personalized attention and innovative teaching methodologies to help students excel in the CBSE curriculum. With our best online and offline classes, we offer a unique learning experience tailored to individual needs. Explore our range of coaching classes, including Mathematics, Science, Accounts, English, Economics, CA Foundation, and CA Intermediate. Join us to unlock your full potential and achieve academic success at Vaishali's best coaching institute.
                        </p>
                        <p className="mt-3 wow fadeInUp text-justify" data-wow-delay=".7s">
                          At P Anand Academy, we take pride in being recognized as the best coaching classes in Vaishali. Our commitment to academic excellence, personalized attention, and holistic development has set us apart as a premier educational institution. Here's why P Anand Academy stands out in the competitive landscape of coaching classes:
                        </p>
                        <a href="tel:9971262737" className="link-btn wow fadeInUp" data-wow-delay=".8s">Request a Call <i className="fa-regular fa-arrow-right"></i></a>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="about-content mt-5">
                        <h3 className="wow fadeInUp" data-wow-delay=".3s">Experienced Faculty</h3>
                        <p className="mt-5 mt-md-4 wow fadeInUp text-justify" data-wow-delay=".5s">
                          Our team of highly qualified and experienced educators forms the backbone of P Anand Academy. Each faculty member is an expert in their respective field, bringing a wealth of knowledge and practical insights to the classroom. Their dedication to teaching and passion for nurturing young minds ensures that every student receives the best possible guidance.
                        </p>
                        <p className="mt-5 mt-md-4 wow fadeInUp text-justify" data-wow-delay=".5s">
                          We offer a meticulously designed curriculum that covers a wide range of subjects and competitive exams. Whether it's school-level academics, entrance exams, or professional courses, our curriculum is tailored to meet the diverse needs of our students. Our structured approach ensures that students grasp concepts thoroughly and perform exceptionally well in their examinations. At P Anand Academy, we understand that each student has unique strengths and areas for improvement. Our small class sizes enable us to provide personalized attention to every student, ensuring that their individual learning needs are met. Regular assessments and feedback sessions help track progress and address any challenges promptly. We believe in nurturing well-rounded individuals who excel not only academically but also in extracurricular activities. P Anand Academy encourages students to participate in various sports, cultural events, and leadership programs. This holistic approach ensures the overall development of our students, preparing them for future challenges.
                        </p>
                        <p className="mt-5 mt-md-4 wow fadeInUp text-justify" data-wow-delay=".5s">
                          Our students' consistent success in various exams and competitions speaks volumes about our quality of education. Over the years, P Anand Academy has produced numerous toppers and achievers who have gone on to excel in their chosen fields. Our alumni network is a testament to the strong foundation we provide. We foster a supportive and inclusive community where students feel motivated and encouraged. Our dedicated support staff, counselors, and mentors are always available to assist students with academic and personal challenges, ensuring a nurturing environment conducive to learning.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )
      }
    </>
  );
}

export default About;
