import React from 'react';

/**
 * Cover Letter Document Preview
 * Renders cover letter on document sheet matching the visual layout, typography, and theme color of all selected templates.
 */
export default function CoverLetterPreview({ data }) {
  if (!data) return null;

  const {
    applicantName = 'Your Name',
    email = 'your.email@example.com',
    phone = '+1 (555) 000-0000',
    location = 'City, Country',
    linkedin = '',
    recipientName = 'Hiring Manager',
    companyName = 'Target Company',
    jobTitle = 'Target Position',
    salutation = 'Dear Hiring Manager,',
    bodyParagraphs = [],
    closing = 'Sincerely,',
    templateId = 'classic',
    themeColor = '#2563eb',
    date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  } = data;

  const getInitials = (name) => {
    if (!name) return 'CV';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Font family selector
  const getFontFamily = () => {
    if (['executive', 'oxford_serif', 'harvard_ats', 'elegance'].includes(templateId)) return 'font-serif';
    if (['tech', 'compact_tech'].includes(templateId)) return 'font-sans';
    return 'font-sans';
  };

  // Render Header by Template Type
  const renderHeader = () => {
    // 1. Creative / Banner / Vanguard / Polished / Current Header
    if (['creative', 'vanguard', 'banner', 'current', 'polished'].includes(templateId)) {
      return (
        <div className="p-8 text-white relative overflow-hidden -mx-8 -mt-8 mb-6 shadow-md" style={{ backgroundColor: themeColor }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center text-xl font-black text-white shadow-lg">
                {getInitials(applicantName)}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">{applicantName}</h1>
                <p className="text-white/80 font-medium text-xs">Application for {jobTitle}</p>
              </div>
            </div>
            <div className="flex flex-col text-xs text-white/90 space-y-0.5 text-right font-medium">
              {email && <span>📧 {email}</span>}
              {phone && <span>📞 {phone}</span>}
              {location && <span>📍 {location}</span>}
            </div>
          </div>
        </div>
      );
    }

    // 2. Executive / Serif / Harvard / Oxford / Elegance Header
    if (['executive', 'oxford_serif', 'harvard_ats', 'elegance', 'apex_leader'].includes(templateId)) {
      return (
        <div className="border-b-4 pb-4 mb-6" style={{ borderColor: themeColor }}>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif" style={{ color: themeColor }}>
            {applicantName}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-gray-600 text-xs font-sans flex-wrap font-medium">
            {email && <span>{email}</span>}
            {phone && <span>| {phone}</span>}
            {location && <span>| {location}</span>}
            {linkedin && <span>| {linkedin}</span>}
          </div>
        </div>
      );
    }

    // 3. Tech / Innovative / Compact Tech Header
    if (['tech', 'innovative', 'compact_tech'].includes(templateId)) {
      return (
        <div className="p-6 text-white rounded-xl mb-6 flex justify-between items-center shadow-lg" style={{ backgroundColor: themeColor }}>
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-0.5">{applicantName}</h1>
            <p className="text-white/80 text-xs font-medium">Application for {jobTitle} at {companyName}</p>
          </div>
          <div className="text-right text-xs text-white/90 space-y-0.5 font-mono">
            {email && <div>{email}</div>}
            {phone && <div>{phone}</div>}
            {location && <div>{location}</div>}
          </div>
        </div>
      );
    }

    // 4. Metropolitan / Boxed Header
    if (['metropolitan', 'boxed'].includes(templateId)) {
      return (
        <div className="p-5 rounded-xl border-2 mb-6" style={{ borderColor: themeColor, backgroundColor: `${themeColor}0d` }}>
          <h1 className="text-3xl font-extrabold text-center" style={{ color: themeColor }}>
            {applicantName}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2 text-gray-600 text-xs flex-wrap font-medium">
            {email && <span>{email}</span>}
            {phone && <span>• {phone}</span>}
            {location && <span>• {location}</span>}
            {linkedin && <span>• {linkedin}</span>}
          </div>
        </div>
      );
    }

    // 5. Contemporary / Stanford / Left Accent Bar Header
    if (['contemporary', 'stanford_modern', 'left'].includes(templateId)) {
      return (
        <div className="border-l-4 pl-4 py-1 mb-6" style={{ borderColor: themeColor }}>
          <h1 className="text-3xl font-extrabold text-gray-900" style={{ color: themeColor }}>
            {applicantName}
          </h1>
          <div className="flex items-center gap-3 mt-1.5 text-gray-600 text-xs flex-wrap font-medium">
            {email && <span>{email}</span>}
            {phone && <span>• {phone}</span>}
            {location && <span>• {location}</span>}
          </div>
        </div>
      );
    }

    // 6. Pinnacle / Initials Avatar Badge Header
    if (['pinnacle', 'initials'].includes(templateId)) {
      return (
        <div className="flex items-center gap-4 pb-4 mb-6 border-b-2" style={{ borderColor: themeColor }}>
          <div
            className="w-14 h-14 rounded-2xl text-white flex items-center justify-center text-xl font-black shadow-md shrink-0"
            style={{ backgroundColor: themeColor }}
          >
            {getInitials(applicantName)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{applicantName}</h1>
            <div className="flex items-center gap-3 mt-1 text-gray-600 text-xs flex-wrap font-medium">
              {email && <span>{email}</span>}
              {phone && <span>• {phone}</span>}
              {location && <span>• {location}</span>}
            </div>
          </div>
        </div>
      );
    }

    // 7. Minimalist Header
    if (['minimalist', 'basic'].includes(templateId)) {
      return (
        <div className="mb-6">
          <h1 className="text-3xl font-light tracking-wider text-gray-900 uppercase mb-2">
            {applicantName}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-light">
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {location && <span>{location}</span>}
          </div>
        </div>
      );
    }

    // Default Classic ATS Standard Header
    return (
      <div className="border-b-2 pb-4 mb-6" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900" style={{ color: themeColor }}>
          {applicantName}
        </h1>
        <div className="flex items-center gap-3 mt-2 text-gray-600 text-xs flex-wrap font-medium">
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {location && <span>• {location}</span>}
          {linkedin && <span>• {linkedin}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white text-gray-900 p-8 rounded-xl shadow-2xl overflow-y-auto text-sm leading-relaxed max-w-4xl w-full mx-auto ${getFontFamily()} min-h-[750px]`}>
      {renderHeader()}

      {/* Date & Recipient Details */}
      <div className="mb-6 space-y-1 text-xs text-gray-600">
        <div className="font-medium text-gray-800 mb-3">{date}</div>
        <div className="font-bold text-gray-900 text-sm">{recipientName}</div>
        <div className="font-semibold" style={{ color: themeColor }}>{jobTitle}</div>
        <div className="text-gray-700 font-medium">{companyName}</div>
      </div>

      {/* Salutation */}
      <div className="font-bold text-gray-900 mb-4 text-sm">
        {salutation}
      </div>

      {/* Body Paragraphs */}
      <div className="space-y-4 text-gray-800 leading-relaxed text-sm">
        {bodyParagraphs.length > 0 ? (
          bodyParagraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-wrap">{para}</p>
          ))
        ) : (
          <p className="text-gray-400 italic">Body paragraphs will appear here as you type or generate with AI...</p>
        )}
      </div>

      {/* Closing & Sign-off */}
      <div className="mt-8 pt-4 space-y-6 border-t border-gray-100">
        <div className="font-bold text-gray-900">{closing}</div>
        <div className="font-extrabold text-lg tracking-tight" style={{ color: themeColor }}>
          {applicantName}
        </div>
      </div>
    </div>
  );
}
