

import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { useDesign } from '../../contexts/DesignContext';
import { auth } from '../../firebase/firebaseConfig';
// FIX: Removed v9 modular import for Firebase Auth to switch to the v8 namespaced API.
// This resolves the "has no exported member 'signInWithEmailAndPassword'" error.
// import { signInWithEmailAndPassword } from 'firebase/auth';

interface AdminLoginFormProps {
    onLoginSuccess: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { siteName } = useDesign();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // FIX: Switched to v8 namespaced API for auth to resolve import error.
            await auth.signInWithEmailAndPassword(email, password);
            onLoginSuccess();
        } catch (error: any) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Invalid email or password. Please try again.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 md:p-10">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full mb-4">
                    <UserIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel Access</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Please log in to manage {siteName} content.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="admin-email"
                        id="admin-email"
                        placeholder="admin@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                </div>
                <div>
                    <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input
                        type="password"
                        name="admin-password"
                        id="admin-password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                </div>
                
                {error && (
                    <div className="text-red-500 dark:text-red-400 text-sm font-medium text-center py-1">
                        {error}
                    </div>
                )}
                
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-semibold rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition-colors disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </div>
            </form>
        </div>
    );
};