import React, { useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Award } from 'lucide-react';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { CertificationCard } from './CertificationCard';
import { useCreateCertification, useReorderCertification } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { ResumeCertification } from '../../services/resume.api';

interface CertificationSectionProps {
  resumeId: string;
  certifications: ResumeCertification[];
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({ resumeId, certifications }) => {
  const { mutate: createCertification, isPending } = useCreateCertification();
  const { mutate: reorderCertification } = useReorderCertification();
  const { liveCertifications, setLiveCertifications } = useResumeBuilderStore();

  useEffect(() => {
    setLiveCertifications(certifications);
  }, [certifications]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveCertifications.findIndex(c => c.id === active.id);
      const newIndex = liveCertifications.findIndex(c => c.id === over.id);
      const reordered = arrayMove(liveCertifications, oldIndex, newIndex).map((c, i) => ({ ...c, displayOrder: i }));
      setLiveCertifications(reordered);
      reorderCertification({
        id: resumeId,
        data: { items: reordered.map(c => ({ id: c.id, displayOrder: c.displayOrder })) },
      });
    }
  };

  const handleAdd = () => {
    createCertification({ id: resumeId, data: { certificationName: 'New Certification', neverExpires: false } });
  };

  return (
    <div className="space-y-4">
      {liveCertifications.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No certifications added yet.</p>
          <p className="text-xs mt-1">Add your professional certifications to boost credibility.</p>
        </div>
      ) : (
        <SortableList items={liveCertifications} onDragEnd={handleDragEnd}>
          {liveCertifications.map((cert) => (
            <CertificationCard key={cert.id} certification={cert} resumeId={resumeId} />
          ))}
        </SortableList>
      )}
      <AddButton label="Add Certification" onClick={handleAdd} disabled={isPending} />
    </div>
  );
};
