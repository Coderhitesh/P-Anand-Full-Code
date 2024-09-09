import React from 'react';
import { useEffect } from 'react';

function Privacy() {
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    },[])
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-12 col-md-10">
                    <div className="card shadow-sm">
                        <div className="card-body p-3">
                            <h2 className="text-center mb-4">Privacy Policy</h2>
                            <p>Your privacy is critically important to us.</p>

                            <p><strong>P Anand Academy</strong> is a division of P Anand Academy located at P Anand Academy Building, SS Tower, Main Market, Sector 4, Vaishali, Ghaziabad, Uttar Pradesh 201010</p>

                            <p>It is P Anand Academy’s policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <strong>www.panandacademy.com</strong> We respect your privacy and are committed to protecting the personally identifiable information you may provide us through the Website. We have adopted this privacy policy (“Privacy Policy”) to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.</p>

                            <p>This Privacy Policy, together with the Terms and Conditions posted on our Website, set forth the general rules and policies governing your use of our Website. Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.</p>

                            <h3 className="mt-4">Website Visitors</h3>
                            <p>Like most website operators, P Anand Academy collects non-personally identifying information such as browser type, language preference, referring site, and the date and time of each visitor request. P Anand Academy’s purpose in collecting non-personally identifying information is to better understand how visitors use its website.</p>

                            <h3 className="mt-4">Gathering of Personally-Identifying Information</h3>
                            <p>Certain visitors to P Anand Academy’s websites choose to interact in ways that require the collection of personally-identifying information. The amount and type of information gathered depends on the nature of the interaction.</p>

                            <h3 className="mt-4">Security</h3>
                            <p>The security of your Personal Information is important to us. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>

                            <h3 className="mt-4">Advertisements</h3>
                            <p>Ads appearing on our website may be delivered by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer to compile information about you or others who use your computer, helping deliver targeted advertisements.</p>

                            <h3 className="mt-4">Links to External Sites</h3>
                            <p>Our Service may contain links to external sites that are not operated by us. If you click on a third-party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy and Terms and Conditions of every site you visit.</p>

                            <h3 className="mt-4">Aggregated Statistics</h3>
                            <p>P Anand Academy may collect statistics about the behavior of visitors to its website. This information may be displayed publicly or provided to others, but it does not disclose personally-identifying information.</p>

                            <h3 className="mt-4">Cookies</h3>
                            <p>P Anand Academy uses cookies to help identify and track visitors, their usage of <strong>www.panandacademy.com</strong>, and their website access preferences. By continuing to navigate our website without changing your cookie settings, you acknowledge and agree to our use of cookies.</p>

                            <h3 className="mt-4">Privacy Policy Changes</h3>
                            <p>P Anand Academy may update its Privacy Policy from time to time at its sole discretion. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such changes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Privacy;
