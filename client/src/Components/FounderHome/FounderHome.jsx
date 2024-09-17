import React from 'react'
import './FounderHome.css'
import founder1 from './kausal-foundar.webp'
import founder2 from './prasannjeet-founder.webp'
import founder3 from './vikash-founder.webp'
import { Link } from 'react-router-dom'

function FounderHome() {
    const data = [
        {
            id: 1,
            name: 'CA Prasanjeet Sir',
            img: founder2,
            position: 'Co-Founder'
        },
        {
            id: 2,
            name: 'CA Kausal Sir',
            img: founder1,
            position: 'Co-Founder'
        },
        {
            id: 3,
            name: 'CA Vikash Sir',
            img: founder3,
            position: 'Co-Founder'
        },
    ]
    return (
        <>
            <div className="founder-section">
                <div className="founder-container">
                    <div className="founder-title">
                        <h2>Our Founders</h2>
                        {/* <p>Meet Our Expert Founder</p> */}
                    </div>
                    <div className="founder-row">
                        {
                            data && data.map((item, index) => (
                                <Link to={`/founder-page/${item.name}`} key={index} className="founder-col">
                                    <div className="img">
                                        <img src={item.img} alt="" />
                                    </div>
                                    <div className="founder-detail">
                                        <h3>{item.name}</h3>
                                        <span>{item.position}</span>
                                        <Link to={`/founder-page/${item.name}`}>Read More <i class="ri-arrow-right-line"></i></Link>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default FounderHome
