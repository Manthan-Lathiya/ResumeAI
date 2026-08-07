import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getResumes } from '../api/resumes';
import { generateInterviewPrep } from '../api/interview';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import {
  MessageSquare, Sparkles, FileText, Briefcase, HelpCircle,
  CheckCircle2, Copy, Printer, ChevronDown, ChevronUp, Wand2, Lightbulb
} from 'lucide-react';

export default function InterviewPrep() {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.selectedResumeId || '');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState(location.state?.jobDescription || '');
  const [questionType, setQuestionType] = useState('all');

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

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
    if (location.state?.jobTitle) {
      setJobTitle(location.state.jobTitle);
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

  async function handleGenerate(e) {
    e.preventDefault();
    if (!jobTitle.trim() && !selectedResumeId) {
      toast.error('Please select a resume or enter a target job title.');
      return;
    }

    setLoading(true);
    setQuestions([]);
    try {
      const response = await generateInterviewPrep({
        resumeId: selectedResumeId || null,
        jobTitle,
        jobDescription,
        questionType,
      });

      const list = response.data.questions || [];
      setQuestions(list);
      if (list.length > 0) setExpandedCard(list[0].id);
      toast.success('Interview Prep Guide generated!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to generate interview questions.'));
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    toast.success('Model answer copied to clipboard!');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20">
          <MessageSquare className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">AI Interview Prep Studio</h1>
          <p className="text-xs text-gray-400">
            Practice role-specific STAR method and technical interview questions customized to your actual experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-bold text-sm text-gray-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Target Role & Context
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Select Resume */}
              <div>
                <label className="input-label text-xs">Select Source Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">-- No Resume (General Role Only) --</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title || 'Untitled Resume'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Job Title */}
              <div>
                <label className="input-label text-xs">Target Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full-Stack Engineer, Product Manager"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Job Description Context */}
              <div>
                <label className="input-label text-xs">Target Job Description (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Paste target job description to generate ultra-specific questions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              {/* Question Category */}
              <div>
                <label className="input-label text-xs">Question Focus</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="all">All Types (Behavioral + Technical + Situational)</option>
                  <option value="star">Behavioral (STAR Method Focus)</option>
                  <option value="technical">Technical & System Architecture</option>
                  <option value="leadership">Leadership & Conflict Resolution</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Custom Questions...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> Generate Interview Prep Guide
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Question & Answer Output Feed */}
        <div className="lg:col-span-7 space-y-4">
          {questions.length === 0 && !loading && (
            <div className="glass-card p-12 text-center text-gray-400 space-y-4 border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-200 text-sm">No Interview Questions Generated Yet</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Select your resume or enter a target job title on the left to generate customized interview questions with STAR model answers.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="glass-card p-12 text-center text-gray-400 space-y-4">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs font-semibold text-gray-300">
                Analyzing your resume experience and building tailored STAR responses...
              </div>
            </div>
          )}

          {questions.map((q, idx) => {
            const isExpanded = expandedCard === q.id;
            return (
              <div key={q.id || idx} className="glass-card p-5 space-y-4 transition-all hover:border-purple-500/40">
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedCard(isExpanded ? null : q.id)}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="badge-primary text-[10px]">
                        {q.category || 'Interview Question'}
                      </span>
                      <span className="text-xs font-mono text-gray-500">Q{idx + 1}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-100 hover:text-purple-300 transition-colors">
                      {q.question}
                    </h3>
                  </div>

                  <button className="p-1 text-gray-400 hover:text-white rounded-lg">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-gray-800/80 animate-fade-in text-xs">
                    {/* Why Ask */}
                    {q.whyAsked && (
                      <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-300 flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                        <div>
                          <span className="font-bold text-[11px] uppercase tracking-wider block text-purple-400 mb-0.5">
                            Why Recruiters Ask This:
                          </span>
                          <span className="text-xs leading-relaxed">{q.whyAsked}</span>
                        </div>
                      </div>
                    )}

                    {/* STAR Answer */}
                    <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-200 uppercase tracking-wider">
                          Suggested STAR Model Answer:
                        </span>
                        <button
                          onClick={() => handleCopy(q.starAnswer)}
                          className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                        {q.starAnswer}
                      </p>
                    </div>

                    {/* Key Talking Points */}
                    {q.talkingPoints && q.talkingPoints.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">
                          Key Bullet Points to Mention:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.talkingPoints.map((tp, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300 bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{tp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
