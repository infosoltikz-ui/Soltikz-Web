import { FC } from 'react';
import { useAIStore } from '../../store/useAIStore';
import { Button } from '@/components/ui/Button';
import { ScanSearch, Brain } from 'lucide-react';
import { ATSScoreCard } from './ATSScoreCard';
import { ATSIssueList } from './ATSIssueList';
import { ATSRecommendationPanel } from './ATSRecommendationPanel';
import { ATSHistory } from './ATSHistory';

interface ATSScannerProps {
  resumeId: string;
}

export const ATSScanner: FC<ATSScannerProps> = ({ resumeId }) => {
  const { atsScannerLoading, setAtsScannerLoading, atsScannerResults, setAtsScannerResults } = useAIStore();

  const handleScan = async () => {
    setAtsScannerLoading(true);
    try {
      const response = await fetch('/api/ai/ats/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ resumeId })
      });

      if (!response.ok) throw new Error('ATS Scan failed');

      const data = await response.json();
      setAtsScannerResults(data.scan);
    } catch (error) {
      console.error(error);
    } finally {
      setAtsScannerLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Run ATS Scan</h2>
          <p className="text-sm text-slate-500 max-w-xl">
            Our AI will parse your resume exactly like a modern Applicant Tracking System (ATS), scoring it on formatting, keywords, content depth, and machine readability.
          </p>
        </div>
        <Button 
          onClick={handleScan} 
          disabled={atsScannerLoading}
          size="lg"
          className="w-full md:w-auto shrink-0"
        >
          {atsScannerLoading ? (
            <span className="flex items-center gap-2">
              <Brain className="w-5 h-5 animate-pulse" />
              Scanning...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ScanSearch className="w-5 h-5" />
              {atsScannerResults ? 'Rescan Resume' : 'Scan Resume'}
            </span>
          )}
        </Button>
      </div>

      {/* Results */}
      {atsScannerResults && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ATSScoreCard 
            score={atsScannerResults.overallScore} 
            sectionScores={atsScannerResults.sectionScores} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ATSIssueList 
              keywordAnalysis={atsScannerResults.keywordAnalysis}
              formattingAnalysis={atsScannerResults.formattingAnalysis}
              contentAnalysis={atsScannerResults.contentAnalysis}
              atsCompatibility={atsScannerResults.atsCompatibility}
            />
            <ATSRecommendationPanel 
              recommendations={atsScannerResults.recommendations} 
            />
          </div>
        </div>
      )}

      {/* History */}
      <ATSHistory 
        resumeId={resumeId} 
        onSelect={(result) => setAtsScannerResults(result)} 
      />
    </div>
  );
};
