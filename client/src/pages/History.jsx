import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalysisHistory } from '../api/analysis';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import { BarChart3, GitCompare, ArrowRight, Clock, Search } from 'lucide-react';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  async function fetchAnalyses() {
    try {
      const response = await getAnalysisHistory();
      setAnalyses(response.data.analyses || []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load analysis history.'));
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score) {
    if (score >= 80) return 'text-green-400 bg-green-400/10';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex p-3 bg-gradient-to-br from-gray-700 to-gray-900 
                      rounded-2xl shadow-lg mb-4">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Analysis History</h1>
        <p className="text-gray-400">Review all your past resume analyses and job comparisons</p>
      </div>

      <div className="animate-slide-up">
        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full 
                          animate-spin mx-auto" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No analyses found in your history.</p>
            <Link to="/analyzer" className="btn-primary inline-flex items-center gap-2">
              Analyze a Resume
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
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
                className="glass-card p-6 flex items-center justify-between hover:border-primary-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  <div className={`score-badge text-2xl font-bold w-16 h-16 rounded-xl flex items-center justify-center ${
                    getScoreColor(analysis.ats_score)
                  }`}>
                    {analysis.ats_score}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-100 group-hover:text-primary-300 transition-colors flex items-center gap-2">
                      {analysis.analysis_type === 'jd_comparison' ? (
                        <><GitCompare className="w-5 h-5 text-green-400" /> Job Description Match</>
                      ) : (
                        <><Search className="w-5 h-5 text-accent-400" /> Resume Analysis</>
                      )}
                    </h3>
                    <div className="text-sm text-gray-400 mt-1 flex flex-col gap-1">
                      <p>Resume: <span className="text-gray-300">{analysis.file_name || 'Saved Resume'}</span></p>
                      <p>Date: <span className="text-gray-300">{new Date(analysis.created_at).toLocaleString()}</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm hidden sm:inline-block">View Details</span>
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
