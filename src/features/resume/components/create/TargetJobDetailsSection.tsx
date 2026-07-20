import React from 'react';
import { Building2, Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface TargetJobDetailsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  resumeType: 'FULLTIME' | 'C2C' | '';
}

export const TargetJobDetailsSection: React.FC<TargetJobDetailsSectionProps> = ({ register, errors, resumeType }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">3. Target Job Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Target Company <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('targetCompany', { required: 'Target company is required' })}
              className={`w-full pl-10 pr-4 py-2 bg-white border ${errors.targetCompany ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary focus:border-primary'} rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-opacity-20`}
              placeholder="e.g. Google, Amazon, Microsoft"
            />
          </div>
          {errors.targetCompany && (
            <p className="mt-1 text-xs text-red-500">{errors.targetCompany.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Target Role <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('targetRole', { required: 'Target role is required' })}
              className={`w-full pl-10 pr-4 py-2 bg-white border ${errors.targetRole ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary focus:border-primary'} rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-opacity-20`}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
          {errors.targetRole && (
            <p className="mt-1 text-xs text-red-500">{errors.targetRole.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Employment Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="text"
              readOnly
              value={resumeType === 'FULLTIME' ? 'Full Time' : resumeType === 'C2C' ? 'C2C (Contract)' : 'Select a type above'}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Expected Experience <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register('expectedExperience')}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-opacity-20"
              placeholder="e.g. 5 Years"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
