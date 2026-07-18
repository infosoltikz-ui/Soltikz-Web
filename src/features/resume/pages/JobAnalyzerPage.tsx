import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { JobDescriptionAnalyzer } from '../../ai/components/analyzer/JobDescriptionAnalyzer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const JobAnalyzerPage = () => {
  const { resumeId } = useParams<{ resumeId: string }>();

  if (!resumeId) {
    return <div>Invalid Resume ID</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/dashboard/resumes/${resumeId}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Description Analyzer</h1>
          <p className="text-gray-500">Tailor your resume for a specific role to beat the ATS</p>
        </div>
      </div>

      <JobDescriptionAnalyzer resumeId={resumeId} />
    </div>
  );
};
