import React, { useState } from 'react';
import { useGenerateOptimization, useOptimizationHistory } from '../../hooks/resumeOptimization.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Loader2, Wand2, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SuggestionCard } from './SuggestionCard';
import { Badge } from '@/components/ui/Badge';

interface ResumeOptimizationPanelProps {
  resumeId: string;
}

export const ResumeOptimizationPanel: React.FC<ResumeOptimizationPanelProps> = ({ resumeId }) => {
  const { data: historyData, isLoading: isHistoryLoading } = useOptimizationHistory(resumeId);
  const { mutate: generateOptimization, isPending: isGenerating } = useGenerateOptimization();
  const liveSummary = useResumeBuilderStore(state => state.liveSummary);
  const setLiveSummary = useResumeBuilderStore(state => state.setLiveSummary);
  const liveExperiences = useResumeBuilderStore(state => state.liveExperiences);
  const setLiveExperiences = useResumeBuilderStore(state => state.setLiveExperiences);

  const [targetSection, setTargetSection] = useState('All');

  const handleOptimize = () => {
    generateOptimization({ resumeId, targetSection });
  };

  const handleAcceptSummary = (editedText: string) => {
    if (liveSummary) {
      setLiveSummary({ ...liveSummary, content: editedText });
    }
  };

  const handleAcceptExperience = (id: string, editedText: string) => {
    const updatedExperiences = liveExperiences.map(exp => 
      exp.id === id ? { ...exp, description: editedText } : exp
    );
    setLiveExperiences(updatedExperiences);
  };

  if (isHistoryLoading) {
    return (
      <div className="bg-slate-50 border-l border-slate-200 h-full w-96 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-sm text-slate-500 font-medium">Loading optimization history...</p>
      </div>
    );
  }

  const latestOptimization = historyData?.history?.[0];
  const suggestions = latestOptimization?.structuredSuggestions;

  return (
    <div className="bg-white border-l border-slate-200 h-full w-96 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-emerald-600" />
          AI Optimization
        </h2>
        <Button 
          onClick={handleOptimize} 
          disabled={isGenerating}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Wand2 className="w-4 h-4 mr-1" />
          )}
          Optimize
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
        {!suggestions ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-slate-800 font-semibold mb-2">No Optimizations Yet</h3>
            <p className="text-sm text-slate-500 mb-6">
              Generate AI suggestions tailored strictly to the Job Description. The AI will never fabricate facts.
            </p>
            <div className="flex justify-center gap-2 mb-4">
              <select 
                className="text-sm border-slate-200 rounded p-1"
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
              >
                <option value="All">All Sections</option>
                <option value="Summary">Summary</option>
                <option value="Experience">Experience</option>
                <option value="Skills">Skills</option>
              </select>
            </div>
            <Button onClick={handleOptimize} disabled={isGenerating} className="bg-emerald-600">
              Generate Suggestions
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Score Overview */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Overall Match</h3>
                  <div className="text-3xl font-bold text-emerald-600 mt-1">
                    {suggestions.overallScore || 0}%
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">ATS Estimate</h3>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {suggestions.estimatedATS || 0}%
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Matched Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {suggestions.matchedKeywords?.slice(0, 8).map((kw: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {suggestions.missingKeywords?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-500" /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestions.missingKeywords.slice(0, 8).map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-rose-50 text-rose-700 hover:bg-rose-100">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {suggestions.recommendations?.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h4 className="text-xs font-bold text-amber-800 uppercase mb-2">High-Level Recommendations</h4>
                <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                  {suggestions.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestion Cards */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Targeted Suggestions</h3>
                <div className="flex gap-2">
                  <select 
                    className="text-xs border-slate-200 rounded p-1"
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Summary">Summary</option>
                    <option value="Experience">Experience</option>
                  </select>
                </div>
              </div>

              {suggestions.summary?.suggested && (
                <SuggestionCard 
                  type="Summary"
                  currentText={suggestions.summary.current}
                  suggestedText={suggestions.summary.suggested}
                  reason={suggestions.summary.reason}
                  atsImpact={suggestions.summary.atsImpact}
                  onAccept={handleAcceptSummary}
                  onReject={() => console.log('Rejected')}
                />
              )}

              {suggestions.experience?.map((exp: any, i: number) => (
                <SuggestionCard 
                  key={i}
                  type="Experience"
                  currentText={exp.current}
                  suggestedText={exp.suggested}
                  reason={exp.reason}
                  atsImpact={exp.atsImpact}
                  onAccept={(text) => handleAcceptExperience(exp.id, text)}
                  onReject={() => console.log('Rejected')}
                />
              ))}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
