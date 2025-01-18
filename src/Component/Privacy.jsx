import React from 'react';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 ml-[25rem] text-[rgb(202,0,42)]">Privacy Policy</h1>
      <p className="text-lg mb-6">
        Last Updated: January 2025
      </p>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to YouTube Comment Analyzer. We value your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and protect your information when you use our service.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <p>
          We collect information that you provide to us directly, such as:
        </p>
        <ul className="list-disc pl-6">
          <li>Your email address when you sign up for an account.</li>
          <li>Your YouTube comments and other content you submit via the platform.</li>
        </ul>
        <p>
          We may also automatically collect information such as:
        </p>
        <ul className="list-disc pl-6">
          <li>Your IP address and device information for analytics and troubleshooting.</li>
          <li>Usage data to improve our service, including what features you use and how you interact with the site.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6">
          <li>Provide and improve our services.</li>
          <li>Communicate with you regarding your account or inquiries.</li>
          <li>Enhance the user experience by analyzing your usage patterns.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. However, we may share your information with trusted third parties in the following circumstances:
        </p>
        <ul className="list-disc pl-6">
          <li>To comply with legal obligations, such as responding to a subpoena or court order.</li>
          <li>If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
        <p>
          We retain your personal data for as long as necessary to fulfill the purposes outlined in this privacy policy. If you wish to delete your account, you may contact us, and we will delete your personal data in accordance with applicable laws.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information, including using encryption and secure servers. However, no method of data transmission over the internet is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
        <p>
          Depending on your location, you may have the right to:
        </p>
        <ul className="list-disc pl-6">
          <li>Access the personal information we hold about you.</li>
          <li>Request the correction or deletion of your personal data.</li>
          <li>Withdraw your consent to the processing of your data (where applicable).</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us using the information provided below.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
        <p>
          Our service may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies before submitting any personal data to these sites.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">9. Changes to This Privacy Policy</h2>
        <p>
          We may update this privacy policy from time to time. Any changes will be posted on this page with the updated date. We encourage you to review this privacy policy periodically to stay informed about how we are protecting your information.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our practices, please contact us at [your email address].
        </p>
      </section>
    </div>
  );
}

export default Privacy;
