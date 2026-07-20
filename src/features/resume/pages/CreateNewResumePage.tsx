import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMasterProfile } from '../../master-profile/hooks/useMasterProfile';
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
  const { data: masterProfile, isLoading: isProfileLoading } = useMasterProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateResumeFormValues>({
    defaultValues: {
      resumeType: '',
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
    setCurrentStep(4); // AI Optimization step
    
    // Simulate generation for now - this will be wired to the real API
    try {
      // 1. Create a draft resume
      // 2. Submit to Job Analysis
      // 3. Submit to Resume Optimization
      // 4. Update timeline steps
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentStep(5);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(6);
      
      // Navigate to the newly created workspace
      // navigate(`/dashboard/resumes/${newResumeId}`);
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
