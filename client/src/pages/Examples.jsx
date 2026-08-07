import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import TemplateThumbnail from '../components/TemplateThumbnail';
import ResumePreview from '../components/ResumePreview';
import { useAuth } from '../contexts/AuthContext';
import { createResume } from '../api/resumes';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import { Sparkles, ArrowRight, Eye, CheckCircle2, FileText, Layout, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Healthcare & Medical',
  'Education',
  'Finance & Accounting',
  'Sales & Marketing',
  'HR & Operations',
  'Hospitality & Trades',
  'Design & Creative',
  'Software & Tech',
  'AI & Data Science',
  'Students & Interns',
  'Executive'
];

export default function Examples() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewSample, setPreviewSample] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredSamples = selectedCategory === 'All'
    ? SAMPLE_RESUMES
    : SAMPLE_RESUMES.filter(s => s.category === selectedCategory);

  async function handleUseSample(sample) {
    if (!isAuthenticated) {
      toast('Please log in to edit this resume template.', { icon: '🔐' });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await createResume(sample.data);
      const newId = response.data.id;
      toast.success(`Loaded "${sample.role}" resume into Builder!`);
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
          <Sparkles className="w-3.5 h-3.5" /> Ready-Made Profession Resumes
        </div>
        <h1 className="text-4xl font-extrabold text-gray-100 tracking-tight sm:text-5xl mb-4">
          Resume <span className="gradient-text">Examples Gallery</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Browse real-world, high-scoring pre-filled resume examples tailored for top roles. Hover or click any resume example to inspect or start customizing it in the builder.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25 scale-105'
                : 'glass-card text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Resume Examples with Visual Document Thumbnails */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSamples.map((sample) => (
          <div
            key={sample.id}
            className="glass-card rounded-2xl p-4 flex flex-col justify-between hover:border-primary-500/50 
                       hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 group"
          >
            <div>
              {/* Visual Document Sheet Preview Container */}
              <div className="relative mb-4 group/thumb">
                <TemplateThumbnail resume={sample.data} scale={0.36} height={310} />

                {/* Hover Quick Action Buttons */}
                <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover/thumb:opacity-100 
                                transition-opacity duration-300 rounded-xl flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={() => setPreviewSample(sample)}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 shadow-lg"
                  >
                    <Eye className="w-4 h-4" /> Fullscreen
                  </button>
                  <button
                    onClick={() => handleUseSample(sample)}
                    disabled={loading}
                    className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-lg"
                  >
                    Edit Example <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div className="px-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-primary-300 transition-colors">
                    {sample.role}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-primary-300 border border-gray-700">
                    {sample.category}
                  </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                  {sample.data.summary}
                </p>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-3 mt-2 border-t border-gray-800">
              <button
                onClick={() => handleUseSample(sample)}
                disabled={loading}
                className="btn-primary text-xs py-2.5 w-full flex items-center justify-center gap-2"
              >
                Use {sample.role} Resume <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Preview Modal */}
      {previewSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/90">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/20 rounded-xl text-primary-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-100">{previewSample.role} Resume</h3>
                  <p className="text-xs text-gray-400">{previewSample.category} Example</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUseSample(previewSample)}
                  disabled={loading}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
                >
                  Edit This Example <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewSample(null)}
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto bg-gray-950/50 flex-1">
              <ResumePreview resume={previewSample.data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
