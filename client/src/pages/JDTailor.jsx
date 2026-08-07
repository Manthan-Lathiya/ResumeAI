import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getResumes, createResume } from '../api/resumes';
import { tailorResume } from '../api/tailor';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import {
  Wand2, Sparkles, ArrowRight, CheckCircle2, FileText,
  TrendingUp, RefreshCw, Save, ArrowRightCircle, Award, Check
} from 'lucide-react';

export default function JDTailor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.selectedResumeId || '');
  const [targetTitle, setTargetTitle] = useState('');
  const [jobDescription, setJobDescription] = useState(location.state?.jobDescription || '');

  const [loading, setLoading] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    if (location.state?.jobDescription) {
      setJobDescription(location.state.jobDescription);
    }
    if (location.state?.selectedResumeId) {
      setSelectedResumeId(location.state.selectedResumeId);
    }
    if (location.state?.targetTitle) {
      setTargetTitle(location.state.targetTitle);
    }
  }, [location.state]);

  async function loadResumes() {
    try {
      const response = await getResumes();
      const list = response.data.resumes || response.data || [];
      setResumes(list);
      if (list.length > 0 && !location.state?.selectedResumeId) {
        setSelectedResumeId(list[0].id);
      }
    } catch (error) {
      toast.error('Failed to load saved resumes.');
    }
  }

  async function handleTailor(e) {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error('Please paste the target Job Description.');
      return;
    }
    if (!selectedResumeId) {
      toast.error('Please select a source resume to tailor.');
      return;
    }

    setLoading(true);
    setTailorResult(null);

    try {
      const response = await tailorResume({
        resumeId: selectedResumeId,
        jobDescription,
        targetTitle,
      });

      setTailorResult(response.data);
      toast.success('Resume successfully tailored!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to tailor resume. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveTailored() {
    if (!tailorResult?.tailoredResume) return;

    setSaving(true);
    try {
      const response = await createResume(tailorResult.tailoredResume);
      const newResumeId = response.data.id || response.data.resumeId;
      toast.success('Tailored Resume saved! Opening builder...');
      navigate(`/builder?id=${newResumeId}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save tailored resume.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20">
          <Wand2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">1-Click AI Job Description Tailor</h1>
          <p className="text-xs text-gray-400">
            Automatically align bullet points, insert required JD keywords, and boost your ATS match score in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-bold text-sm text-gray-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Target Job Details
            </h3>

            <form onSubmit={handleTailor} className="space-y-4">
              {/* Source Resume */}
              <div>
                <label className="input-label text-xs">Select Source Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="input-field text-sm"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title || 'Untitled Resume'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Role Title */}
              <div>
                <label className="input-label text-xs">Target Position Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Target Job Description */}
              <div>
                <label className="input-label text-xs">Target Job Description (Required)</label>
                <textarea
                  rows={7}
                  placeholder="Paste the full job description requirements and skills..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Auto-Tailoring Resume with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> Tailor Resume Now ✨
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Comparison View */}
        <div className="lg:col-span-7 space-y-6">
          {!tailorResult && !loading && (
            <div className="glass-card p-12 text-center text-gray-400 space-y-4 border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Wand2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-200 text-sm">Ready to Tailor Your Resume</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Select your source resume and paste the target job description on the left to generate an ATS-optimized version.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="glass-card p-12 text-center text-gray-400 space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs font-semibold text-gray-300">
                Rewriting bullet points, optimizing keyword density, and boosting ATS match score...
              </div>
            </div>
          )}

          {tailorResult && (
            <div className="space-y-6 animate-fade-in">
              {/* ATS Score Boost Banner */}
              <div className="glass-card p-6 border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-gray-900 to-teal-950/30 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center px-4 py-2 bg-gray-900/80 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Original</span>
                    <span className="text-xl font-bold text-gray-400">{tailorResult.originalScore || 64}%</span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-emerald-400" />

                  <div className="text-center px-4 py-2 bg-emerald-500/20 rounded-xl border border-emerald-500/40">
                    <span className="text-[10px] text-emerald-400 uppercase font-mono block">Tailored Match</span>
                    <span className="text-2xl font-black text-emerald-400">{tailorResult.tailoredScore || 94}%</span>
                  </div>
                </div>

                <button
                  onClick={handleSaveTailored}
                  disabled={saving}
                  className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  {saving ? 'Saving...' : 'Save as New Resume & Edit →'}
                </button>
              </div>

              {/* Improvements List */}
              {tailorResult.keyImprovementsMade && (
                <div className="glass-card p-5 space-y-3">
                  <h4 className="font-bold text-xs text-gray-200 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" /> Key Improvements Made:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {tailorResult.keyImprovementsMade.map((imp, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailored Summary Preview */}
              <div className="glass-card p-5 space-y-2">
                <h4 className="font-bold text-xs text-gray-200 uppercase tracking-wider">
                  Optimized Professional Summary:
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  {tailorResult.tailoredResume?.summary}
                </p>
              </div>

              {/* Experience Highlights Preview */}
              <div className="glass-card p-5 space-y-4">
                <h4 className="font-bold text-xs text-gray-200 uppercase tracking-wider">
                  Optimized Experience Bullets Preview:
                </h4>
                <div className="space-y-3">
                  {tailorResult.tailoredResume?.experience?.map((exp, i) => (
                    <div key={i} className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                        <span>{exp.title} — {exp.company}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                        {exp.bullets?.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
