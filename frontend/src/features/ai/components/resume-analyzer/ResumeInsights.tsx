import { FC } from 'react';
import { Lightbulb, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

interface ResumeInsightsProps {
  insights: {
    topStrengths: string[];
    criticalWeaknesses: string[];
    missingSections: string[];
    missingSkills: string[];
    careerGrowthSuggestions: string[];
  };
}

export const ResumeInsights: FC<ResumeInsightsProps> = ({ insights }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
      </div>
      
      <div className="space-y-6 flex-1">
        {/* Strengths */}
        {insights.topStrengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-900">Top Strengths</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.topStrengths.map((str, i) => (
                <span key={i} className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded border border-emerald-200">
                  {str}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {insights.criticalWeaknesses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <p className="text-sm font-semibold text-slate-900">Critical Weaknesses</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.criticalWeaknesses.map((wk, i) => (
                <span key={i} className="inline-flex px-2 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded border border-rose-200">
                  {wk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Elements */}
        {(insights.missingSections.length > 0 || insights.missingSkills.length > 0) && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-semibold text-slate-900">Missing Elements</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.missingSections.map((sec, i) => (
                <span key={`sec-${i}`} className="inline-flex px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded border border-amber-200">
                  Section: {sec}
                </span>
              ))}
              {insights.missingSkills.map((skill, i) => (
                <span key={`skill-${i}`} className="inline-flex px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">
                  Skill: {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Career Growth */}
        {insights.careerGrowthSuggestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-semibold text-slate-900">Career Growth Advice</p>
            </div>
            <ul className="space-y-2">
              {insights.careerGrowthSuggestions.map((advice, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
