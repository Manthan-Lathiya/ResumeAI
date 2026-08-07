/**
 * Dashboard Page
 *
 * Shows the user's resumes, recent analyses, and quick action buttons.
 * This is the main hub after login.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getResumes, deleteResume, uploadResume } from '../api/resumes';
import { getAnalysisHistory } from '../api/analysis';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import {
  Plus, FileText, BarChart3, GitCompare, Trash2, Edit3,
  Clock, TrendingUp, Sparkles, ArrowRight, Search, Upload
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch data on page load
  useEffect(() => {
    fetchResumes();
    fetchAnalyses();
  }, []);

  async function fetchResumes() {
    try {
      const response = await getResumes();
      setResumes(response.data.resumes || []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load resumes.'));
    } finally {
      setLoadingResumes(false);
    }
  }

  async function fetchAnalyses() {
    try {
      const response = await getAnalysisHistory();
      setAnalyses(response.data.analyses || []);
    } catch (error) {
      // Silently fail — analyses aren't critical for the dashboard
    } finally {
      setLoadingAnalyses(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await deleteResume(id);
      setResumes(resumes.filter(r => r.id !== id));
      toast.success('Resume deleted');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete resume.'));
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['.pdf', '.docx'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!validTypes.includes(ext)) {
      toast.error('Only PDF and DOCX files are supported');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadResume(file);
      setResumes([response.data, ...resumes]);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to upload resume.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  // Get score color based on value
  function getScoreColor(score) {
    if (score >= 80) return 'text-green-400 bg-green-400/10';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-100">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-gray-400 mt-2">Manage your resumes and track your progress</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
        <Link
          to="/builder"
          className="glass-card p-6 hover:border-primary-500/30 transition-all duration-300 
                   hover:-translate-y-1 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
              <Plus className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">New Resume</h3>
              <p className="text-sm text-gray-400">Build from scratch</p>
            </div>
          </div>
        </Link>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="glass-card p-6 hover:border-purple-500/30 transition-all duration-300 
                   hover:-translate-y-1 group text-left relative overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-purple-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">Upload Resume</h3>
              <p className="text-sm text-gray-400">Save a PDF or DOCX</p>
            </div>
          </div>
          <input
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </button>

        <Link
          to="/analyzer"
          className="glass-card p-6 hover:border-accent-500/30 transition-all duration-300 
                   hover:-translate-y-1 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-500/20 rounded-xl group-hover:bg-accent-500/30 transition-colors">
              <BarChart3 className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">Analyze Resume</h3>
              <p className="text-sm text-gray-400">Get AI feedback</p>
            </div>
          </div>
        </Link>

        <Link
          to="/compare"
          className="glass-card p-6 hover:border-green-500/30 transition-all duration-300 
                   hover:-translate-y-1 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
              <GitCompare className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">Match JD</h3>
              <p className="text-sm text-gray-400">Compare with job</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Resumes Section */}
      <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-400" />
            My Resumes
          </h2>
          <div className="flex gap-4">
            <button onClick={() => fileInputRef.current?.click()} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              <Upload className="w-4 h-4" /> Upload
            </button>
            <Link to="/builder" className="text-sm text-primary-400 hover:text-primary-300 
                                         flex items-center gap-1 transition-colors">
              Create New <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {loadingResumes ? (
          <div className="glass-card p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full 
                          animate-spin mx-auto" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No resumes yet. Create your first one!</p>
            <Link to="/builder" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" /> Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="glass-card p-5 hover:border-gray-700/80 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-100 truncate flex-1">{resume.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    resume.is_uploaded 
                      ? 'bg-purple-500/20 text-purple-400'
                      : resume.status === 'complete'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {resume.is_uploaded ? 'Uploaded' : resume.status}
                  </span>
                </div>

                <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                  <Clock className="w-3 h-3" />
                  {new Date(resume.updated_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>

                <div className="flex items-center gap-2">
                  {!resume.is_uploaded && (
                    <Link
                      to={`/builder?id=${resume.id}`}
                      className="flex-1 text-center text-sm py-2 px-3 rounded-lg
                               bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 
                               transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Link>
                  )}
                  <Link
                    to={`/analyzer?resumeId=${resume.id}`}
                    className={`text-sm py-2 px-3 rounded-lg bg-accent-500/10 text-accent-400 
                             hover:bg-accent-500/20 transition-colors flex items-center justify-center gap-1 ${resume.is_uploaded ? 'flex-1' : ''}`}
                  >
                    <Search className="w-3.5 h-3.5" /> Analyze
                  </Link>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="text-sm py-2 px-3 rounded-lg bg-red-500/10 text-red-400 
                             hover:bg-red-500/20 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Analyses */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-400" />
            Recent Analyses
          </h2>
          <Link to="/history" className="text-sm text-accent-400 hover:text-accent-300 
                                       flex items-center gap-1 transition-colors">
            View All History <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingAnalyses ? (
          <div className="glass-card p-8 text-center">
            <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full 
                          animate-spin mx-auto" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No analyses yet. Analyze your first resume!</p>
            <Link to="/analyzer" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Analyze Resume
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.slice(0, 5).map((analysis) => (
              <Link
                key={analysis.id}
                to={analysis.analysis_type === 'jd_comparison' ? '/compare' : '/analyzer'}
                state={{
                  historyResult: {
                    ...analysis.result,
                    resume: analysis.resume,
                    resumeText: analysis.resume_text,
                    jobDescription: analysis.job_description
                  }
                }}
                className="glass-card p-4 flex items-center justify-between hover:border-primary-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`score-badge text-lg w-12 h-12 rounded-xl flex items-center justify-center ${
                    getScoreColor(analysis.ats_score)
                  }`}>
                    {analysis.ats_score}
                  </div>
                  <div>
                    <p className="font-medium text-gray-200 group-hover:text-primary-300 transition-colors">
                      {analysis.analysis_type === 'jd_comparison' ? 'JD Comparison' : 'Resume Analysis'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {analysis.file_name || 'Saved resume'} •{' '}
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                    getScoreColor(analysis.ats_score)
                  }`}>
                    {analysis.ats_score}%
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
