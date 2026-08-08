/**
 * Job Description Comparison Page — AI Match Radar
 *
 * Compare a saved resume OR uploaded file against a target job description.
 * Returns match score, matched & missing keyword pill matrix, 1-click apply, edit in builder, and downloads.
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getResumes, updateResume, createResume } from '../api/resumes';
import { compareJobDescription } from '../api/analysis';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import { downloadResumeAsPDF, downloadTextAsFile } from '../utils/pdf';
import {
  GitCompare, Sparkles, CheckCircle, XCircle, ArrowRight,
  FileText, Target, Zap, Upload, Download, Edit3, Wand2,
  MessageSquare, Check, X, ShieldCheck, Activity, Award, RefreshCw
} from 'lucide-react';

export default function JobComparison() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState(location.state?.historyResult || null);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());
  const [abortController, setAbortController] = useState(null);

  useEffect(() => {
    async function loadResumes() {
      try {
        const response = await getResumes();
        const list = response.data.resumes || response.data || [];
        setResumes(list);
        if (list.length > 0 && !location.state?.historyResult) setSelectedResumeId(list[0].id);
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
      if (location.state.historyResult.jobDescription) {
        setJobDescription(location.state.historyResult.jobDescription);
      }
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

  async function handleCompare() {
    let targetResumeId = selectedResumeId || result?.resumeId || result?.id;

    if (!targetResumeId && !file) {
      toast.error('Please select a resume or upload a file');
      return;
    }
    if (jobDescription.length < 50) {
      toast.error('Job description must be at least 50 characters');
      return;
    }

    // Auto-save applied suggestions to database before re-comparing
    if (appliedSuggestions.size > 0 && result?.resumeData) {
      const payload = {
        title: result.resumeData.title || 'Tailored Resume',
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
        if (targetResumeId) {
          await updateResume(targetResumeId, payload);
        } else {
          const createRes = await createResume(payload);
          targetResumeId = createRes.data?.id || createRes.data?.resumeId;
          if (targetResumeId) setSelectedResumeId(targetResumeId);
        }
      } catch (e) {
        console.error('Failed to auto-save resume before comparison:', e);
      }
    }

    const fileToSend = targetResumeId ? null : file;

    const controller = new AbortController();
    setAbortController(controller);
    setComparing(true);
    setResult(null);
    setAppliedSuggestions(new Set());

    try {
      const response = await compareJobDescription(targetResumeId || null, jobDescription, fileToSend, controller.signal);
      setResult(response.data);
      if (response.data?.resumeId) {
        setSelectedResumeId(response.data.resumeId);
        setFile(null);
      }
      toast.success('Comparison complete!');
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        toast.success('Comparison canceled');
      } else {
        toast.error(getErrorMessage(error, 'Comparison failed. Please try again.'));
      }
    } finally {
      setComparing(false);
      setAbortController(null);
    }
  }

  function applySuggestion(index) {
    setAppliedSuggestions(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    if (result?.resumeData && result?.suggestions?.[index]) {
      const suggestion = result.suggestions[index];
      if (typeof suggestion === 'object' && suggestion !== null) {
        let resumeStr = JSON.stringify(result.resumeData);
        if (suggestion.original && suggestion.improved) {
          resumeStr = resumeStr.replace(suggestion.original, suggestion.improved);
        } else if (suggestion.skill && Array.isArray(result.resumeData.skills)) {
          if (!result.resumeData.skills.includes(suggestion.skill)) {
            const updatedSkills = [...result.resumeData.skills, suggestion.skill];
            setResult(prev => ({
              ...prev,
              resumeData: { ...prev.resumeData, skills: updatedSkills }
            }));
            toast.success(`Added skill "${suggestion.skill}" to resume!`);
            return;
          }
        }
        setResult(prev => ({
          ...prev,
          resumeData: JSON.parse(resumeStr)
        }));
      }
    }

    toast.success('Suggestion applied!');
  }

  function applyAllSuggestions() {
    if (!result?.suggestions?.length) return;

    const allIndices = new Set(result.suggestions.map((_, i) => i));
    setAppliedSuggestions(allIndices);

    if (result?.resumeData) {
      let updatedData = { ...result.resumeData };
      let resumeStr = JSON.stringify(updatedData);

      result.suggestions.forEach(sug => {
        if (typeof sug === 'object' && sug !== null) {
          if (sug.original && sug.improved) {
            resumeStr = resumeStr.replace(sug.original, sug.improved);
          }
          if (sug.skill && Array.isArray(updatedData.skills)) {
            if (!updatedData.skills.includes(sug.skill)) {
              updatedData.skills.push(sug.skill);
            }
          }
        }
      });

      try {
        const parsed = JSON.parse(resumeStr);
        parsed.skills = updatedData.skills;
        setResult(prev => ({ ...prev, resumeData: parsed }));
      } catch (e) {
        setResult(prev => ({ ...prev, resumeData: updatedData }));
      }
    }

    toast.success(`Applied all ${result.suggestions.length} match suggestions!`);
  }

  async function handleEditInBuilder() {
    let targetId = result?.resumeId || result?.resume || result?.resume_id || selectedResumeId;

    if (result?.resumeData) {
      const payload = {
        title: result.resumeData.title || (result.resumeData.personalInfo?.fullName ? `${result.resumeData.personalInfo.fullName}'s Resume` : 'Tailored Resume'),
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
        } else {
          const createRes = await createResume(payload);
          targetId = createRes.data?.id || createRes.data?.resumeId;
        }
      } catch (e) {
        console.log('Failed to save resume before redirecting:', e);
      }
    }

    if (targetId) {
      navigate(`/builder?id=${targetId}`, {
        state: { initialData: result?.resumeData }
      });
    } else {
      navigate('/builder', {
        state: { initialData: result?.resumeData }
      });
    }
  }

  function handleDownloadJD() {
    if (!jobDescription) return;
    downloadTextAsFile(jobDescription, 'Target_Job_Description.txt');
    toast.success('Job Description downloaded!');
  }

  function handleDownloadResume() {
    if (result?.resumeData) {
      downloadResumeAsPDF(result.resumeData);
    } else if (result?.resumeText) {
      downloadTextAsFile(result.resumeText, 'Resume_Analysis.txt');
    } else {
      toast.error('No resume content available to download.');
    }
  }

  const matchScore = result?.matchScore ?? result?.score ?? result?.match_score ?? result?.overallScore ?? 75;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20">
          <GitCompare className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">AI Job Description Match Radar</h1>
          <p className="text-xs text-gray-400">
            Compare your resume against any job description to discover keyword gaps and boost interview callbacks.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Source Selection */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Select Source Resume
            </h3>

            <div>
              <label className="input-label text-xs">Saved Resumes</label>
              <select
                value={selectedResumeId}
                onChange={(e) => { setSelectedResumeId(e.target.value); setFile(null); }}
                className="input-field text-sm"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title || 'Untitled Resume'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label text-xs">Or Upload PDF / DOCX</label>
              <label className="flex items-center justify-center p-4 border border-dashed border-gray-800 rounded-xl cursor-pointer hover:border-emerald-500/50 bg-gray-950/40">
                <Upload className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-xs text-gray-300 font-semibold truncate">
                  {file ? file.name : 'Upload PDF/DOCX file'}
                </span>
                <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-400" /> Target Job Description
            </h3>
            <textarea
              rows={6}
              placeholder="Paste the full job description requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="input-field text-xs"
            />
          </div>
        </div>

        {/* Compare Trigger */}
        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            onClick={handleCompare}
            disabled={comparing}
            className="btn-primary py-3.5 px-8 text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400"
          >
            {comparing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Comparing Resume against Job Posting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Run AI Match Comparison
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Match Score Radar Banner */}
          <div className="glass-card p-6 border-emerald-500/30 bg-gradient-to-br from-gray-900 via-gray-900 to-teal-950/30 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-gray-800" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * matchScore) / 100}
                    strokeLinecap="round"
                    className="text-emerald-400 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">{matchScore}%</span>
                  <span className="text-[10px] text-emerald-400 font-mono block">MATCH</span>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-gray-100">
                  {matchScore >= 80 ? '🎯 Excellent Role Alignment' : matchScore >= 60 ? '⚡ Good Match with Keywords to Add' : '⚠️ Low Keyword Overlap'}
                </h3>
                <p className="text-xs text-gray-400 max-w-md mt-1">
                  {result.overallAssessment || 'Review matched and missing keywords below to optimize your application.'}
                </p>
              </div>
            </div>

            {/* Direct Action Hub */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleEditInBuilder}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-blue-500"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit in Resume Builder
              </button>
              <button
                onClick={() => navigate('/tailor', { state: { selectedResumeId, jobDescription } })}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-teal-500"
              >
                <Wand2 className="w-3.5 h-3.5" /> 1-Click Auto-Tailor ✨
              </button>
              <button
                onClick={() => navigate('/interview-prep', { state: { selectedResumeId, jobDescription } })}
                className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-1.5 text-purple-300"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Interview Prep
              </button>
            </div>
          </div>

          {/* Keyword Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5 space-y-3 border-emerald-500/20">
              <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Matched Keywords ({result.matchedKeywords?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords?.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> {kw}
                  </span>
                ))}
                {!result.matchedKeywords?.length && <p className="text-xs text-gray-500">No exact keywords matched.</p>}
              </div>
            </div>

            <div className="glass-card p-5 space-y-3 border-red-500/20">
              <h4 className="font-bold text-xs text-red-400 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" /> Missing Essential Keywords ({result.missingKeywords?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords?.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/10 text-red-300 rounded-full text-xs font-medium border border-red-500/30 flex items-center gap-1">
                    <X className="w-3 h-3 text-red-400" /> {kw}
                  </span>
                ))}
                {!result.missingKeywords?.length && <p className="text-xs text-gray-500">All required keywords found!</p>}
              </div>
            </div>
          </div>

          {/* Detailed Suggestions & Apply Toolbar */}
          {result.suggestions?.length > 0 && (
            <div className="glass-card p-6 space-y-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h4 className="font-bold text-sm text-gray-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" /> Strategic Match Recommendations
                </h4>

                <button
                  onClick={applyAllSuggestions}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Apply All Match Suggestions ✨
                </button>
              </div>

              <div className="space-y-3">
                {result.suggestions.map((sug, i) => {
                  const isObj = typeof sug === 'object' && sug !== null;
                  const title = isObj ? (sug.title || sug.category || sug.section || sug.type || `Recommendation #${i+1}`) : `Recommendation #${i+1}`;
                  const text = isObj ? (sug.improved || sug.reasoning || sug.suggestion || sug.description || (sug.skill ? `Add skill: ${sug.skill}` : '')) : String(sug);
                  const originalText = isObj ? sug.original : null;
                  const reasonText = isObj ? sug.reasoning : null;
                  const isApplied = appliedSuggestions.has(i);

                  return (
                    <div key={i} className="p-4 bg-gray-950/60 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-2.5">
                      <div className="flex items-center justify-between font-bold text-emerald-400 capitalize">
                        <span>{title}</span>
                        <div className="flex items-center gap-2">
                          {isObj && sug.skill && <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">{sug.skill}</span>}
                          <button
                            onClick={() => applySuggestion(i)}
                            disabled={isApplied}
                            className={`text-[11px] font-bold py-1 px-3 rounded-lg border transition-all flex items-center gap-1 ${
                              isApplied
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                          >
                            {isApplied ? <Check className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                            {isApplied ? 'Applied' : 'Apply Change'}
                          </button>
                        </div>
                      </div>
                      {originalText && (
                        <div className="bg-red-500/5 p-2.5 rounded-lg border border-red-500/20 text-red-300 font-mono">
                          <span className="text-[10px] text-red-400 font-bold block mb-0.5">Original Text:</span>
                          {originalText}
                        </div>
                      )}
                      {text && (
                        <div className="bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-300 font-mono">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">Recommended Improvement:</span>
                          {text}
                        </div>
                      )}
                      {reasonText && <p className="text-[11px] text-gray-400 italic">💡 {reasonText}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Downloads & Artifacts Footer Card */}
          <div className="glass-card p-6 border-gray-800 bg-gray-950/40 space-y-4">
            <h4 className="font-bold text-xs text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-primary-400" /> Comparison Artifacts & Downloads
            </h4>
            <div className="flex items-center gap-3 flex-wrap">
              {jobDescription && (
                <button
                  onClick={handleDownloadJD}
                  className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 text-gray-200 border-gray-800 hover:border-gray-700"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" /> Download Target Job Description (.txt)
                </button>
              )}
              <button
                onClick={handleDownloadResume}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 text-gray-200 border-gray-800 hover:border-gray-700"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> Download Analyzed Resume (.pdf / .txt)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
