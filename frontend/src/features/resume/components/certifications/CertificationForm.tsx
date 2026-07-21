import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeCertification } from '../../services/resume.api';
import { useUpdateCertification } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';

const certSchema = z.object({
  certificationName: z.string().min(1, 'Certification name is required').max(150),
  issuingOrganization: z.string().max(100).optional(),
  credentialId: z.string().max(100).optional(),
  credentialUrl: z.string().optional(),
  issueDate: z.string().optional(),
  expirationDate: z.string().optional(),
  neverExpires: z.boolean().optional(),
});

type CertValues = z.infer<typeof certSchema>;

interface CertificationFormProps {
  certification: ResumeCertification;
  resumeId: string;
}

export const CertificationForm: React.FC<CertificationFormProps> = ({ certification, resumeId }) => {
  const { mutate: updateCertification } = useUpdateCertification();
  const { setSaveStatus, setLastSavedAt, liveCertifications, setLiveCertifications } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const { register, watch, formState: { errors } } = useForm<CertValues>({
    resolver: zodResolver(certSchema),
    defaultValues: {
      certificationName: certification.certificationName || '',
      issuingOrganization: certification.issuingOrganization || '',
      credentialId: certification.credentialId || '',
      credentialUrl: certification.credentialUrl || '',
      issueDate: certification.issueDate || '',
      expirationDate: certification.expirationDate || '',
      neverExpires: certification.neverExpires || false,
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  useEffect(() => {
    const updated = liveCertifications.map(c =>
      c.id === certification.id ? { ...c, ...formValues } : c
    );
    setLiveCertifications(updated);
  }, [formValues]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setSaveStatus('saving');
    updateCertification(
      { id: resumeId, certId: certification.id, data: debouncedValues },
      {
        onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
        onError: () => setSaveStatus('error'),
      }
    );
  }, [debouncedValues]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateCertification(
      { id: resumeId, certId: certification.id, data: formValues },
      {
        onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
        onError: () => setSaveStatus('error'),
      }
    );
  };

  return (
    <div className="space-y-4" onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) handleBlurSave(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Certification Name *"
          placeholder="e.g. AWS Solutions Architect"
          error={errors.certificationName?.message}
          {...register('certificationName')}
        />
        <Input
          label="Issuing Organization"
          placeholder="e.g. Amazon Web Services"
          {...register('issuingOrganization')}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Credential ID"
          placeholder="e.g. ABC123XYZ"
          {...register('credentialId')}
        />
        <Input
          label="Credential URL"
          placeholder="https://..."
          {...register('credentialUrl')}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Issue Date"
          placeholder="e.g. Jan 2023"
          {...register('issueDate')}
        />
        <Input
          label="Expiration Date"
          placeholder="e.g. Jan 2026"
          disabled={formValues.neverExpires}
          {...register('expirationDate')}
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <input
          type="checkbox"
          className="w-4 h-4 accent-primary-600 rounded"
          {...register('neverExpires')}
        />
        <span className="text-sm text-slate-600 font-medium">This credential does not expire</span>
      </label>
    </div>
  );
};
