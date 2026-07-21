import { useParams, Link } from 'react-router-dom';
import { IconButton } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { ATSScanner } from '@features/ai/components/scanner/ATSScanner';

export const ATSScannerPage = () => {
  const { resumeId } = useParams<{ resumeId: string }>();

  if (!resumeId) {
    return <div>Invalid Resume ID</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <IconButton 
          as={Link} 
          to={`/dashboard/resumes/${resumeId}`} 
          icon={<ArrowLeft className="w-5 h-5" />} 
          label="Back" 
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">ATS Scanner</h1>
          <p className="text-slate-500 text-sm">Analyze your resume for ATS compatibility and optimize it for success.</p>
        </div>
      </div>

      <ATSScanner resumeId={resumeId} />
    </div>
  );
};
