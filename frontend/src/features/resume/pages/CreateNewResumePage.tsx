import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMasterProfile } from '../../master-profile/hooks/useMasterProfile';
import { useCreateResume } from '../hooks/resume.queries';
import { useAnalyzeJobDescription } from '../hooks/jobDescription.queries';
import { useGenerateOptimization } from '../hooks/resumeOptimization.queries';
import { CreateResumeHeader } from '../components/create/CreateResumeHeader';
import { ResumeTypeSection } from '../components/create/ResumeTypeSection';
import { PersonalInformationSection } from '../components/create/PersonalInformationSection';
import { TargetJobDetailsSection } from '../components/create/TargetJobDetailsSection';
import { JobDescriptionSection } from '../components/create/JobDescriptionSection';
import { GenerateResumeButton } from '../components/create/GenerateResumeButton';
import { CreateResumeSidebar } from '../components/create/CreateResumeSidebar';
import { PageLoader } from '@/components/ui/States';

interface CreateResumeFormValues {
  resumeType: 'FULLTIME' | 'C2C' | '';
  targetCompany: string;
  targetRole: string;
  expectedExperience: string;
  jobDescription: string;
}

export const CreateNewResumePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: masterProfile, isLoading: isProfileLoading } = useMasterProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const createResumeMutation = useCreateResume();
  const analyzeJdMutation = useAnalyzeJobDescription();
  const optimizeMutation = useGenerateOptimization();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateResumeFormValues>({
    defaultValues: {
      resumeType: (searchParams.get('type') as 'FULLTIME' | 'C2C') || '',
      targetCompany: '',
      targetRole: '',
      expectedExperience: '',
      jobDescription: '',
    }
  });

  const resumeType = watch('resumeType');
  const targetCompany = watch('targetCompany');
  const targetRole = watch('targetRole');
  const jobDescription = watch('jobDescription');

  // Compute current step based on form values
  useEffect(() => {
    let step = 1;
    if (resumeType) step = 2;
    if (resumeType && !isProfileLoading) step = 3;
    if (resumeType && !isProfileLoading && targetCompany && targetRole && jobDescription) step = 3; // Ready to submit
    setCurrentStep(step);
  }, [resumeType, isProfileLoading, targetCompany, targetRole, jobDescription]);

  const onSubmit = async (data: CreateResumeFormValues) => {
    setIsGenerating(true);
    setCurrentStep(3);
    
    try {
      // 1. Generate Resume Name automatically
      const companyPart = data.targetCompany ? ` - ${data.targetCompany}` : '';
      const rolePart = data.targetRole || 'Resume';
      const resumeName = `${rolePart}${companyPart}`;

      // 2. Clone Master Profile / Create Resume Draft
      const newResume = await createResumeMutation.mutateAsync({
        title: resumeName,
        targetRole: data.targetRole,
        // Optional company mapping if your API supports it.
      } as any); // Assuming mutateAsync returns the created resume object with an ID

      const newResumeId = newResume?.id || (newResume as any)?.data?.id;

      if (!newResumeId) {
        throw new Error("Failed to create resume draft");
      }

      setCurrentStep(4); // AI Optimization step
      
      // 3. Save JD & Run Analysis if provided
      if (data.jobDescription) {
        await analyzeJdMutation.mutateAsync({
          resumeId: newResumeId,
          jobDescription: data.jobDescription,
          sourceType: 'Paste'
        });
      }

      setCurrentStep(5); // ATS Analysis step (Simulated for now)
      
      // 4. Run AI Resume Optimization
      await optimizeMutation.mutateAsync({
        resumeId: newResumeId,
      });
      
      // 5. ATS Analysis (Placeholder simulated delay as backend may not be fully wired)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentStep(6);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 6. Navigate to the newly created workspace
      navigate(`/dashboard/resumes/${newResumeId}`);
    } catch (error) {
      console.error('Failed to generate resume', error);
      setCurrentStep(3); // Revert step on error
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full bg-slate-50/50 min-h-screen">
      <CreateResumeHeader />
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (70%) */}
        <div className="flex-1 w-full lg:w-[70%]">
          <ResumeTypeSection 
            value={resumeType} 
            onChange={(val) => setValue('resumeType', val, { shouldValidate: true })} 
          />
          
          <PersonalInformationSection 
            profile={masterProfile} 
            isLoading={isProfileLoading} 
          />
          
          <TargetJobDetailsSection 
            register={register} 
            errors={errors} 
            resumeType={resumeType} 
          />
          
          <JobDescriptionSection 
            register={register} 
            errors={errors} 
            watch={watch} 
            setValue={setValue} 
          />
          
          <GenerateResumeButton isLoading={isGenerating} />
        </div>

        {/* Right Sidebar (30%) */}
        <div className="w-full lg:w-[30%] space-y-6 shrink-0">
          <div className="sticky top-8">
            <CreateResumeSidebar currentStep={currentStep} />
          </div>
        </div>

      </form>
    </div>
  );
};
