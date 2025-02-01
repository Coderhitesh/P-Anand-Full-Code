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
              <p className='about'>CA Prasannjeet Kumar’s journey to success is nothing short of inspiring. Becoming a Chartered Accountant at a remarkably young age, he continued to blaze a trail of academic excellence, earning his B.Com from the prestigious Delhi University and recently qualifying as an LLB. A school topper himself, his passion for learning and teaching has defined his career from the start.
                With an innate gift for teaching, CA Prasannjeet began shaping young minds early on and has since mentored over 2,500 students. Under his dynamic guidance, countless students in the 11th and 12th commerce streams have not only claimed school topper titles but also secured seats in some of the country’s most prestigious universities. His influence extends far beyond the classroom, helping students achieve their academic dreams.
                Driven by a vision to elevate the standard of commerce education, CA Prasannjeet founded P Anand Academy. Through his leadership, the academy has produced numerous toppers, setting a new benchmark for excellence. Today, students under his mentorship are securing the highest scores in CA-Foundation and CA-Intermediate across Delhi NCR, a testament to his unwavering dedication.
                A master of his craft, CA Prasannjeet commands an exceptional understanding of Accountancy, Economics, and Business Studies. His expertise shines through in his teaching of Accountancy (Paper-1) and Business Economics (Paper-4) at the CA-Foundation level, as well as Advanced Accounting in CA-Intermediate. With his unique ability to break down complex concepts and instill confidence in his students, CA Prasannjeet is more than a teacher—he is a mentor, a guide, and a beacon of success for aspiring chartered accountants.
                Under his mentorship, the future is bright for every student who dares to dream big.
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
              <p className='about'>CA Vikas Paswan’s path to success is a story of dedication and early achievement. Becoming a Chartered Accountant at a young age, he earned his B.Com from the prestigious Delhi University, where his journey as a school topper set the tone for his future accomplishments. Teaching came naturally to him, and over the years, he has shaped the futures of more than 1,500 students.
                Under CA Vikas’s guidance, students from the 11th and 12th commerce streams have consistently achieved school topper status and secured admission to some of the most renowned universities. He co-founded P Anand Academy, where his expertise has contributed to producing some of Delhi NCR’s highest scorers in CA-Foundation and CA-Intermediate.
                An expert in the fields of Accounts, Economics, and Business Law, CA Vikas is known for his hands-on approach to teaching. His experience extends beyond the classroom, and he ensures his students gain a real-world understanding of their subjects. He teaches Business Law (Paper-2) in CA-Foundation and Business Law, Audit, and Assurance at the CA-Intermediate level.
                In addition to his teaching, CA Vikas runs a Chartered Accountancy firm—VPP & Associates—in collaboration with CA Prasannjeet Kumar. Through this firm, they provide professional services to a wide array of clients, including businesses, companies, partnerships, and proprietorships.
                CA Vikas seamlessly aligns his practical industry experience with his teaching, giving his students not only academic knowledge but a deeper insight into the professional world. His unique ability to bridge theory and practice makes him a mentor who prepares his students for both exams and the real-world challenges that lie ahead.

              </p>
            </div>
          </div>
          <div className="founder-detail">
            <div className="img">
              <img src={founder3} alt="" />
            </div>
            <div className="founder-info">
              <h3>Meet Your Co-Founder: Kaushal Kumar
              </h3>
              <p>Co-Founder</p>
              <p className='about'>Kaushal Kumar brings unmatched expertise in creating a vibrant and motivating classroom environment at P Anand Academy. With a keen understanding of student dynamics, he excels at fostering a positive, friendly, and success-driven atmosphere that keeps students engaged and striving for excellence.
                Kaushal’s mentorship goes beyond academics. He believes in creating memorable experiences, and under his guidance, P Anand Academy hosts exciting events each year, including fresher’s parties, get-togethers, farewells, and felicitation ceremonies. These gatherings help students bond, celebrate their achievements, and feel part of a supportive community.
                With Kaushal at the helm, the academy isn't just a place to study—it's where students thrive and build lasting connections. Join P Anand Academy and become part of an environment that not only shapes your academic success but also helps you grow personally, making learning an enjoyable and enriching journey!</p>
            </div>
          </div>
        </div>

        <div className="team-box">
          <div className="team-heading">
            <h2>Our Team</h2>
          </div>
          <div className="team-row">
            {
              teacher && teacher.slice(0,4).map((item, index) => (
                <div key={index} className="team-box-items forremovemargin">
                  <div className="team-image">
                    <div style={{height:'280px'}} className="thumb">
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
