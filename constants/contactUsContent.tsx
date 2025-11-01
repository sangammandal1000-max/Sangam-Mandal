import React, { useState } from 'react';
import { MailIcon } from '../components/icons/MailIcon';
import { TwitterIcon } from '../components/icons/TwitterIcon';
import { InstagramIcon } from '../components/icons/InstagramIcon';
import { db } from '../firebase/firebaseConfig';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';


const ContactUsForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            await db.collection('messages').add({
                name,
                email,
                message,
                createdAt: new Date().toISOString(),
                read: false,
            });
            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again later.');
        }
    };

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Send Us a Message</h2>
        {status === 'success' ? (
          <div className="text-center p-8 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-800 dark:text-green-200">Message Sent!</h3>
            <p className="text-green-700 dark:text-green-300 mt-2">Thank you for reaching out. We'll get back to you soon.</p>
            <button onClick={() => setStatus('idle')} className="mt-4 font-semibold text-sm text-green-600 hover:underline">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" id="name" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input type="email" name="email" id="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea id="message" name="message" rows={5} placeholder="Tell us what's on your mind..." required value={message} onChange={(e) => setMessage(e.target.value)} className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
            </div>
             {status === 'error' && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}
            <div>
              <button type="submit" disabled={status === 'loading'} className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-60">
                {status === 'loading' ? 'Sending...' : 'Submit Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    );
};


export const contactUsContent = (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl mx-auto">
        We'd love to hear from you! Whether you have a question about our features, a suggestion for new content, or just want to say hello, our team is ready to assist you.
      </p>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ContactUsForm />

        {/* Other Contact Methods */}
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:text-left text-center">Other Ways to Reach Us</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-start gap-4">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                    <MailIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">General Support</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">For general questions, feature requests, or support issues.</p>
                    <a href="mailto:support@biozilla.app" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block">support@biozilla.app</a>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-start gap-4">
                <div className="flex-shrink-0 bg-pink-100 dark:bg-pink-900/50 p-3 rounded-full">
                    <MailIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Business & Partnerships</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">For partnership opportunities or media inquiries.</p>
                    <a href="mailto:partners@biozilla.app" className="font-semibold text-pink-600 dark:text-pink-400 hover:underline mt-2 inline-block">partners@biozilla.app</a>
                </div>
            </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left px-2">
                <strong>Response Time:</strong> Our team is committed to providing excellent service. We strive to respond to all inquiries within <strong>24-48 business hours</strong>.
            </p>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Follow Us</h3>
              <div className="flex gap-4 justify-center md:justify-start">
                  <a href="#" aria-label="Twitter" className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                  <a href="#" aria-label="Instagram" className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
              </div>
            </div>
        </div>
      </div>
    </>
  );