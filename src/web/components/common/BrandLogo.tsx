import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textColor,
  subtextColor,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Authentic KalaSetu Official Logo from Reference */}
      <div className={`${dim.box} rounded-full bg-[#FFFDF9] border border-amber-200/80 p-0.5 flex items-center justify-center shadow-sm shrink-0 overflow-hidden`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Circular Enclosing Brush Stroke */}
          <path
            d="M170 85 C178 115 165 155 125 170 C85 185 45 165 30 130 C15 95 30 50 65 30 C100 10 145 25 165 55"
            stroke="url(#brushGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="180 8"
          />

          {/* 3 Lotus Petals on Top (Green, Saffron, Orange) */}
          <path d="M55 70 C48 62 55 52 65 62 C70 67 62 75 55 70Z" fill="#2E7D32" />
          <path d="M72 60 C70 50 82 45 88 56 C90 64 78 68 72 60Z" fill="#F59E0B" />
          <path d="M88 68 C92 58 102 62 98 72 C94 78 85 75 88 68Z" fill="#E65100" />

          {/* Diya / Paintbrush Flame on top of 'ल' */}
          <path
            d="M102 62 C108 50 120 40 122 32 C120 45 126 52 118 64 C112 70 100 70 102 62Z"
            fill="url(#flameGrad)"
          />
          <path
            d="M104 60 C108 52 116 46 117 40 C116 48 120 53 114 61 C110 65 102 65 104 60Z"
            fill="#FEF08A"
          />

          {/* कला text in Terracotta Brown */}
          {/* Top Sirorekha (Header line) */}
          <path d="M30 78 L122 78" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />

          {/* Letter क */}
          <path d="M42 78 L42 114" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          <path d="M42 96 C30 96 30 84 42 84 C54 84 54 96 42 96 Z" fill="#78350F" />
          <path d="M42 84 C52 84 56 102 46 108" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />

          {/* Letter ल with curve reaching into the diya */}
          <path d="M76 78 L76 114" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          <path d="M76 98 C68 94 62 100 66 106 C70 110 76 108 76 102" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M76 96 C82 86 96 82 104 74 L114 62" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />

          {/* Letter ा (Aakar matra) */}
          <path d="M110 78 L110 114" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />

          {/* English Text: Setu in Deep Navy Blue */}
          <text
            x="116"
            y="112"
            fill="#154360"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="44"
            letterSpacing="-1.5"
          >
            Setu
          </text>

          {/* Earthen Kalash / Pot on the Bottom Left */}
          <path
            d="M40 120 L58 120 L60 126 L56 142 C54 148 44 148 42 142 L38 126 Z"
            fill="#A04000"
          />
          {/* White tribal pattern on pot */}
          <path
            d="M40 132 L44 136 L48 132 L52 136 L56 132"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Traditional Arched Bridge (Setu) spanning the bottom */}
          <path
            d="M65 140 C85 116 135 116 165 146"
            stroke="#154360"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Bridge Vertical Pillars */}
          <path d="M85 130 L85 142" stroke="#154360" strokeWidth="3.5" />
          <path d="M100 124 L100 142" stroke="#154360" strokeWidth="3.5" />
          <path d="M115 124 L115 142" stroke="#154360" strokeWidth="3.5" />
          <path d="M130 128 L130 144" stroke="#154360" strokeWidth="3.5" />
          <path d="M145 136 L145 146" stroke="#154360" strokeWidth="3.5" />

          {/* Flowing Water Waves (Amber & Blue) */}
          <path
            d="M55 148 C90 142 120 156 160 146"
            stroke="#D35400"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M75 158 C105 160 140 152 170 135"
            stroke="#1B4F72"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Right Botanical Leaves (Orange and Green) */}
          <path
            d="M162 142 C166 128 174 130 172 142 C170 148 162 146 162 142Z"
            fill="#E65100"
          />
          <path
            d="M172 138 C176 122 186 124 184 138 C182 145 174 144 172 138Z"
            fill="#2E7D32"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="brushGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.5" stopColor="#E65100" />
              <stop offset="1" stopColor="#154360" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="100" y1="70" x2="122" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E65100" />
              <stop offset="0.6" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#FDE047" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`${dim.text} font-black tracking-tight ${textColor || 'text-gray-900'} font-sans`}>
              Kala<span className="text-[#FF4B6E]">Setu</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-[#FF4B6E] border border-rose-200">
              कलासेतु
            </span>
          </div>
          <p className={`${dim.sub} font-medium ${subtextColor || 'text-gray-500'} tracking-wide`}>
            Empowering artisans
          </p>
        </div>
      )}
    </div>
  );
};
