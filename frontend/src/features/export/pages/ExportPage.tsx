import { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IconButton } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { ExportDialog } from '../components/ExportDialog';
import { ShareResumeModal } from '../components/ShareResumeModal';
import { ExportHistory } from '../components/ExportHistory';
import { ExportAnalytics } from '../components/ExportAnalytics';

export const ExportPage: FC = () => {
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
          label="Back to Editor" 
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Export & Share</h1>
          <p className="text-slate-500 text-sm">Download your resume in multiple formats, share securely, and track analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <ExportDialog resumeId={resumeId} />
          <ShareResumeModal resumeId={resumeId} />
        </div>
        
        <div className="space-y-6">
          <ExportAnalytics />
          <ExportHistory resumeId={resumeId} />
        </div>
      </div>
    </div>
  );
};
