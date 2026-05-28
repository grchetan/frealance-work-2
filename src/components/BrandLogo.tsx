import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Defined Gradients for Brand Consistency */}
      <defs>
        <linearGradient id="saffronGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary, #f59e0b)" />
          <stop offset="100%" stopColor="var(--color-secondary, #b91c1c)" />
        </linearGradient>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="rgba(245, 158, 11, 0.25)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>
      </defs>

      {/* Radiant Glow Circle Background */}
      <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" />

      {/* stylized Traditional Frying Vessel (Kadhai) Outer Outline */}
      <path 
        d="M20 50 C20 70, 80 70, 80 50" 
        stroke="url(#saffronGradient)" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />

      {/* Decorative Traditional Grips / Rings of the Frying Vessel */}
      <circle cx="15" cy="48" r="6" stroke="url(#saffronGradient)" strokeWidth="4" fill="none" />
      <circle cx="85" cy="48" r="6" stroke="url(#saffronGradient)" strokeWidth="4" fill="none" />

      {/* Crispy Golden Puffed Kachori Motif - Floating over Kadhai */}
      <circle 
        cx="50" 
        cy="40" 
        r="18" 
        fill="url(#saffronGradient)" 
        filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.15))"
      />

      {/* Minimalist Spiced Sparkle Grain vector inside Kachori */}
      <path 
        d="M50 28 L52 35 L59 37 L52 39 L50 46 L48 39 L41 37 L48 35 Z" 
        fill="white" 
        opacity="0.95" 
      />
      <circle cx="38" cy="48" r="2" fill="white" opacity="0.8" />
      <circle cx="62" cy="45" r="2" fill="white" opacity="0.8" />

      {/* Elegant Symmetrical Herbs / Wheat ears framing Kadhai bottom */}
      <path 
        d="M25 76 C35 84, 65 84, 75 76" 
        stroke="var(--color-success, #15803d)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeDasharray="1 6"
      />
    </svg>
  );
};
