import { FC } from 'react';
import { Route, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RoadmapItem {
  priority: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  difficulty: string;
  suggestion: string;
}

interface ResumeRoadmapProps {
  roadmap: {
    quickWins: RoadmapItem[];
    mediumImprovements: RoadmapItem[];
    majorImprovements: RoadmapItem[];
  };
}

export const ResumeRoadmap: FC<ResumeRoadmapProps> = ({ roadmap }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderSection = (title: string, items: RoadmapItem[], icon: string, time: string) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="relative pl-8 pb-8 border-l-2 border-slate-200 last:border-0 last:pb-0">
        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center"></div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{icon}</span>
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full ml-auto">
            {time}
          </span>
        </div>
        
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-slate-700 mb-3">{item.suggestion}</p>
              
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getPriorityColor(item.priority)}`}>
                    {item.priority} Priority
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                    {item.impact} Impact
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                    {item.difficulty} Effort
                  </span>
                </div>
                
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Wand2 className="w-3 h-3" />
                  Fix with AI
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-8">
        <Route className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-900">Improvement Roadmap</h3>
      </div>
      
      <div className="ml-2">
        {renderSection('Quick Wins', roadmap.quickWins, '⚡', '5 mins')}
        {renderSection('Medium Improvements', roadmap.mediumImprovements, '🛠️', '30 mins')}
        {renderSection('Major Improvements', roadmap.majorImprovements, '🏗️', '1-2 hours')}
      </div>
    </div>
  );
};
