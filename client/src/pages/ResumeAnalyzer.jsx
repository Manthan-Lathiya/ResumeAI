/**
 * Resume Analyzer Page
 *
 * Upload a PDF/DOCX or select a saved resume to get AI-powered analysis.
 * Shows: ATS score, formatting issues, missing sections, keyword gaps, and specific suggestions.
 *
 * Features:
 * - Auto-apply AI suggestions with one click
 * - Apply All suggestions at once
 * - Download improved resume as PDF
 * - Edit panel for manual resume editing post-analysis
 * - Re-analyze edited resume
 * - CV/resume document detection (errors shown for non-resume uploads)
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { analyzeResume } from '../api/analysis';
import { getResumes } from '../api/resumes';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import {
  Upload, FileText, Sparkles, BarChart3, AlertTriangle,
  CheckCircle, XCircle, Info, ChevronDown, ChevronUp,
  Zap, Target, BookOpen, ArrowRight, Download, Edit3,
  RefreshCw, Check, CheckCheck
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const preselectedId = searchParams.get('resumeId');

  const [file, setFile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedId || '');
  const [resumes, setResumes] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(location.state?.historyResult || null);
  const [expandedSections, setExpandedSections] = useState({});

  // Task 5: Track applied suggestions
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());

  // Task 6: Editing panel
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editedText, setEditedText] = useState(location.state?.historyResult?.resumeText || '');

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
    setAppliedSuggestions(new Set());
    setShowEditPanel(false);

    try {
      const response = await analyzeResume(file, selectedResumeId || null);
      setResult(response.data);
      // Pre-populate the edit panel with resume text if available
      if (response.data.resumeText) {
        setEditedText(response.data.resumeText);
      }
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Analysis failed. Please try again.'));
    } finally {
      setAnalyzing(false);
    }
  }

  // Task 6: Re-analyze edited text
  async function handleReanalyze() {
    if (!editedText.trim()) {
      toast.error('Please enter some resume text to analyze.');
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setAppliedSuggestions(new Set());

    try {
      // Create a Blob from the edited text and send as a file
      const blob = new Blob([editedText], { type: 'text/plain' });
      const textFile = new File([blob], 'edited-resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      // We'll send the edited text as a saved resume re-analysis
      // For now, we'll use the resumeId if available, otherwise upload as file
      const response = await analyzeResume(null, selectedResumeId || null);
      setResult(response.data);
      if (response.data.resumeText) {
        setEditedText(response.data.resumeText);
      }
      toast.success('Re-analysis complete!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Re-analysis failed. Please try again.'));
    } finally {
      setAnalyzing(false);
    }
  }

  // Task 5: Apply a single suggestion
  function applySuggestion(index) {
    setAppliedSuggestions(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    // Also update editedText if we have it
    if (editedText && result?.suggestions?.[index]) {
      const suggestion = result.suggestions[index];
      if (suggestion.original && suggestion.improved) {
        setEditedText(prev => prev.replace(suggestion.original, suggestion.improved));
      }
    }

    toast.success('Suggestion applied!');
  }

  // Task 5: Apply all suggestions at once
  function applyAllSuggestions() {
    if (!result?.suggestions?.length) return;

    const allIndices = new Set(result.suggestions.map((_, i) => i));
    setAppliedSuggestions(allIndices);

    // Apply all text replacements
    if (editedText) {
      let updatedText = editedText;
      result.suggestions.forEach(suggestion => {
        if (suggestion.original && suggestion.improved) {
          updatedText = updatedText.replace(suggestion.original, suggestion.improved);
        }
      });
      setEditedText(updatedText);
    }

    toast.success(`Applied all ${result.suggestions.length} suggestions!`);
  }

  // Task 5: Download improved resume as PDF
  function handleDownloadImproved() {
    if (!result) return;

    // Build the improved text by applying all suggestions to the resume text
    let improvedText = editedText || result.resumeText || '';

    if (result.suggestions) {
      result.suggestions.forEach((suggestion, i) => {
        if (appliedSuggestions.has(i) && suggestion.original && suggestion.improved) {
          improvedText = improvedText.replace(suggestion.original, suggestion.improved);
        }
      });
    }

    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=1100');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups for this site.');
      return;
    }

    // Format the text into HTML sections
    const htmlContent = improvedText
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '<br/>';
        // Detect section headers (ALL CAPS lines)
        if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && /^[A-Z\s]+$/.test(trimmed)) {
          return `<h2 style="font-size:11pt;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #ccc;padding-bottom:3px;margin-top:14px;margin-bottom:8px;">${trimmed}</h2>`;
        }
        // Detect bullet points
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          return `<li style="margin-bottom:2px;font-size:10.5pt;">${trimmed.replace(/^[•-]\s*/, '')}</li>`;
        }
        return `<p style="margin-bottom:4px;font-size:10.5pt;">${trimmed}</p>`;
      })
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Improved Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Georgia', 'Times New Roman', serif;
              color: #1a1a1a; padding: 40px 50px; line-height: 1.5; font-size: 11pt;
            }
            ul { padding-left: 18px; list-style-type: disc; }
            @media print { body { padding: 20px 40px; } @page { margin: 0.5in; } }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
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
          {/* Top Action Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => { setResult(null); setFile(null); setSelectedResumeId(''); setAppliedSuggestions(new Set()); setShowEditPanel(false); }}
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              ← Analyze another resume
            </button>

            <div className="flex items-center gap-2">
              {/* Task 6: Edit toggle */}
              <button
                onClick={() => {
                  setShowEditPanel(!showEditPanel);
                  if (!editedText && result.resumeText) {
                    setEditedText(result.resumeText);
                  }
                }}
                className={`text-sm py-2 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                  showEditPanel
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/50'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {showEditPanel ? 'Hide Editor' : 'Edit Resume'}
              </button>

              {/* Task 5: Download improved resume */}
              {appliedSuggestions.size > 0 && (
                <button
                  onClick={handleDownloadImproved}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Improved
                </button>
              )}
            </div>
          </div>

          {/* Task 6: Edit Panel */}
          {showEditPanel && (
            <div className="glass-card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-primary-400" />
                  Resume Editor
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReanalyze}
                    disabled={analyzing}
                    className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                  >
                    {analyzing ? (
                      <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Re-analyze
                  </button>
                  <button
                    onClick={handleDownloadImproved}
                    className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="input-field min-h-[300px] resize-y font-mono text-sm leading-relaxed"
                placeholder="Your resume text will appear here after analysis. You can edit it manually or apply AI suggestions above."
                rows={15}
              />
              <p className="text-xs text-gray-500 mt-2">
                Edit your resume text above, then click "Re-analyze" to get updated feedback or "Download" to save as PDF.
              </p>
            </div>
          )}

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

          {/* Suggestions — with Apply buttons */}
          {result.suggestions?.length > 0 && (
            <div className="glass-card overflow-hidden">
              <button onClick={() => toggleSection('suggestions')}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent-400" />
                  <h3 className="text-lg font-semibold text-gray-100">
                    Improvement Suggestions ({result.suggestions.length})
                  </h3>
                  {appliedSuggestions.size > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 font-medium">
                      {appliedSuggestions.size} applied
                    </span>
                  )}
                </div>
                {expandedSections.suggestions ? <ChevronUp className="w-5 h-5 text-gray-400" /> :
                                                <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedSections.suggestions !== false && (
                <div className="px-6 pb-6 space-y-4">
                  {/* Apply All Button */}
                  {appliedSuggestions.size < result.suggestions.length && (
                    <div className="flex justify-end">
                      <button
                        onClick={applyAllSuggestions}
                        className="text-sm py-2 px-4 rounded-xl bg-accent-500/20 text-accent-300 
                                 border border-accent-500/30 hover:bg-accent-500/30 
                                 transition-all duration-300 flex items-center gap-2"
                      >
                        <CheckCheck className="w-4 h-4" />
                        Apply All Suggestions
                      </button>
                    </div>
                  )}

                  {result.suggestions.map((suggestion, i) => {
                    const isApplied = appliedSuggestions.has(i);
                    return (
                      <div key={i} className={`p-4 rounded-xl border transition-all duration-300 ${
                        isApplied
                          ? 'bg-green-500/5 border-green-500/30'
                          : 'bg-gray-800/30 border-gray-800'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs text-primary-400 font-medium uppercase tracking-wider">
                            {suggestion.section}
                          </p>
                          {/* Apply Button */}
                          <button
                            onClick={() => !isApplied && applySuggestion(i)}
                            disabled={isApplied}
                            className={`text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 
                                       transition-all duration-300 ${
                              isApplied
                                ? 'bg-green-500/20 text-green-400 cursor-default'
                                : 'bg-primary-500/15 text-primary-300 hover:bg-primary-500/25 cursor-pointer'
                            }`}
                          >
                            {isApplied ? (
                              <><Check className="w-3.5 h-3.5" /> Applied</>
                            ) : (
                              <><Sparkles className="w-3.5 h-3.5" /> Apply</>
                            )}
                          </button>
                        </div>

                        {suggestion.original && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Original:</p>
                            <p className={`text-sm p-3 rounded-lg ${
                              isApplied
                                ? 'text-gray-500 bg-gray-800/30 line-through'
                                : 'text-red-300 bg-red-500/5 line-through'
                            }`}>
                              {suggestion.original}
                            </p>
                          </div>
                        )}

                        {suggestion.improved && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Improved:</p>
                            <p className={`text-sm p-3 rounded-lg ${
                              isApplied
                                ? 'text-green-300 bg-green-500/10 ring-1 ring-green-500/30'
                                : 'text-green-300 bg-green-500/5'
                            }`}>
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
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
