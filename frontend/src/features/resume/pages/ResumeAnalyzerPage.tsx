
import { useParams, Link } from 'react-router-dom';
import { IconButton } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { ResumeAnalyzerDashboard } from '@features/ai/components/resume-analyzer/ResumeAnalyzerDashboard';

export const ResumeAnalyzerPage = () => {
  const { resumeId } = useParams<{ resumeId: string }>();

  if (!resumeId) {
    return <div>Invalid Resume ID</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl space-y-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <IconButton 
          as={Link} 
          to={`/dashboard/resumes/${resumeId}`} 
          icon={<ArrowLeft className="w-5 h-5" />} 
          label="Back" 
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Resume Analyzer</h1>
          <p className="text-slate-500 text-sm">Comprehensive 360° evaluation and improvement roadmap from a recruiter's perspective.</p>
        </div>
      </div>

      <ResumeAnalyzerDashboard resumeId={resumeId} />
    </div>
  );
};
