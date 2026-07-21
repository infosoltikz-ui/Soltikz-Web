import React from 'react';
import { Target } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface TargetJobDetailsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  resumeType: 'FULLTIME' | 'C2C' | '';
}

export const TargetJobDetailsSection: React.FC<TargetJobDetailsSectionProps> = ({ register, errors, resumeType }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          3. Target Job Details
        </h2>
        <p className="text-sm text-slate-500 mt-1 pl-7">
          Tell us about the job you are targeting.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Target Company <span className="text-red-500">*</span>
          </label>
            <input
              type="text"
              {...register('targetCompany', { required: 'Target company is required' })}
              className={`w-full px-3 py-2 bg-white border ${errors.targetCompany ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary focus:border-primary'} rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-opacity-20`}
              placeholder="e.g. Google, Microsoft, Amazon"
            />
          {errors.targetCompany && (
            <p className="mt-1 text-xs text-red-500">{errors.targetCompany.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Target Role <span className="text-red-500">*</span>
          </label>
            <input
              type="text"
              {...register('targetRole', { required: 'Target role is required' })}
              className={`w-full px-3 py-2 bg-white border ${errors.targetRole ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary focus:border-primary'} rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-opacity-20`}
              placeholder="e.g. Frontend Developer, Software Engineer"
            />
          {errors.targetRole && (
            <p className="mt-1 text-xs text-red-500">{errors.targetRole.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Employment Type
          </label>
          <div className="relative">
            <select
              value={resumeType}
              disabled
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 appearance-none disabled:bg-white disabled:opacity-100"
            >
              <option value="FULLTIME">Full Time</option>
              <option value="C2C">C2C (Contract)</option>
              <option value="">Select a type above</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Expected Experience <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
            <input
              type="text"
              {...register('expectedExperience')}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-opacity-20"
              placeholder="e.g. 3-5 Years"
            />
        </div>
      </div>
    </div>
  );
};
