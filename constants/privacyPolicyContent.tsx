
import React from 'react';
import { InfoCircleIcon } from '../components/icons/InfoCircleIcon';

const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">{title}</h2>
    <div className="space-y-4 text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none">
      {children}
    </div>
  </div>
);

export const privacyPolicyContent = (siteName: string) => (
  <>
    <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
    
    <p className="text-lg text-gray-600 dark:text-gray-400">
      {siteName} ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
    </p>

    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg flex gap-4">
      <InfoCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-bold text-blue-800 dark:text-blue-300">Privacy at a Glance</h3>
        <ul className="list-disc list-inside mt-2 text-blue-700 dark:text-blue-300/90 text-sm">
            <li>We do <strong>not</strong> require you to create an account or provide personal information like your name or email address to use our service.</li>
            <li>We collect anonymous, non-personal data (like browser type and usage statistics) to analyze and improve our service.</li>
            <li>We use your browser's `localStorage` to save your theme preference (dark/light mode). This data is stored only on your device.</li>
            <li>We do <strong>not</strong> sell, rent, or share your data with third parties for marketing purposes.</li>
        </ul>
      </div>
    </div>

    <PolicySection title="1. Information We Collect">
      <p>We collect information that does not personally identify you ("Non-Personal Information") to improve the functionality and user experience of our Service. This includes:</p>
      <ul>
        <li><strong>Log and Usage Data:</strong> Information that your browser automatically sends whenever you visit our Service. This data may include your computer's Internet Protocol (IP) address (anonymized where possible), browser type and version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data. This helps us understand usage patterns and identify potential issues.</li>
        <li><strong>Locally Stored Data (localStorage):</strong> We utilize your browser's `localStorage` to store your theme preference. This is a small piece of data stored on your computer by your web browser. It helps us remember your choice between light and dark mode on subsequent visits. This data remains on your device and is not transmitted to our servers.</li>
      </ul>
    </PolicySection>

    <PolicySection title="2. How We Use Your Information">
        <p>We use the collected Non-Personal Information for the following purposes:</p>
        <ul>
            <li><strong>To Provide and Maintain our Service:</strong> Ensuring the website functions correctly and efficiently.</li>
            <li><strong>To Improve Our Service:</strong> We analyze usage trends and user interactions to understand what features are popular and how we can enhance the user experience.</li>
            <li><strong>To Monitor and Secure Our Service:</strong> To detect, prevent, and address technical issues and protect against misuse.</li>
        </ul>
    </PolicySection>
    
    <PolicySection title="3. Cookies and Tracking Technologies">
        <p>We do not use traditional cookies for tracking users across sites. The only form of local storage we use is `localStorage`, which is strictly for functional purposes (remembering your theme preference) and not for tracking or advertising.</p>
    </PolicySection>

    <PolicySection title="4. Disclosure of Information">
        <p>We do not sell, trade, rent or otherwise share your data with third parties. We may only disclose aggregate, anonymized information for analytical purposes or if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</p>
    </PolicySection>

    <PolicySection title="5. Data Security">
        <p>We are committed to protecting the security of your information. We use a variety of security technologies and procedures to help protect your data from unauthorized access, use, or disclosure. However, please be aware that no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
    </PolicySection>

    <PolicySection title="6. Your Data Rights">
      <p>Since we do not collect Personal Information, your rights are primarily related to the data stored on your device. You can clear your browser's cache and storage at any time to remove your saved theme preference.</p>
    </PolicySection>

    <PolicySection title="7. Links to Other Websites">
      <p>Our Service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
    </PolicySection>

    <PolicySection title="8. Policy for Children">
        <p>Our Service is not directed to anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with any information, please contact us. If we become aware that we have collected information from children without verification of parental consent, we take steps to remove that information.</p>
    </PolicySection>
    
    <PolicySection title="9. Changes to This Privacy Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.</p>
    </PolicySection>

    <PolicySection title="10. Contact Us">
      <p>If you have any questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:privacy@biozilla.app" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">privacy@biozilla.app</a></p>
    </PolicySection>
  </>
);
