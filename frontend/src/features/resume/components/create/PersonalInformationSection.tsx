import React from 'react';
import { Pencil, User, Mail, Phone, MapPin, Link as LinkIcon, Briefcase, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { MasterProfile, MasterEmployment } from '../../../master-profile/types/masterProfile';

interface PersonalInformationSectionProps {
  profile?: MasterProfile | null;
  isLoading: boolean;
}

export const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({ profile, isLoading }) => {
  const navigate = useNavigate();

  const getExperienceText = () => {
    if (!profile?.totalExperience) return 'Not provided';
    return `${profile.totalExperience} Years`;
  };

  const currentEmployment = profile?.employments?.find((emp: MasterEmployment) => emp.currentCompany);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            2. Personal Information
          </h2>
          <p className="text-sm text-slate-500 mt-1 pl-7">
            Auto-filled from your master profile. You can edit if needed.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard/master-profile')}
          className="text-primary border-primary/30 hover:bg-primary-50 gap-2"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
      </div>

      <div>
        {isLoading ? (
          <div className="animate-pulse space-y-4 p-5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        ) : !profile ? (
          <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
            No profile data available. Please complete your master profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Full Name" value={`${profile.firstName} ${profile.lastName}`} />
            <InfoItem label="Email Address" value={profile.email} />
            <InfoItem label="Phone Number" value={profile.mobileNumber} />
            
            <InfoItem label="Location" value={[profile.currentLocation, profile.country].filter(Boolean).join(', ') || 'Not provided'} />
            <InfoItem label="LinkedIn Profile" value={profile.linkedin} isLink />
            <InfoItem label="Portfolio / Website" value={profile.portfolio} isLink />
            
            <InfoItem label="Total Experience" value={getExperienceText()} />
            <InfoItem label="Current Company" value={currentEmployment?.company || 'Not provided'} />
            <InfoItem label="Current Designation" value={profile.currentDesignation || currentEmployment?.designation || 'Not provided'} />
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, isLink }: { label: string, value?: string | null, isLink?: boolean }) => {
  return (
    <div className="flex flex-col bg-slate-50/50 border border-slate-200 rounded-lg p-3">
      <span className="text-xs text-slate-500 mb-1">
        {label}
      </span>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-900 hover:text-primary hover:underline truncate">
          {value}
        </a>
      ) : (
        <span className="text-sm font-medium text-slate-900 truncate">
          {value || 'Not provided'}
        </span>
      )}
    </div>
  );
};
