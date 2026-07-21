
import { FC } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ResumeScoreOverviewProps {
  overallScore: number;
  letterGrade: string;
  contentQuality: Record<string, number>;
  recruiterPerspective: Record<string, number>;
  atsCompatibility: {
    atsScore: number;
    keywordOptimization: number;
    parseSuccess: boolean;
  };
}

export const ResumeScoreOverview: FC<ResumeScoreOverviewProps> = ({ 
  overallScore, 
  letterGrade, 
  contentQuality,
  recruiterPerspective,
  atsCompatibility
}) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return '#10b981'; // emerald-500
    if (value >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getGradeColorClass = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (grade.startsWith('B')) return 'text-blue-500 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-red-500 bg-red-50 border-red-200';
  };

  const calculateAverage = (obj: Record<string, number>) => {
    const values = Object.values(obj);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const avgContent = calculateAverage(contentQuality);
  const avgRecruiter = calculateAverage(recruiterPerspective);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Score Overview</h3>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Main Score */}
        <div className="flex flex-col items-center justify-center space-y-4 shrink-0">
          <div className="w-32 h-32">
            <CircularProgressbar
              value={overallScore}
              text={`${overallScore}`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: getScoreColor(overallScore),
                textColor: '#0f172a', // slate-900
                trailColor: '#f1f5f9', // slate-100
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          <div className={`px-4 py-1 rounded-full border font-bold text-lg ${getGradeColorClass(letterGrade)}`}>
            Grade: {letterGrade}
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">Content Quality</span>
              <span className="font-bold text-slate-900">{avgContent}/100</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ width: `${avgContent}%`, backgroundColor: getScoreColor(avgContent) }} 
              />
            </div>
            <p className="text-xs text-slate-500">Summary, Experience, Skills, Projects</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">Recruiter view</span>
              <span className="font-bold text-slate-900">{avgRecruiter}/100</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ width: `${avgRecruiter}%`, backgroundColor: getScoreColor(avgRecruiter) }} 
              />
            </div>
            <p className="text-xs text-slate-500">First impression, Readability, Clarity</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">ATS Match</span>
              <span className="font-bold text-slate-900">{atsCompatibility.atsScore}/100</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ width: `${atsCompatibility.atsScore}%`, backgroundColor: getScoreColor(atsCompatibility.atsScore) }} 
              />
            </div>
            <p className="text-xs text-slate-500">Keywords, Formatting, Parseability</p>
          </div>
        </div>
      </div>
    </div>
  );
};
