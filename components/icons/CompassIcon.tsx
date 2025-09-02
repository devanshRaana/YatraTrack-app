import React from 'react';

export const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.91 8.351-3.563 3.562-3.563-3.562a.75.75 0 1 1 1.06-1.06l2.503 2.503 2.503-2.503a.75.75 0 0 1 1.06 1.06Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v6" />
    </svg>
);
