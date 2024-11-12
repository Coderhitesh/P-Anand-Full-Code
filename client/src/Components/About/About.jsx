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
                          <h2 className="wow fadeInUp" data-wow-delay=".3s">About P Anand Academy</h2>
                        </div>
                        <p className="mt-5 mt-md-4 wow fadeInUp text-justify" data-wow-delay=".5s">
                        Established in 2019, P Anand Academy was the realization of a long-held dream by its visionary co-founders. The idea was planted in their minds long before the academy came to life: to create a nurturing space where learning is not confined to the typical student-teacher dynamic. Instead, the goal was to foster a deeper, more personal relationship between mentors and students—one that encourages open dialogue, mutual problem-solving, and a sense of shared purpose. At P Anand Academy, education is more than just teaching; it’s about cultivating a meaningful connection that helps students thrive, both academically and personally.
                        </p>
                        <p className="mt-3 wow fadeInUp text-justify" data-wow-delay=".7s">
                        Our academy is dedicated exclusively to the commerce stream, catering to students from Class 11th all the way to aspiring Chartered Accountants. What sets us apart is the supportive environment we provide—where students are encouraged to ask questions without hesitation, where learning is collaborative, and where every student feels valued. Our philosophy is that education is a journey we walk together, with mentors acting as guides, not just instructors.
                        </p>
                        <a href="tel:9971262737" className="link-btn wow fadeInUp" data-wow-delay=".8s">Request a Call <i className="fa-regular fa-arrow-right"></i></a>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="about-content mt-5">
                        {/* <h3 className="wow fadeInUp" data-wow-delay=".3s">Experienced Faculty</h3> */}
                        <p className="mt-5 mt-md-4 wow fadeInUp text-justify" data-wow-delay=".5s">
                        Located in the heart of Vaishali, Ghaziabad, at SS Tower, Plot No. 17, Main Market, Sector-4, P Anand Academy offers more than just a physical space for learning. While our campus serves as a hub of activity, our influence extends far beyond the classroom walls. Through our robust online class model, we now reach students across India, ensuring that geography is no barrier to quality education. Whether in person or online, we’ve created an academy that feels like home—a place where students are not only educated but also inspired and supported every step of the way.
                        </p>
                        <p className="mt-5 mt-md-4 wow fadeInUp text-justify" data-wow-delay=".5s">
                        But our success is measured not only by academic results; it's in the lasting bond we form with our students. Over the years, P Anand Academy has won the love and trust of countless students who see us as more than just an academy—they see us as family. We take pride in having built a learning community that is driven by passion, mutual respect, and a shared vision for success.
                        </p>
                        <p className="mt-5 mt-md-4 wow fadeInUp text-justify" data-wow-delay=".5s">
                        Join us, and become a part of this family. You can connect with us on YouTube, Instagram, and Facebook, or simply reach out through WhatsApp at +91-9971262737 or +91-8802202917. Here, at P Anand Academy, you're not just preparing for exams—you’re preparing for life. We look forward to welcoming you on this journey.
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
