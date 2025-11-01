import React from 'react';
import { Header } from './Header';
// FIX: Changed named import for Footer to a default import to match its export type.
import Footer from './Footer';
import { AdminLoginForm } from './AdminLoginForm';
import { Category } from '../types';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  categories: Category[];
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, categories }) => {
  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 flex flex-col">
      {/* The onSearchClick is dummied as it's not needed on the login page */}
      <Header onSearchClick={() => {}} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow w-full flex items-center justify-center">
        <AdminLoginForm onLoginSuccess={onLoginSuccess} />
      </main>
      <Footer categories={categories} />
    </div>
  );
};

export default AdminLoginPage;
