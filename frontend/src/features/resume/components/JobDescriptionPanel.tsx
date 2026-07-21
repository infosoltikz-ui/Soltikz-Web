import React, { useState } from 'react';
import { useAnalyzeJobDescription } from '../hooks/jobDescription.queries';
import { FileText, Upload, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface JobDescriptionPanelProps {
  resumeId: string;
  onAnalysisComplete?: () => void;
}

export const JobDescriptionPanel: React.FC<JobDescriptionPanelProps> = ({ resumeId, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [jdText, setJdText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const { mutate: analyze, isPending, isError, error, isSuccess } = useAnalyzeJobDescription();

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    
    analyze(
      {
        resumeId,
        jobDescription: jdText,
        sourceType: activeTab === 'paste' ? 'Paste' : 'PDF', // Simplified for now
        fileName: fileName || undefined
      },
      {
        onSuccess: () => {
          if (onAnalysisComplete) onAnalysisComplete();
        }
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    // For now, if it's a text file, read it. For PDF/DOCX we'll mock extraction or require a parser.
    // In a real implementation we would parse PDF here or send to backend.
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setJdText(event.target.result as string);
      } else {
        setJdText(`Mock extracted text from ${file.name}.\n\nSoftware Engineer required with 5 years experience in React and Node.js.`);
      }
    };
    
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      // Mock for non-text files to keep the flow working
      setTimeout(() => {
        setJdText(`Mock extracted text from ${file.name}.\n\nSoftware Engineer required with 5 years experience in React, TypeScript, and Node.js. Must have experience with AWS and Postgres.`);
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full max-h-[800px]">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          Job Description
        </h3>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('paste')}
          className={clsx(
            'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'paste'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          )}
        >
          Paste Text
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={clsx(
            'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'upload'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          )}
        >
          Upload File
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'paste' ? (
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-64 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none resize-none text-sm text-slate-700"
          />
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <Upload className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-sm text-slate-600 font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500 mb-4">PDF, DOCX, or TXT (Max 5MB)</p>
            <input
              type="file"
              id="jd-upload"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="jd-upload"
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Select File
            </label>
            {fileName && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
                <CheckCircle2 className="w-4 h-4" />
                {fileName}
              </div>
            )}
          </div>
        )}

        {isError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{(error as any)?.message || 'Failed to analyze job description. Please try again.'}</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <button
          onClick={() => {
            setJdText('');
            setFileName(null);
          }}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleAnalyze}
          disabled={!jdText.trim() || isPending}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Analysis Saved
            </>
          ) : (
            'Analyze Job'
          )}
        </button>
      </div>
    </div>
  );
};
