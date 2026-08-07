import React from 'react';
import ResumePreview from './ResumePreview';

/**
 * Scaled paper document thumbnail component for displaying real visual previews inside cards.
 */
export default function TemplateThumbnail({ resume, scale = 0.38, height = 320 }) {
  if (!resume) return null;

  return (
    <div
      className="relative overflow-hidden w-full bg-gray-900/60 rounded-xl flex justify-center border border-gray-800 
                 group-hover:border-primary-500/50 group-hover:shadow-lg group-hover:shadow-primary-500/10 
                 transition-all duration-300 pointer-events-none select-none"
      style={{ height: `${height}px` }}
    >
      <div
        className="w-[780px] shrink-0 transform origin-top shadow-2xl transition-transform duration-300 mt-3"
        style={{ transform: `scale(${scale})` }}
      >
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
