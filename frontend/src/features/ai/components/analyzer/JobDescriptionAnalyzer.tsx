import React, { useState } from 'react';
import { useAIStore } from '../../store/useAIStore';
import { Brain, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const JobDescriptionAnalyzer = ({ resumeId }: { resumeId: string }) => {
  const { 
    jobAnalyzerLoading, 
    setJobAnalyzerLoading, 
    jobAnalyzerResults, 
    setJobAnalyzerResults,
    jobDescriptionText,
    setJobDescriptionText,
    tailoringLoading,
    setTailoringLoading
  } = useAIStore();

  const [activeTab, setActiveTab] = useState<'input' | 'analysis' | 'tailoring'>('input');

  const handleAnalyze = async () => {
    if (!jobDescriptionText.trim()) return;
    
    setJobAnalyzerLoading(true);
    try {
      const response = await fetch('/api/ai/job-description/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resumeId,
          jobDescription: jobDescriptionText
        })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setJobAnalyzerResults(data.analysis);
      setActiveTab('analysis');
    } catch (error) {
      console.error(error);
    } finally {
      setJobAnalyzerLoading(false);
    }
  };

  const renderInput = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">
        Paste the job description below. Our AI will analyze it against your current resume and highlight missing skills and gaps.
      </div>
      <textarea
        placeholder="Paste job description here..."
        className="w-full min-h-[300px] text-sm border border-slate-200 rounded-lg p-4 bg-white outline-none resize-y"
        value={jobDescriptionText}
        onChange={(e) => setJobDescriptionText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={handleAnalyze} disabled={jobAnalyzerLoading || !jobDescriptionText.trim()}>
          {jobAnalyzerLoading ? (
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4 animate-pulse" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Analyze Match
            </span>
          )}
        </Button>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!jobAnalyzerResults) return null;

    const { score, matchedSkills = [], missingSkills = [], recommendations = [] } = jobAnalyzerResults;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Match Score</h3>
            <p className="text-sm text-slate-500">How well your resume aligns with this role</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-indigo-600">{score}%</div>
            <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Matched Skills
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs border border-emerald-200">
                    {skill}
                  </span>
                ))}
                {matchedSkills.length === 0 && <span className="text-sm text-slate-500">No matching skills found.</span>}
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                Missing Skills (ATS Gaps)
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs border border-amber-200">
                    {skill}
                  </span>
                ))}
                {missingSkills.length === 0 && <span className="text-sm text-slate-500">No missing skills! You're a great match.</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Actionable Recommendations</h3>
          </div>
          <div className="p-4">
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
              {recommendations.map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={() => setActiveTab('input')}>
            Edit Job Description
          </Button>
          <Button onClick={() => setActiveTab('tailoring')}>
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Tailor Resume
            </span>
          </Button>
        </div>
      </div>
    );
  };

  const renderTailoring = () => {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Resume Tailoring</h3>
        <p className="text-slate-500 mb-6">Select a section of your resume to tailor it using AI based on the missing skills.</p>
        <p className="text-sm text-slate-400 italic">(Tailoring interface implementation details omitted for brevity)</p>
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={() => setActiveTab('analysis')}>Back to Analysis</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            AI Job Description Analyzer
          </h2>
          {jobAnalyzerResults && (
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'input' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('input')}
              >
                Input
              </Button>
              <Button 
                variant={activeTab === 'analysis' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('analysis')}
              >
                Analysis
              </Button>
              <Button 
                variant={activeTab === 'tailoring' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('tailoring')}
              >
                Tailoring
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'input' && renderInput()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'tailoring' && renderTailoring()}
      </div>
    </div>
  );
};
