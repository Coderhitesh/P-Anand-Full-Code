import React from 'react'
import './FounderHome.css'
import founder1 from './vikash-small.jpg'
import founder2 from './prasannjeet-founder.webp'
import founder3 from './kashish-small.jpg'
import { Link } from 'react-router-dom'

function FounderHome() {
    const data = [
        {
            id: 1,
            name: 'CA Prasannjeet Sir',
            img: founder2,
            position: 'Co-Founder'
        },
        {
            id: 2,
            name: 'CA Vikas Sir',
            img: founder1,
            position: 'Co-Founder'
        },
        {
            id: 3,
            name: "Kashish Ma'am",
            img: founder3,
            position: 'Business Developer'
        },
    ]
    return (
        <>
            <div className="founder-section">
                <div className="founder-container container">
                    <div className="founder-title">
                        <h2>Our Founders</h2>
                        {/* <p>Meet Our Expert Founder</p> */}
                    </div>
                    <div className="founder-row">
                        {
                            data && data.map((item, index) => (
                                // <Link to={`/founder-page/${item.name}`} key={index} className="founder-col">
                                <Link to={`/founder-page`} key={index} className="founder-col">
                                    <div className="img">
                                        <img src={item.img} alt="" />
                                    </div>
                                    <div className="founder-detail">
                                        <h3>{item.name}</h3>
                                        <span>{item.position}</span>
                                        <Link to={`/founder-page`}>Read More <i class="ri-arrow-right-line"></i></Link>
                                        {/* <Link to={`/founder-page/${item.name}`}>Read More <i class="ri-arrow-right-line"></i></Link> */}
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
