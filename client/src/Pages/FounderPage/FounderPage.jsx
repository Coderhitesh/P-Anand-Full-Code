import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './founderPage.css'
import founder1 from './kausal-foundar.webp'
import founder2 from './Prasannjeet.jpg'
import founder3 from './vikash.jpg'
import founder4 from './rocky.jpg'
import founder5 from './neeraj.jpg'
import founder6 from './Kashish.jpg'
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
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-teacher')
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
              <img src={founder2} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet Your Mentor and Co-Founder: CA Prasannjeet Kumar</h3>
              {/* <p>Co-Founder</p> */}
              <p className='about'>CA Prasannjeet Kumar is an accomplished Chartered Accountant and passionate mentor, committed to redefining commerce and professional education through innovation and integrity. As the Co-founder of P Anand Academy, he brings a wealth of academic expertise
                and practical knowledge that helps students not only understand subjects deeply but also apply them effectively in real-world scenarios. Known for his engaging teaching style and meticulous attention to detail, CA Prasannjeet Kumar has mentored countless students
                towards academic success and professional excellence. He plays a pivotal role in curriculum development, academic planning, and ensuring that every learner at P Anand Academy receives the guidance and resources needed to thrive. His commitment to excellence and
                student growth is at the heart of P Anand Academy’s success.
              </p>
            </div>
          </div>
          <div className="founder-detail">
            <div className="img">
              <img src={founder3} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet Your Mentor and Co-Founder: CA Vikas Paswan              </h3>
              <p>Co-Founder</p>
              <p className='about'>CA Vikas Paswan is a dynamic Chartered Accountant and visionary educator who co-founded P Anand Academy with the mission to empower students through quality education and expert mentorship. With a strong foundation in finance and a passion for teaching, he
                brings real-world insights and academic excellence to the classroom. His unique teaching approach blends conceptual clarity with practical application, making complex topics easily understandable for students. At P Anand Academy, CA Vikas Paswan plays a key role in
                designing comprehensive courses, guiding students in their professional journey, and nurturing future Chartered Accountants and finance professionals. Driven by dedication and a student-first philosophy, he continues to inspire and shape the next generation of
                achievers.

              </p>
            </div>
          </div>
          <div className="founder-detail">
            <div className="img">
              <img src={founder4} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet Your Mentor and Faculty:  CA Rockey Sir
              </h3>
              <p>Faculty</p>
              <p className='about'>CA Ravinder is a highly knowledgeable and result-oriented Economics faculty member at P Anand Academy. With a deep understanding of both theoretical and practical aspects of Economics, he brings clarity and relevance to every concept he teaches. His ability to
                simplify complex economic ideas and relate them to real-life scenarios makes learning engaging and effective for students. CA Ravinder emphasizes conceptual understanding, analytical thinking, and exam-oriented preparation, helping students perform exceptionally well
                in their academic and professional exams. His commitment to excellence and approachable teaching style make him a valued mentor in the field of Economics education.</p>
            </div>
          </div>
          <div className="founder-detail">
            <div className="img">
              <img src={founder5} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet Your Mentor and Faculty: Prof. Neeraj Sir              </h3>
              <p>Co-Founder</p>
              <p className='about'>Neeraj Sir is a dedicated and experienced Mathematics teacher at P Anand Academy, known for his clear explanations and student-friendly teaching methods. With a strong command over concepts and a passion for numbers, he makes even the most complex topics easy
                to understand. His approach focuses on building strong fundamentals, encouraging logical thinking, and boosting problem-solving skills. Neeraj Sir’s patient guidance and motivating attitude have helped numerous students overcome their fear of Math and achieve
                academic excellence. He believes in making learning interactive and enjoyable, turning Mathematics into a subject students look forward to mastering.</p>
            </div>
          </div>
          {/* <div className="founder-detail">
            <div className="img">
              <img src={founder3} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet Your Mentor and Faculty:  Prof. Desh Deepak Sir
              </h3>
              <p>Faculty</p>
              <p className='about'>Desh Deepak Sir is not just a Mathematics teacher – he’s a mentor on a mission to make numbers meaningful. A distinguished faculty member at P Anand Academy, he brings sharp analytical skills and deep subject expertise shaped by his UPSC preparation journey. His
                academic rigor and conceptual clarity help students build strong mathematical foundations for Classes 11th, 12th, and CUET. With a unique teaching style that blends logic, strategy, and real-world application, Desh Deepak Sir transforms Math from a subject of fear to a
                field of fascination. Whether it's mastering calculus, cracking coordinate geometry, or acing CUET quantitative aptitude – his students don’t just learn Math, they fall in love with it.
              </p>
            </div>
          </div> */}
          {/* <div className="founder-detail">
            <div className="img">
              <img src={founder3} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet our Strategic Manager:  CA Barkha Ma'am             </h3>
              <p>Strategic Manager</p>
              <p className='about'>CA Barkha Chaturvedi is a dynamic Chartered Accountant known for her dedication, precision, and unwavering drive. With expertise in taxation, audit, and financial advisory, she empowers businesses to grow with clarity and compliance. Passionate about learning and
                leadership, she believes that perseverance and a positive mindset can turn any obstacle into a stepping stone. Her journey inspires aspiring professionals to pursue excellence with confidence and integrity.</p>
            </div>
          </div> */}
          <div className="founder-detail">
            <div className="img">
              <img src={founder6} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet Your Mentor and Business Developer:  Kashish Ma'am
              </h3>
              <p>Business Developer</p>
              <p className='about'>Kashish, a dynamic and student-focused Business Developer at P. Anand Academy, is also pursuing Chartered Accountancy, showcasing her dedication and multi-talented nature. She brings a unique student perspective to her role, understanding the challenges and
                aspirations of learners. Passionate and hardworking, Kashish actively engages with students to ensure their needs are met while driving initiatives that make quality education more accessible and effective. Her ability to balance her own academic journey with strategic
                development work makes her a relatable mentor and a key force behind the academy’s growing connection with its student community.</p>
            </div>
          </div>
          {/* <div className="founder-detail">
            <div className="img">
              <img src={founder3} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet our Strategic Manager:  CA Barkha Ma'am             </h3>
              <p>Strategic Manager</p>
              <p className='about'>CA Barkha Chaturvedi is a dynamic Chartered Accountant known for her dedication, precision, and unwavering drive. With expertise in taxation, audit, and financial advisory, she empowers businesses to grow with clarity and compliance. Passionate about learning and
                leadership, she believes that perseverance and a positive mindset can turn any obstacle into a stepping stone. Her journey inspires aspiring professionals to pursue excellence with confidence and integrity.</p>
            </div>
          </div> */}


        </div>

        {/* <div className="team-box">
          <div className="team-heading">
            <h2>Our Team</h2>
          </div>
          <div className="team-row">
            {
              teacher && teacher.slice(0, 4).map((item, index) => (
                <div key={index} className="team-box-items forremovemargin">
                  <div className="team-image">
                    <div style={{ height: '280px' }} className="thumb">
                      <img src={item.teacherImage.url} alt="img" />
                    </div>
                  </div>
                  <div className="team-content text-center">
                    <h6 style={{ marginBottom: '0%' }}><a>{item.teacherName}</a></h6>
                  </div>
                </div>
              ))
            }
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default FounderPage
