import React from 'react';

/**
 * Ultra Minimalist Template
 * Muted slate typography, generous spacing, borderless minimalist design.
 */
export default function MinimalistTemplate({ resume, themeColor = '#475569' }) {
  if (!resume) return null;

  const personalInfo = resume.personalInfo || resume.personal_info || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  return (
    <div className="bg-white text-gray-800 p-10 rounded-xl shadow-2xl overflow-y-auto text-sm leading-relaxed max-w-4xl w-full mx-auto font-sans tracking-wide">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-widest text-gray-900 uppercase mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-light tracking-normal">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2" style={{ color: themeColor }}>
            Profile
          </h2>
          <p className="text-gray-700 font-light leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.some(e => e.company || e.title) && (
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4" style={{ color: themeColor }}>
            Experience
          </h2>
          {experience.filter(e => e.company || e.title).map((exp, i) => (
            <div key={i} className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <strong className="text-gray-900 font-normal text-base">{exp.title}</strong>
                <span className="text-xs text-gray-400 font-light">
                  {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? '–' : ''} {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium mb-2">
                {exp.company}{exp.location && ` • ${exp.location}`}
              </div>
              {exp.bullets?.filter(Boolean).length > 0 && (
                <ul className="space-y-1.5 text-xs text-gray-600 font-light">
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} className="flex gap-2">
                      <span className="text-gray-300">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.some(e => e.institution || e.degree) && (
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3" style={{ color: themeColor }}>
            Education
          </h2>
          {education.filter(e => e.institution || e.degree).map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900 font-normal">{edu.degree}</strong>
                <span className="text-xs text-gray-400 font-light">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="text-xs text-gray-500">{edu.institution}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2" style={{ color: themeColor }}>
            Skills
          </h2>
          <p className="text-xs text-gray-600 font-light leading-relaxed">
            {skills.join('   /   ')}
          </p>
        </div>
      )}
    </div>
  );
}
