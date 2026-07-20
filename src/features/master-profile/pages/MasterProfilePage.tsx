import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMasterProfile, useUpdateMasterProfile } from '../hooks/useMasterProfile';
import { MasterProfile } from '../types/masterProfile';

// Simplified layout to start
export const MasterProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useMasterProfile();
  const { mutate: updateProfile, isPending } = useUpdateMasterProfile();
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { register, watch, reset } = useForm<MasterProfile>({
    defaultValues: profile
  });

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  // Phase 1.12: Debounced Auto-Save
  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(() => {
        updateProfile(value as MasterProfile, {
          onSuccess: () => setSaveStatus('saved')
        });
      }, 2000); // Debounce by 2s for demonstration, typically 30s as per req
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProfile]);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Master Profile...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
      {/* Sidebar Progress */}
      <div className="w-1/4 bg-white p-6 rounded-xl border border-slate-200 h-fit sticky top-6 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-4">Profile Completeness</h2>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${profile?.completionPercentage || 0}%` }}
          />
        </div>
        <p className="text-sm font-medium text-slate-600 mb-6">{profile?.completionPercentage || 0}% Complete</p>
        
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === 'saving' && <span className="text-blue-500 font-medium">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-green-500 font-medium">Saved Successfully</span>}
          {saveStatus === 'idle' && <span className="text-slate-400">All changes saved</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Section 1: Personal Information */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input {...register('firstName')} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input {...register('lastName')} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input {...register('email')} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input {...register('mobileNumber')} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Career Objective</label>
              <textarea {...register('careerObjective')} rows={4} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
        </section>

        {/* Placeholders for other sections... */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-500 italic text-sm">
          Other sections (Education, Certifications, Skills, Employment, Projects, Languages, Awards, Achievements, Social Links) will be rendered here following the same React Hook Form patterns.
        </section>
      </div>
    </div>
  );
};
