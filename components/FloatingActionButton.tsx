import React from 'react';

interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const FloatingActionButton: React.FC<FabProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 bg-teal-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-teal-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-300 z-30 animate-fade-in"
    >
      {children}
    </button>
  );
};

export default FloatingActionButton;
