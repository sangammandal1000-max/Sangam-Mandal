
import React from 'react';
import { InfoCircleIcon } from '../components/icons/InfoCircleIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';

const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">{title}</h2>
    <div className="space-y-4 text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none">
      {children}
    </div>
  </div>
);

export const termsOfServiceContent = (siteName: string) => (
  <>
    <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>

    <p className="text-lg text-gray-600 dark:text-gray-400">
      Welcome to {siteName}! These Terms of Service ("Terms") govern your access to and use of the {siteName} website and its content (collectively, the "Service"). Please read these Terms carefully before using the Service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
    </p>

    <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg flex gap-4">
      <InfoCircleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-bold text-yellow-800 dark:text-yellow-300">Terms Summary</h3>
        <ul className="list-disc list-inside mt-2 text-yellow-700 dark:text-yellow-300/90 text-sm">
            <li>Our content is provided for your personal, non-commercial use only.</li>
            <li>You may not use bots, scrapers, or other automated means to copy our entire database.</li>
            <li>We own the {siteName} brand, design, and the compilation of content. You own no rights to it.</li>
            <li>The service is provided on an "as is" basis without any warranties.</li>
            <li>We reserve the right to modify these terms and suspend access at any time.</li>
        </ul>
      </div>
    </div>

    <PolicySection title="1. Your Acceptance">
      <p>
        By accessing or using the Service, you signify that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, then you do not have permission to access the Service.
      </p>
    </PolicySection>

    <PolicySection title="2. Permitted Use of Our Service">
        <p>{siteName} grants you a limited, non-exclusive, non-transferable, revocable license to use the content on our site for personal, non-commercial purposes. This license is subject to the following restrictions:</p>
        <div className="space-y-3 mt-4 not-prose">
            <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300"><strong>You Are Permitted To:</strong> Copy and paste our bios, quotes, and captions for use on your personal social media profiles, posts, and messages.</span>
            </div>
             <div className="flex items-start gap-3">
                <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300"><strong>You Are Prohibited From:</strong> Using any automated system, such as "robots," "spiders," or "scrapers," to access the Service for any purpose, especially for systematically copying content to create a competing service or database.</span>
            </div>
            <div className="flex items-start gap-3">
                <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300"><strong>You Are Prohibited From:</strong> Selling, licensing, renting, or in any way commercially exploiting the content provided by the Service.</span>
            </div>
             <div className="flex items-start gap-3">
                <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300"><strong>You Are Prohibited From:</strong> Using the Service for any illegal or unauthorized purpose, or in a manner that is harassing, defamatory, or otherwise objectionable.</span>
            </div>
        </div>
    </PolicySection>

    <PolicySection title="3. Intellectual Property Rights">
      <p>
        The Service and all materials therein, including, without limitation, the software, design, text, graphics, logos, and the unique compilation and arrangement of content (the "{siteName} Content"), are the exclusive property of {siteName} and its licensors and are protected by copyright, trademark, and other intellectual property laws. Except as explicitly provided herein, nothing in the Terms shall be deemed to create a license in or under any such Intellectual Property Rights.
      </p>
    </PolicySection>

    <PolicySection title="4. Termination">
      <p>
        We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
      </p>
    </PolicySection>

    <PolicySection title="5. Disclaimer of Warranties and Limitation of Liability">
      <p>
        The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Your use of the Service is at your sole risk. The Service is provided without warranties of any kind, whether express or implied, including, but not to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
      </p>
      <p>
        In no event shall {siteName}, nor its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
      </p>
    </PolicySection>

    <PolicySection title="6. Governing Law">
      <p>
        These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
      </p>
    </PolicySection>
    
    <PolicySection title="7. Changes to These Terms">
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of significant changes by updating the "Effective Date" at the top of these Terms. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
    </PolicySection>

    <PolicySection title="8. Contact Us">
      <p>
        If you have any questions about these Terms, please contact us at: <a href="mailto:legal@biozilla.app" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">legal@biozilla.app</a>
      </p>
    </PolicySection>
  </>
);
