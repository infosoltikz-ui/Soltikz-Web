import React from 'react';
import { useJobAnalysis } from '../hooks/jobDescription.queries';
import { Briefcase, Building2, MapPin, Loader2, CheckCircle2, ChevronRight, FileSearch, Target, GraduationCap } from 'lucide-react';

interface AnalysisSidebarProps {
  resumeId: string;
}

export const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({ resumeId }) => {
  const { data, isLoading } = useJobAnalysis(resumeId);

  if (isLoading) {
    return (
      <div className="bg-slate-50 border-l border-slate-200 h-full w-80 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-sm text-slate-500 font-medium">Loading analysis...</p>
      </div>
    );
  }

  const { jobDescription, analysis } = data || {};

  if (!jobDescription || !analysis) {
    return (
      <div className="bg-slate-50 border-l border-slate-200 h-full w-80 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <FileSearch className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-slate-800 font-semibold mb-2">No Job Description</h3>
        <p className="text-sm text-slate-500">
          Paste or upload a job description to get AI-powered insights and extraction.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-l border-slate-200 h-full w-96 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-600" />
          Job Insights
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Job Header */}
        <div className="space-y-3 border-b border-slate-100 pb-5">
          <h3 className="text-xl font-bold text-slate-900">{analysis.role || jobDescription.jobTitle || 'Unknown Role'}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm text-slate-600 gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              {analysis.company || jobDescription.companyName || 'Unknown Company'}
            </div>
            {(jobDescription.location) && (
              <div className="flex items-center text-sm text-slate-600 gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {jobDescription.location}
              </div>
            )}
            {(analysis.experience || jobDescription.experienceLevel) && (
              <div className="flex items-center text-sm text-slate-600 gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {analysis.experience || jobDescription.experienceLevel}
              </div>
            )}
          </div>
        </div>

        {/* Summary Details */}
        {analysis.summary && (
          <div className="space-y-4 border-b border-slate-100 pb-5">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Summary</h4>
            <div className="space-y-3">
              {analysis.summary.roleSummary && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 mb-1 block">Role Summary</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{analysis.summary.roleSummary}</p>
                </div>
              )}
              {analysis.summary.topPriorities && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 mb-1 block">Top Priorities</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{analysis.summary.topPriorities}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {(analysis.skills?.required?.length > 0 || analysis.skills?.preferred?.length > 0) && (
          <div className="space-y-4 border-b border-slate-100 pb-5">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Required Skills
            </h4>
            
            {analysis.skills?.required?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {analysis.skills.required.map((skill: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            
            {analysis.skills?.preferred?.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-500 mb-2 block">Preferred / Nice-to-have</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.preferred.map((skill: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Responsibilities */}
        {analysis.responsibilities?.length > 0 && (
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Key Responsibilities</h4>
            <ul className="space-y-2">
              {analysis.responsibilities.map((resp: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Qualifications */}
        {analysis.qualifications?.length > 0 && (
          <div className="space-y-3 pb-2">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Qualifications
            </h4>
            <ul className="space-y-2">
              {analysis.qualifications.map((qual: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                  <span className="leading-relaxed">{qual}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
      
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-center text-slate-400">
        AI Analysis • v{jobDescription.analysis?.analysisVersion || '1.0'}
      </div>
    </div>
  );
};
