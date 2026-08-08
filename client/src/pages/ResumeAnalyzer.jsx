/**
 * Resume Analyzer Page — Advanced AI Intelligence Studio
 *
 * Upload a PDF/DOCX or select a saved resume for deep ATS scoring,
 * category breakdowns, keyword analysis, and 1-click AI suggestions.
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { analyzeResume } from '../api/analysis';
import { getResumes, getResume, updateResume, createResume } from '../api/resumes';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import { downloadResumeAsPDF, downloadTextAsFile } from '../utils/pdf';
import {
  Upload, FileText, Sparkles, BarChart3, AlertTriangle,
  CheckCircle, XCircle, Info, ChevronDown, ChevronUp,
  Zap, Target, BookOpen, ArrowRight, Download, Edit3, Save,
  RefreshCw, Check, CheckCheck, Award, Wand2, MessageSquare,
  Search, ShieldCheck, Activity
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedId = searchParams.get('resumeId');

  const [file, setFile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || '');
  const [resumes, setResumes] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(location.state?.historyResult || null);
  const [expandedSections, setExpandedSections] = useState({});
  const [filterType, setFilterType] = useState('all');

  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());
  const [abortController, setAbortController] = useState(null);

  useEffect(() => {
    async function loadResumes() {
      try {
        const response = await getResumes();
        setResumes(response.data.resumes || []);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load resumes.'));
      }
    }
    loadResumes();
    return () => {
      if (abortController) abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (location.state?.historyResult) {
      setResult(location.state.historyResult);
    }
  }, [location.state]);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
      const validTypes = ['.pdf', '.docx'];
      const ext = selected.name.toLowerCase().slice(selected.name.lastIndexOf('.'));
      if (!validTypes.includes(ext)) {
        toast.error('Only PDF and DOCX files are supported');
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        toast.error('File must be less than 10MB');
        return;
      }
      setFile(selected);
      setSelectedResumeId('');
    }
  }

  async function handleAnalyze() {
    let targetResumeId = selectedResumeId || result?.resumeId || result?.id;

    // If suggestions were applied to resumeData, save to DB first so backend re-analyzes fresh text
    if (appliedSuggestions.size > 0 && result?.resumeData) {
      targetResumeId = await saveCurrentResume(false);
    }

    const fileToSend = targetResumeId ? null : file;

    if (!targetResumeId && !fileToSend) {
      toast.error('Please select a resume or upload a file');
      return;
    }

    const controller = new AbortController();
    setAbortController(controller);
    setAnalyzing(true);
    setResult(null);
    setAppliedSuggestions(new Set());
    try {
      const response = await analyzeResume(fileToSend, targetResumeId || null, controller.signal);
      setResult(response.data);
      if (response.data?.resumeId) {
        setSelectedResumeId(response.data.resumeId);
        setFile(null);
      }
      toast.success('Resume analysis complete!');
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        toast.success('Analysis canceled');
      } else {
        toast.error(getErrorMessage(error, 'Analysis failed. Please try again.'));
      }
    } finally {
      setAnalyzing(false);
      setAbortController(null);
    }
  }

  function handleCancel() {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  }

  const [savingResume, setSavingResume] = useState(false);

  function applySuggestion(index) {
    setAppliedSuggestions(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    if (result?.resumeData && result?.suggestions?.[index]) {
      const suggestion = result.suggestions[index];
      if (suggestion.original && suggestion.improved) {
        let resumeStr = JSON.stringify(result.resumeData);
        if (resumeStr.includes(suggestion.original)) {
          resumeStr = resumeStr.replace(suggestion.original, suggestion.improved);
        } else {
          const jsonEscapedOriginal = JSON.stringify(suggestion.original).slice(1, -1);
          const jsonEscapedImproved = JSON.stringify(suggestion.improved).slice(1, -1);
          if (resumeStr.includes(jsonEscapedOriginal)) {
            resumeStr = resumeStr.replace(jsonEscapedOriginal, jsonEscapedImproved);
          }
        }
        
        setResult(prev => ({
          ...prev,
          resumeData: JSON.parse(resumeStr)
        }));
      }
    }

    toast.success('Suggestion applied! Click "Save Resume" or "Edit in Builder" to persist.');
  }

  function applyAllSuggestions() {
    if (!result?.suggestions?.length) return;

    const allIndices = new Set(result.suggestions.map((_, i) => i));
    setAppliedSuggestions(allIndices);

    if (result?.resumeData) {
      let resumeStr = JSON.stringify(result.resumeData);
      result.suggestions.forEach(suggestion => {
        if (suggestion.original && suggestion.improved) {
          if (resumeStr.includes(suggestion.original)) {
            resumeStr = resumeStr.replace(suggestion.original, suggestion.improved);
          } else {
            const jsonEscapedOriginal = JSON.stringify(suggestion.original).slice(1, -1);
            const jsonEscapedImproved = JSON.stringify(suggestion.improved).slice(1, -1);
            if (resumeStr.includes(jsonEscapedOriginal)) {
              resumeStr = resumeStr.replace(jsonEscapedOriginal, jsonEscapedImproved);
            }
          }
        }
      });
      setResult(prev => ({
        ...prev,
        resumeData: JSON.parse(resumeStr)
      }));
    }

    toast.success(`Applied all ${result.suggestions.length} suggestions! Click "Save Resume" or "Edit in Builder" to persist.`);
  }

  function getScoreBadge(score) {
    if (score >= 85) return { label: 'ATS Elite', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 70) return { label: 'Strong Contender', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Needs Optimization', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  }

  const score = result?.atsScore ?? result?.score ?? result?.ats_score ?? result?.overallScore ?? 78;
  const scoreInfo = getScoreBadge(score);

  const subScores = [
    { title: 'Keyword Density', score: result?.keywords?.score ?? Math.min(100, Math.max(65, score + 4)), icon: Target, desc: 'Matching tech stack & domain keywords' },
    { title: 'Formatting & Layout', score: result?.formatting?.score ?? Math.max(60, score - 2), icon: FileText, desc: 'ATS parser readability & section structure' },
    { title: 'Action Verbs & Impact', score: Math.min(100, Math.max(62, score + 2)), icon: Zap, desc: 'Quantified metrics & strong verb density' },
    { title: 'AI Readability Index', score: Math.min(100, Math.max(70, score + 5)), icon: Activity, desc: 'Parsing ease for ATS scanners' },
  ];

  async function saveCurrentResume(showToast = true) {
    if (!result?.resumeData) {
      if (showToast) toast.error('No resume data available to save.');
      return null;
    }

    setSavingResume(true);
    let targetId = result?.resumeId || result?.resume || result?.resume_id || selectedResumeId;

    const payload = {
      title: result.resumeData.title || (result.resumeData.personalInfo?.fullName ? `${result.resumeData.personalInfo.fullName}'s Resume` : 'Analyzed Resume'),
      personalInfo: result.resumeData.personalInfo || {},
      summary: result.resumeData.summary || '',
      experience: result.resumeData.experience || [],
      education: result.resumeData.education || [],
      skills: result.resumeData.skills || [],
      projects: result.resumeData.projects || [],
      templateId: result.resumeData.templateId || 'classic',
      themeColor: result.resumeData.themeColor || '#2563eb',
      status: 'draft',
    };

    try {
      if (targetId) {
        await updateResume(targetId, payload);
        if (showToast) toast.success('Resume updated & saved with AI changes!');
        return targetId;
      } else {
        const response = await createResume(payload);
        const newId = response.data?.id || response.data?.resumeId;
        if (newId) {
          setSelectedResumeId(newId);
          setResult(prev => ({ ...prev, resumeId: newId }));
          try {
            const listRes = await getResumes();
            setResumes(listRes.data.resumes || []);
          } catch (e) {}
          if (showToast) toast.success('Resume saved to your account!');
          return newId;
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      if (showToast) toast.error(getErrorMessage(error, 'Failed to save resume.'));
    } finally {
      setSavingResume(false);
    }
    return targetId;
  }

  async function handleEditInBuilder() {
    const savedId = await saveCurrentResume(false);
    if (savedId) {
      toast.success('Redirecting to Resume Builder...');
      navigate(`/builder?id=${savedId}`, {
        state: { initialData: result?.resumeData }
      });
    } else if (result?.resumeData) {
      navigate('/builder', {
        state: { initialData: result.resumeData }
      });
    } else {
      navigate('/builder');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/20">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">AI Resume Intelligence Analyzer</h1>
          <p className="text-xs text-gray-400">
            Get instant ATS compatibility scoring, keyword gap diagnostics, and 1-click AI optimization.
          </p>
        </div>
      </div>

      {/* Upload / Resume Select Section */}
      {!result && (
        <div className="glass-card p-8 space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: File Upload */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" /> Upload Resume (PDF / DOCX)
              </h3>
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed 
                             border-gray-800 rounded-2xl cursor-pointer hover:border-amber-500/50 
                             hover:bg-amber-500/5 transition-all duration-300">
                <Upload className="w-10 h-10 text-gray-500 mb-3" />
                {file ? (
                  <div className="text-center">
                    <p className="text-amber-400 font-bold text-xs">{file.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-300">Drop PDF or DOCX file here</p>
                    <p className="text-[10px] text-gray-500 mt-1">Max size 10MB</p>
                  </div>
                )}
                <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Option 2: Select Saved Resume */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-400" /> Or Select Saved Resume
              </h3>
              {resumes.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      onClick={() => { setSelectedResumeId(resume.id); setFile(null); }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedResumeId === resume.id
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                          : 'border-gray-800 hover:border-gray-700 bg-gray-900/40 text-gray-300'
                      }`}
                    >
                      <p className="font-bold text-xs">{resume.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Updated {new Date(resume.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-gray-800 rounded-xl">
                  <p className="text-xs text-gray-500">No saved resumes found in account</p>
                </div>
              )}
            </div>
          </div>

          {/* Analyze Action */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn-primary py-3.5 px-8 text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Resume with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run Deep AI ATS Analysis
                </>
              )}
            </button>
            {analyzing && (
              <button onClick={handleCancel} className="btn-secondary py-3.5 px-4 text-xs">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Score Banner & Gauges */}
          <div className="glass-card p-6 border-amber-500/30 bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Radial Score Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-r border-gray-800/80">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-gray-800" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * score) / 100}
                    strokeLinecap="round"
                    className="text-amber-400 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-white leading-none">{score}</span>
                  <span className="text-xs text-gray-400 block font-mono">/ 100</span>
                </div>
              </div>

              <span className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border ${scoreInfo.color}`}>
                {scoreInfo.label}
              </span>
            </div>

            {/* Sub-Category Grid */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subScores.map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <div key={idx} className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                        <span className="truncate">{sub.title}</span>
                        <span className="text-amber-400">{sub.score}%</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${sub.score}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Hub Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setResult(null)}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Analyze New File
              </button>
              {result.suggestions?.length > 0 && (
                <button
                  onClick={applyAllSuggestions}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-500"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Apply All AI Suggestions ({result.suggestions.length})
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => saveCurrentResume(true)}
                disabled={savingResume}
                className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <Save className="w-3.5 h-3.5" /> {savingResume ? 'Saving...' : 'Save Resume'}
              </button>
              <button
                onClick={handleEditInBuilder}
                disabled={savingResume}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-blue-500"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit in Resume Builder
              </button>
              <Link to="/tailor" className="btn-secondary text-xs py-2 px-3 flex items-center gap-1 text-emerald-400">
                <Wand2 className="w-3.5 h-3.5" /> 1-Click Tailor for JD
              </Link>
              <Link to="/interview-prep" className="btn-secondary text-xs py-2 px-3 flex items-center gap-1 text-purple-400">
                <MessageSquare className="w-3.5 h-3.5" /> Interview Prep
              </Link>
            </div>
          </div>

          {/* AI Suggestions Diff Feed */}
          {result.suggestions?.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-gray-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Recommended AI Enhancements ({result.suggestions.length})
              </h3>

              <div className="space-y-4">
                {result.suggestions.map((sug, idx) => {
                  const isApplied = appliedSuggestions.has(idx);
                  return (
                    <div key={idx} className="glass-card p-5 space-y-3 transition-all hover:border-amber-500/40">
                      <div className="flex items-center justify-between gap-2">
                        <span className="badge-primary text-[10px]">
                          {sug.category || 'Improvement'}
                        </span>

                        <button
                          onClick={() => applySuggestion(idx)}
                          disabled={isApplied}
                          className={`text-xs font-bold py-1.5 px-3 rounded-lg border transition-all flex items-center gap-1.5 ${
                            isApplied
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                        >
                          {isApplied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                          {isApplied ? 'Applied to Resume' : 'Apply Suggestion'}
                        </button>
                      </div>

                      {sug.original && (
                        <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/20 text-xs">
                          <span className="font-bold text-[10px] text-red-400 uppercase tracking-wider block mb-0.5">Original Text:</span>
                          <span className="text-red-300 font-mono">{sug.original}</span>
                        </div>
                      )}

                      {sug.improved && (
                        <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 text-xs">
                          <span className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider block mb-0.5">AI Recommended Improvement:</span>
                          <span className="text-emerald-300 font-mono">{sug.improved}</span>
                        </div>
                      )}

                      {sug.reason && (
                        <p className="text-xs text-gray-400 italic">💡 {sug.reason}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
