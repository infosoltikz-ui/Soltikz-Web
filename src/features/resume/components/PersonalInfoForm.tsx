import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Resume } from '../services/resume.api';
import { useUpdatePersonal } from '../hooks/resume.queries';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';

const personalInfoSchema = z.object({
  firstName: z.string().max(50, 'Max 50 characters').optional(),
  lastName: z.string().max(50, 'Max 50 characters').optional(),
  title: z.string().max(100, 'Max 100 characters').optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().max(20, 'Max 20 characters').optional(),
  city: z.string().max(50, 'Max 50 characters').optional(),
  country: z.string().max(50, 'Max 50 characters').optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  resume: Resume;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ resume }) => {
  const { mutate: updatePersonal } = useUpdatePersonal();
  const { setSaveStatus, setLastSavedAt } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: resume.personal?.firstName || '',
      lastName: resume.personal?.lastName || '',
      title: resume.personal?.title || '',
      email: resume.personal?.email || '',
      phone: resume.personal?.phone || '',
      city: resume.personal?.city || '',
      country: resume.personal?.country || '',
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 1000);

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
          setTimeout(() => {
            if (useResumeBuilderStore.getState().saveStatus === 'saved') {
              setSaveStatus('idle');
            }
          }, 2000);
        },
        onError: () => {
          setSaveStatus('error');
        }
      }
    );
  }, [debouncedValues, resume.id, updatePersonal, setSaveStatus, setLastSavedAt]);

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="e.g. jane@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="e.g. +1 234 567 890"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="e.g. New York"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="Country"
          placeholder="e.g. United States"
          error={errors.country?.message}
          {...register('country')}
        />
      </div>
    </div>
  );
};
