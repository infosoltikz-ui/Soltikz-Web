import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { storageService } from '../../services/storage.service';
import { Upload, X } from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';

export const PersonalInformationSection: React.FC = () => {
  const { register, watch, setValue } = useFormContext<MasterProfile>();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profilePhoto = watch('profilePhoto');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await storageService.upload(file);
      setValue('profilePhoto', url, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      console.error('Upload failed', error);
      // useUIStore.getState().toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async () => {
    if (profilePhoto) {
      try {
        await storageService.delete(profilePhoto);
        setValue('profilePhoto', null, { shouldDirty: true });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <section id="personal" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b">Personal Information</h2>
      
      {/* Profile Photo */}
      <div className="mb-8 flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
          {profilePhoto ? (
            <>
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={removePhoto}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="text-slate-400">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-slate-700">Profile Photo</h3>
          <p className="text-sm text-slate-500 mb-3">Upload a professional headshot</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Choose File'}
          </button>
        </div>
      </div>

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
