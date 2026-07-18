import { FC } from 'react';
import { Lightbulb, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAIStore } from '../../store/useAIStore';

interface ATSRecommendation {
  section: 'summary' | 'experience' | 'skills' | 'projects' | 'general';
  issue: string;
  suggestion: string;
  severity: 'High' | 'Medium' | 'Low';
}

interface ATSRecommendationPanelProps {
  recommendations: ATSRecommendation[];
}

export const ATSRecommendationPanel: FC<ATSRecommendationPanelProps> = ({ recommendations }) => {
  const { setSidebarOpen } = useAIStore();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        AI Recommendations
      </h3>
      
      {recommendations.length === 0 ? (
        <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 text-center text-slate-500">
          No major recommendations. Your resume is highly optimized!
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${getSeverityColor(rec.severity)}`}>
                    {rec.severity} Priority
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Section: {rec.section}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900">{rec.issue}</h4>
                <p className="text-sm text-slate-600">{rec.suggestion}</p>
              </div>
              <div className="shrink-0 pt-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Fix with AI
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
