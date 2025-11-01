
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

export const disclaimerContent = (siteName: string) => (
  <>
    <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
    
    <p className="text-lg text-gray-600 dark:text-gray-400">
      The information provided by {siteName} ("we," "us," or "our") on this website is for general informational and entertainment purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
    </p>

    <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-500 rounded-r-lg flex gap-4">
      <InfoCircleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-bold text-orange-800 dark:text-orange-300">Key Points</h3>
        <ul className="list-disc list-inside mt-2 text-orange-700 dark:text-orange-300/90 text-sm">
            <li>The content is for personal, non-commercial use only.</li>
            <li>We are not liable for any outcomes resulting from the use of our content.</li>
            <li>The content is provided "as is" without any guarantees.</li>
            <li>External links are not endorsed by us and we are not responsible for their content.</li>
        </ul>
      </div>
    </div>

    <PolicySection title="1. No Professional Advice">
      <p>
        The content provided on {siteName} is not intended to be a substitute for professional advice. The bios, quotes, captions, and other text are created for entertainment and personal expression. They should not be construed as professional, legal, financial, or psychological advice. You should not act or refrain from acting on the basis of any content included in the site without seeking the appropriate professional advice on the particular facts and circumstances at issue.
      </p>
    </PolicySection>

    <PolicySection title="2. Content Accuracy">
        <p>
            While we strive to provide accurate and up-to-date information, we make no warranties or representations about the accuracy, completeness, or suitability of the content. Fun facts and other informational content may contain errors or become outdated. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the site.
        </p>
    </PolicySection>
    
    <PolicySection title="3. User Responsibility">
        <p>
            You are solely responsible for how you use the content from {siteName}. It is your responsibility to ensure that your use of any content does not infringe on any third-party rights, such as copyrights or trademarks, and that it complies with the terms of service of the platforms where you post it (e.g., Instagram, Facebook, etc.).
        </p>
    </PolicySection>

    <PolicySection title="4. External Links Disclaimer">
        <p>
            The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with {siteName}. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. We do not endorse the views expressed on external sites and are not responsible for their content or privacy practices.
        </p>
    </PolicySection>

    <PolicySection title="5. Limitation of Liability">
        <p>
            Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
        </p>
    </PolicySection>
    
    <PolicySection title="6. Contact Us">
      <p>If you have any questions about this Disclaimer, you can contact us at: <a href="mailto:legal@biozilla.app" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">legal@biozilla.app</a></p>
    </PolicySection>
    
    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm">
      <p className="text-gray-600 dark:text-gray-400">
        For more information, please visit our{' '}
        <a 
          href="#/support/privacy-policy" 
          onClick={(e) => { e.preventDefault(); window.location.hash = '#/support/privacy-policy'; }} 
          className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          Privacy Policy
        </a>
        {' and '}
        <a 
          href="#/support/terms-of-service" 
          onClick={(e) => { e.preventDefault(); window.location.hash = '#/support/terms-of-service'; }} 
          className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          Terms of Service
        </a>.
      </p>
    </div>
  </>
);
