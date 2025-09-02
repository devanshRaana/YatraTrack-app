
import React from 'react';
import { CompassIcon } from './icons/CompassIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white/10 backdrop-blur-sm p-4 shadow-md flex items-center justify-center text-white sticky top-0 z-10">
        <CompassIcon className="w-8 h-8 mr-3 text-cyan-300" />
        <h1 className="text-xl font-bold tracking-wider">NATPAC Travel Log</h1>
    </header>
  );
};

export default Header;
