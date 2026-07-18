import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface ATSIssueListProps {
  keywordAnalysis: {
    found: string[];
    missing: string[];
    density: string;
  };
  formattingAnalysis: {
    issues: string[];
    isAtsFriendly: boolean;
  };
  contentAnalysis: {
    grammarIssues: string[];
    actionVerbsScore: number;
    quantifiedAchievementsScore: number;
    buzzwords: string[];
  };
  atsCompatibility: {
    parseSuccess: boolean;
    missingSections: string[];
  };
}

export const ATSIssueList: React.FC<ATSIssueListProps> = ({ 
  keywordAnalysis, 
  formattingAnalysis, 
  contentAnalysis, 
  atsCompatibility 
}) => {
  return (
    <div className="space-y-6">
      {/* Parsing & Compatibility */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          {atsCompatibility.parseSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
          <h3 className="text-sm font-semibold text-slate-900">ATS Parsing Compatibility</h3>
        </div>
        <div className="p-4 text-sm text-slate-700">
          <p className="mb-2">
            Status: <span className={atsCompatibility.parseSuccess ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
              {atsCompatibility.parseSuccess ? 'Parsed Successfully' : 'Parsing Issues Detected'}
            </span>
          </p>
          {atsCompatibility.missingSections.length > 0 && (
            <p className="text-amber-600 mt-2">
              <strong>Missing Standard Sections:</strong> {atsCompatibility.missingSections.join(', ')}
            </p>
          )}
          {!formattingAnalysis.isAtsFriendly && (
            <p className="text-red-600 mt-2 flex items-start gap-1">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              Your resume uses complex formatting (tables, columns, or images) that may confuse ATS parsers.
            </p>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            Keyword Analysis
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-slate-600 mb-3">
            Keyword Density: <strong className={keywordAnalysis.density === 'Optimal' ? 'text-emerald-600' : 'text-amber-600'}>{keywordAnalysis.density}</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-emerald-600 uppercase mb-2">Keywords Found</h4>
              <div className="flex flex-wrap gap-1.5">
                {keywordAnalysis.found.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-200">{kw}</span>
                ))}
                {keywordAnalysis.found.length === 0 && <span className="text-xs text-slate-500">None found</span>}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-amber-600 uppercase mb-2">Missing/Weak Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {keywordAnalysis.missing.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs border border-amber-200">{kw}</span>
                ))}
                {keywordAnalysis.missing.length === 0 && <span className="text-xs text-slate-500">None identified</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content & Formatting Issues */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Content & Formatting Issues
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {formattingAnalysis.issues.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">Formatting</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                {formattingAnalysis.issues.map((issue, i) => <li key={i}>{issue}</li>)}
              </ul>
            </div>
          )}
          {contentAnalysis.grammarIssues.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">Grammar & Typos</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                {contentAnalysis.grammarIssues.map((issue, i) => <li key={i}>{issue}</li>)}
              </ul>
            </div>
          )}
          {contentAnalysis.buzzwords.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">Cliché Buzzwords to Remove</h4>
              <div className="flex flex-wrap gap-1.5">
                {contentAnalysis.buzzwords.map((bw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-xs border border-rose-200">{bw}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4 pt-2">
            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500">Action Verbs</div>
              <div className={`text-lg font-bold ${contentAnalysis.actionVerbsScore >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {contentAnalysis.actionVerbsScore}/100
              </div>
            </div>
            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500">Quantified Impact</div>
              <div className={`text-lg font-bold ${contentAnalysis.quantifiedAchievementsScore >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {contentAnalysis.quantifiedAchievementsScore}/100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
