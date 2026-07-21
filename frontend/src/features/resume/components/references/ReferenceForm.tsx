import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeReference } from '../../services/resume.api';
import { useUpdateReference } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  designation: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  email: z.string().optional(),
  phone: z.string().max(20).optional(),
  relationship: z.string().max(100).optional(),
  availableUponRequest: z.boolean().optional(),
});

type Values = z.infer<typeof schema>;

interface ReferenceFormProps {
  reference: ResumeReference;
  resumeId: string;
}

export const ReferenceForm: React.FC<ReferenceFormProps> = ({ reference, resumeId }) => {
  const { mutate: updateReference } = useUpdateReference();
  const { setSaveStatus, setLastSavedAt, liveReferences, setLiveReferences } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const { register, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: reference.name || '',
      designation: reference.designation || '',
      company: reference.company || '',
      email: reference.email || '',
      phone: reference.phone || '',
      relationship: reference.relationship || '',
      availableUponRequest: reference.availableUponRequest || false,
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  useEffect(() => {
    setLiveReferences(liveReferences.map(r => r.id === reference.id ? { ...r, ...formValues } : r));
  }, [formValues]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setSaveStatus('saving');
    updateReference({ id: resumeId, refId: reference.id, data: debouncedValues }, {
      onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
      onError: () => setSaveStatus('error'),
    });
  }, [debouncedValues]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateReference({ id: resumeId, refId: reference.id, data: formValues }, {
      onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
      onError: () => setSaveStatus('error'),
    });
  };

  const isAvailableOnRequest = formValues.availableUponRequest;

  return (
    <div className="space-y-4" onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) handleBlurSave(); }}>
      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <input type="checkbox" className="w-4 h-4 accent-primary-600 rounded" {...register('availableUponRequest')} />
        <span className="text-sm text-slate-600 font-medium">Available upon request (hides contact details)</span>
      </label>

      {!isAvailableOnRequest && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name *" placeholder="e.g. Jane Smith" error={errors.name?.message} {...register('name')} />
            <Input label="Job Title / Designation" placeholder="e.g. Senior Manager" {...register('designation')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company" placeholder="e.g. Acme Corp" {...register('company')} />
            <Input label="Relationship" placeholder="e.g. Former Supervisor" {...register('relationship')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" placeholder="jane@example.com" type="email" {...register('email')} />
            <Input label="Phone" placeholder="+1 (555) 000-0000" {...register('phone')} />
          </div>
        </>
      )}

      {isAvailableOnRequest && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
          <strong className="font-semibold">Name: </strong>{formValues.name || reference.name}
          {formValues.designation && <span> · {formValues.designation}</span>}
          {formValues.company && <span> at {formValues.company}</span>}
          <p className="mt-1 text-xs text-blue-500">Contact details hidden — will show "Available upon request" in preview.</p>
        </div>
      )}
    </div>
  );
};
