import React, { useState, useEffect } from 'react';
import Loading from '../../Components/Loading/Loading';

function Term() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Simulate loading time (2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  
  return (
    <>
      {
        loading ? (
          <Loading />
        ) : (

    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-12">
          <div className="card shadow-sm">
            <div className="card-body p-3">
              <h2 className="text-center mb-4">Terms & Conditions</h2>

              <h3 className="mb-3">1. Acceptance of Terms</h3>
              <p>By accessing and using the services provided by P Anand Academy (<strong>panandacademy.com</strong>), you agree to comply with and be bound by these terms and conditions. If you do not agree with any part of these terms, you may not use the Website.</p>

              <h3 className="mt-4 mb-3">2. User Accounts</h3>
              <p><strong>2.1.</strong> To access certain features of the Website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information, including your username and password.</p>
              <p><strong>2.2.</strong> You must notify us immediately of any unauthorized use of your account or any other security breach. We will not be liable for any loss or damage arising from your failure to comply with this security obligation.</p>

              <h3 className="mt-4 mb-3">3. Intellectual Property</h3>
              <p><strong>3.1.</strong> All content on the Website, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of P Anand Academy or its content suppliers and is protected by copyright and other intellectual property laws.</p>
              <p><strong>3.2.</strong> You may not reproduce, distribute, modify, transmit, reuse, or use any content on the Website for commercial purposes without the express written consent of P Anand Academy.</p>

              <h3 className="mt-4 mb-3">4. Courses and Products</h3>
              <p><strong>4.1.</strong> The Website offers educational courses and products for purchase. Prices, descriptions, and availability are subject to change without notice.</p>
              <p><strong>4.2.</strong> Payment for courses and products is due at the time of purchase. Refunds may be issued in accordance with our refund policy, as stated on the Website.</p>

              <h3 className="mt-4 mb-3">5. Changes to Terms</h3>
              <p>P Anand Academy reserves the right to modify or revise these terms and conditions at any time. Your continued use of the Website following the posting of changes constitutes your acceptance of such changes.</p>

              <p className="mt-4">By using the Website, you acknowledge that you have read, understood, and agreed to these terms and conditions. If you have any questions or concerns, please contact us at <strong>panandacademy@gmail.com</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
        )
      }
    </>
  );
}

export default Term;
