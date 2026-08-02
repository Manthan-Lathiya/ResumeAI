/**
 * Job Description Comparison Page
 *
 * Compare a saved resume against a job description.
 * Returns match score, missing keywords, and tailored suggestions.
 */

import { useState, useEffect } from 'react';
import { getResumes } from '../api/resumes';
import { compareJobDescription } from '../api/analysis';
import toast from 'react-hot-toast';
import {
  GitCompare, Sparkles, CheckCircle, XCircle, ArrowRight,
  FileText, Target, Zap
} from 'lucide-react';

export default function JobComparison() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadResumes() {
      try {
        const response = await getResumes();
        setResumes(response.data.resumes || []);
      } catch (error) {
        toast.error('Failed to load resumes');
      }
    }
    loadResumes();
  }, []);

  async function handleCompare() {
    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }
    if (jobDescription.length < 50) {
      toast.error('Job description must be at least 50 characters');
      return;
    }

    setComparing(true);
    setResult(null);

    try {
      const response = await compareJobDescription(selectedResumeId, jobDescription);
      setResult(response.data);
      toast.success('Comparison complete!');
    } catch (error) {
      const message = error.response?.data?.error || 'Comparison failed. Please try again.';
      toast.error(message);
    } finally {
      setComparing(false);
    }
  }

  function getScoreColor(score) {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex p-3 bg-gradient-to-br from-green-500 to-primary-500 
                      rounded-2xl shadow-lg shadow-green-500/25 mb-4">
          <GitCompare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Job Description Match</h1>
        <p className="text-gray-400">See how well your resume matches a specific job posting</p>
      </div>

      {/* Input Section */}
      {!result && (
        <div className="glass-card p-8 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Select Resume */}
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-400" />
                Select Resume
              </h3>
              {resumes.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {resumes.map((resume) => (
                    <button
                      key={resume.id}
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                        selectedResumeId === resume.id
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-gray-800 hover:border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <p className="font-medium text-gray-200">{resume.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{resume.status}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-700 rounded-xl">
                  <p className="text-gray-500">Create a resume first in the Builder</p>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Paste Job Description
              </h3>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here...

Example: We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and AWS. The ideal candidate will have experience with microservices architecture..."
                className="input-field min-h-[250px] resize-y"
                rows={10}
              />
              <p className="text-xs text-gray-500 mt-2">
                {jobDescription.length}/50 characters minimum
              </p>
            </div>
          </div>

          {/* Compare Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleCompare}
              disabled={comparing || !selectedResumeId || jobDescription.length < 50}
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              {comparing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Comparing with AI...
                </>
              ) : (
                <>
                  <GitCompare className="w-5 h-5" />
                  Compare Match
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          <button
            onClick={() => setResult(null)}
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            ← Compare again
          </button>

          {/* Match Score */}
          <div className="glass-card p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-400 mb-4">Match Score</h2>
            <div className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl 
                          ring-4 ring-current/20 mb-4 ${getScoreColor(result.matchScore)}`}>
              <span className="text-5xl font-bold">{result.matchScore}</span>
            </div>
            <p className="text-gray-400 max-w-lg mx-auto">{result.overallAssessment}</p>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Matched Keywords ({result.matchedKeywords?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords?.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Missing Keywords ({result.missingKeywords?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords?.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-sm">
                    ✗ {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-400" />
                Tailored Suggestions
              </h3>
              <div className="space-y-4">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="p-4 bg-gray-800/30 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded text-xs font-medium">
                        {s.type?.replace('_', ' ')}
                      </span>
                      {s.section && <span className="text-xs text-gray-500">{s.section}</span>}
                    </div>

                    {s.original && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500">Original:</p>
                        <p className="text-sm text-red-300 bg-red-500/5 p-2 rounded-lg">{s.original}</p>
                      </div>
                    )}

                    {s.improved && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500">Improved:</p>
                        <p className="text-sm text-green-300 bg-green-500/5 p-2 rounded-lg">{s.improved}</p>
                      </div>
                    )}

                    {s.reasoning && (
                      <p className="text-xs text-gray-400 italic">💡 {s.reasoning}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
