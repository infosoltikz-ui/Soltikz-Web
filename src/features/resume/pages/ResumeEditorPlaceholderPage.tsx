import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResume } from '../hooks/resume.queries';
import { ArrowLeft, HardHat, FileText, CheckCircle2, Clock } from 'lucide-react';

export const ResumeEditorPlaceholderPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { data: resume, isLoading } = useResume(resumeId!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
          <div className="w-32 h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Resume Not Found</h2>
          <p className="text-slate-500 mb-6">The resume you are looking for does not exist.</p>
          <Link to="/dashboard" className="text-primary-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight">{resume.title}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{resume.template?.name || 'Blank Template'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Updated Today
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500" 
                style={{ width: `${resume.completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-slate-600">{resume.completionPercentage}%</span>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Save Draft
          </button>
        </div>
      </header>

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Sections) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sections</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {[
              { name: 'Personal Details', done: true },
              { name: 'Professional Summary', done: true },
              { name: 'Work Experience', done: false },
              { name: 'Education', done: false },
              { name: 'Skills', done: false },
              { name: 'Projects', done: false },
            ].map((section, idx) => (
              <button 
                key={idx}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  idx === 0 ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 opacity-50" />
                  {section.name}
                </div>
                {section.done && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Center Canvas (Placeholder) */}
        <main className="flex-1 overflow-auto p-8 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-slate-200/60 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-500"></div>
            
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <HardHat className="w-10 h-10 text-primary-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Under Construction</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              The AI-powered Resume Builder module is scheduled for <strong>Sprint 3.2</strong>. 
              This is just a placeholder route to verify the dashboard navigation flow.
            </p>
            
            <Link 
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded-xl transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};
