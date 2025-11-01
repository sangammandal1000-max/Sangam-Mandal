
import React from 'react';
import { FAQItem } from '../components/FAQItem';

export const helpCenterContent = (siteName: string) => (
  <>
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
      Welcome to the {siteName} FAQ (Frequently Asked Questions). We've compiled answers to common questions to help you get the most out of our platform. If you can't find your answer here, please feel free to contact us.
    </p>

    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Getting Started</h2>
    <div className="space-y-2">
      <FAQItem question={`What is ${siteName} and how do I use it?`}>
        <p>
          {siteName} is a comprehensive library of high-quality content designed for your social media needs. Our goal is to provide you with the perfect words for any occasion, right at your fingertips.
        </p>
        <p className="mt-2">
          <strong>Using {siteName} is simple:</strong>
        </p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li><strong>Browse:</strong> Explore our diverse content categories directly from the homepage.</li>
          <li><strong>Filter:</strong> Use the 'Trending', 'Recent', and 'Popular' filters to discover content based on what's new or popular.</li>
          <li><strong>Copy:</strong> When you find a piece of content you like, click the "Copy" button. The text is instantly saved to your clipboard.</li>
          <li><strong>Paste:</strong> Paste the copied text into your Instagram bio, a social media post, a message, or anywhere else you'd like.</li>
        </ol>
      </FAQItem>
      <FAQItem question={`Is ${siteName} free to use?`}>
        <p>
          Yes, the vast majority of our content is completely free for personal use. We also offer a <strong>Premium Collection</strong> which contains exclusive, professionally crafted content and unique features for subscribers. You can identify premium categories by the crown icon and the "Upgrade" button.
        </p>
      </FAQItem>
    </div>

    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Features & Functionality</h2>
    <div className="space-y-2">
      <FAQItem question="How does the Search feature work?">
        <p>
          Our powerful search feature allows you to find specific content quickly. Here's how to use it:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Click the search icon in the header to open the search modal.</li>
            <li>Type keywords related to the content you're looking for (e.g., "motivation," "friendship," "travel").</li>
            <li>You can also filter your search by category to narrow down the results.</li>
            <li>The search will look for matches within the content text and its associated tags.</li>
        </ul>
      </FAQItem>
       <FAQItem question="How do I switch between Light and Dark Mode?">
        <p>
          You can toggle between light and dark themes at any time by clicking the sun/moon icon in the top-right corner of the header. The website will remember your choice for your next visit.
        </p>
      </FAQItem>
      <FAQItem question="What do the 'Trending', 'Recent', and 'Popular' filters mean?">
        <p>These filters help you discover content in different ways:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>All:</strong> A shuffled, diverse mix of all our content, perfect for casual browsing and discovery.</li>
            <li><strong>Trending:</strong> Shows content that is currently receiving high engagement (a mix of likes and views). This is great for finding what's hot right now.</li>
            <li><strong>Recent:</strong> Displays the newest content that has been added to {siteName}, so you can always find fresh ideas.</li>
            <li><strong>Popular:</strong> Sorts content by the all-time number of views, highlighting timeless favorites.</li>
        </ul>
      </FAQItem>
    </div>
    
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Content & Contributions</h2>
    <div className="space-y-2">
       <FAQItem question="How often is new content added?">
        <p>
          Our team is dedicated to keeping our library fresh and relevant. We add new content across all categories on a weekly basis, so there's always something new to discover.
        </p>
      </FAQItem>
      <FAQItem question="Can I suggest new content or categories?">
        <p>
          Absolutely! We love hearing from our community. If you have an idea for a new category or a suggestion for content you'd like to see, please send us a message through our <a href="#/support/contact-us" onClick={(e) => { e.preventDefault(); window.location.hash = '#/support/contact-us'; }} className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">Contact Us</a> page.
        </p>
      </FAQItem>
    </div>

    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Troubleshooting</h2>
     <div className="space-y-2">
       <FAQItem question="The 'Copy' button isn't working. What should I do?">
        <p>
          This issue can sometimes be caused by browser settings or extensions that restrict clipboard access. Please try the following steps:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Check Permissions:</strong> Your browser may ask for permission to allow the site to write to your clipboard. Please ensure you grant this permission.</li>
            <li><strong>Refresh the Page:</strong> A simple refresh can often resolve temporary issues.</li>
            <li><strong>Try a Different Browser:</strong> If the problem persists, try using a different web browser to see if the issue is browser-specific.</li>
            <li><strong>Disable Extensions:</strong> Temporarily disable browser extensions (especially ad-blockers or privacy-focused ones) to see if they are interfering.</li>
        </ul>
      </FAQItem>
    </div>
    
    <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Still Need Help?</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
            If your question wasn't answered here, our support team is ready to help.
        </p>
        <a href="#/support/contact-us" onClick={(e) => { e.preventDefault(); window.location.hash = '#/support/contact-us'; }} className="mt-4 inline-block bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow">
            Contact Support
        </a>
    </div>
  </>
);
