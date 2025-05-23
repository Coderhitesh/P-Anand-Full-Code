import React, { useEffect } from 'react'
import './Login.css'
import bg from './bg.jpg'
import { useState } from 'react'
import axios from 'axios'
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import Loading from '../Loading/Loading'

const ForgetPassword = () => {
    const navigator = useNavigate()
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);
    const [loading, setLoading] = useState(false);
    const [getOtp, setgetOtp] = useState(false);

    const [formData, setFormData] = useState({
        Email: "",
        NewPassword: "",
        PasswordChangeOtp: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault()
        try {
            const response = await axios.post("https://www.api.panandacademy.com/api/v1/Password-Change", formData)
            console.log(response.data);
            setLoading(false);
            toast.success(response.data.msg)
            setgetOtp(true);
        }
        catch (err) {
            console.log(err);
            console.log(err.response?.data.msg);
            toast.error(err.response?.data?.msg?? "Internal Server error")
            setLoading(false)

        }
    }

    const handleOTPSubmit = async (otpevent) => {
        setLoading(true)
        otpevent.preventDefault()
        try {
            const response = await axios.post(`https://www.api.panandacademy.com/api/v1/Verify-Otp`, formData)
            console.log(response.data);
            setLoading(false);
            toast.success(response.data.msg)
            
            // window.location.href="/login"
            navigator('/login')

        } catch (error) {
            console.log(error)
            console.log(error.response.data.msg);
            toast.error(error.response.data.msg)

            setLoading(false)
        }
    }
    const resendOTP = async (otpevent) => {
        setLoading(true)
        otpevent.preventDefault()
        try {
            const response = await axios.post(`https://www.api.panandacademy.com/api/v1/resend-otp/`, formData)
            console.log(response.data);
            setLoading(false);

        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response.data.msg)

        }
    }

    return (
        <>
            {/* <ToastContainer /> */}
            <Toaster />
            {loading ? (
                <Loading />
            ) : (<section className='login-account'>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 forbgcolor mx-auto p-0">
                            <div className="form">
                                <h3>Forget Password </h3>
                                <form >
                                    <input required type="email" name="Email" onChange={handleChange} value={formData.Email} placeholder='Email Id' />
                                    <input required type="password" name="NewPassword" value={formData.NewPassword} onChange={handleChange} placeholder='New Password' />

                                    {getOtp ? (
                                        <>
                                            <input required type="text" name="PasswordChangeOtp" value={formData.PasswordChangeOtp} onChange={handleChange} placeholder='Enter OTP' />
                                            <p className="text-warning h6">OTP is only valid for 5 minutes.</p>
                                        
                                            <div className="flex">
                                                <div className="keep">
                                                    <Link onClick={resendOTP}><i class="fa-solid fa-arrow-rotate-left"></i> Resend OTP</Link>
                                                </div>
                                                <div className="member">

                                                </div>
                                            </div>
                                        </>
                                    ) : ""}
                                    {
                                        getOtp ? (
                                            <input onClick={handleOTPSubmit} type="submit" value="Submit Otp " />
                                        ) : (
                                            <input onClick={handleSubmit} type="submit" value="GET OTP " />
                                        )
                                    }

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>)}
        </>
    )
}

export default ForgetPassword