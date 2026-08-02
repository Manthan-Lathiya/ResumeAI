/**
 * Resume Analyzer Page
 *
 * Upload a PDF/DOCX or select a saved resume to get AI-powered analysis.
 * Shows: ATS score, formatting issues, missing sections, keyword gaps, and specific suggestions.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { analyzeResume } from '../api/analysis';
import { getResumes } from '../api/resumes';
import toast from 'react-hot-toast';
import {
  Upload, FileText, Sparkles, BarChart3, AlertTriangle,
  CheckCircle, XCircle, Info, ChevronDown, ChevronUp,
  Zap, Target, BookOpen, ArrowRight
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('resumeId');

  const [file, setFile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || '');
  const [resumes, setResumes] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Load saved resumes for the dropdown
  useEffect(() => {
    async function loadResumes() {
      try {
        const response = await getResumes();
        setResumes(response.data.resumes || []);
      } catch (error) {
        // Non-critical, user can still upload a file
      }
    }
    loadResumes();
  }, []);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
      // Validate file type
      const validTypes = ['.pdf', '.docx'];
      const ext = selected.name.toLowerCase().slice(selected.name.lastIndexOf('.'));
      if (!validTypes.includes(ext)) {
        toast.error('Only PDF and DOCX files are supported');
        return;
      }
      // Validate file size (10MB)
      if (selected.size > 10 * 1024 * 1024) {
        toast.error('File must be less than 10MB');
        return;
      }
      setFile(selected);
      setSelectedResumeId('');  // Clear resume selection when file is chosen
    }
  }

  async function handleAnalyze() {
    if (!file && !selectedResumeId) {
      toast.error('Please upload a file or select a saved resume');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await analyzeResume(file, selectedResumeId || null);
      setResult(response.data);
      toast.success('Analysis complete!');
    } catch (error) {
      const message = error.response?.data?.error || 'Analysis failed. Please try again.';
      toast.error(message);
    } finally {
      setAnalyzing(false);
    }
  }

  function toggleSection(section) {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }

  // Get color for scores
  function getScoreColor(score) {
    if (score >= 80) return { text: 'text-green-400', bg: 'bg-green-400', ring: 'ring-green-400/30' };
    if (score >= 60) return { text: 'text-yellow-400', bg: 'bg-yellow-400', ring: 'ring-yellow-400/30' };
    return { text: 'text-red-400', bg: 'bg-red-400', ring: 'ring-red-400/30' };
  }

  function getSeverityIcon(severity) {
    switch (severity) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex p-3 bg-gradient-to-br from-accent-500 to-primary-500 
                      rounded-2xl shadow-lg shadow-accent-500/25 mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Resume Analyzer</h1>
        <p className="text-gray-400">Get AI-powered feedback on your resume's ATS compatibility</p>
      </div>

      {/* Upload Section */}
      {!result && (
        <div className="glass-card p-8 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: File Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-accent-400" />
                Upload Resume
              </h3>
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed 
                             border-gray-700 rounded-xl cursor-pointer hover:border-primary-500/50 
                             hover:bg-primary-500/5 transition-all duration-300">
                <Upload className="w-10 h-10 text-gray-500 mb-3" />
                {file ? (
                  <div className="text-center">
                    <p className="text-primary-400 font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400">Drop PDF or DOCX here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                  </div>
                )}
                <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Option 2: Select Saved Resume */}
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-400" />
                Or Select Saved Resume
              </h3>
              {resumes.length > 0 ? (
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <button
                      key={resume.id}
                      onClick={() => { setSelectedResumeId(resume.id); setFile(null); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                        selectedResumeId === resume.id
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-gray-800 hover:border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <p className="font-medium text-gray-200">{resume.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-700 rounded-xl">
                  <p className="text-gray-500">No saved resumes yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Analyze Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || (!file && !selectedResumeId)}
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Back button */}
          <button
            onClick={() => { setResult(null); setFile(null); setSelectedResumeId(''); }}
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors mb-4"
          >
            ← Analyze another resume
          </button>

          {/* ATS Score */}
          <div className="glass-card p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-400 mb-4">ATS Compatibility Score</h2>
            <div className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl 
                          ring-4 ${getScoreColor(result.atsScore).ring} mb-4`}>
              <span className={`text-5xl font-bold ${getScoreColor(result.atsScore).text}`}>
                {result.atsScore}
              </span>
            </div>
            <p className="text-gray-400">
              {result.atsScore >= 80 ? 'Great! Your resume is well-optimized.' :
               result.atsScore >= 60 ? 'Good, but there\'s room for improvement.' :
               'Needs work. Follow the suggestions below.'}
            </p>
          </div>

          {/* Formatting */}
          {result.formatting && (
            <div className="glass-card overflow-hidden">
              <button onClick={() => toggleSection('formatting')}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-100">Formatting</h3>
                  <span className={`px-2 py-0.5 rounded-lg text-sm font-medium ${
                    getScoreColor(result.formatting.score).text
                  } ${getScoreColor(result.formatting.score).text.replace('text-', 'bg-')}/10`}>
                    {result.formatting.score}/100
                  </span>
                </div>
                {expandedSections.formatting ? <ChevronUp className="w-5 h-5 text-gray-400" /> :
                                              <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedSections.formatting !== false && (
                <div className="px-6 pb-6 space-y-3">
                  {result.formatting.issues?.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-xl">
                      {getSeverityIcon(issue.severity)}
                      <div>
                        <p className="text-gray-200 text-sm">{issue.message}</p>
                        <p className="text-xs text-gray-500 mt-1">Section: {issue.location}</p>
                      </div>
                    </div>
                  ))}
                  {(!result.formatting.issues || result.formatting.issues.length === 0) && (
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" /> No formatting issues found!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sections Analysis */}
          {result.sections && (
            <div className="glass-card overflow-hidden">
              <button onClick={() => toggleSection('sections')}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-100">Sections</h3>
                </div>
                {expandedSections.sections ? <ChevronUp className="w-5 h-5 text-gray-400" /> :
                                             <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedSections.sections !== false && (
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Present</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sections.present?.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {result.sections.missing?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Missing</p>
                      <div className="flex flex-wrap gap-2">
                        {result.sections.missing.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-sm">
                            ✗ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.sections.recommendations?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Recommendations</p>
                      {result.sections.recommendations.map((rec, i) => (
                        <p key={i} className="text-sm text-gray-300 flex items-start gap-2 mb-1">
                          <ArrowRight className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                          {rec}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Keywords */}
          {result.keywords && (
            <div className="glass-card overflow-hidden">
              <button onClick={() => toggleSection('keywords')}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-gray-100">Keywords</h3>
                </div>
                {expandedSections.keywords ? <ChevronUp className="w-5 h-5 text-gray-400" /> :
                                             <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedSections.keywords !== false && (
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Found in resume</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.found?.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  {result.keywords.suggestedToAdd?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Suggested to add</p>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.suggestedToAdd.map((kw, i) => (
                          <span key={i} className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.keywords.reasoning && (
                    <p className="text-sm text-gray-400 italic">{result.keywords.reasoning}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="glass-card overflow-hidden">
              <button onClick={() => toggleSection('suggestions')}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent-400" />
                  <h3 className="text-lg font-semibold text-gray-100">
                    Improvement Suggestions ({result.suggestions.length})
                  </h3>
                </div>
                {expandedSections.suggestions ? <ChevronUp className="w-5 h-5 text-gray-400" /> :
                                                <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedSections.suggestions !== false && (
                <div className="px-6 pb-6 space-y-4">
                  {result.suggestions.map((suggestion, i) => (
                    <div key={i} className="p-4 bg-gray-800/30 rounded-xl border border-gray-800">
                      <p className="text-xs text-primary-400 font-medium uppercase tracking-wider mb-3">
                        {suggestion.section}
                      </p>

                      {suggestion.original && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Original:</p>
                          <p className="text-sm text-red-300 bg-red-500/5 p-3 rounded-lg line-through">
                            {suggestion.original}
                          </p>
                        </div>
                      )}

                      {suggestion.improved && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Improved:</p>
                          <p className="text-sm text-green-300 bg-green-500/5 p-3 rounded-lg">
                            {suggestion.improved}
                          </p>
                        </div>
                      )}

                      {suggestion.reasoning && (
                        <p className="text-xs text-gray-400 italic mt-2">
                          💡 {suggestion.reasoning}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
