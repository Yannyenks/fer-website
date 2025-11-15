
import React from 'react';

export const HeartLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M90.5 25.5C90.5 13.08 80.42 3 68 3C58.4 3 50.65 8.28 46.5 15.6C42.35 8.28 34.6 3 25 3C12.58 3 2.5 13.08 2.5 25.5C2.5 49.33 46.5 87 46.5 87S90.5 49.33 90.5 25.5Z"
      stroke="currentColor"
      strokeWidth="5"
      fill="white"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <circle cx="46.5" cy="35" r="8" fill="currentColor" />
    <path d="M46.5 43C42 53 37 53 37 53" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M46.5 43C51 53 56 53 56 53" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);
