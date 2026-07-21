import React, { useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import { useDeleteInterest } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { ResumeInterest } from '../../services/resume.api';
import { AddInterestForm } from './AddInterestForm';

const CATEGORY_COLORS: Record<string, string> = {
  Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Technology: 'bg-blue-50 text-blue-700 border-blue-200',
  Travel: 'bg-amber-50 text-amber-700 border-amber-200',
  Reading: 'bg-violet-50 text-violet-700 border-violet-200',
  Music: 'bg-pink-50 text-pink-700 border-pink-200',
  Art: 'bg-rose-50 text-rose-700 border-rose-200',
  Community: 'bg-teal-50 text-teal-700 border-teal-200',
  Other: 'bg-slate-50 text-slate-700 border-slate-200',
};

interface InterestSectionProps {
  resumeId: string;
  interests: ResumeInterest[];
}

export const InterestSection: React.FC<InterestSectionProps> = ({ resumeId, interests }) => {
  const { mutate: deleteInterest } = useDeleteInterest();
  const { liveInterests, setLiveInterests } = useResumeBuilderStore();

  useEffect(() => {
    setLiveInterests(interests);
  }, [interests]);

  const handleDelete = (interestId: string) => {
    deleteInterest({ id: resumeId, interestId });
  };

  // Group by category
  const grouped = liveInterests.reduce<Record<string, ResumeInterest[]>>((acc, i) => {
    const cat = i.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(i);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {liveInterests.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No interests added yet.</p>
          <p className="text-xs mt-1">Personal interests humanize your profile and aid cultural fit.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((interest) => {
                const colorClass = CATEGORY_COLORS[interest.category || 'Other'] || CATEGORY_COLORS['Other'];
                return (
                  <span
                    key={interest.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-sm font-medium transition-all group ${colorClass}`}
                  >
                    {interest.interest}
                    <button
                      type="button"
                      onClick={() => handleDelete(interest.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity rounded-full"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        ))
      )}

      <AddInterestForm resumeId={resumeId} />
    </div>
  );
};
