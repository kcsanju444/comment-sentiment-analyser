import React from 'react';
import terms from '../assets/terms.jpg'; // Ensure the image path is correct

const Terms = () => {
  return (
    <div
      style={{
       
      }}
    >
      <div className="bg-[rgb(202,0,42)] h-[10rem] w-full">
        <h1 className="ml-[18rem] font-bold text-[2rem] text-white">Terms & Condition</h1>
      </div>
      <div className="flex">
        <div className="w-[70%] bg-white p-[35px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.09)] transition-all duration-300 -mt-[70px] mr-[40px] mb-[40px] ml-[2rem]">
          <span>Last Updated: January 2025</span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">1. Acceptance of Terms</span>
          <br />
          <span className="mt-[4rem]">
            By accessing or using the services provided by YouTube Comment Analyzer, you agree to be bound by these
            terms and conditions, our privacy policy, and any other guidelines, policies, or rules that apply to specific
            features or services we offer. If you do not agree to these terms, you should not use our services.
          </span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">2. Use of Our Service</span>
          <br />
          <span>
            YouTube Comment Analyzer is a platform that analyzes YouTube comments for sentiment, spam detection, and other
            metrics. You agree to use our platform only for lawful purposes and agree not to misuse the service in any way,
            including but not limited to:
          </span>
          <br />
          <span>- Uploading content that violates the rights of others, including intellectual property rights.</span>
          <br />
          <span>- Using the service for fraudulent or illegal activities.</span>
          <br />
          <span>- Interfering with the normal operation or performance of the service.</span>
          <br />
          <span>- Distributing malicious content or using the service to spread harmful software.</span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">3. Account Registration</span>
          <br />
          <span>
            To access certain features, you may need to create an account. You agree to provide accurate, current, and
            complete information during the registration process. You are responsible for maintaining the confidentiality of
            your account credentials and for all activities that occur under your account. You agree to notify us immediately
            if you suspect any unauthorized use of your account.
          </span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">4. Content Ownership</span>
          <br />
          <span>
            You retain ownership of any content you upload, including YouTube comments, but by uploading content to our
            service, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process your content as
            necessary to provide and improve our services. We do not sell or transfer your content to third parties without
            your explicit consent.
          </span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">5. Data Privacy</span>
          <br />
          <span>
            Your privacy is important to us. Our Privacy Policy governs how we collect, use, and protect your personal data.
            By using our service, you consent to the collection and use of your data as described in our privacy policy. We
            are committed to safeguarding your personal information and ensuring compliance with applicable privacy laws.
          </span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">6. Limitation of Liability</span>
          <br />
          <span>
            We strive to provide a reliable and effective service; however, we do not guarantee that our service will be
            error-free or uninterrupted. We are not liable for any damages arising from the use or inability to use our
            service, including but not limited to indirect, incidental, or consequential damages. This includes, but is not
            limited to, any loss of data or profits, or issues arising from inaccuracies in sentiment analysis or spam
            detection.
          </span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">7. Modifications to Terms</span>
          <br />
          <span>
            We reserve the right to update or modify these terms at any time. Any changes will be posted on this page with
            an updated revision date. Continued use of the service after such changes will constitute your acceptance of the
            modified terms. It is your responsibility to regularly review this page for any updates.
          </span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">8. Termination</span>
          <br />
          <span>
            We may suspend or terminate your access to the service if you violate these terms. Upon termination, you must
            immediately cease using the service, and all licenses granted to you will be revoked. You may terminate your
            account at any time by contacting us.
          </span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">9. Governing Law</span>
          <br />
          <span>
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which YouTube
            Comment Analyzer operates. Any legal disputes related to these terms shall be resolved in the appropriate courts
            within that jurisdiction.
          </span>
          <br />
          <br />
          <span className="font-bold text-[rgb(202,0,42)]">10. Contact Us</span>
          <br />
          <span>
            If you have any questions about these Terms of Service, please contact us at 
            <span className='underline'> smartfilter12@gmail.com.</span>
              We are
            happy to assist you with any inquiries or concerns you may have.
          </span>
         
        </div>
        <div>
            <img src={terms} alt="term" className="h-[25rem] mt-[8rem] w-[20rem] ml-[3rem]" />
          </div>x
      </div>
    </div>
  );
};

export default Terms;
