import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const EditFaq = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        question: '',
        answer: ''
    });

    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchFaq = async () => {
        try {
            const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-single-faq/${id}`);
            const data = res.data.data;
            setFormData({
                question: data.question || '',
                answer: data.answer || ''
            });
        } catch (error) {
            console.error("Failed to fetch FAQ:", error);
            toast.error("Failed to fetch FAQ");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);

        try {
            await axios.put(`https://www.api.panandacademy.com/api/v1/update-faq/${id}`, formData);
            toast.success("FAQ Updated Successfully!");
            navigate('/all-faq');
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update FAQ");
        } finally {
            setBtnLoading(false);
        }
    };

    useEffect(() => {
        fetchFaq();
    }, [id]);

    return (
        <>
            <Toaster />
            <div className="bread">
                <div className="head">
                    <h4>Edit FAQ</h4>
                </div>
                <div className="links">
                    <Link to="/all-faq" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-12">
                            <label htmlFor="question" className="form-label">Question</label>
                            <textarea
                                name="question"
                                id="question"
                                value={formData.question}
                                onChange={handleChange}
                                className="form-control"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div className="col-md-12">
                            <label htmlFor="answer" className="form-label">Answer</label>
                            <textarea
                                name="answer"
                                id="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                className="form-control"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div className="col-12 text-center">
                            <button
                                type="submit"
                                className={`${btnLoading ? 'not-allowed' : 'allowed'}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? "Please Wait..." : "Update FAQ"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditFaq;
