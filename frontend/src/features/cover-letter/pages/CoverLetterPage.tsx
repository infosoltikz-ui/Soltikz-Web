import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wand2, FileText, Download, Save, RefreshCw } from 'lucide-react';
import { coverLetterApi } from '../api/coverLetterApi';
import { IconButton } from '@/components/ui/Button';

export const CoverLetterPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();

  const [activeTab, setActiveTab] = useState<'generate' | 'preview' | 'history'>('generate');
  
  // Form State
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [template, setTemplate] = useState('professional');

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  
  // Saved Letters
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    try {
      const data = await coverLetterApi.getAll();
      setHistory(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load history');
    }
  };

  const handleGenerate = async () => {
    if (!resumeId) return;
    setIsGenerating(true);
    setContent('');
    setError('');
    setActiveTab('preview');

    await coverLetterApi.streamGeneration(
      resumeId,
      { jobDescription, companyName, position, tone, length },
      (chunk) => {
        setContent((prev) => prev + chunk);
      },
      (data) => {
        setIsGenerating(false);
      },
      (err) => {
        setError(err.message || 'An error occurred during generation.');
        setIsGenerating(false);
      }
    );
  };

  const handleSave = async () => {
    if (!resumeId || !content) return;
    try {
      await coverLetterApi.save({
        resumeId,
        content,
        companyName,
        position,
        jobDescription,
        tone,
        length,
        template
      });
      alert('Cover letter saved successfully!');
    } catch (e: any) {
      alert(e.message || 'Failed to save');
    }
  };

  const handleExport = async (format: string, id?: string) => {
    // If id is not provided, we need to save first
    let exportId = id;
    if (!exportId) {
      if (!resumeId || !content) return;
      try {
        const saved = await coverLetterApi.save({
          resumeId, content, companyName, position, jobDescription, tone, length, template
        });
        exportId = saved.id;
      } catch (e: any) {
        alert('Failed to save before export: ' + e.message);
        return;
      }
    }

    try {
      if (!exportId) throw new Error('Cover letter ID is missing');
      const blob = await coverLetterApi.exportFormat(exportId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover_letter.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e: any) {
      alert('Export failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to={`/dashboard/resumes/${resumeId}/editor`}>
            <IconButton variant="ghost" icon={<ArrowLeft size={20} />} label="Back to Editor" aria-label="Back to Editor" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Cover Letter</h1>
            <p className="text-gray-500 mt-1">Generate highly personalized cover letters using your resume.</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'generate' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('generate')}
        >
          Generator
        </button>
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'preview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview & Edit
        </button>
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('history')}
        >
          Saved Letters
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Position</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tone</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly & Enthusiastic</option>
                    <option value="executive">Executive</option>
                    <option value="confident">Confident</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    <option value="professional">Professional</option>
                    <option value="modern">Modern</option>
                    <option value="executive">Executive</option>
                    <option value="startup">Startup</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-full flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
                <textarea
                  className="flex-1 w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  rows={8}
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                onClick={handleGenerate}
                disabled={!jobDescription || isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Wand2 size={20} />}
                {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="flex flex-col h-[600px]">
            <div className="flex justify-end gap-3 mb-4">
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                <Save size={16} /> Save
              </button>
              <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                <Download size={16} /> Export PDF
              </button>
              <button onClick={() => handleExport('DOCX')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FileText size={16} /> Export DOCX
              </button>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <textarea
              className="flex-1 w-full p-6 border rounded-lg font-serif text-gray-800 dark:text-gray-200 dark:bg-gray-900 dark:border-gray-700 resize-none leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isGenerating ? "AI is generating your cover letter..." : "Your cover letter will appear here..."}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved cover letters found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((cl) => (
                  <div key={cl.id} className="p-4 border rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <h3 className="font-semibold text-lg">{cl.title || 'Untitled Cover Letter'}</h3>
                    <p className="text-sm text-gray-500 mt-1">Template: {cl.template} • Tone: {cl.tone}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(cl.createdAt).toLocaleDateString()}</p>
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleExport('PDF', cl.id)}
                        className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border rounded hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Download size={14} /> PDF
                      </button>
                      <button 
                        onClick={() => handleExport('DOCX', cl.id)}
                        className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border rounded hover:bg-gray-50 flex items-center gap-1"
                      >
                        <FileText size={14} /> DOCX
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
