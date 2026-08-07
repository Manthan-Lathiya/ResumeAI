import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrandLogo from '../components/common/BrandLogo';
import { TEMPLATES } from '../templates/registry';
import TemplateThumbnail from '../components/TemplateThumbnail';
import {
  Sparkles, ArrowRight, CheckCircle2, ShieldCheck, FileText,
  BarChart3, Mail, GitCompare, Layout, Wand2, Star, Zap, Users
} from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      title: 'Smart Resume Builder',
      desc: 'Build ATS-optimized resumes with 20+ customizable layouts, dynamic color palettes, and real-time document preview.',
      link: '/builder',
      actionText: 'Launch Builder',
    },
    {
      icon: Mail,
      color: 'from-purple-500 to-pink-500',
      title: 'AI Cover Letter Studio',
      desc: 'Generate tailored 4-paragraph cover letters in seconds matching your target job title, company, and resume achievements.',
      link: '/cover-letter',
      actionText: 'Create Cover Letter',
    },
    {
      icon: BarChart3,
      color: 'from-amber-500 to-orange-500',
      title: 'ATS Score Analyzer',
      desc: 'Upload your resume to get instant AI scoring, keyword gap analysis, section checks, and 1-click smart suggestions.',
      link: '/analyzer',
      actionText: 'Analyze Resume',
    },
    {
      icon: GitCompare,
      color: 'from-emerald-500 to-teal-500',
      title: 'Job Description Matcher',
      desc: 'Compare your resume side-by-side against any job description to discover missing skills and boost interview callbacks.',
      link: '/compare',
      actionText: 'Compare JD',
    },
  ];

  const sampleResumeData = {
    personalInfo: {
      fullName: 'Alex Chen',
      email: 'alex.chen@devmail.io',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexchen-dev',
    },
    summary: 'Results-driven Senior Full-Stack Engineer with 6+ years of experience architecting microservices, distributed RAG pipelines, and cloud applications.',
    experience: [
      {
        company: 'CloudScale Technologies',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected event-driven microservices processing 15M+ daily requests with 99.99% uptime.',
          'Led migration to Docker/Kubernetes on AWS EKS, reducing cloud infrastructure costs by 28%.'
        ]
      }
    ],
    education: [
      {
        institution: 'UC Berkeley',
        degree: 'B.S. in Computer Science',
        startDate: '2015-08',
        endDate: '2019-05',
        gpa: '3.85'
      }
    ],
    skills: ['TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    projects: []
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Top Floating Header */}
      <header className="sticky top-0 z-50 glass-card rounded-none border-b border-gray-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo size="medium" />

          <div className="flex items-center gap-3">
            <Link to="/templates" className="hidden sm:inline-flex text-xs font-semibold text-gray-300 hover:text-white px-3 py-2">
              Templates
            </Link>
            <Link to="/examples" className="hidden sm:inline-flex text-xs font-semibold text-gray-300 hover:text-white px-3 py-2">
              Examples
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-xs py-2 px-4">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                  Get Started Free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary-600/30 to-accent-500/20 rounded-full blur-[120px] pointer-events-none" />

        {/* AI Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary-500/30 text-xs font-medium text-primary-300 mb-8 animate-fade-in shadow-lg shadow-primary-500/10">
          <Sparkles className="w-4 h-4 text-accent-400 animate-spin-slow" />
          <span>Powered by Google Gemini AI & 20+ ATS Templates</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-[1.15] animate-slide-up text-white">
          Craft <span className="gradient-text">ATS-Proof Resumes</span> & Cover Letters in Minutes
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-10 leading-relaxed font-normal">
          Accelerate your career with AI-driven content suggestions, instant ATS compatibility scoring, 
          profession-specific ready-made examples, and matching visual cover letter templates.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to="/builder" className="btn-primary py-3.5 px-8 text-sm flex items-center gap-2 text-base shadow-xl">
            <Wand2 className="w-5 h-5" /> Build My Resume Free
          </Link>
          <Link to="/cover-letter" className="btn-secondary py-3.5 px-6 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary-400" /> Create Cover Letter
          </Link>
          <Link to="/templates" className="btn-secondary py-3.5 px-6 text-sm flex items-center gap-2">
            <Layout className="w-4 h-4 text-accent-400" /> View 20+ Templates
          </Link>
        </div>

        {/* Hero Mockup Live Preview Card */}
        <div className="relative max-w-5xl mx-auto glass-card p-4 sm:p-6 rounded-3xl border border-gray-800/80 shadow-2xl overflow-hidden group">
          <div className="flex items-center justify-between mb-4 px-3 py-1.5 rounded-xl bg-gray-900/60 text-xs text-gray-300 font-mono border border-gray-800/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-medium text-gray-300">resume-ai.studio/preview</span>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% ATS Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {['classic', 'tech', 'contemporary'].map((tId) => (
              <div key={tId} className="transform group-hover:scale-[1.01] transition-transform duration-300">
                <TemplateThumbnail templateId={tId} themeColor="#2563eb" resumeData={sampleResumeData} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y border-gray-800/80 bg-gray-900/40 py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">50,000+</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Resumes Generated</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">98.4%</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Average ATS Score</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-400 mb-1">20+</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Designer Templates</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-accent-400 mb-1">18+</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Profession Examples</div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Everything You Need to Land Interviews Faster
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Powered by advanced AI models to ensure your resume passes Applicant Tracking Systems and wows recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">{feat.desc}</p>
                </div>
                <Link to={feat.link} className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1.5 mt-auto">
                  {feat.actionText} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-10 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo size="small" showSubtitle={false} />
          <div className="flex items-center gap-6 flex-wrap font-medium text-gray-400">
            <Link to="/builder" className="hover:text-white">Resume Builder</Link>
            <Link to="/cover-letter" className="hover:text-white">Cover Letter</Link>
            <Link to="/analyzer" className="hover:text-white">ATS Analyzer</Link>
            <Link to="/compare" className="hover:text-white">JD Match</Link>
            <Link to="/templates" className="hover:text-white">Templates</Link>
            <Link to="/examples" className="hover:text-white">Examples</Link>
          </div>
          <div>© {new Date().getFullYear()} ResumeAI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
