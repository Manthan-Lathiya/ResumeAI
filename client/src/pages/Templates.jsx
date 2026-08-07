import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES, COLOR_PRESETS } from '../templates/registry';
import TemplateThumbnail from '../components/TemplateThumbnail';
import ResumePreview from '../components/ResumePreview';
import { useAuth } from '../contexts/AuthContext';
import { createResume } from '../api/resumes';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import { Layout, ArrowRight, Eye, Check, X, Sparkles } from 'lucide-react';

const PREVIEW_DUMMY_RESUME = {
  title: 'Template Preview',
  personalInfo: {
    fullName: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahsmith',
    website: 'sarahsmith.dev',
  },
  summary: 'Results-driven professional with 6+ years of experience leading strategic projects, building scalable operations, and managing high-performing teams.',
  experience: [
    {
      company: 'TechGlobal Inc.',
      title: 'Operations & Product Lead',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: 'Present',
      current: true,
      bullets: [
        'Spearheaded cross-functional teams to deliver enterprise tools, increasing efficiency by 35%.',
        'Managed $2.4M product budget and optimized resource allocation across 4 squads.',
        'Pioneered automated reporting workflows reducing manual data entry by 15 hours weekly.'
      ]
    }
  ],
  education: [
    {
      institution: 'Stanford University',
      degree: 'B.S. in Management & Technology',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.88'
    }
  ],
  skills: ['Leadership', 'Strategic Planning', 'Product Management', 'Data Analysis', 'Process Optimization', 'Agile'],
  projects: [
    {
      name: 'Enterprise Automation Suite',
      description: 'Launched automated internal workflow engine serving 40k+ users.',
      technologies: ['React', 'Python', 'SQL'],
      link: 'techglobal.com/automation'
    }
  ]
};

export default function Templates() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState({});
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  const getColor = (template) => selectedColors[template.id] || template.defaultColor;

  const setColor = (templateId, hex) => {
    setSelectedColors(prev => ({ ...prev, [templateId]: hex }));
  };

  async function handleUseTemplate(template) {
    if (!isAuthenticated) {
      toast('Please log in to start building with this template.', { icon: '🔐' });
      navigate('/login');
      return;
    }

    setLoading(true);
    const activeColor = getColor(template);

    const newResumeData = {
      title: `${template.name} Resume`,
      personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '' },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      templateId: template.id,
      themeColor: activeColor,
      status: 'draft'
    };

    try {
      const response = await createResume(newResumeData);
      const newId = response.data.id;
      toast.success(`Created draft using ${template.name}!`);
      navigate(`/builder?id=${newId}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create resume from template.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold mb-4">
          <Layout className="w-3.5 h-3.5" /> Professional Resume Designs
        </div>
        <h1 className="text-4xl font-extrabold text-gray-100 tracking-tight sm:text-5xl mb-4">
          Resume <span className="gradient-text">Templates Catalog</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Select a visually stunning, ATS-friendly template layout below. Customize theme colors live or click any template to start building instantly.
        </p>
      </div>

      {/* Templates Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEMPLATES.map((tmpl) => {
          const activeColor = getColor(tmpl);
          const dummyData = { ...PREVIEW_DUMMY_RESUME, templateId: tmpl.id, themeColor: activeColor };

          return (
            <div
              key={tmpl.id}
              className="glass-card rounded-2xl p-4 flex flex-col justify-between hover:border-primary-500/50 
                         hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 group"
            >
              <div>
                {/* Visual Document Card Thumbnail */}
                <div className="relative mb-4 group/thumb">
                  <TemplateThumbnail resume={dummyData} scale={0.36} height={310} />
                  
                  {/* Hover Overlay Quick Button */}
                  <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover/thumb:opacity-100 
                                  transition-opacity duration-300 rounded-xl flex items-center justify-center gap-3 p-4">
                    <button
                      onClick={() => setPreviewTemplate({ ...tmpl, activeColor })}
                      className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 shadow-lg"
                    >
                      <Eye className="w-4 h-4" /> Fullscreen
                    </button>
                    <button
                      onClick={() => handleUseTemplate(tmpl)}
                      disabled={loading}
                      className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-lg"
                    >
                      Use Template <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Meta info below image */}
                <div className="px-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-primary-300 transition-colors">
                      {tmpl.name}
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-primary-300 border border-gray-700">
                      {tmpl.tag}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {tmpl.description}
                  </p>

                  {/* Color Palette Switcher */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
                    <span className="text-[11px] font-medium text-gray-400">Color Palette:</span>
                    <div className="flex items-center gap-1.5">
                      {COLOR_PRESETS.map((preset) => {
                        const isColorActive = activeColor.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.id}
                            onClick={() => setColor(tmpl.id, preset.hex)}
                            title={preset.name}
                            className={`w-5 h-5 rounded-full transition-all duration-200 flex items-center justify-center ${
                              isColorActive ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: preset.hex }}
                          >
                            {isColorActive && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="pt-4 mt-2">
                <button
                  onClick={() => handleUseTemplate(tmpl)}
                  disabled={loading}
                  className="btn-primary text-xs py-2.5 w-full flex items-center justify-center gap-2"
                >
                  Select {tmpl.name} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/90">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/20 rounded-xl text-primary-300">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-100">{previewTemplate.name}</h3>
                  <p className="text-xs text-gray-400">{previewTemplate.tag} Layout Preview</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUseTemplate(previewTemplate)}
                  disabled={loading}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
                >
                  Build With This Layout <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto bg-gray-950/50 flex-1">
              <ResumePreview
                resume={{
                  ...PREVIEW_DUMMY_RESUME,
                  templateId: previewTemplate.id,
                  themeColor: previewTemplate.activeColor
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
