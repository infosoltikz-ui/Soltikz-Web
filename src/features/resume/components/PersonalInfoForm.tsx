import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Resume } from '../services/resume.api';
import { useUpdatePersonal } from '../hooks/resume.queries';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';
import { ImageUploader } from './ImageUploader';

const personalInfoSchema = z.object({
  firstName: z.string().max(50, 'Max 50 characters').optional(),
  lastName: z.string().max(50, 'Max 50 characters').optional(),
  title: z.string().max(100, 'Max 100 characters').optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().max(20, 'Max 20 characters').optional(),
  countryCode: z.string().max(10, 'Max 10 chars').optional(),
  location: z.string().max(100, 'Max 100 chars').optional(),
  city: z.string().max(50, 'Max 50 characters').optional(),
  state: z.string().max(50, 'Max 50 chars').optional(),
  country: z.string().max(50, 'Max 50 characters').optional(),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  profileImage: z.string().optional(),
  about: z.string().max(500, 'Max 500 characters').optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  resume: Resume;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ resume }) => {
  const { mutate: updatePersonal } = useUpdatePersonal();
  const { setSaveStatus, setLastSavedAt, setLivePersonal } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: resume.personal?.firstName || '',
      lastName: resume.personal?.lastName || '',
      title: resume.personal?.title || '',
      email: resume.personal?.email || '',
      phone: resume.personal?.phone || '',
      countryCode: resume.personal?.countryCode || '',
      location: resume.personal?.location || '',
      city: resume.personal?.city || '',
      state: resume.personal?.state || '',
      country: resume.personal?.country || '',
      linkedin: resume.personal?.linkedin || '',
      github: resume.personal?.github || '',
      portfolio: resume.personal?.portfolio || '',
      website: resume.personal?.website || '',
      profileImage: resume.personal?.profileImage || '',
      about: resume.personal?.about || '',
    },
  });

  // Use subscribe instead of watch() in useEffect to avoid infinite loops
  // watch() creates a new object reference every render causing infinite re-renders
  useEffect(() => {
    const subscription = watch((values) => {
      setLivePersonal(values as any);
    });
    return () => subscription.unsubscribe();
  }, [watch, setLivePersonal]);

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000); // 5 seconds auto-save per requirements

  // Auto-save logic
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    updatePersonal(
      { id: resume.id, data: debouncedValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        },
        onError: () => {
          setSaveStatus('error');
        }
      }
    );
  }, [debouncedValues, resume.id, updatePersonal, setSaveStatus, setLastSavedAt]);

  const handleBlurSave = () => {
    // Save on blur per requirements
    setSaveStatus('saving');
    updatePersonal(
      { id: resume.id, data: formValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        },
        onError: () => {
          setSaveStatus('error');
        }
      }
    );
  };

  return (
    <div className="space-y-6 pb-20" onBlurCapture={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        handleBlurSave();
      }
    }}>
      <div className="flex flex-col md:flex-row gap-6">
        <Controller
          control={control}
          name="profileImage"
          render={({ field }) => (
            <ImageUploader 
              value={field.value} 
              onChange={field.onChange} 
              className="shrink-0"
            />
          )}
        />
        
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. Jane"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="e.g. Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Professional Title"
            placeholder="e.g. Senior Product Designer"
            error={errors.title?.message}
            {...register('title')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="e.g. jane@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="flex gap-2">
          <div className="w-1/3">
            <Input
              label="Code"
              placeholder="+1"
              error={errors.countryCode?.message}
              {...register('countryCode')}
            />
          </div>
          <div className="w-2/3">
            <Input
              label="Phone"
              type="tel"
              placeholder="234 567 890"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="e.g. New York"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="State / Province"
          placeholder="e.g. NY"
          error={errors.state?.message}
          {...register('state')}
        />
        <Input
          label="Country"
          placeholder="e.g. United States"
          error={errors.country?.message}
          {...register('country')}
        />
        <Input
          label="Location (Full)"
          placeholder="e.g. Remote, Worldwide"
          error={errors.location?.message}
          {...register('location')}
        />
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-4">
        <h3 className="text-lg font-medium text-slate-900">Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="LinkedIn"
            placeholder="https://linkedin.com/in/jane"
            error={errors.linkedin?.message}
            {...register('linkedin')}
          />
          <Input
            label="GitHub"
            placeholder="https://github.com/jane"
            error={errors.github?.message}
            {...register('github')}
          />
          <Input
            label="Portfolio"
            placeholder="https://janedoe.com"
            error={errors.portfolio?.message}
            {...register('portfolio')}
          />
          <Input
            label="Website"
            placeholder="https://example.com"
            error={errors.website?.message}
            {...register('website')}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <label className="block text-sm font-medium text-slate-700 mb-1">About (Optional)</label>
        <textarea
          className={`w-full h-24 p-3 rounded-xl border ${
            errors.about ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-primary-100'
          } focus:border-primary-500 focus:ring-4 outline-none transition-all resize-none text-sm text-slate-700`}
          placeholder="A brief blurb about yourself..."
          {...register('about')}
        />
        {errors.about && <p className="mt-1 text-xs text-rose-500">{errors.about.message}</p>}
      </div>
    </div>
  );
};
