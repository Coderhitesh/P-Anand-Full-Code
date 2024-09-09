import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Hero.css';
import banner1 from './banner1.webp'
import axios from 'axios';
// import banner2 from './banner2.jpg'

function Hero() {
    const [banner, setBanner] = useState([])
    const settings = {
        dots: true,
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true, // Enable fade effect
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2000 // Autoplay speed in milliseconds
    };

    const fetchBanner = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-banner')
            setBanner(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBanner()
    }, [])

    return (
        <section className='hero-section'>
            <div className="hero-container">
                <Slider className='slider-main-box' {...settings}>
                    {
                        banner && banner.map((item, index) => (
                            <div key={index} className='slider-box'>
                                <img src={item.bannerImage.url} alt="" />
                            </div>
                        ))
                    }

                    {/* <div className='slider-box'>
                        <img src={banner1} alt="" />
                    </div> */}
                </Slider>
            </div>
        </section>
    );
}

export default Hero;
