import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './founderPage.css'
import founder1 from './kausal-foundar.webp'
import founder2 from './prasannjeet-founder.webp'
import founder3 from './vikash-founder.webp'

function FounderPage() {
  // const {name} = useParams()
  // console.log(name)
  // const data = [
  //     {
  //         id:1,
  //     }
  // ]

  useEffect(() => {
    window.scrollTo({
      top: '0',
      behavior: 'smooth'
    })
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
              <p className='about'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cum possimus architecto recusandae magni sunt sint ex enim laborum! Reiciendis reprehenderit iste, cum iusto voluptatem quam sapiente amet tempora perspiciatis, maxime, sunt laudantium dolorum dicta. Similique repellendus quaerat aspernatur molestiae quas voluptatum ipsa veniam voluptas ea temporibus nulla eius in a iusto cum assumenda, accusamus rerum porro fugiat, eos dolores quae laborum. Quas incidunt rem inventore sequi placeat magni qui, voluptates libero ad, explicabo doloribus neque, consectetur maxime unde enim optio delectus sed animi voluptatem velit autem similique amet eum saepe. Inventore repellat at labore ipsum aspernatur eum fugit dolorum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod sapiente optio vero doloribus velit eligendi ipsa nihil quo, nobis id iste laborum ipsam temporibus, illo blanditiis ad saepe eaque, consequatur </p>
            </div>
          </div>
          <div className="founder-detail">
            <div className="img">
              <img src={founder1} alt="" />
            </div>
            <div className="founder-info">
              <h3>Kausal Sir</h3>
              <p>Co-Founder</p>
              <p className='about'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cum possimus architecto recusandae magni sunt sint ex enim laborum! Reiciendis reprehenderit iste, cum iusto voluptatem quam sapiente amet tempora perspiciatis, maxime, sunt laudantium dolorum dicta. Similique repellendus quaerat aspernatur molestiae quas voluptatum ipsa veniam voluptas ea temporibus nulla eius in a iusto cum assumenda, accusamus rerum porro fugiat, eos dolores quae laborum. Quas incidunt rem inventore sequi placeat magni qui, voluptates libero ad, explicabo doloribus neque, consectetur maxime unde enim optio delectus sed animi voluptatem velit autem similique amet eum saepe. Inventore repellat at labore ipsum aspernatur eum fugit dolorum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod sapiente optio vero doloribus velit eligendi ipsa nihil quo, nobis id iste laborum ipsam temporibus, illo blanditiis ad saepe eaque, consequatur </p>
            </div>
          </div>
          <div className="founder-detail">
            <div className="img">
              <img src={founder1} alt="" />
            </div>
            <div className="founder-info">
              <h3>Kausal Sir</h3>
              <p>Co-Founder</p>
              <p className='about'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cum possimus architecto recusandae magni sunt sint ex enim laborum! Reiciendis reprehenderit iste, cum iusto voluptatem quam sapiente amet tempora perspiciatis, maxime, sunt laudantium dolorum dicta. Similique repellendus quaerat aspernatur molestiae quas voluptatum ipsa veniam voluptas ea temporibus nulla eius in a iusto cum assumenda, accusamus rerum porro fugiat, eos dolores quae laborum. Quas incidunt rem inventore sequi placeat magni qui, voluptates libero ad, explicabo doloribus neque, consectetur maxime unde enim optio delectus sed animi voluptatem velit autem similique amet eum saepe. Inventore repellat at labore ipsum aspernatur eum fugit dolorum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod sapiente optio vero doloribus velit eligendi ipsa nihil quo, nobis id iste laborum ipsam temporibus, illo blanditiis ad saepe eaque, consequatur </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FounderPage
