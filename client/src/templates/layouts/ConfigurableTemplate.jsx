import React from 'react';

/**
 * Highly configurable template component that renders a wide variety of template styles based on config.
 */
export default function ConfigurableTemplate({ resume, themeColor = '#2563eb', config = {} }) {
  if (!resume) return null;

  const {
    layout = '1col', // '1col' | 'sidebar-left' | 'sidebar-right' | 'banner'
    headerStyle = 'center', // 'center' | 'left' | 'banner' | 'initials' | 'boxed' | 'split'
    headingStyle = 'border-bottom', // 'border-bottom' | 'left-bar' | 'pill' | 'double-line' | 'muted'
    fontFamily = 'font-sans'
  } = config;

  const personalInfo = resume.personalInfo || resume.personal_info || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  const getInitials = (name) => {
    if (!name) return 'CV';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Heading Renderer Helper
  const renderHeading = (title) => {
    if (headingStyle === 'left-bar') {
      return (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: themeColor }} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800">
            {title}
          </h2>
        </div>
      );
    }
    if (headingStyle === 'pill') {
      return (
        <div className="mb-3">
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded text-white inline-block"
            style={{ backgroundColor: themeColor }}
          >
            {title}
          </span>
        </div>
      );
    }
    if (headingStyle === 'double-line') {
      return (
        <h2
          className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2 border-t py-1"
          style={{ color: themeColor, borderColor: themeColor }}
        >
          {title}
        </h2>
      );
    }
    if (headingStyle === 'muted') {
      return (
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3" style={{ color: themeColor }}>
          {title}
        </h2>
      );
    }
    // Default border-bottom
    return (
      <h2
        className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
        style={{ color: themeColor, borderColor: themeColor }}
      >
        {title}
      </h2>
    );
  };

  // Header Renderer
  const renderHeader = () => {
    if (headerStyle === 'banner') {
      return (
        <div className="p-8 text-white relative overflow-hidden -mx-8 -mt-8 mb-6" style={{ backgroundColor: themeColor }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-white/80 font-medium text-xs mt-0.5">Professional Resume</p>
            </div>
            <div className="flex flex-col text-xs text-white/90 space-y-1">
              {personalInfo.email && <span>📧 {personalInfo.email}</span>}
              {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
              {personalInfo.location && <span>📍 {personalInfo.location}</span>}
              {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
      );
    }

    if (headerStyle === 'initials') {
      return (
        <div className="flex items-center gap-5 pb-5 mb-5 border-b-2" style={{ borderColor: themeColor }}>
          <div
            className="w-16 h-16 rounded-2xl text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0"
            style={{ backgroundColor: themeColor }}
          >
            {getInitials(personalInfo.fullName)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900" style={{ color: themeColor }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-gray-600 text-xs flex-wrap font-medium">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
              {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
      );
    }

    if (headerStyle === 'boxed') {
      return (
        <div className="p-5 rounded-xl border-2 mb-6" style={{ borderColor: themeColor, backgroundColor: `${themeColor}0a` }}>
          <h1 className="text-3xl font-extrabold text-center" style={{ color: themeColor }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2 text-gray-600 text-xs flex-wrap font-medium">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        </div>
      );
    }

    if (headerStyle === 'left') {
      return (
        <div className="border-b-2 pb-4 mb-5" style={{ borderColor: themeColor }}>
          <h1 className="text-3xl font-extrabold text-gray-900" style={{ color: themeColor }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-gray-600 text-xs flex-wrap font-medium">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          </div>
        </div>
      );
    }

    // Default Center Header
    return (
      <div className="text-center border-b-2 pb-4 mb-5" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900" style={{ color: themeColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2 text-gray-600 text-xs flex-wrap font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
        <div className="flex items-center justify-center gap-3 mt-1 text-gray-500 text-xs flex-wrap">
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>
    );
  };

  // 2-Column Sidebar Layouts
  if (layout === 'sidebar-left' || layout === 'sidebar-right') {
    const isLeft = layout === 'sidebar-left';
    return (
      <div className={`bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full mx-auto ${fontFamily} flex flex-col md:flex-row text-xs leading-relaxed min-h-[800px]`}>
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 text-white p-6 flex flex-col justify-between ${isLeft ? 'order-1' : 'order-2'}`} style={{ backgroundColor: themeColor }}>
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-white mb-1">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-white/80 font-medium text-xs">Professional Portfolio</p>
            </div>

            <div className="mb-6 space-y-2 text-white/90">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/30 pb-1 mb-2">
                Contact
              </h2>
              {personalInfo.email && <div className="break-all">📧 {personalInfo.email}</div>}
              {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
              {personalInfo.location && <div>📍 {personalInfo.location}</div>}
              {personalInfo.linkedin && <div className="break-all">🔗 {personalInfo.linkedin}</div>}
              {personalInfo.website && <div className="break-all">🌐 {personalInfo.website}</div>}
            </div>

            {skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/30 pb-1 mb-3">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-white/20 text-white font-medium text-[11px] px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education.some(e => e.institution || e.degree) && (
              <div className="mb-6 text-white/90">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/30 pb-1 mb-3">
                  Education
                </h2>
                {education.filter(e => e.institution || e.degree).map((edu, i) => (
                  <div key={i} className="mb-3">
                    <div className="font-bold text-white">{edu.degree}</div>
                    <div className="text-white/80">{edu.institution}</div>
                    <div className="text-white/60 text-[10px]">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className={`w-full md:w-2/3 p-6 bg-white space-y-5 ${isLeft ? 'order-2' : 'order-1'}`}>
          {summary && (
            <div>
              {renderHeading('Profile Summary')}
              <p className="text-gray-700 leading-normal">{summary}</p>
            </div>
          )}

          {experience.some(e => e.company || e.title) && (
            <div>
              {renderHeading('Experience')}
              {experience.filter(e => e.company || e.title).map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-gray-900 font-bold text-sm">{exp.title}</strong>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? '–' : ''} {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="font-semibold text-xs mb-1" style={{ color: themeColor }}>
                    {exp.company}{exp.location && ` • ${exp.location}`}
                  </div>
                  {exp.bullets?.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-gray-700 space-y-1">
                      {exp.bullets.filter(Boolean).map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {projects.some(p => p.name) && (
            <div>
              {renderHeading('Projects')}
              {projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-gray-900 font-bold">{proj.name}</strong>
                    {proj.link && <span className="text-[10px] text-gray-500">{proj.link}</span>}
                  </div>
                  {proj.description && <p className="text-gray-700 text-xs mb-1">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 1-Column Layouts (Classic / Banner / Minimalist)
  return (
    <div className={`bg-white text-gray-900 p-8 rounded-xl shadow-2xl overflow-y-auto text-sm leading-relaxed max-w-4xl w-full mx-auto ${fontFamily}`}>
      {renderHeader()}

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          {renderHeading('Professional Summary')}
          <p className="text-gray-700 leading-normal">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.some(e => e.company || e.title) && (
        <div className="mb-5">
          {renderHeading('Work Experience')}
          {experience.filter(e => e.company || e.title).map((exp, i) => (
            <div key={i} className="mb-3.5">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900 font-semibold text-base">{exp.title}</strong>
                <span className="text-xs text-gray-500 font-medium">
                  {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? '–' : ''} {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-xs font-semibold mb-1" style={{ color: themeColor }}>
                {exp.company}{exp.location && ` • ${exp.location}`}
              </div>
              {exp.bullets?.filter(Boolean).length > 0 && (
                <ul className="list-disc list-outside ml-4 text-gray-700 space-y-1 text-xs">
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.some(e => e.institution || e.degree) && (
        <div className="mb-5">
          {renderHeading('Education')}
          {education.filter(e => e.institution || e.degree).map((edu, i) => (
            <div key={i} className="mb-2.5">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900 font-semibold">{edu.degree}</strong>
                <span className="text-xs text-gray-500 font-medium">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="text-gray-600 text-xs">{edu.institution}{edu.gpa && ` • GPA: ${edu.gpa}`}</div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.some(p => p.name) && (
        <div className="mb-5">
          {renderHeading('Key Projects')}
          {projects.filter(p => p.name).map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900 font-semibold">{proj.name}</strong>
                {proj.link && <span className="text-xs text-gray-500">{proj.link}</span>}
              </div>
              {proj.description && <p className="text-gray-700 text-xs mt-0.5">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          {renderHeading('Skills & Expertise')}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded border border-gray-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
