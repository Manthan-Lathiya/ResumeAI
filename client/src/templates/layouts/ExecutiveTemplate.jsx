import React from 'react';

/**
 * Executive Leadership Template
 * Polished, high-level management template with Georgia/Serif headers and accent bars.
 */
export default function ExecutiveTemplate({ resume, themeColor = '#1e3a8a' }) {
  if (!resume) return null;

  const personalInfo = resume.personalInfo || resume.personal_info || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  return (
    <div className="bg-white text-gray-900 p-9 rounded-xl shadow-2xl overflow-y-auto text-sm leading-relaxed max-w-4xl w-full mx-auto font-serif">
      {/* Header */}
      <div className="border-b-4 pb-4 mb-6" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif" style={{ color: themeColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex items-center gap-4 mt-2 text-gray-600 text-xs font-sans flex-wrap font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: themeColor }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 font-sans">
              Executive Summary
            </h2>
          </div>
          <p className="text-gray-700 italic leading-relaxed pl-3 border-l-2 border-gray-200 font-serif">
            "{summary}"
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.some(e => e.company || e.title) && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: themeColor }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 font-sans">
              Professional Experience
            </h2>
          </div>
          {experience.filter(e => e.company || e.title).map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline font-sans">
                <strong className="text-gray-900 font-bold text-sm">{exp.title || 'Job Title'}</strong>
                <span className="text-xs text-gray-500 font-medium">
                  {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? '–' : ''} {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-gray-700 text-xs font-medium font-sans mb-1.5" style={{ color: themeColor }}>
                {exp.company}{exp.location && ` • ${exp.location}`}
              </div>
              {exp.bullets?.filter(Boolean).length > 0 && (
                <ul className="list-disc list-outside ml-4 text-gray-700 space-y-1 text-xs font-sans">
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: themeColor }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 font-sans">
              Education & Credentials
            </h2>
          </div>
          {education.filter(e => e.institution || e.degree).map((edu, i) => (
            <div key={i} className="mb-3 font-sans">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900 font-bold">{edu.degree || 'Degree'}</strong>
                <span className="text-xs text-gray-500 font-medium">
                  {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                </span>
              </div>
              <div className="text-gray-600 text-xs">
                {edu.institution}{edu.gpa && ` • Honors: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.some(p => p.name) && (
        <div className="mb-6 font-sans">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: themeColor }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 font-sans">
              Strategic Initiatives & Projects
            </h2>
          </div>
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
        <div className="mb-4 font-sans">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: themeColor }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 font-sans">
              Core Competencies
            </h2>
          </div>
          <p className="text-gray-700 text-xs leading-relaxed font-medium pl-3">
            {skills.join('  •  ')}
          </p>
        </div>
      )}
    </div>
  );
}
