
import React from 'react';
import { HeartIcon } from '../components/icons/HeartIcon';
import { PremiumIcon } from '../components/icons/PremiumIcon';
import { ExploreIcon } from '../components/icons/ExploreIcon';
import { Category } from '../types';

const Section: React.FC<{ title: string; children: React.ReactNode; Icon: React.FC<{ className?: string }> }> = ({ title, Icon, children }) => (
  <div className="mt-8">
    <div className="flex items-center gap-3">
        <Icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
    <div className="mt-3 pl-10 border-l-2 border-purple-200 dark:border-purple-800/50">
        <div className="space-y-4 text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none">
            {children}
        </div>
    </div>
  </div>
);

export const aboutUsContent = (siteName: string, categories: Category[]) => {
  const publicCategories = categories.filter(cat => !cat.premium);

  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
        Welcome to {siteName}, the creative heart of your social media presence. We believe that the right words can transform a simple post into a powerful statement.
      </p>

      <div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Our Core Belief</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400 italic">
              "Empowering expression, one copy-paste at a time."
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {siteName} is created and managed by a small team of creators passionate about digital content.
          </p>
      </div>

      <Section title="Our Mission" Icon={HeartIcon}>
        <p>
          Our mission is simple: to provide a diverse, high-quality, and easily accessible library of content that empowers individuals and brands to express themselves authentically. We want to eliminate the stress of finding the perfect caption or bio, giving you more time to create, connect, and engage with your audience.
        </p>
      </Section>

      <Section title="Our Story" Icon={ExploreIcon}>
        <p>
          {siteName} was born from a common frustration: spending too much time searching for the right words. As avid social media users, we found ourselves scrolling endlessly for inspiration. We envisioned a single, beautifully designed platform where finding creative bios, witty captions, heartfelt quotes, and fun facts was effortless.
        </p>
        <p>
          What started as a small personal project has grown into a thriving community of content lovers. Every piece of content is curated and crafted with care, ensuring it meets our high standards of quality and creativity.
        </p>
      </Section>

      <Section title="What We Offer" Icon={PremiumIcon}>
          <p>{siteName} is more than just a collection of text. It's a toolkit for digital expression, featuring:</p>
          <ul>
              <li>
                  <strong>Diverse Categories:</strong> Explore our diverse collections, including our popular{' '}
                  {publicCategories.map((cat, index) => {
                      const isLast = index === publicCategories.length - 1;
                      const isSecondLast = index === publicCategories.length - 2;

                      return (
                          <React.Fragment key={cat.id}>
                              <a
                                  href={`#/category/${cat.id}`}
                                  onClick={(e) => { e.preventDefault(); window.location.hash = `#/category/${cat.id}`; }}
                                  className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                              >
                                  {cat.name}
                              </a>
                              {!isLast && (isSecondLast ? ', and ' : ', ')}
                          </React.Fragment>
                      );
                  })}
                  . We cover a wide spectrum of moods and occasions.
              </li>
              <li><strong>Curated Quality:</strong> Our content is handpicked and regularly updated to ensure it's fresh, relevant, and engaging.</li>
              <li><strong>Intuitive Design:</strong> A clean, user-friendly interface that makes finding and copying content a seamless experience, on any device.</li>
              <li><strong>Community-Focused:</strong> We listen to our users' feedback to continuously improve and expand our collections.</li>
          </ul>
      </Section>
      
      <div className="mt-12 p-6 bg-purple-600 text-white rounded-lg text-center">
          <h3 className="text-2xl font-bold">Join Our Community</h3>
          <p className="mt-2 max-w-2xl mx-auto">
              We are constantly growing and evolving, and we invite you to be a part of our journey. Follow us on social media for the latest updates and content highlights.
          </p>
          <a href="#/support/contact-us" onClick={(e) => { e.preventDefault(); window.location.hash = '#/support/contact-us'; }} className="mt-4 inline-block bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow">
              Get in Touch
          </a>
      </div>
    </>
  );
};
