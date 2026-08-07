import React from 'react';

/**
 * Classic Standard Template (ATS Friendly)
 * Clean 1-column traditional layout with crisp header and structured sections.
 */
export default function ClassicTemplate({ resume, themeColor = '#2563eb' }) {
  if (!resume) return null;

  const personalInfo = resume.personalInfo || resume.personal_info || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  return (
    <div className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl overflow-y-auto text-sm leading-relaxed max-w-4xl w-full mx-auto font-sans">
      {/* Header */}
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
          {personalInfo.linkedin && <span className="hover:underline">{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-gray-200" style={{ color: themeColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-normal">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.some(e => e.company || e.title) && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b border-gray-200" style={{ color: themeColor }}>
            Work Experience
          </h2>
          {experience.filter(e => e.company || e.title).map((exp, i) => (
            <div key={i} className="mb-3.5">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900 font-semibold">{exp.title || 'Job Title'}</strong>
                <span className="text-xs text-gray-500 font-medium">
                  {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? '–' : ''} {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-gray-600 text-xs font-medium mb-1">
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
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b border-gray-200" style={{ color: themeColor }}>
            Education
          </h2>
          {education.filter(e => e.institution || e.degree).map((edu, i) => (
            <div key={i} className="mb-2.5">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900 font-semibold">{edu.degree || 'Degree'}</strong>
                <span className="text-xs text-gray-500 font-medium">
                  {edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}
                </span>
              </div>
              <div className="text-gray-600 text-xs">
                {edu.institution}{edu.gpa && ` • GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.some(p => p.name) && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b border-gray-200" style={{ color: themeColor }}>
            Key Projects
          </h2>
          {projects.filter(p => p.name).map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <strong className="text-gray-900 font-semibold">{proj.name}</strong>
                {proj.link && <span className="text-xs text-gray-500">{proj.link}</span>}
              </div>
              {proj.description && <p className="text-gray-700 text-xs mt-0.5">{proj.description}</p>}
              {proj.technologies?.length > 0 && (
                <div className="text-gray-500 text-xs mt-1">
                  <span className="font-semibold text-gray-700">Tech Stack: </span>
                  {proj.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-gray-200" style={{ color: themeColor }}>
            Skills & Expertise
          </h2>
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
