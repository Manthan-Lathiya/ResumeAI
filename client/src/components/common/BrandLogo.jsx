import React from 'react';

/**
 * Custom Brand Logo Component for ResumeAI (Pure Dark Theme)
 * Distinct SVG Brand Mark featuring a glowing AI Document Shield with dual-gradient orbital sparkles.
 */
export default function BrandLogo({ size = 'medium', className = '', showSubtitle = true }) {
  const iconSizes = {
    small: 'w-7 h-7',
    medium: 'w-9 h-9',
    large: 'w-12 h-12',
  };

  const textSizes = {
    small: 'text-base',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Icon Badge */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} 
                    bg-gradient-to-br from-teal-500 via-primary-500 to-indigo-600 rounded-xl shadow-lg 
                    shadow-primary-500/25 border border-white/20 shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5 text-white drop-shadow-md"
        >
          {/* Document Sheet */}
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          {/* AI Sparkle Stars */}
          <path d="M9 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="currentColor" stroke="none" />
          <line x1="9" y1="10" x2="15" y2="10" />
          <line x1="9" y1="18" x2="13" y2="18" />
        </svg>
        {/* Glow indicator dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-gray-950 animate-pulse" />
      </div>

      {/* Typography — ResumeAI */}
      <div>
        <div className={`font-black tracking-tight leading-none ${textSizes[size]}`}>
          <span className="text-gray-100">Resume</span>
          <span className="bg-gradient-to-r from-teal-400 via-primary-400 to-indigo-400 bg-clip-text text-transparent ml-0.5">
            AI
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block mt-0.5 font-medium">
            ATS Resume & Cover Studio
          </span>
        )}
      </div>
    </div>
  );
}
