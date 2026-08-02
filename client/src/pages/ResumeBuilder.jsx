/**
 * Resume Builder Page
 *
 * A multi-section form for creating and editing resumes.
 * Features:
 * - Tab-based navigation between sections
 * - Live preview on the right side
 * - Auto-save as draft
 * - Add/remove dynamic items (experience, education, etc.)
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createResume, updateResume, getResume } from '../api/resumes';
import toast from 'react-hot-toast';
import {
  User, Briefcase, GraduationCap, Code, FolderOpen, FileText,
  Plus, Trash2, Save, Eye, EyeOff, ChevronRight, CheckCircle
} from 'lucide-react';

// ─── Section tabs for the form ───
const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
];

// ─── Empty templates for adding new items ───
const EMPTY_EXPERIENCE = {
  company: '', title: '', location: '', startDate: '', endDate: '',
  current: false, bullets: ['']
};

const EMPTY_EDUCATION = {
  institution: '', degree: '', startDate: '', endDate: '', gpa: ''
};

const EMPTY_PROJECT = {
  name: '', description: '', technologies: [], link: ''
};

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');  // If editing existing resume

  // Form state
  const [title, setTitle] = useState('Untitled Resume');
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState(editId);

  // Resume data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '', email: '', phone: '', location: '', linkedin: '', website: ''
  });
  const [summary, setSummary] = useState('');
  const [experience, setExperience] = useState([{ ...EMPTY_EXPERIENCE }]);
  const [education, setEducation] = useState([{ ...EMPTY_EDUCATION }]);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([{ ...EMPTY_PROJECT }]);

  // Load existing resume if editing
  useEffect(() => {
    if (editId) {
      loadResume(editId);
    }
  }, [editId]);

  async function loadResume(id) {
    try {
      const response = await getResume(id);
      const data = response.data;
      setTitle(data.title || 'Untitled Resume');
      setPersonalInfo(data.personal_info || {});
      setSummary(data.summary || '');
      setExperience(data.experience?.length ? data.experience : [{ ...EMPTY_EXPERIENCE }]);
      setEducation(data.education?.length ? data.education : [{ ...EMPTY_EDUCATION }]);
      setSkills(data.skills || []);
      setProjects(data.projects?.length ? data.projects : [{ ...EMPTY_PROJECT }]);
    } catch (error) {
      toast.error('Failed to load resume');
    }
  }

  // Save resume
  async function handleSave(status = 'draft') {
    setSaving(true);
    const data = {
      title,
      personalInfo,
      summary,
      experience: experience.filter(e => e.company || e.title),
      education: education.filter(e => e.institution || e.degree),
      skills,
      projects: projects.filter(p => p.name),
      status,
    };

    try {
      if (resumeId) {
        await updateResume(resumeId, data);
        toast.success('Resume saved!');
      } else {
        const response = await createResume(data);
        setResumeId(response.data.id);
        toast.success('Resume created!');
      }
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  }

  // ─── Dynamic list helpers ───
  function updateExperience(index, field, value) {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  }

  function updateBullet(expIndex, bulletIndex, value) {
    const updated = [...experience];
    updated[expIndex].bullets[bulletIndex] = value;
    setExperience(updated);
  }

  function addBullet(expIndex) {
    const updated = [...experience];
    updated[expIndex].bullets.push('');
    setExperience(updated);
  }

  function removeBullet(expIndex, bulletIndex) {
    const updated = [...experience];
    updated[expIndex].bullets.splice(bulletIndex, 1);
    setExperience(updated);
  }

  function updateEducation(index, field, value) {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  }

  function updateProject(index, field, value) {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  }

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  }

  function handleSkillKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  }

  // ─── Render the active section form ───
  function renderSection() {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Personal Information</h3>
            {[
              { key: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
              { key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
              { key: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567' },
              { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
              { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/johndoe' },
              { key: 'website', label: 'Website', placeholder: 'johndoe.dev' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="input-label">{label}</label>
                <input
                  type={type || 'text'}
                  value={personalInfo[key] || ''}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        );

      case 'summary':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Professional Summary</h3>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A brief overview of your professional background, key skills, and career goals..."
              className="input-field min-h-[200px] resize-y"
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Keep it 2-4 sentences. Highlight your years of experience, core skills, and what value you bring.
            </p>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-100">Work Experience</h3>
              <button
                onClick={() => setExperience([...experience, { ...EMPTY_EXPERIENCE }])}
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Position
              </button>
            </div>

            {experience.map((exp, i) => (
              <div key={i} className="p-4 bg-gray-800/30 rounded-xl border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Position {i + 1}</span>
                  {experience.length > 1 && (
                    <button
                      onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="input-label text-xs">Job Title</label>
                    <input value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)}
                           placeholder="Software Engineer" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Company</label>
                    <input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)}
                           placeholder="Google" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Location</label>
                    <input value={exp.location} onChange={(e) => updateExperience(i, 'location', e.target.value)}
                           placeholder="Mountain View, CA" className="input-field text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="input-label text-xs">Start Date</label>
                      <input type="month" value={exp.startDate}
                             onChange={(e) => updateExperience(i, 'startDate', e.target.value)}
                             className="input-field text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="input-label text-xs">End Date</label>
                      <input type="month" value={exp.endDate} disabled={exp.current}
                             onChange={(e) => updateExperience(i, 'endDate', e.target.value)}
                             className="input-field text-sm disabled:opacity-50" />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={exp.current}
                         onChange={(e) => updateExperience(i, 'current', e.target.checked)}
                         className="w-4 h-4 rounded border-gray-600 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-gray-400">Currently working here</span>
                </label>

                {/* Bullet points */}
                <div className="space-y-2">
                  <label className="input-label text-xs">Key Achievements / Responsibilities</label>
                  {exp.bullets.map((bullet, bi) => (
                    <div key={bi} className="flex gap-2">
                      <span className="text-gray-500 mt-3">•</span>
                      <input
                        value={bullet}
                        onChange={(e) => updateBullet(i, bi, e.target.value)}
                        placeholder="Led migration to microservices, reducing latency by 40%"
                        className="input-field text-sm flex-1"
                      />
                      {exp.bullets.length > 1 && (
                        <button onClick={() => removeBullet(i, bi)} className="text-red-400 hover:text-red-300 mt-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addBullet(i)}
                          className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add bullet
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-100">Education</h3>
              <button
                onClick={() => setEducation([...education, { ...EMPTY_EDUCATION }])}
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>

            {education.map((edu, i) => (
              <div key={i} className="p-4 bg-gray-800/30 rounded-xl border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Education {i + 1}</span>
                  {education.length > 1 && (
                    <button onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="input-label text-xs">Institution</label>
                    <input value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)}
                           placeholder="Stanford University" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Degree</label>
                    <input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                           placeholder="B.S. Computer Science" className="input-field text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="input-label text-xs">Start Date</label>
                      <input type="month" value={edu.startDate}
                             onChange={(e) => updateEducation(i, 'startDate', e.target.value)}
                             className="input-field text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="input-label text-xs">End Date</label>
                      <input type="month" value={edu.endDate}
                             onChange={(e) => updateEducation(i, 'endDate', e.target.value)}
                             className="input-field text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="input-label text-xs">GPA (optional)</label>
                    <input value={edu.gpa} onChange={(e) => updateEducation(i, 'gpa', e.target.value)}
                           placeholder="3.8" className="input-field text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Skills</h3>
            <div className="flex gap-2 mb-4">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className="input-field flex-1"
              />
              <button onClick={addSkill} className="btn-primary px-4">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/15 
                                       text-primary-300 rounded-lg text-sm">
                  {skill}
                  <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                          className="hover:text-red-400 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-gray-500 text-sm">No skills added yet. Start typing above!</p>
              )}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-100">Projects</h3>
              <button onClick={() => setProjects([...projects, { ...EMPTY_PROJECT }])}
                      className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            {projects.map((proj, i) => (
              <div key={i} className="p-4 bg-gray-800/30 rounded-xl border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Project {i + 1}</span>
                  {projects.length > 1 && (
                    <button onClick={() => setProjects(projects.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="input-label text-xs">Project Name</label>
                    <input value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)}
                           placeholder="My Awesome Project" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Description</label>
                    <textarea value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)}
                              placeholder="What does this project do?" className="input-field text-sm" rows={3} />
                  </div>
                  <div>
                    <label className="input-label text-xs">Technologies (comma-separated)</label>
                    <input
                      value={(proj.technologies || []).join(', ')}
                      onChange={(e) => updateProject(i, 'technologies',
                        e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      placeholder="React, Node.js, PostgreSQL"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="input-label text-xs">Link (optional)</label>
                    <input value={proj.link} onChange={(e) => updateProject(i, 'link', e.target.value)}
                           placeholder="github.com/username/project" className="input-field text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  // ─── Live Preview ───
  function renderPreview() {
    return (
      <div className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl max-h-[calc(100vh-200px)] 
                    overflow-y-auto text-sm leading-relaxed">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-200 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2 text-gray-600 text-xs flex-wrap">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
          </div>
          <div className="flex items-center justify-center gap-3 mt-1 text-gray-500 text-xs flex-wrap">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.some(e => e.company || e.title) && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Experience
            </h2>
            {experience.filter(e => e.company || e.title).map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <strong className="text-gray-900">{exp.title || 'Job Title'}</strong>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-gray-600 text-xs">
                  {exp.company}{exp.location && ` • ${exp.location}`}
                </div>
                {exp.bullets?.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside mt-1 text-gray-700 space-y-0.5">
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
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Education
            </h2>
            {education.filter(e => e.institution || e.degree).map((edu, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <strong className="text-gray-900">{edu.degree || 'Degree'}</strong>
                  <span className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-gray-600 text-xs">
                  {edu.institution}{edu.gpa && ` • GPA: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Skills
            </h2>
            <p className="text-gray-700">{skills.join(' • ')}</p>
          </div>
        )}

        {/* Projects */}
        {projects.some(p => p.name) && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Projects
            </h2>
            {projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-2">
                <strong className="text-gray-900">{proj.name}</strong>
                {proj.link && <span className="text-xs text-blue-600 ml-2">{proj.link}</span>}
                {proj.description && <p className="text-gray-700 text-xs mt-0.5">{proj.description}</p>}
                {proj.technologies?.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">Tech: {proj.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent text-gray-100 border-b border-transparent 
                     hover:border-gray-700 focus:border-primary-500 focus:outline-none transition-colors px-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2 md:hidden"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Preview
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave('complete')}
            disabled={saving}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Save & Complete
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: Form */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          {/* Section tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                  transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-primary-500/20 text-primary-300 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>

          {/* Active section form */}
          <div className="glass-card p-6 animate-fade-in" key={activeSection}>
            {renderSection()}
          </div>
        </div>

        {/* Right: Live Preview */}
        {showPreview && (
          <div className="hidden md:block w-1/2 animate-slide-in">
            <div className="sticky top-24">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Live Preview
              </h3>
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
