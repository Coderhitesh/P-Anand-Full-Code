import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AddFaq = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('https://www.api.panandacademy.com/api/v1/create-faq', formData);
      toast.success('FAQ Added Successfully!');
      setIsLoading(false);
      navigate('/all-faq');
    } catch (error) {
      console.error('Error:', error.message);
      toast.error(error.response?.data?.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>Add FAQ</h4>
        </div>
        <div className="links">
          <Link to="/all-faq" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="question" className="form-label">Question</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="form-control"
              id="question"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="col-md-6">
            <label htmlFor="answer" className="form-label">Answer</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              className="form-control"
              id="answer"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? 'not-allowed' : 'allowed'}`}
            >
              {isLoading ? 'Please Wait...' : 'Add FAQ'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddFaq;
