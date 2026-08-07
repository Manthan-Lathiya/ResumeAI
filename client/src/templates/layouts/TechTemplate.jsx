import React from 'react';

/**
 * Modern Tech & Developer Template
 * Clean 2-column layout with a left sidebar for skills, contact info, and projects.
 */
export default function TechTemplate({ resume, themeColor = '#059669' }) {
  if (!resume) return null;

  const personalInfo = resume.personalInfo || resume.personal_info || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full mx-auto font-sans flex flex-col md:flex-row text-xs leading-relaxed min-h-[800px]">
      {/* Sidebar Column */}
      <div className="w-full md:w-1/3 text-white p-6 flex flex-col justify-between" style={{ backgroundColor: themeColor }}>
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-white/80 font-medium text-xs">Software & Technology Professional</p>
          </div>

          {/* Contact */}
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

          {/* Tech Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/30 pb-1 mb-3">
                Tech Stack & Skills
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

          {/* Education Sidebar */}
          {education.some(e => e.institution || e.degree) && (
            <div className="mb-6 text-white/90">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/30 pb-1 mb-3">
                Education
              </h2>
              {education.filter(e => e.institution || e.degree).map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="font-bold text-white">{edu.degree || 'Degree'}</div>
                  <div className="text-white/80">{edu.institution}</div>
                  <div className="text-white/60 text-[10px]">{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Column */}
      <div className="w-full md:w-2/3 p-6 bg-white flex flex-col space-y-5">
        {/* Summary */}
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 border-gray-100" style={{ color: themeColor }}>
              About & Summary
            </h2>
            <p className="text-gray-700 leading-normal">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.some(e => e.company || e.title) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2 border-gray-100" style={{ color: themeColor }}>
              Engineering Experience
            </h2>
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

        {/* Projects */}
        {projects.some(p => p.name) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2 border-gray-100" style={{ color: themeColor }}>
              Featured Systems & Projects
            </h2>
            {projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-3.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex justify-between items-baseline mb-1">
                  <strong className="text-gray-900 font-bold">{proj.name}</strong>
                  {proj.link && <span className="text-[10px] text-gray-500">{proj.link}</span>}
                </div>
                {proj.description && <p className="text-gray-700 text-xs mb-1">{proj.description}</p>}
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((tech, ti) => (
                      <span key={ti} className="bg-gray-200 text-gray-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
