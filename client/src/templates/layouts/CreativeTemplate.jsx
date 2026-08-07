import React from 'react';

/**
 * Creative & Portfolio Template
 * Header accent banner with initials avatar badge and modern pill skill tags.
 */
export default function CreativeTemplate({ resume, themeColor = '#7c3aed' }) {
  if (!resume) return null;

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

  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full mx-auto font-sans text-sm leading-relaxed">
      {/* Creative Banner Header */}
      <div className="p-8 text-white relative overflow-hidden" style={{ backgroundColor: themeColor }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Initials Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center text-2xl font-black text-white shadow-lg">
              {getInitials(personalInfo.fullName)}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-white/80 font-medium text-xs mt-0.5">Creative Professional & Strategist</p>
            </div>
          </div>
          <div className="flex flex-col text-xs text-white/90 space-y-1 font-medium">
            {personalInfo.email && <span>📧 {personalInfo.email}</span>}
            {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.portfolio && <span>🔗 {personalInfo.portfolio}</span>}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Summary */}
        {summary && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              About Me
            </h2>
            <p className="text-gray-700 leading-normal">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.some(e => e.company || e.title) && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-3 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              Professional Experience
            </h2>
            {experience.filter(e => e.company || e.title).map((exp, i) => (
              <div key={i} className="mb-4 relative pl-4 border-l-2" style={{ borderColor: themeColor }}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-gray-900 font-bold text-base">{exp.title}</strong>
                  <span className="text-xs font-semibold text-gray-500">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? '–' : ''} {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="font-semibold text-xs mb-1.5" style={{ color: themeColor }}>
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

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-3 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              Specialties & Tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full font-semibold shadow-sm text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.some(p => p.name) && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-3 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              Creative Projects & Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-gray-900 font-bold">{proj.name}</strong>
                    {proj.link && <span className="text-[10px] text-gray-500">{proj.link}</span>}
                  </div>
                  {proj.description && <p className="text-gray-600 text-xs">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.some(e => e.institution || e.degree) && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-3 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
              Education
            </h2>
            {education.filter(e => e.institution || e.degree).map((edu, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <strong className="text-gray-900 font-bold">{edu.degree}</strong>
                  <span className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-gray-600 text-xs">{edu.institution}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
