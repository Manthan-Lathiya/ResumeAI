import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getResumes } from '../api/resumes';
import {
  generateCoverLetter, getCoverLetters, getCoverLetter,
  createCoverLetter, updateCoverLetter
} from '../api/coverLetters';
import CoverLetterPreview from '../components/CoverLetterPreview';
import { SAMPLE_COVER_LETTERS } from '../data/sampleCoverLetters';
import { TEMPLATES, COLOR_PRESETS } from '../templates/registry';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../api/axios';
import {
  Mail, Sparkles, Save, Download, Copy, Eye, Palette, Check,
  FileText, Plus, FolderOpen, RefreshCw, Wand2, ArrowRight, Trash2, X
} from 'lucide-react';

const TONES = [
  { id: 'Professional', label: 'Professional', desc: 'Authoritative, polished, traditional' },
  { id: 'Enthusiastic', label: 'Enthusiastic', desc: 'High energy, passionate, forward-looking' },
  { id: 'Executive', label: 'Executive', desc: 'Strategic, metrics-driven, leadership-focused' },
  { id: 'Creative', label: 'Creative', desc: 'Engaging narrative, bold personality' },
  { id: 'Direct', label: 'Direct', desc: 'Concise, action-oriented, zero filler' },
];

export default function CoverLetter() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('id');

  // Active letter ID & Title
  const [letterId, setLetterId] = useState(editId);
  const [title, setTitle] = useState('Untitled Cover Letter');

  // Form State
  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [recipientName, setRecipientName] = useState('Hiring Manager');
  const [companyName, setCompanyName] = useState('Google');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [salutation, setSalutation] = useState('Dear Hiring Manager,');
  const [bodyParagraphs, setBodyParagraphs] = useState([
    'I am writing to express my strong interest in the position. With my background and passion for excellence, I am confident in my ability to deliver immediate value to your team.',
    'In my previous roles, I have consistently driven results by combining core domain expertise with strategic execution and cross-functional collaboration.',
    'Your company’s vision and market leadership deeply resonate with my career goals, and I am excited about the prospect of contributing to your team.',
    'Thank you for your time and consideration. I look forward to the opportunity to discuss my application further in an interview.'
  ]);
  const [closing, setClosing] = useState('Sincerely,');

  // Styling & Template
  const [templateId, setTemplateId] = useState('classic');
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'design'

  // UI States
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // AI Generator Form State
  const [resumesList, setResumesList] = useState([]);
  const [savedLettersList, setSavedLettersList] = useState([]);
  const [aiResumeId, setAiResumeId] = useState('');
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiCompanyName, setAiCompanyName] = useState('');
  const [aiJobDescription, setAiJobDescription] = useState('');
  const [aiTone, setAiTone] = useState('Professional');

  const previewRef = useRef(null);

  useEffect(() => {
    fetchResumes();
    fetchSavedLetters();
    if (editId) {
      loadCoverLetter(editId);
    }
  }, [editId]);

  async function fetchResumes() {
    try {
      const res = await getResumes();
      const list = Array.isArray(res.data) ? res.data : (res.data?.resumes || []);
      setResumesList(list);
      if (list.length > 0) setAiResumeId(list[0].id);
    } catch (e) {
      console.error(e);
      setResumesList([]);
    }
  }

  async function fetchSavedLetters() {
    try {
      const res = await getCoverLetters();
      const list = Array.isArray(res.data) ? res.data : (res.data?.results || res.data?.cover_letters || []);
      setSavedLettersList(list);
    } catch (e) {
      console.error(e);
      setSavedLettersList([]);
    }
  }

  async function loadCoverLetter(id) {
    try {
      const res = await getCoverLetter(id);
      const data = res.data;
      setLetterId(id);
      setTitle(data.title || 'Untitled Cover Letter');
      setJobTitle(data.job_title || '');
      setCompanyName(data.company_name || '');
      setRecipientName(data.recipient_name || 'Hiring Manager');
      setSalutation(data.salutation || 'Dear Hiring Manager,');
      setBodyParagraphs(data.body_paragraphs || []);
      setClosing(data.closing || 'Sincerely,');
      setTemplateId(data.template_id || 'classic');
      setThemeColor(data.theme_color || '#2563eb');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load cover letter.'));
    }
  }

  // Handle AI Cover Letter Generation
  async function handleAiGenerate() {
    if (!aiJobTitle && !aiCompanyName) {
      toast.error('Please enter at least a Job Title or Company Name.');
      return;
    }

    setGenerating(true);
    try {
      const response = await generateCoverLetter({
        resumeId: aiResumeId || undefined,
        jobTitle: aiJobTitle,
        companyName: aiCompanyName,
        jobDescription: aiJobDescription,
        tone: aiTone,
      });

      const data = response.data;
      if (data.salutation) setSalutation(data.salutation);
      if (data.bodyParagraphs) setBodyParagraphs(data.bodyParagraphs);
      if (data.closing) setClosing(data.closing);
      if (aiJobTitle) setJobTitle(aiJobTitle);
      if (aiCompanyName) setCompanyName(aiCompanyName);

      setTitle(`${aiJobTitle || 'Cover Letter'} — ${aiCompanyName || 'Company'}`);
      setShowAiModal(false);
      toast.success('Cover letter generated with AI!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'AI generation failed. Please try again.'));
    } finally {
      setGenerating(false);
    }
  }

  function handleLoadSample(sample) {
    setTitle(sample.data.title);
    setJobTitle(sample.data.jobTitle);
    setCompanyName(sample.data.companyName);
    setRecipientName(sample.data.recipientName);
    setSalutation(sample.data.salutation);
    setBodyParagraphs(sample.data.bodyParagraphs);
    setClosing(sample.data.closing);
    setTemplateId(sample.templateId);
    setThemeColor(sample.themeColor);
    toast.success(`Loaded "${sample.role}" cover letter template!`);
  }

  async function handleSave() {
    setSaving(true);
    const data = {
      title,
      job_title: jobTitle,
      company_name: companyName,
      recipient_name: recipientName,
      tone: aiTone,
      job_description: aiJobDescription,
      salutation,
      body_paragraphs: bodyParagraphs,
      closing,
      template_id: templateId,
      theme_color: themeColor,
    };

    try {
      if (letterId) {
        await updateCoverLetter(letterId, data);
        toast.success('Cover letter saved!');
      } else {
        const response = await createCoverLetter(data);
        setLetterId(response.data.id);
        toast.success('Cover letter saved!');
      }
      fetchSavedLetters();
      navigate('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save cover letter.'));
    } finally {
      setSaving(false);
    }
  }

  function handleCopyText() {
    const fullText = `${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}\n${applicantName}`;
    navigator.clipboard.writeText(fullText);
    toast.success('Cover letter copied to clipboard!');
  }

  function handleDownloadPdf() {
    if (!previewRef.current) return;
    const element = previewRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body className="bg-white p-8">
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }

  const currentCoverLetterData = {
    applicantName: applicantName || user?.name || 'Your Name',
    email: email || user?.email || 'email@example.com',
    phone,
    location,
    linkedin,
    recipientName,
    companyName,
    jobTitle,
    salutation,
    bodyParagraphs,
    closing,
    templateId,
    themeColor,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl shadow-lg shadow-primary-500/20">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold bg-transparent text-gray-100 border-b border-transparent 
                       hover:border-gray-700 focus:border-primary-500 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-400">Cover Letter Studio & AI Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAiModal(true)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500"
          >
            <Sparkles className="w-4 h-4" /> AI Generator
          </button>
          <button
            onClick={() => setShowSavedModal(true)}
            className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" /> Saved Letters
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCopyText}
            className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy Text
          </button>
          <button
            onClick={handleDownloadPdf}
            className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Form Editor / Design Tab */}
        <div className={`${showPreview ? 'w-full md:w-1/2' : 'w-full'} transition-all duration-300`}>
          {/* Tabs Header */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'editor' ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'glass-card text-gray-400'
              }`}
            >
              <FileText className="w-4 h-4" /> Content Editor
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'design' ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'glass-card text-gray-400'
              }`}
            >
              <Palette className="w-4 h-4" /> Template & Colors
            </button>
          </div>

          {/* Form Content Tab */}
          {activeTab === 'editor' && (
            <div className="glass-card p-6 space-y-6 animate-fade-in">
              {/* Applicant Contact details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-1">
                  1. Your Info (Header)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label text-xs">Full Name</label>
                    <input value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Location</label>
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" className="input-field text-sm" />
                  </div>
                </div>
              </div>

              {/* Target Job & Recipient */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-1">
                  2. Recipient & Target Role
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="input-label text-xs">Target Job Title</label>
                    <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Company Name</label>
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="input-label text-xs">Recipient Name</label>
                    <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="input-field text-sm" />
                  </div>
                </div>
              </div>

              {/* Salutation & Paragraphs */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-1">
                  3. Cover Letter Content
                </h3>

                <div>
                  <label className="input-label text-xs">Salutation</label>
                  <input value={salutation} onChange={(e) => setSalutation(e.target.value)} className="input-field text-sm" />
                </div>

                {bodyParagraphs.map((para, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="input-label text-xs font-medium text-primary-300">Paragraph {idx + 1}</label>
                      {bodyParagraphs.length > 1 && (
                        <button
                          onClick={() => setBodyParagraphs(bodyParagraphs.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => {
                        const updated = [...bodyParagraphs];
                        updated[idx] = e.target.value;
                        setBodyParagraphs(updated);
                      }}
                      className="input-field text-sm leading-relaxed"
                    />
                  </div>
                ))}

                <button
                  onClick={() => setBodyParagraphs([...bodyParagraphs, 'New paragraph content...'])}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Paragraph
                </button>
              </div>
            </div>
          )}

          {/* Design & Colors Tab — All 20 Templates */}
          {activeTab === 'design' && (
            <div className="glass-card p-6 space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">Choose Cover Letter Template</h3>
                <p className="text-xs text-gray-400 mb-4">Matches your resume's layout and color branding.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {TEMPLATES.map((tmpl) => {
                    const isSelected = templateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          setTemplateId(tmpl.id);
                          if (!themeColor) setThemeColor(tmpl.defaultColor);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'bg-primary-500/20 border-primary-500 ring-2 ring-primary-500/50' : 'glass-card hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-gray-100">{tmpl.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-primary-400" />}
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-2">{tmpl.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Theme Color Palette</h3>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => {
                    const isColorActive = themeColor.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setThemeColor(preset.hex)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isColorActive ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isColorActive && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ready-made Profession Sample Buttons */}
              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Load Sample Template</h3>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_COVER_LETTERS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleLoadSample(sample)}
                      className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs border border-gray-700"
                    >
                      {sample.role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        {showPreview && (
          <div className="hidden md:block w-1/2 animate-slide-in">
            <div className="sticky top-24">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Live Document Preview
              </h3>
              <div ref={previewRef}>
                <CoverLetterPreview data={currentCoverLetterData} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Generation Wizard Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 sticky top-0 bg-gray-900 z-10">
              <div className="flex items-center gap-2 text-primary-300">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-lg text-gray-100">AI Cover Letter Generator</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-1 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Saved Resume Picker */}
              <div>
                <label className="input-label text-xs">Match With Saved Resume (Optional)</label>
                <select
                  value={aiResumeId}
                  onChange={(e) => setAiResumeId(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">None (Generate from Job Title)</option>
                  {(Array.isArray(resumesList) ? resumesList : []).map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label text-xs">Target Job Title *</label>
                  <input
                    value={aiJobTitle}
                    onChange={(e) => setAiJobTitle(e.target.value)}
                    placeholder="Senior Full Stack Engineer"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="input-label text-xs">Target Company Name *</label>
                  <input
                    value={aiCompanyName}
                    onChange={(e) => setAiCompanyName(e.target.value)}
                    placeholder="CloudScale Technologies"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Writing Tone Selector */}
              <div>
                <label className="input-label text-xs">Writing Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setAiTone(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        aiTone === t.id ? 'bg-primary-500/20 border-primary-500 text-primary-300' : 'glass-card text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      <div className="font-semibold text-xs">{t.label}</div>
                      <div className="text-[10px] opacity-75">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label text-xs">Paste Job Description / Key Requirements (Optional)</label>
                <textarea
                  rows={4}
                  value={aiJobDescription}
                  onChange={(e) => setAiJobDescription(e.target.value)}
                  placeholder="Paste target job responsibilities to tailor accomplishments..."
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800 sticky bottom-0 bg-gray-900 z-10">
              <button onClick={() => setShowAiModal(false)} className="btn-secondary text-xs py-2 px-4">
                Cancel
              </button>
              <button
                onClick={handleAiGenerate}
                disabled={generating}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
              >
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {generating ? 'Writing Cover Letter...' : 'Generate Letter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Cover Letters History Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary-400" /> Saved Cover Letters
              </h3>
              <button onClick={() => setShowSavedModal(false)} className="text-gray-400 hover:text-gray-200">✕</button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-2">
              {(!Array.isArray(savedLettersList) || savedLettersList.length === 0) ? (
                <p className="text-xs text-gray-400 italic text-center py-6">No saved cover letters found yet.</p>
              ) : (
                savedLettersList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      loadCoverLetter(item.id);
                      setShowSavedModal(false);
                    }}
                    className="p-3 glass-card hover:border-primary-500/50 rounded-xl cursor-pointer flex justify-between items-center transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-gray-100">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.job_title} at {item.company_name}</p>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
