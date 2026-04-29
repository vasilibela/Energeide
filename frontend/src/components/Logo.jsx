import React from "react";

// Stylized Energeide "E" logo with sunrays - SVG inline
const Logo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="eg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#0A1F44" />
        <stop offset="1" stopColor="#16407a" />
      </linearGradient>
    </defs>
    {/* outer rounded square */}
    <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#eg)" />
    {/* sun arc */}
    <path
      d="M14 28 C 22 16, 42 16, 50 28"
      stroke="#F4C542"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* mountain / panel base */}
    <path
      d="M14 46 L 26 32 L 36 42 L 50 26"
      stroke="#0FB36B"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* E mark */}
    <path
      d="M22 50 H 44"
      stroke="#F4C542"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export default Logo;
