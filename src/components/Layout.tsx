import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { View } from '../types';

interface LayoutProps {
  title: string;
  subtitle?: string;
  setView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, subtitle, setView, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setView('dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <span className="text-gray-600">{subtitle}</span>}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;