import React from 'react';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10v-1.5h-2v1.5c0 4.14-3.36 7.5-7.5 7.5S4.5 16.14 4.5 12 7.86 4.5 12 4.5c.83 0 1.61.17 2.32.48v3.02a4.5 4.5 0 01-2.32-.6V7.5h5v5h-1.5V8.41a6.5 6.5 0 01-3.5-1.91V12c0 1.38 1.12 2.5 2.5 2.5S16 13.38 16 12V7h2v5c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5c.28 0 .55.03.81.08V2z" />
  </svg>
);

export default TikTokIcon;
