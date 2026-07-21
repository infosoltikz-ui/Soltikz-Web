import { FC } from 'react';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ResumeBenchmarkProps {
  benchmarking: {
    percentile: number;
    strengths: string[];
    weaknesses: string[];
  };
}

export const ResumeBenchmark: FC<ResumeBenchmarkProps> = ({ benchmarking }) => {
  const isAboveAverage = benchmarking.percentile >= 75;
  const isAverage = benchmarking.percentile >= 50 && benchmarking.percentile < 75;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-900">Industry Benchmark</h3>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Your Percentile</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-4xl font-bold text-slate-900">{benchmarking.percentile}</span>
              <span className="text-slate-500 pb-1">th</span>
            </div>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isAboveAverage ? 'bg-emerald-100 text-emerald-600' : 
            isAverage ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'
          }`}>
            {isAboveAverage ? <TrendingUp className="w-8 h-8" /> : 
             isAverage ? <Minus className="w-8 h-8" /> : 
             <TrendingDown className="w-8 h-8" />}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Compared to peers, you are stronger in:</p>
            <ul className="space-y-2">
              {benchmarking.strengths.length > 0 ? benchmarking.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              )) : (
                <li className="text-sm text-slate-400 italic">No clear strengths identified relative to peers.</li>
              )}
            </ul>
          </div>
          
          <div className="pt-2">
            <p className="text-sm font-medium text-slate-700 mb-2">Compared to peers, you fall behind in:</p>
            <ul className="space-y-2">
              {benchmarking.weaknesses.length > 0 ? benchmarking.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span>{w}</span>
                </li>
              )) : (
                <li className="text-sm text-slate-400 italic">No clear weaknesses identified relative to peers.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
