import { FC } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ATSScoreCardProps {
  score: number;
  sectionScores: {
    contact: number;
    summary: number;
    experience: number;
    skills: number;
    education: number;
    projects: number;
  };
}

export const ATSScoreCard: FC<ATSScoreCardProps> = ({ score, sectionScores }) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return '#10b981'; // emerald-500
    if (value >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getScoreTextColor = (value: number) => {
    if (value >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (value >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Overall ATS Score</h3>
        <div className="w-32 h-32">
          <CircularProgressbar 
            value={score} 
            text={`${score}%`} 
            styles={buildStyles({
              pathColor: getScoreColor(score),
              textColor: getScoreColor(score),
              trailColor: '#f1f5f9',
              textSize: '24px',
              pathTransitionDuration: 0.5,
            })}
          />
        </div>
        <div className={`mt-4 px-3 py-1 text-xs font-medium border rounded-full ${getScoreTextColor(score)}`}>
          {score >= 80 ? 'Excellent' : score >= 60 ? 'Needs Improvement' : 'Poor'}
        </div>
      </div>

      {/* Section Scores */}
      <div className="md:col-span-2 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Section Scores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {Object.entries(sectionScores).map(([section, value]) => (
            <div key={section} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="capitalize text-slate-600">{section}</span>
                <span className="font-medium" style={{ color: getScoreColor(value) }}>{value}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${value}%`, backgroundColor: getScoreColor(value) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
