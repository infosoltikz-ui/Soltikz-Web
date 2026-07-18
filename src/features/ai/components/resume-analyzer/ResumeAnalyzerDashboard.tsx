// Triggering IDE re-index
import { FC } from 'react';
import { useAIStore } from '../../store/useAIStore';
import { Button } from '@/components/ui/Button';
import { ScanSearch, Brain } from 'lucide-react';
import { ResumeScoreOverview } from './ResumeScoreOverview';
import { ResumeBenchmark } from './ResumeBenchmark';
import { ResumeInsights } from './ResumeInsights';
import { ResumeRoadmap } from './ResumeRoadmap';
import { ResumeHistory } from './ResumeHistory';

interface ResumeAnalyzerDashboardProps {
  resumeId: string;
}

export const ResumeAnalyzerDashboard: FC<ResumeAnalyzerDashboardProps> = ({ resumeId }) => {
  const { resumeAnalyzerLoading, setResumeAnalyzerLoading, resumeAnalyzerResults, setResumeAnalyzerResults } = useAIStore();

  const handleAnalyze = async () => {
    setResumeAnalyzerLoading(true);
    try {
      const response = await fetch('/api/ai/resume/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ resumeId })
      });
      const data = await response.json();
      if (response.ok) {
        setResumeAnalyzerResults(data.analysis);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to run resume analyzer:', error);
      // In a real app we would show a toast error here
    } finally {
      setResumeAnalyzerLoading(false);
    }
  };

  if (!resumeAnalyzerResults && !resumeAnalyzerLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Enterprise Resume Analyzer</h2>
            <p className="text-slate-500 max-w-md">
              Get a comprehensive 360-degree evaluation of your resume from an expert recruiter perspective.
              Benchmark against industry standards and receive an actionable improvement roadmap.
            </p>
            <Button onClick={handleAnalyze} size="lg" className="mt-4 gap-2">
              <ScanSearch className="w-5 h-5" />
              Analyze Resume
            </Button>
          </div>
        </div>
        <div className="w-full md:w-80 shrink-0">
          <ResumeHistory resumeId={resumeId} onSelect={setResumeAnalyzerResults} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Analysis Results</h2>
          <Button onClick={handleAnalyze} disabled={resumeAnalyzerLoading} variant="outline" className="gap-2 bg-white">
            <ScanSearch className="w-4 h-4" />
            {resumeAnalyzerLoading ? 'Analyzing...' : 'Re-analyze'}
          </Button>
        </div>

        {resumeAnalyzerLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Running comprehensive analysis...</p>
          </div>
        ) : resumeAnalyzerResults ? (
          <div className="space-y-6">
            <ResumeScoreOverview 
              overallScore={resumeAnalyzerResults.overallScore}
              letterGrade={resumeAnalyzerResults.letterGrade}
              contentQuality={resumeAnalyzerResults.contentQuality}
              recruiterPerspective={resumeAnalyzerResults.recruiterPerspective}
              atsCompatibility={resumeAnalyzerResults.atsCompatibility}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResumeInsights insights={resumeAnalyzerResults.insights} />
              <ResumeBenchmark benchmarking={resumeAnalyzerResults.benchmarking} />
            </div>

            <ResumeRoadmap roadmap={resumeAnalyzerResults.roadmap} />
          </div>
        ) : null}
      </div>
      
      <div className="w-full md:w-80 shrink-0 space-y-6">
        <ResumeHistory resumeId={resumeId} onSelect={setResumeAnalyzerResults} />
      </div>
    </div>
  );
};
