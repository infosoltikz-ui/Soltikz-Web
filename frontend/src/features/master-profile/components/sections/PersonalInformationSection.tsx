import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { RichTextEditor } from '../RichTextEditor';

export const PersonalInformationSection: React.FC = () => {
  const { register, watch, setValue } = useFormContext<MasterProfile>();
  return (
    <section id="personal" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
          <input {...register('firstName')} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
          <input {...register('lastName')} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input {...register('email')} type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
          <input {...register('mobileNumber')} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Designation</label>
          <input {...register('currentDesignation')} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Total Experience (Years)</label>
          <input {...register('totalExperience')} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Location (City, State)</label>
          <input {...register('currentLocation')} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
          <input {...register('country')} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notice Period</label>
          <select {...register('noticePeriod')} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
            <option value="">Select...</option>
            <option value="Immediate">Immediate</option>
            <option value="15 Days">15 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="60 Days">60 Days</option>
            <option value="90 Days">90 Days</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Location</label>
          <input {...register('preferredLocation')} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current CTC</label>
          <input {...register('currentCtc')} placeholder="e.g. $100,000" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Expected CTC</label>
          <input {...register('expectedCtc')} placeholder="e.g. $120,000" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Work Authorization</label>
          <select {...register('workAuthorization')} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
            <option value="">Select...</option>
            <option value="Citizen">Citizen</option>
            <option value="Permanent Resident">Permanent Resident (Green Card)</option>
            <option value="Work Visa">Work Visa (H1B, etc)</option>
            <option value="Student Visa">Student Visa (F1/OPT)</option>
            <option value="Requires Sponsorship">Requires Sponsorship</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Visa Status</label>
          <input {...register('visaStatus')} placeholder="e.g. H1B, OPT, TN" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
        
        <div className="col-span-1 md:col-span-2 mt-2">
          <RichTextEditor 
            name="careerObjective" 
            label="Career Objective" 
            placeholder="Write a compelling summary about your professional background and goals..."
            height={250}
          />
        </div>
      </div>
    </section>
  );
};
