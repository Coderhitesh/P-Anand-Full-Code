import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Faq = () => {
  // Mock data for demonstration purposes
  // In your actual implementation, you would replace this with your API call
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  },[])

  // Custom CSS for the component
  const customStyles = `
    .hitesh-faq-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3rem 1rem;
    }
    
    .hitesh-faq-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .hitesh-faq-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .hitesh-faq-subtitle {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }
    
    .hitesh-faq-item {
      margin-bottom: 1rem;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .hitesh-faq-item:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    .hitesh-faq-question {
      width: 100%;
      text-align: left;
      padding: 1.25rem 1.5rem;
      background: linear-gradient(to right, #f0f4ff, #eef1fd);
      border: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    
    .hitesh-faq-question:hover {
      background: linear-gradient(to right, #e6eeff, #e8ecfd);
    }
    
    .hitesh-faq-question:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }
    
    .hitesh-faq-question-text {
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
      margin: 0;
    }
    
    .hitesh-faq-icon {
      transition: transform 0.3s ease;
    }
    
    .hitesh-faq-icon-rotated {
      transform: rotate(180deg);
    }
    
    .hitesh-faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
    }
    
    .hitesh-faq-answer-expanded {
      max-height: 300px;
      padding: 1.25rem 1.5rem;
    }
    
    .hitesh-faq-answer-text {
      color: #555;
      line-height: 1.6;
      margin: 0;
    }
    
    .hitesh-loading {
      text-align: center;
      padding: 2rem;
    }
    
    .hitesh-loading-box {
      background-color: #e6f0ff;
      border-radius: 8px;
      padding: 1.5rem;
      display: inline-block;
    }
  `;

  // Simulate API call with mock data
  useEffect(() => {
    // This simulates your API call
    const mockApiCall = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "All faq found",
            data: [
              {
                "_id": "682db2fd326d48add7847f54",
                "question": "1. What makes P Anand Academy different from other coaching institutes?",
                "answer": "We prioritize conceptual clarity, personalized attention, and consistent academic growth. With small batch sizes, expert educators, and a nurturing environment, we ensure each student learns with confidence.",
                "__v": 0
              },
              {
                "_id": "682db313326d48add7847f58",
                "question": "2. How do you support students who are weak in studies?",
                "answer": "We identify learning gaps early and offer remedial classes, doubt-clearing sessions, and individual mentoring to make sure no student is left behind.",
                "__v": 0
              },
              {
                "_id": "682db31f326d48add7847f5c",
                "question": "3. What is the teacher-to-student ratio in your classes?",
                "answer": "Our small batch sizes ensure a favourable teacher-student ratio, allowing for personal attention and effective learning.",
                "__v": 0
              }
            ]
          });
        }, 1000); // Simulate network delay
      });
    };

    const fetchData = async () => {
      try {
        // In your actual code, replace this with your axios call:
        const {data} = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-faq');
        // const response = await mockApiCall();
        setFaqs(data.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Internal server error", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      {/* Include custom CSS */}
      <style>{customStyles}</style>
      
      <div className="hitesh-faq-container">
        <div className="hitesh-faq-header">
          <h2 className="hitesh-faq-title">Frequently Asked Questions</h2>
          <p className="hitesh-faq-subtitle">
            Find answers to common questions about P Anand Academy
          </p>
        </div>
        
        {isLoading ? (
          <div className="hitesh-loading">
            <div className="hitesh-loading-box">
              <div className="d-flex align-items-center">
                <div className="spinner-border text-primary me-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div>
                  <h3 className="h5 mb-1">Loading FAQs</h3>
                  <p className="mb-0">Please wait while we fetch the frequently asked questions.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hitesh-faq-list">
            {faqs.map((faq) => (
              <div key={faq._id} className="hitesh-faq-item">
                <button
                  className="hitesh-faq-question"
                  onClick={() => toggleFaq(faq._id)}
                >
                  <h3 className="hitesh-faq-question-text">{faq.question}</h3>
                  <span className={`hitesh-faq-icon ${expandedId === faq._id ? 'hitesh-faq-icon-rotated' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </span>
                </button>
                
                <div className={`hitesh-faq-answer ${expandedId === faq._id ? 'hitesh-faq-answer-expanded' : ''}`}>
                  <p className="hitesh-faq-answer-text">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Faq;