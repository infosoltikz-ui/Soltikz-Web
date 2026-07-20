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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">2. Personal Information</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard/master-profile')}
          className="text-primary hover:text-primary-hover hover:bg-primary-50"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        ) : !profile ? (
          <div className="text-center py-6 text-slate-500">
            No profile data available. Please complete your master profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            <InfoItem icon={User} label="Full Name" value={`${profile.firstName} ${profile.lastName}`} />
            <InfoItem icon={Mail} label="Email Address" value={profile.email} />
            <InfoItem icon={Phone} label="Phone Number" value={profile.mobileNumber} />
            <InfoItem 
              icon={MapPin} 
              label="Location" 
              value={[profile.currentLocation, profile.country].filter(Boolean).join(', ') || 'Not provided'} 
            />
            <InfoItem icon={LinkIcon} label="LinkedIn" value={profile.linkedin} isLink />
            <InfoItem icon={LinkIcon} label="Portfolio Website" value={profile.portfolio} isLink />
            <InfoItem icon={Briefcase} label="Years of Experience" value={getExperienceText()} />
            <InfoItem icon={Building} label="Current Company" value={currentEmployment?.company || 'Not provided'} />
            <InfoItem icon={User} label="Current Designation" value={profile.currentDesignation || currentEmployment?.designation || 'Not provided'} />
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, isLink }: { icon: any, label: string, value?: string | null, isLink?: boolean }) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline truncate">
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
