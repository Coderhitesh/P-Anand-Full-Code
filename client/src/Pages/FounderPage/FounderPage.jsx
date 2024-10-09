import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './founderPage.css'
import founder1 from './kausal-foundar.webp'
import founder2 from './prasannjeet-founder.webp'
import founder3 from './vikash-founder.webp'
import axios from 'axios'

function FounderPage() {
  // const {name} = useParams()
  // console.log(name)
  // const data = [
  //     {
  //         id:1,
  //     }
  // ]

  const [teacher, setTeacher] = useState([])

  const handleFetchTeacher = async () => {
    try {
      const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-teacher')
      setTeacher(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: '0',
      behavior: 'smooth'
    })
    handleFetchTeacher();
  }, [])
  return (
    <div className='founder-section'>
      <div className="founder-container">
        <div className="founder-box">
          {/* <div className="founder-heading">
            <h2>Founders</h2>
          </div> */}
          <div className="founder-detail">
            <div className="img">
              <img src={founder1} alt="" />
            </div>
            <div className="founder-info">
              <h3>Kausal Sir</h3>
              <p>Co-Founder</p>
              <p className='about'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cum possimus architecto recusandae magni sunt sint ex enim laborum! Reiciendis reprehenderit iste, cum iusto voluptatem quam sapiente amet tempora perspiciatis, maxime, sunt laudantium dolorum dicta. Similique repellendus quaerat aspernatur molestiae quas voluptatum ipsa veniam voluptas ea temporibus nulla eius in a iusto cum assumenda, accusamus rerum porro fugiat, eos dolores quae laborum. Quas incidunt rem inventore sequi placeat magni qui, voluptates libero ad, explicabo doloribus neque, consectetur maxime unde enim optio delectus sed animi voluptatem velit autem similique amet eum saepe. Inventore repellat at labore ipsum aspernatur eum fugit dolorum! Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <div className="founder-detail">
            <div className="img">
              <img src={founder2} alt="" />
            </div>
            <div className="founder-info">
              <h3>Prasannjeet Sir</h3>
              <p>Co-Founder</p>
              <p className='about'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cum possimus architecto recusandae magni sunt sint ex enim laborum! Reiciendis reprehenderit iste, cum iusto voluptatem quam sapiente amet tempora perspiciatis, maxime, sunt laudantium dolorum dicta. Similique repellendus quaerat aspernatur molestiae quas voluptatum ipsa veniam voluptas ea temporibus nulla eius in a iusto cum assumenda, accusamus rerum porro fugiat, eos dolores quae laborum. Quas incidunt rem inventore sequi placeat magni qui, voluptates libero ad, explicabo doloribus neque, consectetur maxime unde enim optio delectus sed animi voluptatem velit autem similique amet eum saepe. Inventore repellat at labore ipsum aspernatur eum fugit dolorum! Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <div className="founder-detail">
            <div className="img">
              <img src={founder3} alt="" />
            </div>
            <div className="founder-info">
              <h3>Vikash Sir</h3>
              <p>Co-Founder</p>
              <p className='about'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cum possimus architecto recusandae magni sunt sint ex enim laborum! Reiciendis reprehenderit iste, cum iusto voluptatem quam sapiente amet tempora perspiciatis, maxime, sunt laudantium dolorum dicta. Similique repellendus quaerat aspernatur molestiae quas voluptatum ipsa veniam voluptas ea temporibus nulla eius in a iusto cum assumenda, accusamus rerum porro fugiat, eos dolores quae laborum. Quas incidunt rem inventore sequi placeat magni qui, voluptates libero ad, explicabo doloribus neque, consectetur maxime unde enim optio delectus sed animi voluptatem velit autem similique amet eum saepe. Inventore repellat at labore ipsum aspernatur eum fugit dolorum! Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
        </div>

        <div className="team-box">
          <div className="team-heading">
            <h2>Our Team</h2>
          </div>
          <div className="team-row">
            {
              teacher && teacher.map((item, index) => (
                <div key={index} className="team-box-items forremovemargin">
                  <div className="team-image">
                    <div className="thumb">
                      <img src={item.teacherImage.url} alt="img" />
                    </div>
                    {/* <div className="shape-img">
                    <img src="assets/img/team/shape-img.png" alt="img" />
                  </div> */}
                  </div>
                  <div className="team-content text-center">
                    <h6 style={{ marginBottom: '0%' }}><a>{item.teacherName}</a></h6>
                    {/* <p>{item.teacherExpertise[0]}</p> */}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default FounderPage
